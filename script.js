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


  /* ==============================================================
     5. SIGN-IN  —  modal (index.html) + standalone (signin.html)
     ============================================================== */

  /* ----- helpers ----- */
  function siValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }
  function siSetErr(field, el, msg) {
    field.classList.add("has-error");
    el.textContent = msg;
  }
  function siClearErr(field, el) {
    field.classList.remove("has-error");
    el.textContent = "";
  }
  function siShowToast(toastId) {
    const t = document.getElementById(toastId);
    if (!t) return;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2800);
  }
  function siToggleEye(input, eyeBtn) {
    if (!input || !eyeBtn) return;
    eyeBtn.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      const s = eyeBtn.querySelector(".si2-eye__show");
      const h = eyeBtn.querySelector(".si2-eye__hide");
      if (s) s.style.display = show ? "none" : "";
      if (h) h.style.display = show ? "" : "none";
      eyeBtn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  }
  function siBuildTwoStep({ emailFormId, emailInputId, emailFieldId, emailErrId,
                             passFormId,  passInputId,  passFieldId,  passErrId,
                             emailDisplayId, stepEmailId, stepPassId,
                             backBtnId, eyeBtnId, submitBtnId,
                             onSuccess }) {
    const fmEmail   = document.getElementById(emailFormId);
    const inEmail   = document.getElementById(emailInputId);
    const fdEmail   = document.getElementById(emailFieldId);
    const erEmail   = document.getElementById(emailErrId);
    const fmPass    = document.getElementById(passFormId);
    const inPass    = document.getElementById(passInputId);
    const fdPass    = document.getElementById(passFieldId);
    const erPass    = document.getElementById(passErrId);
    const dispEmail = document.getElementById(emailDisplayId);
    const stEmail   = document.getElementById(stepEmailId);
    const stPass    = document.getElementById(stepPassId);
    const backBtn   = document.getElementById(backBtnId);
    const eyeBtn    = document.getElementById(eyeBtnId);
    const subBtn    = document.getElementById(submitBtnId);

    if (!fmEmail || !fmPass) return;

    siToggleEye(inPass, eyeBtn);

    // Clear on input
    inEmail && inEmail.addEventListener("input", () => siClearErr(fdEmail, erEmail));
    inPass  && inPass.addEventListener("input",  () => siClearErr(fdPass,  erPass));

    // Step 1 submit
    fmEmail.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = inEmail ? inEmail.value.trim() : "";
      if (!v)                { siSetErr(fdEmail, erEmail, "Please enter your email."); return; }
      if (!siValidEmail(v))  { siSetErr(fdEmail, erEmail, "Enter a valid email address."); return; }
      siClearErr(fdEmail, erEmail);
      if (dispEmail) dispEmail.textContent = v;
      stEmail.classList.add("si2-step--hidden");
      stPass.classList.remove("si2-step--hidden");
      if (inPass) inPass.focus();
    });

    // Back button
    backBtn && backBtn.addEventListener("click", () => {
      stPass.classList.add("si2-step--hidden");
      stEmail.classList.remove("si2-step--hidden");
      siClearErr(fdPass, erPass);
    });

    // Step 2 submit
    fmPass.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = inPass ? inPass.value : "";
      if (!v)          { siSetErr(fdPass, erPass, "Please enter your password."); return; }
      if (v.length < 6){ siSetErr(fdPass, erPass, "Password must be at least 6 characters."); return; }
      siClearErr(fdPass, erPass);
      if (subBtn) { subBtn.classList.add("loading"); subBtn.disabled = true; }
      setTimeout(() => {
        if (subBtn) { subBtn.classList.remove("loading"); subBtn.disabled = false; }
        onSuccess();
      }, 1400);
    });
  }

  /* ----- A. Modal in index.html ----- */
  const overlay    = document.getElementById("signinOverlay");
  const openBtn    = document.getElementById("openSignin");
  const closeBtn   = document.getElementById("closeSignin");

  if (overlay && openBtn) {
    // Open
    openBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
      const inp = document.getElementById("mEmailInput");
      if (inp) { inp.value = ""; inp.focus(); }
      // reset steps
      const se = document.getElementById("mStepEmail");
      const sp = document.getElementById("mStepPassword");
      if (se) se.classList.remove("si2-step--hidden");
      if (sp) sp.classList.add("si2-step--hidden");
    });

    // Close button
    closeBtn && closeBtn.addEventListener("click", closeModal);

    // Click outside card
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    // ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
    });

    function closeModal() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }

    // Wire two-step flow for modal
    siBuildTwoStep({
      emailFormId:   "mFormEmail",   emailInputId: "mEmailInput",
      emailFieldId:  "mFEmail",      emailErrId:   "mErrEmail",
      passFormId:    "mFormPassword", passInputId:  "mPasswordInput",
      passFieldId:   "mFPassword",   passErrId:    "mErrPassword",
      emailDisplayId: "mEmailDisplay",
      stepEmailId:   "mStepEmail",   stepPassId:   "mStepPassword",
      backBtnId:     "mBackBtn",     eyeBtnId:     "mEyeBtn",
      submitBtnId:   "mLoginBtn",
      onSuccess() {
        closeModal();
        siShowToast("mainToast");
      }
    });
  }

  /* ----- B. Standalone signin.html ----- */
  if (document.getElementById("si2Card") && !overlay) {
    siBuildTwoStep({
      emailFormId:   "formEmail",    emailInputId: "emailInput",
      emailFieldId:  "fEmail",       emailErrId:   "errEmail",
      passFormId:    "formPassword",  passInputId:  "passwordInput",
      passFieldId:   "fPassword",    passErrId:    "errPassword",
      emailDisplayId: "emailDisplay",
      stepEmailId:   "stepEmail",    stepPassId:   "stepPassword",
      backBtnId:     "backBtn",      eyeBtnId:     "eyeBtn",
      submitBtnId:   "loginSubmitBtn",
      onSuccess() {
        siShowToast("si2Toast");
        setTimeout(() => { window.location.href = "index.html"; }, 1800);
      }
    });
  }

}); // end DOMContentLoaded
