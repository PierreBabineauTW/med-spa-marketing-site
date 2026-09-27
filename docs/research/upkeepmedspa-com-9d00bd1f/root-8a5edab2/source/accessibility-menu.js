/* UPKEEP Accessibility Menu
 * Native compliance approach (no third-party widget).
 * Floating bottom-left button → opens a small popover with:
 *  - Link to full Accessibility Statement
 *  - Contact (email + phone)
 *  - Larger text toggle (persists in localStorage)
 *  - Reduce motion toggle (persists in localStorage)
 */
(function () {
  if (window.__upkeepA11yMenuMounted) return;
  window.__upkeepA11yMenuMounted = true;

  // Determine relative path to accessibility.html based on current location
  var depth = (window.location.pathname.match(/\//g) || []).length - 1;
  var basePath = depth > 1 ? '../' : './';

  // Restore persisted preferences before painting
  try {
    if (localStorage.getItem('upkeep-a11y-large-text') === '1') {
      document.documentElement.classList.add('a11y-large-text');
    }
    if (localStorage.getItem('upkeep-a11y-reduce-motion') === '1') {
      document.documentElement.classList.add('a11y-reduce-motion');
    }
  } catch (e) {}

  function mount() {
    if (document.getElementById('a11y-menu-root')) return;
    var root = document.createElement('div');
    root.id = 'a11y-menu-root';
    root.innerHTML = '\
      <button id="a11y-menu-button" type="button" aria-label="Open accessibility menu" aria-expanded="false" aria-controls="a11y-menu-panel">\
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">\
          <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.4"/>\
          <circle cx="12" cy="5.4" r="1.6" fill="currentColor"/>\
          <path d="M5.5 8.5 L18.5 8.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/>\
          <path d="M9.5 8.5 L8 18.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/>\
          <path d="M14.5 8.5 L16 18.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/>\
          <path d="M9.2 12 L14.8 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/>\
        </svg>\
      </button>\
      <div id="a11y-menu-panel" role="dialog" aria-modal="false" aria-labelledby="a11y-menu-heading" hidden>\
        <h2 id="a11y-menu-heading">Accessibility</h2>\
        <p class="a11y-menu__intro">Quick controls for a more comfortable visit.</p>\
        <div class="a11y-menu__controls">\
          <label class="a11y-menu__toggle">\
            <input type="checkbox" id="a11y-toggle-text">\
            <span class="a11y-menu__toggle-label">Larger text</span>\
            <span class="a11y-menu__toggle-switch" aria-hidden="true"></span>\
          </label>\
          <label class="a11y-menu__toggle">\
            <input type="checkbox" id="a11y-toggle-motion">\
            <span class="a11y-menu__toggle-label">Reduce motion</span>\
            <span class="a11y-menu__toggle-switch" aria-hidden="true"></span>\
          </label>\
          <button type="button" class="a11y-menu__reset" id="a11y-reset">Reset preferences</button>\
        </div>\
        <div class="a11y-menu__divider" role="presentation"></div>\
        <a class="a11y-menu__link" href="' + basePath + 'accessibility.html">Read full Accessibility Statement</a>\
        <div class="a11y-menu__contact">\
          <p class="a11y-menu__contact-label">Need help? Contact us:</p>\
          <a href="mailto:info@upkeepmedspa.com">info@upkeepmedspa.com</a>\
          <a href="tel:+18338753377">(833) 875-3377</a>\
        </div>\
      </div>';
    document.body.appendChild(root);

    var button = document.getElementById('a11y-menu-button');
    var panel = document.getElementById('a11y-menu-panel');
    var textToggle = document.getElementById('a11y-toggle-text');
    var motionToggle = document.getElementById('a11y-toggle-motion');
    var resetBtn = document.getElementById('a11y-reset');

    // Sync toggle visual state with current document classes
    textToggle.checked = document.documentElement.classList.contains('a11y-large-text');
    motionToggle.checked = document.documentElement.classList.contains('a11y-reduce-motion');

    function openPanel() {
      panel.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      // Move focus to the heading for screen readers
      panel.querySelector('#a11y-menu-heading').setAttribute('tabindex', '-1');
      panel.querySelector('#a11y-menu-heading').focus();
    }
    function closePanel() {
      panel.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    }
    function togglePanel() {
      if (panel.hidden) openPanel(); else closePanel();
    }

    button.addEventListener('click', togglePanel);

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (panel.hidden) return;
      if (!root.contains(e.target)) closePanel();
    });
    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) {
        closePanel();
        button.focus();
      }
    });

    function persist(key, on) {
      try {
        if (on) localStorage.setItem(key, '1');
        else localStorage.removeItem(key);
      } catch (e) {}
    }

    textToggle.addEventListener('change', function () {
      document.documentElement.classList.toggle('a11y-large-text', textToggle.checked);
      persist('upkeep-a11y-large-text', textToggle.checked);
    });
    motionToggle.addEventListener('change', function () {
      document.documentElement.classList.toggle('a11y-reduce-motion', motionToggle.checked);
      persist('upkeep-a11y-reduce-motion', motionToggle.checked);
    });
    resetBtn.addEventListener('click', function () {
      document.documentElement.classList.remove('a11y-large-text');
      document.documentElement.classList.remove('a11y-reduce-motion');
      textToggle.checked = false;
      motionToggle.checked = false;
      persist('upkeep-a11y-large-text', false);
      persist('upkeep-a11y-reduce-motion', false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
