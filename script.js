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
const closeNav = () => {
  navLinks.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
};
const openNav = () => {
  navLinks.classList.add("open");
  navToggle.classList.add("open");
  navToggle.setAttribute("aria-expanded", "true");
};
navToggle.addEventListener("click", () => {
  if (navLinks.classList.contains("open")) closeNav();
  else openNav();
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNav);
});
document.addEventListener("click", (e) => {
  if (!navLinks.classList.contains("open")) return;
  if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
  closeNav();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLinks.classList.contains("open")) {
    closeNav();
    navToggle.focus();
  }
});

// Project filter: pills switch between the Featured panel and one
// category grid at a time. Implements the ARIA APG tabs pattern:
// arrow-key roving focus, Home/End, automatic activation on focus.
const filterBar = document.getElementById("projectFilterBar");
const filterPills = Array.from(document.querySelectorAll("#projectFilterBar .filter-pill"));
const filterPanels = document.querySelectorAll(".filter-panel");

const activatePill = (pill) => {
  filterPills.forEach((p) => {
    const isActive = p === pill;
    p.classList.toggle("active", isActive);
    p.setAttribute("aria-selected", String(isActive));
    p.tabIndex = isActive ? 0 : -1;
  });
  const target = pill.dataset.panel;
  filterPanels.forEach((panel) => {
    panel.hidden = panel.dataset.panel !== target;
  });
};

filterPills.forEach((pill, i) => {
  pill.addEventListener("click", () => activatePill(pill));
});

filterBar.addEventListener("keydown", (e) => {
  const currentIndex = filterPills.indexOf(document.activeElement);
  if (currentIndex === -1) return;
  let nextIndex = null;
  if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % filterPills.length;
  else if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + filterPills.length) % filterPills.length;
  else if (e.key === "Home") nextIndex = 0;
  else if (e.key === "End") nextIndex = filterPills.length - 1;
  if (nextIndex !== null) {
    e.preventDefault();
    const nextPill = filterPills[nextIndex];
    nextPill.focus();
    activatePill(nextPill);
  }
});

// Skills: groups over 6 tags start collapsed behind a "+N more" toggle.
document.querySelectorAll(".tags-toggle").forEach((btn) => {
  const list = document.getElementById(btn.getAttribute("aria-controls"));
  const hiddenItems = Array.from(list.querySelectorAll("li[hidden]"));
  const moreLabel = `+${hiddenItems.length} more`;
  btn.textContent = moreLabel;
  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    hiddenItems.forEach((li) => {
      li.hidden = expanded;
    });
    btn.setAttribute("aria-expanded", String(!expanded));
    btn.textContent = expanded ? moreLabel : "Show less";
  });
});
