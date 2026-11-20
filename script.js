// ============================================================
//  EVENTBRITE CLONE — script.js
//  Scope: Header + Hero + Categories (Team Member 1)
//  Teammates: add your JS below the "TEAMMATE ZONE" comment.
// ============================================================

// ---- Mobile menu toggle ----
const menuToggle = document.getElementById("menuToggle");
const nav        = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

// Close nav when any nav link is clicked (mobile UX)
nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// ---- Help Center dropdown ----
const helpBtn  = document.getElementById("helpBtn");
const helpMenu = document.getElementById("helpMenu");

helpBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = helpMenu.classList.toggle("open");
  helpBtn.setAttribute("aria-expanded", isOpen);
});

// Close on outside click
document.addEventListener("click", () => {
  helpMenu.classList.remove("open");
  helpBtn.setAttribute("aria-expanded", "false");
});

// Close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    helpMenu.classList.remove("open");
    helpBtn.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

// ---- Search (demo) ----
function runSearch() {
  const q   = document.getElementById("searchInput").value.trim();
  const loc = document.getElementById("locationInput").value.trim();
  if (!q) return;
  console.log("Search:", q, "| Location:", loc);
  // Uncomment to navigate:
  // window.location.href = `search.html?q=${encodeURIComponent(q)}&loc=${encodeURIComponent(loc)}`;
}

document.getElementById("searchBtn").addEventListener("click", runSearch);
document.getElementById("searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") runSearch();
});

// ---- Category pill: mark active ----
document.querySelectorAll(".category").forEach((cat) => {
  cat.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".category").forEach((c) => c.classList.remove("active"));
    cat.classList.add("active");
  });
});

// ---- Sticky header shadow on scroll ----
const header = document.querySelector(".header");
window.addEventListener("scroll", () => {
  header.style.boxShadow = window.scrollY > 4
    ? "0 2px 12px rgba(30,10,60,0.09)"
    : "none";
}, { passive: true });

// ============================================================
//  TEAMMATE ZONE — add your JS below this line
//  (Teammate 2: Middle section | Teammate 3: Footer)
// ============================================================

// ============================================================
//  FOOTER JS — Teammate 3
// ============================================================
(function () {
  const ARROW =
    '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">' +
    '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"' +
    ' stroke-linejoin="round" d="M7 17L17 7M8 7h9v9"/></svg>';

  const cities = [
    "Abilene", "Phoenix", "Albuquerque", "Anaheim", "Raleigh", "Wichita"
  ];

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

  // Guard — footer may not be on every page
  if (!citiesEl) return;

  // Populate chips
  citiesEl.innerHTML = cities.map((c) => chip("Things to do in " + c)).join("");
  row1.innerHTML     = statesRow1.map(chip).join("");
  row2.innerHTML     = statesRow2.map(chip).join("");

  // Drag-to-scroll for state rows
  const scroller = document.getElementById("efStates");
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
  // Prevent link navigation while dragging
  scroller.addEventListener("click", (e) => {
    if (moved) e.preventDefault();
  }, true);

  // Country dropdown
  const countryBtn   = document.getElementById("efCountryBtn");
  const countryMenu  = document.getElementById("efCountryMenu");
  const countryLabel = document.getElementById("efCountryLabel");

  countryBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = countryMenu.classList.toggle("open");
    countryBtn.setAttribute("aria-expanded", open);
  });

  countryMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      countryLabel.textContent = e.target.textContent;
      countryMenu.classList.remove("open");
      countryBtn.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", () => {
    countryMenu.classList.remove("open");
    countryBtn.setAttribute("aria-expanded", "false");
  });

  // Auto-update copyright year
  const yearEl = document.getElementById("efYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

const locationBtn = document.getElementById("locationBtn");
const locationDropdown = document.getElementById("locationDropdown");
const currentLocation = document.getElementById("currentLocation");

locationBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    locationDropdown.classList.toggle("show");
});

// Current location option
currentLocation.addEventListener("click", function () {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
            function (position) {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                alert(
                    "Location detected successfully!\nLatitude: " +
                    latitude +
                    "\nLongitude: " +
                    longitude
                );

                locationDropdown.classList.remove("show");

            },
            function () {
                alert("Please allow location access in your browser.");
            }
        );

    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

// Close dropdown when clicking outside
document.addEventListener("click", function (event) {

    if (!event.target.closest(".location-dropdown")) {
        locationDropdown.classList.remove("show");
    }

});

 /* ============================================================
     6. SIGN-IN MODAL  (index.html)
     ============================================================ */

  var overlay   = $("signinOverlay");
  var openBtn   = $("openSignin");
  var closeBtn  = $("closeSignin");

  // Open modal
  if (overlay && openBtn) {
    openBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
      resetModalSteps();
      var inp = $("mEmailInput");
      if (inp) { inp.value = ""; inp.focus(); }
    });

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
     7. SIGN-IN STANDALONE PAGE  (signin.html)
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
        setTimeout(function () { window.location.href = "index.html"; }, 1800);
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

; // end DOMContentLoaded