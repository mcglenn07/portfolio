document.getElementById("year").textContent = new Date().getFullYear();

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
