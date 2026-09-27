/* =========================================================================
   UPKEEP Med Spa — Event RSVP Popup
   Site-wide modal that prompts visitors to RSVP for the next UPKEEP event.

   Which event is shown depends on where the visitor is:
     • New York  → UPKEEP Long Island "Summer Send Off" (Aug 27, Great Neck)
     • Elsewhere → UPKEEP Dallas "Pink Party" 5 Year Anniversary (Aug 27)

   Location comes from /api/visitor-region (netlify/edge-functions/
   visitor-region.ts), which reports the visitor's state/country from the
   edge. If that lookup fails or is slow, the popup quietly falls back to the
   first event with no location requirement — it never blocks on geo.

   Opens a few seconds after page load. A visitor sees at most one RSVP prompt
   per 7 days across all events (60 days once they tap RSVP), so gaining a
   second event never means two modals on consecutive pageviews. Self-
   disabling: an event never mounts after it ends, so no manual teardown is
   required.

   Preview helpers (ignore cookies + delay):
     ?rsvp=preview                     — whichever event this visitor would get
     ?rsvp=preview&region=NY           — simulate a visitor in that state
     ?rsvp=preview&event=pink-party    — force a specific event by id
   ========================================================================= */
(function () {
  'use strict';

  // Events are evaluated in order — the first one this visitor is eligible for
  // wins. Keep any location-gated event above the catch-all fallback.
  var EVENTS = [
    {
      id: 'summer-send-off',
      cookie: 'upkeep_li_rsvp_seen',
      regions: ['NY'],                 // US states this prompt is shown in
      rsvpUrl: 'https://partiful.com/e/KcCP1F37QKtPVMBdZK3y',
      startMs: Date.parse('2026-08-27T17:00:00-04:00'), // 5:00pm ET
      endMs: Date.parse('2026-08-28T00:00:00-04:00'),   // end of 8/27 ET
      flyer: 'assets/events/summer-send-off-long-island-aug27.png',
      flyerWidth: 1254,
      flyerHeight: 1254,
      eyebrow: 'UPKEEP Long Island',
      titleHtml: 'Summer <em>Send Off</em>',
      dateHtml: 'Thursday, August 27<sup>th</sup> &middot; 5:00 &ndash; 7:30 PM',
      sub: 'One last toast to summer in Great Neck.',
      perks: [
        'Exclusive event specials',
        'Giveaways',
        'Local vendors',
        'Lite bites &amp; drinks',
        'Free lip flips with purchase'
      ],
      address: '39 Great Neck Rd. &middot; Great Neck, NY 11021 &middot; Terms &amp; conditions apply'
    },
    {
      id: 'pink-party',
      cookie: 'upkeep_dallas_rsvp_seen',
      regions: null,                   // no location requirement — the default
      rsvpUrl: 'https://partiful.com/e/MgqFELQ1CmoWutChxpr8',
      startMs: Date.parse('2026-08-27T17:30:00-05:00'), // 5:30pm CT
      endMs: Date.parse('2026-08-28T00:00:00-05:00'),   // end of 8/27 CT
      flyer: 'assets/events/pink-party-dallas-aug27.png',
      flyerWidth: 1080,
      flyerHeight: 1920,
      eyebrow: 'UPKEEP Dallas &middot; 5 Year Anniversary',
      titleHtml: 'Pink <em>Party</em>',
      dateHtml: 'Thursday, August 27<sup>th</sup> &middot; 5:30 &ndash; 8:00 PM',
      sub: 'Five years of UPKEEP Dallas. Dress code: think pink.',
      perks: [
        'Free lip flips',
        'Food truck &amp; open bar',
        '$50K in giveaways',
        '$500 best-dressed prize'
      ],
      address: '5207 Bonita Ave &middot; Dallas, TX 75206 &middot; Terms &amp; conditions apply'
    }
  ];

  var SHOW_DELAY_MS  = 5000;
  var DISMISS_DAYS   = 7;
  var RSVPED_DAYS    = 60;
  var OVERLAY_CLASS  = 'upk-rsvp-overlay';
  var GEO_ENDPOINT   = '/api/visitor-region';
  var GEO_TIMEOUT_MS = 2500;
  // Set whenever any event prompt is closed — keeps a visitor who dismissed
  // one event from being shown a different one on their next pageview.
  var COOLDOWN_COOKIE = 'upkeep_rsvp_prompted';

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  function queryParam(name) {
    var match = window.location.search.match(new RegExp('[?&]' + name + '=([^&]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  // Build a relative href to a root-level file based on current URL depth
  function relHref(file) {
    var path = window.location.pathname;
    var parts = path.split('/').filter(Boolean);
    var depth = parts.length;
    if (parts.length && parts[parts.length - 1].indexOf('.') !== -1) {
      depth = parts.length - 1; // last segment is the file
    }
    return (depth > 0 ? '../'.repeat(depth) : './') + file;
  }

  // "Tonight" / "Tomorrow" / "In 12 days" — urgency line above the CTA
  function countdownLabel(event) {
    var now = Date.now();
    if (now >= event.startMs) return 'Happening now';
    var days = Math.ceil((event.startMs - now) / 86400000);
    if (days <= 1) return 'Tonight';
    if (days === 2) return 'Tomorrow';
    return 'In ' + days + ' days';
  }

  function build(event) {
    var overlay = document.createElement('div');
    overlay.className = 'upk-pop-overlay ' + OVERLAY_CLASS;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'upk-rsvp-title');
    overlay.setAttribute('aria-describedby', 'upk-rsvp-date');
    overlay.innerHTML = ''
      + '<div class="upk-pop-card upk-rsvp-card">'
      +   '<button type="button" class="upk-pop-close upk-rsvp-close" aria-label="Close">&times;</button>'
      +   '<div class="upk-rsvp-media" aria-hidden="true">'
      +     '<img src="' + relHref(event.flyer) + '" alt="" width="' + event.flyerWidth + '" height="' + event.flyerHeight + '" loading="lazy" decoding="async">'
      +   '</div>'
      +   '<div class="upk-rsvp-body">'
      +     '<p class="upk-rsvp-eyebrow">' + event.eyebrow + '</p>'
      +     '<h2 class="upk-rsvp-title" id="upk-rsvp-title">' + event.titleHtml + '</h2>'
      +     '<p class="upk-rsvp-date" id="upk-rsvp-date">'
      +       '<span>' + event.dateHtml + '</span>'
      +       '<span class="upk-rsvp-countdown">' + countdownLabel(event) + '</span>'
      +     '</p>'
      +     '<p class="upk-rsvp-sub">' + event.sub + '</p>'
      +     '<ul class="upk-rsvp-list" role="list">'
      +       '<li>' + event.perks.join('</li><li>') + '</li>'
      +     '</ul>'
      +     '<a class="upk-rsvp-cta" href="' + event.rsvpUrl + '" target="_blank" rel="noopener noreferrer">Tap to RSVP</a>'
      +     '<button type="button" class="upk-rsvp-dismiss">Maybe later</button>'
      +     '<p class="upk-rsvp-address">' + event.address + '</p>'
      +   '</div>'
      + '</div>';
    return overlay;
  }

  function mount(event) {
    var overlay = build(event);
    var lastFocused = document.activeElement;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(function () {
      overlay.classList.add('upk-pop-open');
    });

    function close(days) {
      var cooldown = days || DISMISS_DAYS;
      setCookie(event.cookie, '1', cooldown);
      setCookie(COOLDOWN_COOKIE, event.id, cooldown);
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
      // Keep focus inside the dialog while it is open
      var focusable = overlay.querySelectorAll('button, a[href]');
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

    overlay.querySelector('.upk-rsvp-close').addEventListener('click', function () { close(); });
    overlay.querySelector('.upk-rsvp-dismiss').addEventListener('click', function () { close(); });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    // Tapping RSVP opens Partiful in a new tab — stop re-prompting for a while
    overlay.querySelector('.upk-rsvp-cta').addEventListener('click', function () {
      close(RSVPED_DAYS);
    });
    document.addEventListener('keydown', onKeydown, true);

    overlay.querySelector('.upk-rsvp-cta').focus();
  }

  // A location-gated event only shows to US visitors in one of its states.
  // Unknown location (lookup failed or skipped) never matches a gated event.
  function inRegion(event, geo) {
    if (!event.regions) return true;
    if (!geo || geo.country !== 'US' || !geo.region) return false;
    return event.regions.indexOf(String(geo.region).toUpperCase()) !== -1;
  }

  function pick(candidates, geo) {
    for (var i = 0; i < candidates.length; i++) {
      if (inRegion(candidates[i], geo)) return candidates[i];
    }
    return null;
  }

  // Resolves the visitor's region, or null if it can't be determined quickly.
  function resolveRegion(needed, forcedRegion, done) {
    if (forcedRegion) {
      done({ region: forcedRegion.toUpperCase(), country: 'US' });
      return;
    }
    if (!needed || typeof window.fetch !== 'function') {
      done(null);
      return;
    }

    var settled = false;
    function finish(geo) {
      if (settled) return;
      settled = true;
      done(geo);
    }

    var timer = setTimeout(function () { finish(null); }, GEO_TIMEOUT_MS);
    window.fetch(GEO_ENDPOINT, { headers: { Accept: 'application/json' } })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) { clearTimeout(timer); finish(data); })
      .catch(function () { clearTimeout(timer); finish(null); });
  }

  function init() {
    if (document.querySelector('.' + OVERLAY_CLASS)) return; // idempotent

    var preview      = queryParam('rsvp') === 'preview';
    var forcedId     = preview ? queryParam('event') : null;
    var forcedRegion = preview ? queryParam('region') : null;
    var now          = Date.now();

    if (!preview && getCookie(COOLDOWN_COOKIE)) return; // prompted recently

    var candidates = EVENTS.filter(function (event) {
      if (forcedId && event.id !== forcedId) return false;
      if (preview) return true;
      if (now > event.endMs) return false;        // event over — never show
      if (getCookie(event.cookie)) return false;  // already seen recently
      return true;
    });
    if (!candidates.length) return;

    // Only pay for the geo lookup when a location-gated event is still in play.
    var needsGeo = candidates.some(function (event) { return !!event.regions; });

    var geoReady = false, delayReady = false, geo = null;
    function maybeMount() {
      if (!geoReady || !delayReady) return;
      var event = pick(candidates, geo);
      if (!event) return;
      // Don't stack on top of another modal (e.g. the newsletter popup)
      if (!preview && document.querySelector('.upk-pop-overlay')) return;
      mount(event);
    }

    if (preview) {
      delayReady = true;
    } else {
      setTimeout(function () { delayReady = true; maybeMount(); }, SHOW_DELAY_MS);
    }

    resolveRegion(needsGeo, forcedRegion, function (result) {
      geo = result;
      geoReady = true;
      maybeMount();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
