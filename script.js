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
     4. EVENT CARDS — data array + loop (replaces repeated HTML)
     ============================================================
     To add a new event: just add one more object to the array below.
     Fields:
       img   – filename inside images/
       alt   – image alt text
       title – event title
       date  – date/time string
       venue – location string
       price – price string ("Free" or "From $X.XX")
       promo – (optional) set to true to show "Promoted" label
     ============================================================ */

  var EVENTS = [
    {
      img: "event1.jpg", alt: "Grief Gab event",
      title: "Grief Gab | On Air: Audio-Only Grief Conversations",
      date: "Today \u2022 7:00 PM GMT+5:30", venue: "Online Event",
      price: "Free", promo: true
    },
    {
      img: "event2.jpg", alt: "Event in Ahmedabad",
      title: "Event in Ahmedabad Fun and Joy",
      date: "Mon, Dec 7 \u2022 10:00 AM", venue: "Ghodasar Canal Road",
      price: "From $2.91"
    },
    {
      img: "event3.jpg", alt: "MSME Business Summit",
      title: "MSME Business Summit 2026 | Ahmedabad",
      date: "Sat, Dec 12 \u2022 8:30 AM", venue: "Welcomhotel By ITC Hotels, Ashram Road",
      price: "From $20.46"
    },
    {
      img: "event4.jpg", alt: "Unleash Your Greatness",
      title: "UNLEASH YOUR GREATNESS",
      date: "Today \u2022 11:30 PM GMT+5:30", venue: "Ahmedabad",
      price: "From $268.61", promo: true
    },
    {
      img: "event5.jpg", alt: "Global Startup Summit",
      title: "Global Startup Summit 2026 | Ahmedabad",
      date: "Sat, Dec 12 \u2022 8:30 AM", venue: "Welcomhotel By ITC Hotels, Ashram Road",
      price: "From $20.46"
    },
    {
      img: "event6.jpg", alt: "TechAI India Summit",
      title: "TechAI India Summit \u2013 Ahmedabad 2026",
      date: "Sat, Dec 12 \u2022 8:30 AM", venue: "Welcomhotel By ITC Hotels, Ashram Road",
      price: "From $20.46"
    },
    {
      img: "event7.jpg", alt: "International D2C Conclave",
      title: "International D2C Conclave 2026 | Ahmedabad",
      date: "Sat, Dec 12 \u2022 8:30 AM", venue: "Welcomhotel By ITC Hotels, Ashram Road",
      price: "From $20.46"
    },
    {
      img: "event8.jpg", alt: "EFY Expo Gujarat",
      title: "EFY Expo Gujarat | 3-5 December 2026",
      date: "Thu, Dec 3 \u2022 10:00 AM", venue: "Helipad Exhibition Centre, Gate 3",
      price: "Free"
    }
  ];

  // Build and inject all event cards using one loop
  var eventsGrid = $("eventsGrid");
  if (eventsGrid) {
    EVENTS.forEach(function (ev) {
      // Create card element
      var card = document.createElement("div");
      card.className = "event-card";

      // Build inner HTML using the event data
      card.innerHTML =
        '<div class="image-wrapper">' +
          '<img src="images/' + ev.img + '" alt="' + ev.alt + '">' +
        '</div>' +
        '<div class="event-heading">' +
          '<h2>' + ev.title + '</h2>' +
          '<div class="event-actions">' +
            '<button title="Share">\u21e7</button>' +
            '<button title="Favourite">\u2661</button>' +
          '</div>' +
        '</div>' +
        '<p class="event-date">'  + ev.date  + '</p>' +
        '<p class="event-venue">' + ev.venue + '</p>' +
        '<p class="event-price">' + ev.price + '</p>' +
        (ev.promo ? '<p class="event-promo">Promoted</p>' : '');

      eventsGrid.appendChild(card);
    });
  }


  /* ============================================================
     5. DESTINATIONS CAROUSEL — prev / next buttons
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
  var heroBtn        = $("heroMusicBtn");   // "Get Into Live Music" button
  var createEventBtn = $("createEventBtn"); // "Create Events" nav link

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

    // "Create Events" nav link also opens sign-in modal
    if (createEventBtn) {
      createEventBtn.addEventListener("click", function (e) {
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
     8. LOCATION DROPDOWN (current location, online events, recents, search)
     ============================================================ */
  var locMenu        = $("locMenu");
  var locList        = $("locList");
  var locCurrent     = $("locCurrent");
  var locCurrentText = $("locCurrentText");
  var locOnline      = $("locOnline");

  if (locInput && locMenu && locList) {
    var STORE_KEY   = "eb_recent_locations";
    var cityHeading = document.querySelector(".top-section h1 > span:first-child");
    var typeTimer   = null;
    var reqId       = 0;

    var pinSVG   = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';
    var clockSVG = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l3 2"/></svg>';

    /* ---------- recent locations (localStorage) ---------- */
    function getRecent() {
      try {
        var d = JSON.parse(localStorage.getItem(STORE_KEY));
        if (Array.isArray(d) && d.length) return d;
      } catch (e) {}
      return [{ name: "Ahmadābād", sub: "Gujarat" }];
    }
    function saveRecent(item) {
      var list = getRecent().filter(function (x) { return x.name !== item.name; });
      list.unshift(item);
      try { localStorage.setItem(STORE_KEY, JSON.stringify(list.slice(0, 4))); } catch (e) {}
    }

    /* ---------- open / close ---------- */
    function openLocMenu()  { renderList(getRecent(), clockSVG); locMenu.classList.add("open"); }
    function closeLocMenu() { locMenu.classList.remove("open"); }

    /* ---------- render a list of places ---------- */
    function renderList(items, icon) {
      locList.innerHTML = "";
      if (!items.length) {
        var empty = document.createElement("div");
        empty.className = "loc-empty";
        empty.textContent = "No matching locations found";
        locList.appendChild(empty);
        return;
      }
      items.forEach(function (item) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "loc-item";
        btn.setAttribute("role", "option");
        btn.innerHTML = icon;
        var text = document.createElement("span");
        text.className = "loc-item__text";
        var n = document.createElement("span");
        n.textContent = item.name;
        text.appendChild(n);
        if (item.sub) {
          var s = document.createElement("span");
          s.className = "loc-item__sub";
          s.textContent = item.sub;
          text.appendChild(s);
        }
        btn.appendChild(text);
        btn.addEventListener("click", function () { chooseLocation(item); });
        locList.appendChild(btn);
      });
    }

    /* ---------- choose a location ---------- */
    function chooseLocation(item, skipSave) {
      locInput.value = item.name;
      if (cityHeading) cityHeading.textContent = item.name;
      if (!skipSave) saveRecent(item);
      closeLocMenu();
      console.log("Location selected:", item.name, item.sub || "");
    }

    /* ---------- "Use my current location" ---------- */
    function setCurrentStatus(msg, isError) {
      locCurrentText.textContent = msg;
      locCurrent.classList.toggle("is-error", !!isError);
    }
    function resetCurrentStatus() { setCurrentStatus("Use my current location", false); }

    locCurrent.addEventListener("click", function () {
      if (!navigator.geolocation) {
        setCurrentStatus("Geolocation is not supported by your browser", true);
        setTimeout(resetCurrentStatus, 3500);
        return;
      }
      setCurrentStatus("Detecting your location\u2026", false);

      navigator.geolocation.getCurrentPosition(
        function (pos) {
          var lat = pos.coords.latitude, lon = pos.coords.longitude;
          var url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&accept-language=en" +
                    "&lat=" + lat + "&lon=" + lon;
          fetch(url)
            .then(function (r) { return r.json(); })
            .then(function (data) {
              var a = data.address || {};
              var name = a.city || a.town || a.village || a.suburb || a.county || a.state_district || "Current location";
              var sub  = a.state || a.country || "";
              resetCurrentStatus();
              chooseLocation({ name: name, sub: sub });
            })
            .catch(function () {
              resetCurrentStatus();
              chooseLocation({ name: "Current location", sub: lat.toFixed(3) + ", " + lon.toFixed(3) });
            });
        },
        function (err) {
          var msg = err.code === 1
            ? "Location permission denied. Allow it in browser settings."
            : "Couldn't detect your location. Try again.";
          setCurrentStatus(msg, true);
          setTimeout(resetCurrentStatus, 4000);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    });

    /* ---------- "Browse online events" ---------- */
    locOnline.addEventListener("click", function () {
      chooseLocation({ name: "Online", sub: "" }, true);   // not saved to recents
    });

    /* ---------- typing = live city suggestions (debounced) ---------- */
    locInput.addEventListener("input", function () {
      clearTimeout(typeTimer);
      var q = locInput.value.trim();
      if (!locMenu.classList.contains("open")) locMenu.classList.add("open");

      if (q.length < 2) { renderList(getRecent(), clockSVG); return; }

      typeTimer = setTimeout(function () {
        var myReq = ++reqId;
        var url = "https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5" +
                  "&accept-language=en&q=" + encodeURIComponent(q);
        fetch(url)
          .then(function (r) { return r.json(); })
          .then(function (results) {
            if (myReq !== reqId) return;            // ignore outdated responses
            var items = results.map(function (p) {
              var a = p.address || {};
              return {
                name: a.city || a.town || a.village || a.state || p.display_name.split(",")[0],
                sub:  a.state && a.state !== (a.city || a.town) ? a.state : (a.country || "")
              };
            });
            renderList(items, pinSVG);
          })
          .catch(function () {
            if (myReq === reqId) renderList([], pinSVG);
          });
      }, 350);
    });

    /* ---------- open on click/focus, select the text ---------- */
    locInput.addEventListener("focus", function () { locInput.select(); openLocMenu(); });
    locInput.addEventListener("click", function (e) { e.stopPropagation(); openLocMenu(); });

    /* ---------- close on outside click / Escape / Enter ---------- */
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".search__field--location")) closeLocMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLocMenu();
    });
    locInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); closeLocMenu(); }
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
