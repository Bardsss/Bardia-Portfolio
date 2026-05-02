const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");

toggle?.addEventListener("click", () => {
  links.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => links.classList.remove("open"));
});

const mediaItems = [...document.querySelectorAll(".media-open")].map((item) => ({
  type: item.dataset.type,
  src: item.dataset.src,
  title: item.dataset.title || item.textContent.trim(),
  trigger: item,
}));

const lightbox = document.querySelector(".lightbox");
const lightboxTitle = document.querySelector(".lightbox-title");
const lightboxStage = document.querySelector(".lightbox-stage");
const lightboxMedia = document.querySelector(".lightbox-media");
const closeButtons = document.querySelectorAll("[data-lightbox-close]");
const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-arrow.prev");
const nextButton = document.querySelector(".lightbox-arrow.next");
let activeIndex = 0;

function renderLightboxItem() {
  const item = mediaItems[activeIndex];
  if (!item || !lightboxMedia || !lightboxTitle) return;

  lightboxTitle.textContent = `${item.title} ${activeIndex + 1} / ${mediaItems.length}`;
  lightboxMedia.replaceChildren();

  const element = item.type === "video" ? document.createElement("video") : document.createElement("img");
  element.src = item.src;

  if (item.type === "video") {
    element.controls = true;
    element.autoplay = true;
    element.playsInline = true;
  } else {
    element.alt = item.title;
  }

  lightboxMedia.appendChild(element);
}

function openLightbox(index) {
  activeIndex = index;
  renderLightboxItem();
  lightbox?.classList.add("open");
  lightbox?.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  closeButton?.focus();
}

function closeLightbox() {
  lightbox?.classList.remove("open");
  lightbox?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  lightboxMedia?.replaceChildren();
  mediaItems[activeIndex]?.trigger.focus();
}

function showItem(direction) {
  if (!mediaItems.length) return;
  activeIndex = (activeIndex + direction + mediaItems.length) % mediaItems.length;
  renderLightboxItem();
}

mediaItems.forEach((item, index) => {
  item.trigger.addEventListener("click", () => openLightbox(index));
});

closeButtons.forEach((button) => {
  button.addEventListener("click", closeLightbox);
});

prevButton?.addEventListener("click", () => showItem(-1));
nextButton?.addEventListener("click", () => showItem(1));

document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showItem(-1);
  if (event.key === "ArrowRight") showItem(1);
});
