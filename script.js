// ============================================================
//  EVENTBRITE CLONE — script.js  (single combined script)
//  Sections:
//    1. Header — mobile menu, dropdowns, search, scroll shadow
//    2. Hero categories — active pill
//    3. Middle — event tab switching, destinations carousel
//    4. Footer — city/state chips, drag-scroll, country picker
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

  /* ==============================================================
     1. HEADER
     ============================================================== */

  // Mobile hamburger
  const menuToggle = document.getElementById("menuToggle");
  const nav        = document.getElementById("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close nav on any link click (mobile UX)
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Help Center dropdown
  const helpBtn  = document.getElementById("helpBtn");
  const helpMenu = document.getElementById("helpMenu");

  if (helpBtn && helpMenu) {
    helpBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = helpMenu.classList.toggle("open");
      helpBtn.setAttribute("aria-expanded", isOpen);
    });
  }

  // Close all dropdowns on outside click
  document.addEventListener("click", () => {
    if (helpMenu) {
      helpMenu.classList.remove("open");
      if (helpBtn) helpBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Close all dropdowns + mobile nav on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (helpMenu) {
      helpMenu.classList.remove("open");
      if (helpBtn) helpBtn.setAttribute("aria-expanded", "false");
    }
    if (nav) {
      nav.classList.remove("open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Search (demo — logs query to console)
  const searchBtn   = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const locInput    = document.getElementById("locationInput");

  function runSearch() {
    const q   = searchInput ? searchInput.value.trim() : "";
    const loc = locInput    ? locInput.value.trim()    : "";
    if (!q) return;
    console.log("Search:", q, "| Location:", loc);
    // Uncomment to navigate: window.location.href = `search.html?q=${encodeURIComponent(q)}&loc=${encodeURIComponent(loc)}`;
  }

  if (searchBtn)  searchBtn.addEventListener("click", runSearch);
  if (searchInput) searchInput.addEventListener("keydown", (e) => { if (e.key === "Enter") runSearch(); });

  // Sticky header shadow on scroll
  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.style.boxShadow = window.scrollY > 4
        ? "0 2px 12px rgba(30,10,60,0.09)"
        : "none";
    }, { passive: true });
  }


  /* ==============================================================
     2. HERO CATEGORIES — active pill
     ============================================================== */
  document.querySelectorAll(".category").forEach((cat) => {
    cat.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".category").forEach((c) => c.classList.remove("active"));
      cat.classList.add("active");
    });
  });


  /* ==============================================================
     3. MIDDLE SECTION
     ============================================================== */

  // ---- Event tab switching ----
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      // Add real event filtering here when you have live data
    });
  });

  // ---- Destinations carousel ----
  const grid    = document.getElementById("destinationsGrid");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (grid && prevBtn && nextBtn) {
    // One "page" = visible grid width + one gap so cards align perfectly
    function pageWidth() {
      const gap = parseInt(getComputedStyle(grid).columnGap, 10) || 0;
      return grid.clientWidth + gap;
    }

    function updateCarouselButtons() {
      prevBtn.disabled = grid.scrollLeft <= 2;
      nextBtn.disabled = grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 2;
    }

    nextBtn.addEventListener("click", () => grid.scrollBy({ left:  pageWidth(), behavior: "smooth" }));
    prevBtn.addEventListener("click", () => grid.scrollBy({ left: -pageWidth(), behavior: "smooth" }));

    grid.addEventListener("scroll", updateCarouselButtons, { passive: true });
    window.addEventListener("resize", updateCarouselButtons);
    updateCarouselButtons();  // set initial disabled state
  }


  /* ==============================================================
     4. FOOTER
     ============================================================== */

  const ARROW =
    '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">' +
    '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"' +
    ' stroke-linejoin="round" d="M7 17L17 7M8 7h9v9"/></svg>';

  const cities = ["Abilene", "Phoenix", "Albuquerque", "Anaheim", "Raleigh", "Wichita"];

  const statesRow1 = [
    "Alabama", "Arizona", "California", "Connecticut", "District of Columbia",
    "Georgia", "Idaho", "Indiana", "Kansas", "Louisiana", "Michigan", "Minnesota"
  ];
  const statesRow2 = [
    "Alaska", "Arkansas", "Colorado", "Delaware", "Florida", "Hawaii",
    "Illinois", "Iowa", "Kentucky", "Maine", "Massachusetts", "Mississippi"
  ];

  function chip(text) {
    return '<a href="#" class="ef__chip">' + text + ARROW + "</a>";
  }

  const citiesEl = document.getElementById("efCities");
  const row1     = document.getElementById("efStatesRow1");
  const row2     = document.getElementById("efStatesRow2");

  // Only run footer code if footer elements are present
  if (citiesEl && row1 && row2) {
    citiesEl.innerHTML = cities.map((c) => chip("Things to do in " + c)).join("");
    row1.innerHTML     = statesRow1.map(chip).join("");
    row2.innerHTML     = statesRow2.map(chip).join("");

    // Drag-to-scroll on state rows
    const scroller = document.getElementById("efStates");
    if (scroller) {
      let isDown = false, startX = 0, startLeft = 0, moved = false;

      scroller.addEventListener("mousedown", (e) => {
        isDown = true; moved = false;
        startX    = e.pageX;
        startLeft = scroller.scrollLeft;
        scroller.classList.add("dragging");
      });
      window.addEventListener("mouseup", () => {
        isDown = false;
        scroller.classList.remove("dragging");
      });
      window.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        const dx = e.pageX - startX;
        if (Math.abs(dx) > 4) moved = true;
        scroller.scrollLeft = startLeft - dx;
      });
      // Prevent link clicks while dragging
      scroller.addEventListener("click", (e) => { if (moved) e.preventDefault(); }, true);
    }
  }

  // Country dropdown
  const countryBtn   = document.getElementById("efCountryBtn");
  const countryMenu  = document.getElementById("efCountryMenu");
  const countryLabel = document.getElementById("efCountryLabel");

  if (countryBtn && countryMenu) {
    countryBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = countryMenu.classList.toggle("open");
      countryBtn.setAttribute("aria-expanded", open);
    });

    countryMenu.addEventListener("click", (e) => {
      if (e.target.tagName === "LI" && countryLabel) {
        countryLabel.textContent = e.target.textContent;
        countryMenu.classList.remove("open");
        countryBtn.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("click", () => {
      countryMenu.classList.remove("open");
      countryBtn.setAttribute("aria-expanded", "false");
    });
  }

  // Auto copyright year
  const yearEl = document.getElementById("efYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

}); // end DOMContentLoaded
