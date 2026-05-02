/*
=========================================
SafeLink Premium Main Script
=========================================
Features:
- Theme toggle + persistence
- URL generator
- Short slug mapping (localStorage demo)
- Waiting countdown
- Unlock redirect
- Sticky ad close
- Basic anti inspect
=========================================
*/

(function () {
  "use strict";

  /* =========================
     DOM Ready
  ========================= */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initGenerator();
    initWaitingPage();
    initStickyAd();
    initAntiInspect();
  });

  /* =========================
     Theme Toggle
  ========================= */
  function initTheme() {
    const html = document.documentElement;
    const toggle = document.getElementById("themeToggle");

    const savedTheme = localStorage.getItem("theme") || "light";
    html.setAttribute("data-theme", savedTheme);

    updateThemeIcon(savedTheme);

    if (toggle) {
      toggle.addEventListener("click", () => {
        const current = html.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";

        html.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        updateThemeIcon(next);
      });
    }
  }

  function updateThemeIcon(theme) {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    toggle.innerHTML =
      theme === "dark"
        ? `<i class="bi bi-sun-fill"></i>`
        : `<i class="bi bi-moon-stars-fill"></i>`;
  }

  /* =========================
     Generator
  ========================= */
  function initGenerator() {
    const btn = document.getElementById("generateBtn");
    const input = document.getElementById("urlInput");
    const resultBox = document.getElementById("resultBox");
    const generated = document.getElementById("generatedLink");
    const copyBtn = document.getElementById("copyBtn");
    const copySuccess = document.getElementById("copySuccess");

    if (!btn || !input) return;

    btn.addEventListener("click", () => {
      const url = input.value.trim();

      if (!url) {
        alert("Please enter destination URL.");
        return;
      }

      if (!isValidUrl(url)) {
        alert("Please enter valid URL.");
        return;
      }

      const slug = randomSlug(7);

      saveMapping(slug, url);

      const finalLink =
        window.location.origin +
        "/go/" +
        slug;

      generated.value = finalLink;
      resultBox.classList.remove("d-none");
    });

    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(generated.value);

          copySuccess.classList.remove("d-none");

          setTimeout(() => {
            copySuccess.classList.add("d-none");
          }, 2000);

        } catch (err) {
          generated.select();
          document.execCommand("copy");
        }
      });
    }
  }

  function isValidUrl(str) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  function randomSlug(length = 7) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {
      result += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }

    return result;
  }

  function saveMapping(slug, url) {
    const data =
      JSON.parse(localStorage.getItem("safeLinks")) || {};

    data[slug] = {
      url,
      created: Date.now()
    };

    localStorage.setItem(
      "safeLinks",
      JSON.stringify(data)
    );
  }

  function getMapping(slug) {
    const data =
      JSON.parse(localStorage.getItem("safeLinks")) || {};

    return data[slug] || null;
  }

  /* =========================
     Waiting Page
  ========================= */
  function initWaitingPage() {
    const countdownEl = document.getElementById("countdown");
    const circle = document.getElementById("progressCircle");
    const unlockBtn = document.getElementById("unlockBtn");

    if (!countdownEl || !circle) return;

    const slug = getSlug();
    const mapping = getMapping(slug);

    if (!mapping) {
      countdownEl.innerText = "!";
      return;
    }

    let time = 10;
    const circumference = 377;

    const timer = setInterval(() => {
      time--;

      countdownEl.innerText = time;

      const progress =
        ((10 - time) / 10) * circumference;

      circle.style.strokeDashoffset =
        circumference - progress;

      if (time <= 0) {
        clearInterval(timer);

        countdownEl.innerText = "✓";

        unlockBtn.classList.remove("d-none");

        unlockBtn.addEventListener("click", () => {
          window.location.href = mapping.url;
        });
      }

    }, 1000);
  }

  function getSlug() {
    const path = window.location.pathname;

    if (path.includes("/safelink/go/")) {
      return path.split("/safelink/go/")[1];
    }

    const params = new URLSearchParams(
      window.location.search
    );

    return params.get("slug");
  }

  /* =========================
     Sticky Ad
  ========================= */
  function initStickyAd() {
    const close = document.getElementById("closeStickyAd");
    const sticky = document.querySelector(".sticky-ad");

    if (!close || !sticky) return;

    close.addEventListener("click", () => {
      sticky.style.display = "none";
    });
  }

  /* =========================
     Basic Anti Inspect
  ========================= */
  function initAntiInspect() {
    document.addEventListener("contextmenu", e => {
      e.preventDefault();
    });

    document.addEventListener("keydown", e => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I","J","C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
      }
    });
  }

})();