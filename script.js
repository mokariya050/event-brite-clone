// ============================================================
//  EVENTBRITE CLONE — script.js
//  Sections:
//    1. Header  (menu, dropdown, search, scroll shadow)
//    2. Categories  (active pill)
//    3. Event tabs  (active state)
//    4. Destinations carousel  (prev/next scroll)
//    5. Footer  (chips, drag-scroll, country picker, year)
//    6. Sign-in modal  (open/close, 2-step email → password)
//    7. Sign-in standalone page  (signin.html same flow)
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

  // Shortcut helper
  function $(id) { return document.getElementById(id); }


  /* ============================================================
     1. HEADER
     ============================================================ */

  // Mobile hamburger toggle
  var menuToggle = $("menuToggle");
  var nav = $("nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open);
    });
    // Close nav when any link is clicked (mobile UX)
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Help Center dropdown
  var helpBtn  = $("helpBtn");
  var helpMenu = $("helpMenu");
  if (helpBtn && helpMenu) {
    helpBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = helpMenu.classList.toggle("open");
      helpBtn.setAttribute("aria-expanded", open);
    });
  }

  // Close dropdowns when clicking outside or pressing Escape
  document.addEventListener("click", function () {
    if (helpMenu) helpMenu.classList.remove("open");
    if (helpBtn)  helpBtn.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (helpMenu) helpMenu.classList.remove("open");
    if (nav)      nav.classList.remove("open");
    if (helpBtn)  helpBtn.setAttribute("aria-expanded", "false");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    closeSigninModal();
  });

  // Search (logs to console — replace with real search later)
  var searchBtn   = $("searchBtn");
  var searchInput = $("searchInput");
  var locInput    = $("locationInput");
  function runSearch() {
    var q = searchInput ? searchInput.value.trim() : "";
    if (q) console.log("Search:", q, "| Location:", locInput ? locInput.value : "");
  }
  if (searchBtn)  searchBtn.addEventListener("click", runSearch);
  if (searchInput) searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") runSearch();
  });

  // Add shadow to sticky header on scroll
  var header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", function () {
      header.style.boxShadow = window.scrollY > 4
        ? "0 2px 12px rgba(30,10,60,0.09)"
        : "none";
    }, { passive: true });
  }


  /* ============================================================
     2. CATEGORIES — active pill on click
     ============================================================ */
  document.querySelectorAll(".category").forEach(function (cat) {
    cat.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelectorAll(".category").forEach(function (c) { c.classList.remove("active"); });
      cat.classList.add("active");
    });
  });


  /* ============================================================
     3. EVENT TABS — active state
     ============================================================ */
  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
    });
  });


  /* ============================================================
     4. DESTINATIONS CAROUSEL — prev / next buttons
     ============================================================ */
  var grid    = $("destinationsGrid");
  var prevBtn = $("prevBtn");
  var nextBtn = $("nextBtn");

  if (grid && prevBtn && nextBtn) {
    function pageWidth() {
      var gap = parseInt(getComputedStyle(grid).columnGap, 10) || 0;
      return grid.clientWidth + gap;
    }
    function updateCarouselBtns() {
      prevBtn.disabled = grid.scrollLeft <= 2;
      nextBtn.disabled = grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 2;
    }
    nextBtn.addEventListener("click", function () { grid.scrollBy({ left:  pageWidth(), behavior: "smooth" }); });
    prevBtn.addEventListener("click", function () { grid.scrollBy({ left: -pageWidth(), behavior: "smooth" }); });
    grid.addEventListener("scroll", updateCarouselBtns, { passive: true });
    window.addEventListener("resize", updateCarouselBtns);
    updateCarouselBtns();
  }


  /* ============================================================
     5. FOOTER — chips, drag-scroll, country picker, year
     ============================================================ */

  // City & state chip data
  var cities = ["Abilene", "Phoenix", "Albuquerque", "Anaheim", "Raleigh", "Wichita"];
  var states1 = ["Alabama","Arizona","California","Connecticut","District of Columbia","Georgia","Idaho","Indiana","Kansas","Louisiana","Michigan","Minnesota"];
  var states2 = ["Alaska","Arkansas","Colorado","Delaware","Florida","Hawaii","Illinois","Iowa","Kentucky","Maine","Massachusetts","Mississippi"];

  var arrowSVG = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M8 7h9v9"/></svg>';

  function chip(text) {
    return '<a href="#" class="ef__chip">' + text + arrowSVG + '</a>';
  }

  var citiesEl = $("efCities");
  var row1     = $("efStatesRow1");
  var row2     = $("efStatesRow2");

  if (citiesEl && row1 && row2) {
    citiesEl.innerHTML = cities.map(function (c) { return chip("Things to do in " + c); }).join("");
    row1.innerHTML     = states1.map(chip).join("");
    row2.innerHTML     = states2.map(chip).join("");

    // Drag-to-scroll on the state rows
    var scroller = $("efStates");
    if (scroller) {
      var isDown = false, startX = 0, startLeft = 0, moved = false;
      scroller.addEventListener("mousedown", function (e) {
        isDown = true; moved = false;
        startX = e.pageX; startLeft = scroller.scrollLeft;
        scroller.classList.add("dragging");
      });
      window.addEventListener("mouseup", function () {
        isDown = false;
        scroller.classList.remove("dragging");
      });
      window.addEventListener("mousemove", function (e) {
        if (!isDown) return;
        if (Math.abs(e.pageX - startX) > 4) moved = true;
        scroller.scrollLeft = startLeft - (e.pageX - startX);
      });
      scroller.addEventListener("click", function (e) { if (moved) e.preventDefault(); }, true);
    }
  }

  // Country dropdown
  var countryBtn   = $("efCountryBtn");
  var countryMenu  = $("efCountryMenu");
  var countryLabel = $("efCountryLabel");
  if (countryBtn && countryMenu) {
    countryBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = countryMenu.classList.toggle("open");
      countryBtn.setAttribute("aria-expanded", open);
    });
    countryMenu.addEventListener("click", function (e) {
      if (e.target.tagName === "LI" && countryLabel) {
        countryLabel.textContent = e.target.textContent;
        countryMenu.classList.remove("open");
        countryBtn.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("click", function () {
      countryMenu.classList.remove("open");
      countryBtn.setAttribute("aria-expanded", "false");
    });
  }

  // Auto update copyright year
  var yearEl = $("efYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ============================================================
     6. SIGN-IN MODAL  (index.html)
     ============================================================ */

  var overlay   = $("signinOverlay");
  var openBtn   = $("openSignin");
  var closeBtn  = $("closeSignin");
  var heroBtn   = $("heroMusicBtn");  // "Get Into Live Music" button

  // Helper: open sign-in modal
  function openSigninModal() {
    if (!overlay) return;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    resetModalSteps();
    var inp = $("mEmailInput");
    if (inp) { inp.value = ""; inp.focus(); }
  }

  if (overlay && openBtn) {
    // "Sign in" nav button opens modal
    openBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      openSigninModal();
    });

    // "Get Into Live Music" hero button also opens sign-in modal
    if (heroBtn) {
      heroBtn.addEventListener("click", function (e) {
        e.preventDefault();
        openSigninModal();
      });
    }

    // Close on X button or clicking outside the card
    if (closeBtn) closeBtn.addEventListener("click", closeSigninModal);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeSigninModal();
    });

    // Wire 2-step flow for modal
    wireSigninFlow({
      emailForm:    $("mFormEmail"),
      emailInput:   $("mEmailInput"),
      emailField:   $("mFEmail"),
      emailErr:     $("mErrEmail"),
      passForm:     $("mFormPassword"),
      passInput:    $("mPasswordInput"),
      passField:    $("mFPassword"),
      passErr:      $("mErrPassword"),
      emailDisplay: $("mEmailDisplay"),
      stepEmail:    $("mStepEmail"),
      stepPass:     $("mStepPassword"),
      backBtn:      $("mBackBtn"),
      eyeBtn:       $("mEyeBtn"),
      submitBtn:    $("mLoginBtn"),
      onSuccess: function () {
        closeSigninModal();
        showToast("mainToast");
      }
    });
  }

  function closeSigninModal() {
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  function resetModalSteps() {
    var se = $("mStepEmail");
    var sp = $("mStepPassword");
    if (se) se.classList.remove("si2-step--hidden");
    if (sp) sp.classList.add("si2-step--hidden");
  }


  /* ============================================================
     7. SIGN-IN STANDALONE PAGE  (signin/index.html)
     ============================================================ */

  if ($("si2Card") && !overlay) {
    wireSigninFlow({
      emailForm:    $("formEmail"),
      emailInput:   $("emailInput"),
      emailField:   $("fEmail"),
      emailErr:     $("errEmail"),
      passForm:     $("formPassword"),
      passInput:    $("passwordInput"),
      passField:    $("fPassword"),
      passErr:      $("errPassword"),
      emailDisplay: $("emailDisplay"),
      stepEmail:    $("stepEmail"),
      stepPass:     $("stepPassword"),
      backBtn:      $("backBtn"),
      eyeBtn:       $("eyeBtn"),
      submitBtn:    $("loginSubmitBtn"),
      onSuccess: function () {
        showToast("si2Toast");
        // Go back to home — works from both root signin.html and signin/index.html
        setTimeout(function () { window.location.href = "../index.html"; }, 1800);
      }
    });
  }


  /* ============================================================
     SHARED HELPERS
     ============================================================ */

  // Wire up the full 2-step email → password sign-in flow
  function wireSigninFlow(o) {
    if (!o.emailForm || !o.passForm) return;

    // Show/hide password toggle
    if (o.eyeBtn && o.passInput) {
      o.eyeBtn.addEventListener("click", function () {
        var show = o.passInput.type === "password";
        o.passInput.type = show ? "text" : "password";
        var eyeShow = o.eyeBtn.querySelector(".si2-eye__show");
        var eyeHide = o.eyeBtn.querySelector(".si2-eye__hide");
        if (eyeShow) eyeShow.style.display = show ? "none" : "";
        if (eyeHide) eyeHide.style.display = show ? "" : "none";
        o.eyeBtn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      });
    }

    // Clear error when user starts typing
    if (o.emailInput) o.emailInput.addEventListener("input", function () { clearErr(o.emailField, o.emailErr); });
    if (o.passInput)  o.passInput.addEventListener("input",  function () { clearErr(o.passField,  o.passErr); });

    // Step 1: validate email → show password step
    o.emailForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = o.emailInput ? o.emailInput.value.trim() : "";
      if (!email) { return showErr(o.emailField, o.emailErr, "Please enter your email."); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { return showErr(o.emailField, o.emailErr, "Enter a valid email address."); }
      clearErr(o.emailField, o.emailErr);
      if (o.emailDisplay) o.emailDisplay.textContent = email;
      o.stepEmail.classList.add("si2-step--hidden");
      o.stepPass.classList.remove("si2-step--hidden");
      if (o.passInput) o.passInput.focus();
    });

    // Back button: go back to email step
    if (o.backBtn) {
      o.backBtn.addEventListener("click", function () {
        o.stepPass.classList.add("si2-step--hidden");
        o.stepEmail.classList.remove("si2-step--hidden");
        clearErr(o.passField, o.passErr);
      });
    }

    // Step 2: validate password → success
    o.passForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var pass = o.passInput ? o.passInput.value : "";
      if (!pass)         { return showErr(o.passField, o.passErr, "Please enter your password."); }
      if (pass.length < 6) { return showErr(o.passField, o.passErr, "Password must be at least 6 characters."); }
      clearErr(o.passField, o.passErr);

      // Show loading spinner on submit button
      if (o.submitBtn) { o.submitBtn.classList.add("loading"); o.submitBtn.disabled = true; }

      // Simulate login (1.4s delay) then call success callback
      setTimeout(function () {
        if (o.submitBtn) { o.submitBtn.classList.remove("loading"); o.submitBtn.disabled = false; }
        o.onSuccess();
      }, 1400);
    });
  }

  // Show a validation error on a field
  function showErr(field, errEl, msg) {
    if (field)  field.classList.add("has-error");
    if (errEl)  errEl.textContent = msg;
  }

  // Remove validation error from a field
  function clearErr(field, errEl) {
    if (field)  field.classList.remove("has-error");
    if (errEl)  errEl.textContent = "";
  }

  // Show a toast notification for 2.8 seconds
  function showToast(id) {
    var toast = $(id);
    if (!toast) return;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 2800);
  }

}); // end DOMContentLoaded
