document.getElementById("year").textContent = new Date().getFullYear();

// Typewriter effect for hero terminal tagline
const heroTagline = document.getElementById("heroTagline");
if (heroTagline) {
  const fullText = heroTagline.textContent.trim();
  heroTagline.textContent = "";
  heroTagline.classList.add("typing-cursor");
  let i = 0;
  const type = () => {
    if (i <= fullText.length) {
      heroTagline.textContent = fullText.slice(0, i);
      i++;
      setTimeout(type, 14);
    } else {
      heroTagline.classList.remove("typing-cursor");
    }
  };
  setTimeout(type, 500);
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
