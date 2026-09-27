/* =========================================================================
   UPKEEP Med Spa — Privacy-Safe Tracking & Analytics
   Purpose: reduce Meta Pixel / wiretap / health-data tracking risk.

   Default behavior:
   - Does NOT load Meta Pixel or Google advertising tags until marketing consent.
   - Does NOT send form fields, names, email, phone, message text, or treatment
     inquiry details to Meta.
   - Does NOT fire Meta Lead, InitiateCheckout, Contact, or custom CTA events.
   - Enables Meta Limited Data Use before Pixel initialization where applicable.

   Consent integration:
   - Your cookie banner/CMP should call:
       window.UPKEEP_TrackingConsent.grantMarketing()
     when the visitor affirmatively accepts marketing/advertising cookies.
   - It should call:
       window.UPKEEP_TrackingConsent.denyMarketing()
     when the visitor rejects/withdraws marketing cookies.
   ========================================================================= */
(function () {
  'use strict';

  var TRACKING_CONFIG = {
    META_PIXEL_ID: '703174090456642',
    GOOGLE_ID: 'GT-NBPRR3V',
    CONSENT_STORAGE_KEY: 'upkeep_marketing_tracking_consent_v1'
  };

  function hasMarketingConsent() {
    try {
      return window.localStorage.getItem(TRACKING_CONFIG.CONSENT_STORAGE_KEY) === 'granted';
    } catch (e) {
      return false;
    }
  }

  function setMarketingConsent(value) {
    try {
      window.localStorage.setItem(
        TRACKING_CONFIG.CONSENT_STORAGE_KEY,
        value ? 'granted' : 'denied'
      );
    } catch (e) {}
  }

  function currentPageCategory() {
    var path = (window.location.pathname || '').toLowerCase();
    if (path.indexOf('/contact') !== -1) return 'contact';
    if (path.indexOf('/services/') !== -1) return 'service';
    if (path.indexOf('/blog/') !== -1) return 'blog';
    if (path.indexOf('/locations') !== -1) return 'locations';
    if (path === '/' || path === '') return 'home';
    return 'general';
  }

  function loadMetaPixel() {
    if (!TRACKING_CONFIG.META_PIXEL_ID) return;
    if (window.fbq && window.fbq.version) return;

    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s);
    }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

    /*
      Meta Limited Data Use supports certain US state privacy compliance efforts.
      This is not a substitute for consent or for excluding sensitive health data.
    */
    try { window.fbq('dataProcessingOptions', ['LDU'], 0, 0); } catch (e) {}

    /*
      Do not pass advanced matching identifiers here. Avoid em, ph, fn, ln,
      external_id, ZIP, DOB, or other identifiers for med-spa traffic.
    */
    window.fbq('init', TRACKING_CONFIG.META_PIXEL_ID);

    /*
      Conservative approach: only send generic PageView after opt-in. Avoid
      custom health/treatment details and avoid form/booking conversion events.
    */
    window.fbq('track', 'PageView');
  }

  function loadGoogleTag() {
    var id = TRACKING_CONFIG.GOOGLE_ID;
    if (!id || window.gtag) return;

    if (/^(G-|AW-|GT-)/i.test(id)) {
      var gt = document.createElement('script');
      gt.async = true;
      gt.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      document.head.appendChild(gt);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){ window.dataLayer.push(arguments); };
      window.gtag('consent', 'default', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
      window.gtag('js', new Date());
      window.gtag('config', id, {
        anonymize_ip: true,
        allow_ad_personalization_signals: false,
        page_title: document.title,
        page_path: window.location.pathname
      });
    }
  }

  function loadMarketingTracking() {
    if (!hasMarketingConsent()) return;
    loadMetaPixel();
    loadGoogleTag();
  }

  function trackAllowedAnalyticsEvent(name, params) {
    if (!hasMarketingConsent()) return;
    params = params || {};

    /*
      Only generic, non-identifying events. Do not include treatment names,
      button text containing treatment intent, form content, URLs with query
      strings, names, emails, phone numbers, or message text.
    */
    var safeParams = {
      page_category: currentPageCategory(),
      page_path: window.location.pathname
    };
    if (params.event_category) safeParams.event_category = params.event_category;

    try {
      if (window.gtag) window.gtag('event', name, safeParams);
    } catch (e) {}
  }

  function initEventListeners() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('a, button');
      if (!el) return;

      var href = (el.getAttribute('href') || '').toLowerCase();
      var text = (el.textContent || '').trim().toLowerCase();

      if (
        href.indexOf('joinblvd.com') !== -1 ||
        text === 'book now' ||
        text === 'book' ||
        text.indexOf('schedule') !== -1
      ) {
        /*
          Do not send this event to Meta. A booking click can imply intent to
          seek health/aesthetic services. Keep it generic in Google only after
          marketing consent.
        */
        trackAllowedAnalyticsEvent('booking_click', { event_category: 'booking' });
      }
    }, { passive: true });

    document.addEventListener('submit', function (e) {
      var form = e.target;
      if (!form || form.tagName !== 'FORM') return;

      /*
        Do not send Lead or form_submit to Meta. Do not include form name,
        form fields, email, phone, names, or message body in any ad platform.
      */
      trackAllowedAnalyticsEvent('form_submit', { event_category: 'form' });
    }, true);
  }

  window.UPKEEP_TrackingConsent = {
    grantMarketing: function () {
      setMarketingConsent(true);
      loadMarketingTracking();
      try {
        window.dispatchEvent(new CustomEvent('upkeep:marketing-consent-granted'));
      } catch (e) {}
    },
    denyMarketing: function () {
      setMarketingConsent(false);
      try {
        window.dispatchEvent(new CustomEvent('upkeep:marketing-consent-denied'));
      } catch (e) {}
    },
    hasMarketingConsent: hasMarketingConsent,
    config: TRACKING_CONFIG
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initEventListeners();
      loadMarketingTracking();
    });
  } else {
    initEventListeners();
    loadMarketingTracking();
  }
})();
