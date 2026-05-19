/* FactoryLogic PLC — progressive enhancement.
 * Base content works fully without this script. */
(function () {
  'use strict';

  var html = document.documentElement;
  html.classList.add('js');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Scroll reveal -----------------------------------------------------
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length && 'IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-revealed'); });
  }

  // ---- Header scroll state ----------------------------------------------
  var header = document.querySelector('.site-header');
  if (header) {
    var update = function () {
      if (window.scrollY > 4) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  // ---- Copy to clipboard ------------------------------------------------
  var toast = null;
  function showToast(message) {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'fl-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  document.addEventListener('click', function (event) {
    var btn = event.target.closest('.copy-button');
    if (!btn) return;
    var text = btn.getAttribute('data-copy');
    if (!text) return;
    event.preventDefault();
    copyText(text).then(
      function () {
        btn.classList.add('is-copied');
        showToast('Copied ' + text + ' to clipboard');
        clearTimeout(btn._t);
        btn._t = setTimeout(function () { btn.classList.remove('is-copied'); }, 1800);
      },
      function () {
        showToast('Could not copy automatically — long-press to copy: ' + text);
      }
    );
  });

  // Hint when an email link is tapped (helps users without a mail client).
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a.is-email');
    if (!link) return;
    var email = link.getAttribute('data-copy');
    setTimeout(function () {
      if (document.hasFocus()) {
        showToast(
          email
            ? 'Opening your email app — no app? Email: ' + email
            : 'Opening your email app…'
        );
      }
    }, 350);
  });
})();
