/*
=========================================
SafeLink Premium AdBlock Detector
=========================================
Features:
- Detect blocked ad element
- Show premium modal warning
- Lightweight
=========================================
*/

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    detectAdBlock();
  });

  function detectAdBlock() {
    // create bait element
    const bait = document.createElement("div");

    bait.className =
      "ads adsbox ad-unit ad-zone banner-ad sponsored ad-placement";

    bait.style.cssText = `
      width:1px;
      height:1px;
      position:absolute;
      left:-9999px;
      top:-9999px;
      opacity:0;
      pointer-events:none;
    `;

    document.body.appendChild(bait);

    window.setTimeout(() => {
      const blocked =
        bait.offsetHeight === 0 ||
        bait.offsetParent === null ||
        getComputedStyle(bait).display === "none" ||
        getComputedStyle(bait).visibility === "hidden";

      bait.remove();

      if (blocked) {
        showAdblockModal();
      }
    }, 150);
  }

  function showAdblockModal() {
    const modal = document.getElementById("adblockModal");
    if (!modal) return;

    modal.classList.remove("d-none");
    document.body.style.overflow = "hidden";
  }
})();