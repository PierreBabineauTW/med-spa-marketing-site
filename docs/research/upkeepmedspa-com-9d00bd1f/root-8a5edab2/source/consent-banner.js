/* =========================================================================
   UPKEEP Med Spa — Marketing Cookie Consent Banner
   Pairs with tracking.js (privacy-safe).
   Renders a bottom bar on first visit; persists choice in localStorage.
   On Accept → window.UPKEEP_TrackingConsent.grantMarketing()
   On Decline → window.UPKEEP_TrackingConsent.denyMarketing()
   ========================================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'upkeep_marketing_tracking_consent_v1';
  var DISMISS_KEY = 'upkeep_consent_banner_dismissed_v1';

  function alreadyAnswered() {
    try {
      var v = window.localStorage.getItem(STORAGE_KEY);
      return v === 'granted' || v === 'denied';
    } catch (e) { return false; }
  }

  function buildBanner() {
    var wrap = document.createElement('div');
    wrap.id = 'upkeep-consent-banner';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-live', 'polite');
    wrap.setAttribute('aria-label', 'Cookie consent');
    wrap.innerHTML =
      '<div class="upkeep-consent__inner">' +
        '<p class="upkeep-consent__text">' +
          'We use cookies to improve your experience and, with your permission, to show relevant ads and measure marketing performance. ' +
          'See our <a href="/privacy-policy.html">Privacy Policy</a>.' +
        '</p>' +
        '<div class="upkeep-consent__actions">' +
          '<button type="button" class="upkeep-consent__btn upkeep-consent__btn--secondary" data-consent="decline">Decline</button>' +
          '<button type="button" class="upkeep-consent__btn upkeep-consent__btn--primary" data-consent="accept">Allow marketing cookies</button>' +
        '</div>' +
      '</div>';

    wrap.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.getAttribute) return;
      var action = t.getAttribute('data-consent');
      if (!action) return;
      if (action === 'accept') {
        if (window.UPKEEP_TrackingConsent && typeof window.UPKEEP_TrackingConsent.grantMarketing === 'function') {
          window.UPKEEP_TrackingConsent.grantMarketing();
        }
      } else if (action === 'decline') {
        if (window.UPKEEP_TrackingConsent && typeof window.UPKEEP_TrackingConsent.denyMarketing === 'function') {
          window.UPKEEP_TrackingConsent.denyMarketing();
        }
      }
      try { window.localStorage.setItem(DISMISS_KEY, '1'); } catch (e2) {}
      wrap.parentNode && wrap.parentNode.removeChild(wrap);
    });

    return wrap;
  }

  function show() {
    if (alreadyAnswered()) return;
    if (document.getElementById('upkeep-consent-banner')) return;
    document.body.appendChild(buildBanner());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', show);
  } else {
    show();
  }

  // Expose a manual re-open for the privacy policy footer link
  window.UPKEEP_ConsentBanner = {
    reopen: function () {
      try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      try { window.localStorage.removeItem(DISMISS_KEY); } catch (e) {}
      var existing = document.getElementById('upkeep-consent-banner');
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      show();
    }
  };
})();
