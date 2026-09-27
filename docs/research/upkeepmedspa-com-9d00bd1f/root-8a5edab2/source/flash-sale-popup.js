/* =========================================================================
   UPKEEP Med Spa — Flash Sale Popup
   40% off a full syringe of JUVEDERM Ultra XC, September 24-27, 2026
   (originally 24-25; extended through the weekend).

   Site-wide modal with two ways to convert:
     1. "Book Now"  — opens the Boulevard booking widget in a new tab. The
        discount is applied automatically at checkout, so no code is shown.
     2. "Have us call you" — an inline form (name, phone, email, preferred
        location) that posts to the Netlify form "flash-sale-lead". The team
        works that list by phone. Registered in __forms.html; a form that is
        not declared there has its submissions silently discarded.

   SELF-DISABLING. Nothing mounts once SALE_END_MS has passed — the modal
   never appears and the form is never rendered, so no one can submit a
   callback request for an expired offer. No manual teardown needed; the
   script can safely stay on the pages after Sunday.

   Frequency: by default this shows on EVERY pageview for the length of the
   sale, which is what "pop up every time someone visits" means. Two things
   stop it: booking, or submitting the callback form — either one silences it
   for the rest of the sale. To soften it to once per browsing session
   instead, flip ONCE_PER_SESSION to true below; nothing else changes.

   Preview helpers (ignore the date window, cookies and the open delay):
     ?flash=preview
   ========================================================================= */
