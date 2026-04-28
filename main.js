function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initScrollReveal() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!revealItems.length) {
    return;
  }

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
}

function initBackToTop() {
  const btn = document.getElementById("backToTop");

  if (!btn) {
    return;
  }

  window.addEventListener("scroll", function () {
    if (window.scrollY > 420) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initThemeToggle() {
  const key = "victor-theme";
  const button = document.getElementById("themeToggle");

  if (!button) {
    return;
  }

  const applyTheme = function (theme) {
    const isLight = theme === "light";
    document.body.classList.toggle("light-theme", isLight);
    button.textContent = isLight ? "☀️" : "🌙";
  };

  const saved = localStorage.getItem(key);
  const preferredDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = saved || (preferredDark ? "dark" : "light");
  applyTheme(initialTheme);

  button.addEventListener("click", function () {
    const next = document.body.classList.contains("light-theme") ? "dark" : "light";
    localStorage.setItem(key, next);
    applyTheme(next);
  });
}

function initYear() {
  const yearNode = document.getElementById("year");

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initScrollReveal();
  initBackToTop();
  initThemeToggle();
  initYear();
});

