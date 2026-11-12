/* HIT ME pitch page. Scroll reveals, sticky nav state, five-day board tabs, budget bar, light parallax.
   Everything renders in its final state without this file; it only adds motion and the tab behaviour. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var supportsIO = 'IntersectionObserver' in window;

  /* ---------- Reveals: sections, cold-open beats, budget bar ---------- */
  var revealTargets = [].slice.call(document.querySelectorAll('.reveal, [data-beat], [data-budget-bar]'));

  function showAll() {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  if (!supportsIO || reduceMotion.matches) {
    showAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Sticky nav: mark the active section ---------- */
  var navLinks = {};
  [].slice.call(document.querySelectorAll('[data-nav-link]')).forEach(function (a) {
    navLinks[a.getAttribute('data-nav-link')] = a;
  });
  var navSections = [].slice.call(document.querySelectorAll('[data-nav]'));

  function setActive(key) {
    Object.keys(navLinks).forEach(function (k) {
      var on = k === key;
      navLinks[k].classList.toggle('is-active', on);
      if (on) { navLinks[k].setAttribute('aria-current', 'location'); }
      else { navLinks[k].removeAttribute('aria-current'); }
    });
  }

  if (supportsIO && navSections.length) {
    var visible = new Map();
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { visible.set(entry.target, entry.intersectionRatio); }
        else { visible.delete(entry.target); }
      });
      if (!visible.size) { setActive(null); return; }
      // Of the sections on screen, pick the one closest to the top of the viewport.
      var best = null, bestTop = Infinity;
      visible.forEach(function (_ratio, el) {
        var top = Math.abs(el.getBoundingClientRect().top);
        if (top < bestTop) { bestTop = top; best = el; }
      });
      setActive(best ? best.getAttribute('data-nav') : null);
    }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.01] });
    navSections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Five-day board: accessible tabs with arrow keys ---------- */
  var board = document.querySelector('[data-board]');
  if (board) {
    var tabs = [].slice.call(board.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

    function selectTab(index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.setAttribute('tabindex', on ? '0' : '-1');
        if (panels[i]) { panels[i].hidden = !on; }
      });
      if (focus) { tabs[index].focus(); }
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectTab(i, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        switch (e.key) {
          case 'ArrowRight': case 'ArrowDown': next = (i + 1) % tabs.length; break;
          case 'ArrowLeft': case 'ArrowUp': next = (i - 1 + tabs.length) % tabs.length; break;
          case 'Home': next = 0; break;
          case 'End': next = tabs.length - 1; break;
          default: return;
        }
        e.preventDefault();
        selectTab(next, true);
      });
    });
  }

  /* ---------- Light parallax on the cold-open and hero images ---------- */
  var parallaxImgs = [].slice.call(document.querySelectorAll('img[data-parallax]'));
  if (parallaxImgs.length && !reduceMotion.matches && supportsIO) {
    var onScreen = new Set();
    var ticking = false;

    function update() {
      ticking = false;
      var vh = window.innerHeight;
      onScreen.forEach(function (img) {
        var rect = img.parentNode.getBoundingClientRect();
        // -1 (just left the top) .. 0 (centered) .. 1 (just entering from the bottom)
        var progress = (rect.top + rect.height / 2 - vh / 2) / (vh + rect.height);
        // Image is 120% tall and offset -10%, so +-10% of travel keeps it covered.
        var shift = Math.max(-1, Math.min(1, progress)) * -0.08 * rect.height;
        img.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0)';
      });
    }
    function requestUpdate() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }

    var parallaxObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { onScreen.add(entry.target); }
        else { onScreen.delete(entry.target); }
      });
      requestUpdate();
    }, { rootMargin: '10% 0px' });
    parallaxImgs.forEach(function (img) { parallaxObserver.observe(img); });

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    requestUpdate();

    reduceMotion.addEventListener && reduceMotion.addEventListener('change', function (e) {
      if (e.matches) {
        parallaxImgs.forEach(function (img) { img.style.transform = ''; });
        onScreen.clear();
        showAll();
      }
    });
  }
})();
