/* Bhooma Reddy Convention — interactions */
(function () {
  'use strict';

  /* ---------- year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav scroll state ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- hamburger / mobile menu ---------- */
  var ham = document.getElementById('hamburger');
  var menu = document.getElementById('menu');
  var closeMenu = function () {
    ham.classList.remove('open');
    menu.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
  };
  ham.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    ham.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* ---------- hero slideshow ---------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll('.hslide'));
  var dotsWrap = document.getElementById('heroDots');
  var current = 0, timer = null;

  slides.forEach(function (_, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Show image ' + (i + 1));
    b.addEventListener('click', function () { goTo(i); restart(); });
    dotsWrap.appendChild(b);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function goTo(i) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('on');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('on');
  }
  function restart() {
    if (timer) clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, 4200);
  }
  if (slides.length) {
    dots[0].classList.add('on');
    restart();
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('on');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('on'); });
  }

  /* ---------- number counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var animateCount = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var isYear = target >= 1900 && target <= 2100; /* years must not group as 2,016 */
    var dur = 1400, start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = isYear ? String(val) : val.toLocaleString('en-IN');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-count'); });
  }

  /* ---------- toast ---------- */
  var toast = document.getElementById('toast');
  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 4200);
  }

  /* ---------- enquiry form (demo) ---------- */
  var form = document.getElementById('enquiryForm');
  var note = document.getElementById('formNote');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    ['name', 'phone', 'occasion'].forEach(function (id) {
      var f = document.getElementById(id);
      var valid = f.value.trim() !== '';
      if (id === 'phone') valid = /^[+\d][\d\s-]{8,14}$/.test(f.value.trim());
      f.classList.toggle('err', !valid);
      if (!valid) ok = false;
    });
    if (!ok) {
      note.textContent = 'Please add your name, a valid phone number and event type.';
      note.classList.add('bad');
      return;
    }
    note.classList.remove('bad');
    note.textContent = 'Thank you! Our team will call you back shortly.';
    showToast('Enquiry received — we will call you back soon ✓');
    form.reset();
  });
  form.querySelectorAll('input, select').forEach(function (f) {
    f.addEventListener('input', function () { f.classList.remove('err'); });
  });

  /* ---------- minimum date = today ---------- */
  var dateEl = document.getElementById('date');
  if (dateEl) dateEl.min = new Date().toISOString().split('T')[0];
})();
