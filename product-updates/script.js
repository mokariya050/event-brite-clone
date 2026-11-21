// Eventbrite Product Updates — script.js

document.addEventListener("DOMContentLoaded", function () {
  function $(id) { return document.getElementById(id); }

  var MONTHS = ["October 2026", "September 2026", "August 2026", "July 2026", "June 2026", "May 2026", "April 2026"];

  // Video paths are relative to product-updates/index.html — videos folder is one level up
  var DATA = {
    "October 2026": {
      featured: [
        {
          date: "Oct 30, 2026",
          title: "Delay QR code release",
          video: "../videos/DelayedQRcode_ANIMATION_compressed__2_.mp4",
          text: "Choose to release QR codes 24 or 48 hours before your event, making it harder to resell tickets in advance."
        },
        {
          date: "Oct 30, 2026",
          title: "What\u2019s next for Eventbrite",
          video: "../videos/roadmap-announcement_COMPRESSED.mp4",
          text: "Explore our November 2026 roadmap: automated waitlists, SMS campaigns (paid, starting in the US), smarter event discovery and more, all coming in the months ahead."
        },
        {
          date: "Oct 19, 2026",
          title: "Bulk check-in and check-out",
          video: "../videos/BulkCheckInOut_ANIMATION_compressed.mp4",
          text: "Check in or out multiple attendees at once, with optional ticket-type filters, to save time before and after your event."
        },
        {
          date: "Oct 16, 2026",
          title: "Clearer start and end date fields",
          video: "../videos/StartEndDateClarity_ANIMATION.mp4",
          text: "Start and end dates now have their own fields when you create an event, so it\u2019s clearer how to set overnight and multi-day schedules."
        },
        {
          date: "Oct 14, 2026",
          title: "Pin a featured event on your profile",
          video: "../videos/PinEventOrganizerProfile_ANIMATION.mp4",
          text: "Pin one event to the top of your organizer profile, so your flagship events are highlighted and not buried under smaller ones."
        },
        {
          date: "Oct 11, 2026",
          title: "Attendee questions reach the right team",
          video: "../videos/ContactOrganizer_ANIMATION_compressed.mp4",
          text: "\u201CContact the organizer\u201D messages go only to team members with permission for that profile. Admins and Owners can choose in Communication preferences."
        },
        {
          date: "Oct 6, 2026",
          title: "Customizable attendee emails",
          video: "../videos/EmailToAttendees_ANIMATION_compressed__1_.mp4",
          text: "Start with a fresh, modern design, then customize brand colors, light or dark mode, and background visuals. Preview your email on mobile and desktop before sending."
        },
        {
          date: "Oct 1, 2026",
          title: "Reports by organizer profile",
          video: "../videos/OrganizerProfileFilter_ANIMATION_compressed.mp4",
          text: "When creating a report, filter events by one or more Organizer Profiles. Matching events are grouped by profile, so you can easily create targeted reports."
        }
      ],
      more: [
        {
          date: "Oct 21, 2026",
          title: "Duplicate add-ons in one click",
          text: "Copy any add-on, with price, capacity, sale dates and image already filled in."
        },
        {
          date: "Oct 13, 2026",
          title: "Add-ons easier to find in checkout",
          text: "Buyers who only want add-ons can click Add-ons at the top of checkout, no ticket needed."
        },
        {
          date: "Oct 12, 2026",
          title: "Paste formatted text into Email Campaigns",
          text: "Copy and paste text into your email body without losing formatting, so you can build campaigns faster."
        },
        {
          date: "Oct 5, 2026",
          title: "Take card payments at the door on Android",
          text: "Staff using the Organizer app on Android can now enter card details manually for events in CAD, AUD, and GBP, just like on iOS."
        }
      ]
    }
  };

  var current = MONTHS[0];
  var query = "";
  var observer = null;

  var monthsEl  = $("months");
  var featuredEl = $("featured");
  var moreEl    = $("more");
  var emptyEl   = $("empty");
  var titleEl   = $("monthTitle");
  var countEl   = $("monthCount");
  var moreTitle = $("moreTitle");

  var playSVG  = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var pauseSVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';

  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function hl(s) {
    var safe = esc(s);
    if (!query) return safe;
    var re = new RegExp("(" + query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
    return safe.replace(re, "<mark>$1</mark>");
  }
  function matches(item) {
    return !query || (item.title + " " + item.text).toLowerCase().indexOf(query) !== -1;
  }

  /* ---- Month tabs ---- */
  function renderTabs() {
    monthsEl.innerHTML = "";
    MONTHS.forEach(function (m) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "month-tab";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", m === current);
      b.textContent = m;
      b.addEventListener("click", function () { current = m; renderTabs(); render(); });
      monthsEl.appendChild(b);
    });
  }

  /* ---- Build one featured video row ---- */
  function featureNode(f) {
    var row = document.createElement("article");
    row.className = "feature";
    row.innerHTML =
      '<div class="feature__media">' +
      '<video muted loop playsinline preload="metadata" src="' + esc(f.video) + '" aria-label="' + esc(f.title) + ' demo"></video>' +
      '<button type="button" class="feature__ctrl" aria-label="Pause video">' + pauseSVG + '</button>' +
      '</div>' +
      '<div class="feature__body">' +
      '<p class="feature__date">' + esc(f.date) + '</p>' +
      '<h3>' + hl(f.title) + '</h3>' +
      '<p>' + hl(f.text) + '</p>' +
      '</div>';

    var media = row.querySelector(".feature__media");
    var vid   = row.querySelector("video");
    var ctrl  = row.querySelector(".feature__ctrl");

    vid.addEventListener("error", function () {
      media.classList.add("is-missing");
      ctrl.style.display = "none";
    });
    ctrl.addEventListener("click", function () {
      if (vid.paused) {
        vid.dataset.manual = "";
        vid.play();
        ctrl.innerHTML = pauseSVG;
        ctrl.setAttribute("aria-label", "Pause video");
      } else {
        vid.dataset.manual = "paused";
        vid.pause();
        ctrl.innerHTML = playSVG;
        ctrl.setAttribute("aria-label", "Play video");
      }
    });
    return row;
  }

  /* ---- Auto-play videos when visible ---- */
  function watchVideos() {
    if (observer) observer.disconnect();
    if (!("IntersectionObserver" in window)) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting && !reduce && v.dataset.manual !== "paused") {
          v.play().catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.5 });
    featuredEl.querySelectorAll("video").forEach(function (v) { observer.observe(v); });
  }

  /* ---- Render the selected month ---- */
  function render() {
    var d = DATA[current];
    titleEl.textContent = current;
    featuredEl.innerHTML = "";
    moreEl.innerHTML = "";

    if (!d) {
      countEl.hidden = true;
      moreTitle.hidden = true;
      emptyEl.hidden = false;
      emptyEl.textContent = "No updates added for " + current + " yet.";
      return;
    }

    var f = d.featured.filter(matches);
    var m = d.more.filter(matches);

    countEl.hidden = false;
    countEl.textContent = (f.length + m.length) + " live upgrades" + (query ? " found" : " this month");

    f.forEach(function (item) { featuredEl.appendChild(featureNode(item)); });
    m.forEach(function (item) {
      var li = document.createElement("li");
      li.innerHTML = '<time>' + esc(item.date) + '</time><div><h4>' + hl(item.title) + '</h4><p>' + hl(item.text) + '</p></div>';
      moreEl.appendChild(li);
    });

    moreTitle.hidden = !m.length;
    emptyEl.hidden = !!(f.length || m.length);
    if (!emptyEl.hidden) emptyEl.textContent = 'No updates match \u201C' + query + '\u201D. Try a different word.';
    watchVideos();
  }

  /* ---- Search filter ---- */
  var finderEl = $("finder");
  if (finderEl) {
    finderEl.addEventListener("input", function (e) {
      query = e.target.value.trim().toLowerCase();
      render();
    });
  }

  // Footer year (used by the shared footer script)
  var y = $("efYear"); if (y) y.textContent = new Date().getFullYear();

  renderTabs();
  render();
});