(function () {
  'use strict';

  // Midnight CT at the end of Sunday, September 27 2026 (extended from Friday
  // the 25th to run through the weekend). Central is the later
  // of the brand's two timezones, so no Dallas visitor loses hours to a New
  // York cutoff. Past this instant the popup never mounts again.
  var SALE_END_MS = Date.parse('2026-09-28T00:00:00-05:00');

  var BOOKING_URL = 'https://www.joinblvd.com/b/upkeep-medspa/widget#/locations';
  var FLYER       = 'assets/events/flash-sale-40-off-sept2026.png';
  var FLYER_W     = 900;
  var FLYER_H     = 1600;

  var FORM_NAME     = 'flash-sale-lead';
  var FORM_ENDPOINT = '/__forms.html';

  var SHOW_DELAY_MS    = 1200;  // brief beat after load, not an instant blast
  var ONCE_PER_SESSION = false; // true = at most one prompt per browsing session
  var SESSION_KEY      = 'upkeep_flash_seen';
  var DONE_COOKIE      = 'upkeep_flash_done'; // booked or left their info
  var OVERLAY_CLASS    = 'upk-flash-overlay';

  var LOCATIONS = [
    'Upper East Side, NY',
    'Greenwich Village, NY',
    'Chelsea, NY',
    'Brooklyn, NY',
    'Long Island, NY',
    'Dallas, TX',
    'Addison, TX',
    'No preference'
  ];

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  // Cookies expire with the sale — there is nothing to remember afterwards.
  function setDoneCookie() {
    var days = Math.max(1, Math.ceil((SALE_END_MS - Date.now()) / 86400000));
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = DONE_COOKIE + '=1;expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  function queryParam(name) {
    var match = window.location.search.match(new RegExp('[?&]' + name + '=([^&]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  // Root-level asset path that works from /, /services/ and /blog/ alike.
  function relHref(file) {
    var parts = window.location.pathname.split('/').filter(Boolean);
    var depth = parts.length;
    if (parts.length && parts[parts.length - 1].indexOf('.') !== -1) {
      depth = parts.length - 1; // last segment is the file, not a directory
    }
    return (depth > 0 ? '../'.repeat(depth) : './') + file;
  }

  function escapeAttr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // "2d 4h left" / "6h 20m left" / "14m left" — urgency next to the dates.
  function timeLeftLabel() {
    var ms = SALE_END_MS - Date.now();
    if (ms <= 0) return 'Last chance';
    var minutes = Math.floor(ms / 60000);
    var days = Math.floor(minutes / 1440);
    var hours = Math.floor((minutes % 1440) / 60);
    var mins = minutes % 60;
    if (days > 0) return days + 'd ' + hours + 'h left';
    if (hours > 0) return hours + 'h ' + mins + 'm left';
    return Math.max(1, mins) + 'm left';
  }

  function locationOptions() {
    var html = '<option value="" disabled selected>Select a location</option>';
    for (var i = 0; i < LOCATIONS.length; i++) {
      html += '<option value="' + escapeAttr(LOCATIONS[i]) + '">' + LOCATIONS[i] + '</option>';
    }
    return html;
  }

  function build() {
    var overlay = document.createElement('div');
    overlay.className = 'upk-pop-overlay ' + OVERLAY_CLASS;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'upk-flash-title');
    overlay.setAttribute('aria-describedby', 'upk-flash-offer');
    overlay.innerHTML = ''
      + '<div class="upk-pop-card upk-flash-card">'
      +   '<button type="button" class="upk-pop-close upk-flash-close" aria-label="Close">&times;</button>'
      +   '<div class="upk-flash-media" aria-hidden="true">'
      +     '<img src="' + escapeAttr(relHref(FLYER)) + '" alt="" width="' + FLYER_W + '" height="' + FLYER_H + '" decoding="async">'
      +     '<span class="upk-flash-extended">Extended<b>9/24 &ndash; 9/27</b></span>'
      +   '</div>'
      +   '<div class="upk-flash-body">'
      +     '<p class="upk-flash-eyebrow">Flash Sale &middot; All Locations</p>'
      +     '<h2 class="upk-flash-title" id="upk-flash-title">40% <em>Off</em></h2>'
      +     '<p class="upk-flash-offer" id="upk-flash-offer">A full syringe of JUV&Eacute;DERM<sup>&reg;</sup> Ultra XC</p>'
      +     '<p class="upk-flash-sub">Pick up &mdash; your dream lips are calling.</p>'
      +     '<p class="upk-flash-dates">'
      +       '<span>Extended &middot; Through Sunday, Sept 27</span>'
      +       '<span class="upk-flash-countdown" data-flash-countdown>' + timeLeftLabel() + '</span>'
      +     '</p>'

      +     '<div class="upk-flash-step" data-flash-step="choose">'
      +       '<a class="upk-flash-cta" href="' + BOOKING_URL + '" target="_blank" rel="noopener noreferrer" data-flash-book>Book Now</a>'
      +       '<p class="upk-flash-note">Your 40% discount is applied automatically at checkout &mdash; no code needed.</p>'
      +       '<button type="button" class="upk-flash-alt" data-flash-show-form>Rather we call you? Leave your info</button>'
      +     '</div>'

      +     '<form class="upk-flash-form" data-flash-step="form" novalidate hidden>'
      +       '<input type="hidden" name="form-name" value="' + FORM_NAME + '">'
      +       '<input type="hidden" name="campaign" value="flash-sale-40-off-sept-2026">'
      +       '<input type="hidden" name="subject" value="Flash sale callback request &mdash; 40% off full syringe">'
      +       '<p class="upk-flash-hp" aria-hidden="true"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>'
      +       '<p class="upk-flash-form-lede">Leave your details and we&rsquo;ll call to book you in before the sale ends.</p>'
      +       '<div class="upk-flash-row">'
      +         '<label class="upk-flash-field"><span>First name</span>'
      +           '<input type="text" name="fname" autocomplete="given-name" required>'
      +         '</label>'
      +         '<label class="upk-flash-field"><span>Last name</span>'
      +           '<input type="text" name="lname" autocomplete="family-name">'
      +         '</label>'
      +       '</div>'
      +       '<label class="upk-flash-field"><span>Phone</span>'
      +         '<input type="tel" name="phone" autocomplete="tel" required>'
      +       '</label>'
      +       '<label class="upk-flash-field"><span>Email</span>'
      +         '<input type="email" name="email" autocomplete="email">'
      +       '</label>'
      +       '<label class="upk-flash-field"><span>Preferred location</span>'
      +         '<select name="location" required>' + locationOptions() + '</select>'
      +       '</label>'
      +       '<button type="submit" class="upk-flash-cta upk-flash-submit">Have Us Contact You</button>'
      +       '<p class="upk-flash-status" role="status" aria-live="polite"></p>'
      +       '<button type="button" class="upk-flash-alt" data-flash-show-choose>Back &mdash; I&rsquo;ll book myself</button>'
      +     '</form>'

      +     '<div class="upk-flash-step upk-flash-success" data-flash-step="success" hidden>'
      +       '<h3 class="upk-flash-success-title" tabindex="-1">You&rsquo;re on the list.</h3>'
      +       '<p class="upk-flash-success-sub">We&rsquo;ll reach out shortly to lock in your 40% off. Want a slot right now?</p>'
      +       '<a class="upk-flash-cta" href="' + BOOKING_URL + '" target="_blank" rel="noopener noreferrer">Book Now Instead</a>'
      +     '</div>'

      +     '<p class="upk-flash-fine">Terms &amp; conditions apply &middot; All locations &middot; Select providers</p>'
      +   '</div>'
      + '</div>';
    return overlay;
  }

  function mount() {
    var overlay = build();
    var lastFocused = document.activeElement;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    var steps = {
      choose:  overlay.querySelector('[data-flash-step="choose"]'),
      form:    overlay.querySelector('[data-flash-step="form"]'),
      success: overlay.querySelector('[data-flash-step="success"]')
    };
    var form      = steps.form;
    var status    = overlay.querySelector('.upk-flash-status');
    var submitBtn = overlay.querySelector('.upk-flash-submit');
    var countdown = overlay.querySelector('[data-flash-countdown]');

    var ticker = setInterval(function () {
      countdown.textContent = timeLeftLabel();
    }, 30000);

    function show(name) {
      for (var key in steps) {
        if (Object.prototype.hasOwnProperty.call(steps, key)) {
          steps[key].hidden = key !== name;
        }
      }
    }

    function close() {
      clearInterval(ticker);
      document.removeEventListener('keydown', onKeydown, true);
      overlay.classList.remove('upk-pop-open');
      document.body.style.overflow = '';
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 350);
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function onKeydown(e) {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      // Keep focus inside the dialog, skipping whichever step is hidden.
      var focusable = [];
      var candidates = overlay.querySelectorAll('button, a[href], input, select');
      for (var i = 0; i < candidates.length; i++) {
        if (candidates[i].offsetParent !== null && candidates[i].tabIndex !== -1) {
          focusable.push(candidates[i]);
        }
      }
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    requestAnimationFrame(function () {
      overlay.classList.add('upk-pop-open');
    });

    overlay.querySelector('.upk-flash-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', onKeydown, true);

    overlay.querySelector('[data-flash-show-form]').addEventListener('click', function () {
      show('form');
      form.querySelector('[name="fname"]').focus();
    });
    overlay.querySelector('[data-flash-show-choose]').addEventListener('click', function () {
      show('choose');
      overlay.querySelector('[data-flash-book]').focus();
    });

    // Booking opens in a new tab — stop prompting them for the rest of the sale.
    var bookLinks = overlay.querySelectorAll('.upk-flash-cta[href]');
    for (var b = 0; b < bookLinks.length; b++) {
      bookLinks[b].addEventListener('click', function () {
        setDoneCookie();
        setTimeout(close, 400);
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = '';
      status.classList.remove('upk-flash-status--error');

      // Honeypot — only bots fill this in.
      if (form.querySelector('[name="bot-field"]').value) return;

      var required = ['fname', 'phone', 'location'];
      for (var i = 0; i < required.length; i++) {
        var field = form.querySelector('[name="' + required[i] + '"]');
        if (!field.value.trim()) {
          field.focus();
          status.textContent = 'Please add your name, phone and preferred location.';
          status.classList.add('upk-flash-status--error');
          return;
        }
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      var body = [];
      new FormData(form).forEach(function (value, key) {
        body.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
      });

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.join('&')
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Submission failed');
          setDoneCookie();
          show('success');
          overlay.querySelector('.upk-flash-success-title').focus();
        })
        .catch(function () {
          status.textContent = 'Something went wrong. Please call 833-875-3377 or book directly.';
          status.classList.add('upk-flash-status--error');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Have Us Contact You';
        });
    });

    overlay.querySelector('[data-flash-book]').focus();
  }

  function init() {
    if (document.querySelector('.' + OVERLAY_CLASS)) return; // idempotent

    var preview = queryParam('flash') === 'preview';

    if (!preview) {
      if (Date.now() >= SALE_END_MS) return;   // sale is over — never mount
      if (getCookie(DONE_COOKIE)) return;      // already booked or left info
      if (ONCE_PER_SESSION) {
        try {
          if (sessionStorage.getItem(SESSION_KEY)) return;
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch (err) { /* private mode — fall through and show it */ }
      }
    }

    setTimeout(function () {
      // Never stack on another modal (the RSVP or newsletter popups).
      if (!preview && document.querySelector('.upk-pop-overlay')) return;
      mount();
    }, preview ? 0 : SHOW_DELAY_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
