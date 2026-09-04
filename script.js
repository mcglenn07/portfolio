document.getElementById("year").textContent = new Date().getFullYear();

// Logo collapses down to initials as you scroll, scrubbed live like Anthropic's
// nav wordmark (theirs morphs vector letterforms via a scroll-linked Lottie;
// this collapses each non-initial letter's width/opacity with scroll position).
const logoText = document.querySelector(".logo-text");
if (logoText) {
  const LOGO_FULL = "MC GLENN TANGALIN";
  const LOGO_MORPH_DISTANCE = 220; // px of scroll over which the collapse completes

  logoText.textContent = "";
  logoText.classList.add("logo-scramble");
  logoText.setAttribute("aria-hidden", "true");

  LOGO_FULL.split(" ").forEach((word, wi, words) => {
    [...word].forEach((ch, ci) => {
      const span = document.createElement("span");
      span.textContent = ch;
      span.className = "logo-char" + (ci === 0 ? " logo-keep" : "");
      logoText.appendChild(span);
    });
    if (wi < words.length - 1) {
      const space = document.createElement("span");
      space.textContent = " ";
      space.className = "logo-char logo-space";
      logoText.appendChild(space);
    }
  });

  let ticking = false;
  const updateLogo = () => {
    const progress = Math.min(1, Math.max(0, window.scrollY / LOGO_MORPH_DISTANCE));
    logoText.style.setProperty("--p", progress.toFixed(3));
    ticking = false;
  };
  updateLogo();
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateLogo);
        ticking = true;
      }
    },
    { passive: true }
  );
}

// Highlight active nav link based on scroll position
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll("#navLinks a[href^='#']");
if (sections.length && navAnchors.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((sec) => navObserver.observe(sec));
}

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

// Show more / show less for collapsed project subsections
document.querySelectorAll(".show-more-btn").forEach((btn) => {
  const grid = document.getElementById(btn.dataset.target);
  if (!grid) return;
  const extraCards = grid.querySelectorAll(".card-extra");
  const label = btn.querySelector(".show-more-label");
  label.textContent = `Show ${extraCards.length} more`;

  btn.addEventListener("click", () => {
    const expanded = grid.classList.toggle("grid-expanded");
    btn.classList.toggle("expanded", expanded);
    label.textContent = expanded ? "Show less" : `Show ${extraCards.length} more`;
    if (expanded) {
      extraCards.forEach((card) => card.classList.add("in-view"));
    }
  });
});
