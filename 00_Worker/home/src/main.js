(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nawigacja: tło po przewinięciu + przycisk na dole (mobile) */
  var nav = $('#nav'), stick = $('#stick'), hero = $('.hero');
  function onScroll() {
    var y = window.scrollY || 0;
    nav.classList.toggle('solid', y > 24);
    if (stick) stick.classList.toggle('show', y > (hero ? hero.offsetHeight * 0.7 : 500));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* pojawianie się sekcji */
  var rv = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (n) { io.observe(n); });
  } else { rv.forEach(function (n) { n.classList.add('in'); }); }

  /* liczniki */
  $$('[data-count]').forEach(function (el) {
    var to = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduce) return;
    el.textContent = '0' + suf;
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / 1400), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
      el.textContent = v + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    setTimeout(function () { requestAnimationFrame(step); }, 500);
  });

  /* przechył 3D makiety w hero */
  var tilt = $('#tilt');
  if (tilt && !reduce && window.matchMedia('(hover:hover)').matches) {
    var st = tilt.parentNode;
    st.addEventListener('pointermove', function (e) {
      var r = st.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = 'rotateY(' + (x * 14) + 'deg) rotateX(' + (-y * 10) + 'deg)';
    });
    st.addEventListener('pointerleave', function () { tilt.style.transform = ''; });
  } else if (tilt) { tilt.style.transform = 'rotateY(-6deg) rotateX(3deg)'; }

  /* poświata za kursorem na kartach */
  $$('[data-spot]').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* aktywna pigułka podczas przewijania */
  var pills = $$('#pills a');
  if ('IntersectionObserver' in window) {
    var po = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        pills.forEach(function (a) { a.classList.toggle('on', a.dataset.p === e.target.id); });
        var on = $('#pills a.on'); if (on && on.scrollIntoView && $('#pills').scrollWidth > $('#pills').clientWidth) on.scrollIntoView({ inline: 'center', block: 'nearest' });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    $$('.app').forEach(function (a) { po.observe(a); });
  }

  /* toast */
  var toast = $('#toast'), tt;
  function say(m) { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('show'); }, 4200); }

  /* galeria ekranów */
  $$('.viewer').forEach(function (v) {
    var slides = $$('.vslide', v), thumbs = $$('.vthumb', v);
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () {
        var i = +t.dataset.i;
        slides.forEach(function (s, k) { s.classList.toggle('on', k === i); });
        thumbs.forEach(function (x, k) { x.classList.toggle('on', k === i); });
      });
    });
  });

  var lb = $('#lb'), lbImg = $('#lbImg');
  $$('.vslide img').forEach(function (im) { im.addEventListener('click', function () { lbImg.src = im.src; if (lb.showModal) lb.showModal(); }); });
  if (lb) lb.addEventListener('click', function () { lb.close(); });


  /* animowane demo: kroki */
  (function () {
    var demos = $$('[data-demo]'); if (!demos.length) return;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    demos.forEach(function (m) {
      var caps = (m.dataset.caps || '').split('|').filter(Boolean), n = caps.length || 5, s = 0, vis = true, timer, hold = false;
      if (!caps.length) n = 5;
      var dcap = $('.dcap', m), dots = [];
      if (dcap && caps.length) {
        dcap.innerHTML = '<p></p><div class="dd"></div>';
        var dd = $('.dd', dcap);
        caps.forEach(function (c, i) { var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Krok ' + (i + 1) + ': ' + c); b.addEventListener('click', function () { go(i + 1, true); }); dd.appendChild(b); dots.push(b); });
      }
      function inl(e, k) {
        var f = e.dataset.from ? +e.dataset.from : 0, t = e.dataset.to ? +e.dataset.to : 99;
        return k >= f && k <= t;
      }
      function has(list, k) { return (',' + list + ',').indexOf(',' + k + ',') > -1; }
      function go(k, manual) {
        s = k; m.dataset.s = k;
        $$('[data-from],[data-to]', m).forEach(function (e) { e.classList.toggle('on', inl(e, k)); });
        $$('[data-at]', m).forEach(function (e) { e.classList.toggle('at', has(e.dataset.at, k)); });
        $$('[data-at2]', m).forEach(function (e) { e.classList.toggle('at2', has(e.dataset.at2, k)); });
        $$('[data-pv]', m).forEach(function (e) { var v = e.dataset.pv.split(' ')[k - 1]; e.style.setProperty('--p', v); var sp = $('span', e); if (sp) sp.textContent = v + '%'; });
        if (caps.length) { $('.dcap p', m).textContent = caps[k - 1]; dots.forEach(function (d, i) { d.classList.toggle('on', i === k - 1); }); }
        if (manual) { hold = true; clearTimeout(timer); timer = setTimeout(function () { hold = false; tick(); }, 9000); }
      }
      function active() {
        var sl = m.closest ? m.closest('.vslide') : null;
        return vis && !document.hidden && (!sl || sl.classList.contains('on'));
      }
      function tick() {
        clearTimeout(timer);
        timer = setTimeout(function () { if (!hold && active()) go(s % n + 1); tick(); }, +m.dataset.ms || 2800);
      }
      go(1);
      if (reduce) return;
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }, { threshold: .25 }).observe(m);
      tick();
    });
  })();

  /* zapis na listę chętnych */
  var dW = $('#dWant'), wF = $('#wantF');
  $$('[data-want]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.want) $('#wApp').value = b.dataset.want;
      $('#dWant h2').textContent = b.dataset.want ? 'Zapisz się na dostęp: ' + b.dataset.want : 'Zapisz się na dostęp';
      $('#wMsg').textContent = ''; $('#wMsg').className = 'msg';
      if (dW.showModal) dW.showModal();
      setTimeout(function () { $('#wName').focus(); }, 50);
    });
  });
  if (wF) wF.addEventListener('submit', function (e) {
    e.preventDefault();
    var m = $('#wMsg'), go = $('#wGo'), name = $('#wName').value.trim(), mail = $('#wMail').value.trim();
    function err(t) { m.textContent = t; m.className = 'msg err'; }
    if (name.length < 2) return err('Podaj imię.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) return err('Podaj poprawny e-mail.');
    if (!$('#wOk').checked) return err('Zaznacz zgodę, aby się zapisać.');
    go.disabled = true; m.textContent = 'Zapisuję…'; m.className = 'msg';
    fetch('/api/interest', { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: name, email: mail, app: $('#wApp').value, website: $('#wHp').value }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j }; }); })
      .then(function (x) {
        go.disabled = false;
        if (x.j && x.j.ok) { m.textContent = 'Dziękuję! Jesteś na liście. Dam znać o premierze.'; m.className = 'msg ok'; wF.reset(); setTimeout(function () { dW.close(); say('Zapisano na listę chętnych.'); }, 1800); }
        else err(x.j && x.j.code === 'bad_email' ? 'Podaj poprawny e-mail.' : 'Nie udało się zapisać. Spróbuj za chwilę lub napisz na kontakt@smialo.org.');
      }, function () { go.disabled = false; err('Brak połączenia. Spróbuj ponownie.'); });
  });

  /* dialogi: O autorze, Sugestie */
  $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { var d = document.getElementById(b.dataset.open); if (d && d.showModal) d.showModal(); }); });
  $$('dialog').forEach(function (d) {
    d.addEventListener('click', function (e) { if (e.target === d || (e.target.closest && e.target.closest('[data-close]'))) d.close(); });
  });
  var sugT = $('#sugT'), sugMail = $('#sugMail'), sugCopy = $('#sugCopy');
  if (sugT) {
    var base = sugMail.getAttribute('href').split('&body=')[0];
    sugT.addEventListener('input', function () { sugMail.setAttribute('href', base + '&body=' + encodeURIComponent(sugT.value)); });
    sugCopy.addEventListener('click', function () {
      var t = sugT.value; if (!t) { say('Najpierw wpisz sugestię.'); return; }
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { say('Skopiowano. Wklej w wiadomości na kontakt@smialo.org.'); }, function () { sugT.select(); say('Zaznaczono tekst — skopiuj ręcznie (Ctrl+C).'); });
    });
  }
})();
