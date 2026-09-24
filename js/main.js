/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'pancaffe-da-ale',    // usato per localStorage lang
    whatsapp: {
      number: '',                     // '39xxxxxxxxxx' — vuoto = niente wiring
      message: 'Ciao! Vorrei informazioni.',
      ids: ['ctaPrenota', 'heroWhatsapp', 'doveWhatsapp', 'barWhatsapp'],
    },
    /* orari: per giorno (0=domenica) un array di finestre [inizio, fine]
       in minuti-stringa 'HH:MM'. Fine oltre '24:00' = scavalca mezzanotte
       (es. ['18:00','24:30'] = apre alle 18, chiude alle 00:30 del giorno
       dopo). Giorno chiuso = []. */
    /* Scheda Google, tabella aperta a schermo il 24/9/2026: lun–sab 06–20 continuato, domenica chiuso.
       (La bio Instagram dice 06:30–20:00: da confermare.) */
    hours: {
      0: [],
      1: [['06:00', '20:00']],
      2: [['06:00', '20:00']],
      3: [['06:00', '20:00']],
      4: [['06:00', '20:00']],
      5: [['06:00', '20:00']],
      6: [['06:00', '20:00']],
    },
    hoursStatusId: 'orarioStato',     // elemento testo stato
    hoursTableSelector: '[data-day]', // righe/li con data-day da evidenziare
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 2600,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 960,
    /* dizionario EN: SOLO overlay — l'HTML è la versione italiana.
       Forma storica a due lingue, resta valida e invariata. */
    EN: {
      "intro.k": "viale Fulvio Testi 86 · Milan",
      "intro.f": "noun, masculine",
      "intro.skip": "skip",
      "nav.home": "Pancaffè da Ale, back to top",
      "nav.apri": "Open the menu",
      "marchio.s": "bakery · pastry · café · viale Fulvio Testi 86",
      "nav.etimologia": "Etymology",
      "nav.significati": "Meanings",
      "nav.esempi": "Examples",
      "nav.sinonimi": "Synonyms",
      "nav.dove": "Where to find it",
      "nav.domande": "Questions",
      "cta.chiama": "Call",
      "cta.chiama2": "Call +39 02 9144 8100",
      "h.k": "Bakery · pastry shop · café · viale Fulvio Testi 86, Milan Bicocca",
      "h.gram": "n., m.",
      "h.etim": "[from pane, bread, and caffè, coffee]",
      "h.d1": "Bakery, pastry shop and café in a single word, with hot dishes at lunchtime.",
      "h.d2": "On viale Fulvio Testi 86, from six in the morning to eight in the evening, Monday to Saturday.",
      "h.d3": "A women-owned business.",
      "h.cta1": "Call +39 02 9144 8100",
      "h.cta2": "The six meanings",
      "h.badge": "4.4 on Google with 112 reviews · «focaccia» and «pizza» are the words customers write most often",
      "h.alt": "The shopfront on viale Fulvio Testi: the white sign Pancaffè da Ale, bakery pastry café, and the windows",
      "h.fig": "fig. 1",
      "h.cap": "the sign, at viale Fulvio Testi 86 (their photo)",
      "e.k": "· etymology",
      "e.h": "From bread and coffee.",
      "e.p1": "<b>Bread</b>, because from six in the morning the oven is on: bread, focaccia, pizza by the slice already in the window at half past eight.",
      "e.p2": "<b>Coffee</b>, because you have breakfast at the counter with brioches and pastries, and in the late afternoon you come back for an aperitivo with the little focaccias.",
      "e.p3": "Put together they make a word that is not in the dictionary, but is on viale Fulvio Testi.",
      "e.alt": "The glass counter with pizza by the slice, focaccia and pastries",
      "e.fig": "fig. 2",
      "e.cap": "the counter, in the morning (their photo)",
      "s.k": "· meanings",
      "s.h": "Six things it means.",
      "s.p": "In the order they happen, from six in the morning onwards.",
      "s1.t": "breakfast",
      "s1.d": "From six in the morning, at the counter: coffee, cappuccino, brioches and pastries. The white-chocolate mousse pastry has a review all of its own.",
      "s2.t": "bread and focaccia",
      "s2.d": "Well-risen, well-baked bread, grissini, the cheese focaccia and the onion one. «The best onion focaccia in Milan! Word of a Genoese!», Guido wrote seven months ago.",
      "s2.a": "The focaccia with onions, olives and anchovies on a board",
      "s2.fig": "fig. 3",
      "s2.cap": "the onion focaccia (their photo)",
      "s3.t": "pizza by the slice",
      "s3.d": "Baked from the morning: at half past eight it is already in the window. With ham, brie and rocket; with ham and olives; with vegetables.",
      "s3.a1": "Pizza by the slice with cooked ham, brie and rocket",
      "s3.fig1": "fig. 4",
      "s3.cap1": "ham, brie and rocket",
      "s3.a2": "Pizza with cooked ham and olives",
      "s3.fig2": "fig. 5",
      "s3.cap2": "ham and olives",
      "s4.t": "lunch",
      "s4.d": "Slices, focaccia, sandwiches with ham or with a cutlet, and the hot dishes: it says so on the awning. To take away, or at the tables, inside and out.",
      "s5.t": "cakes and pastry",
      "s5.d": "Fruit tarts, red-berry cakes, birthday and party cakes with the writing on top, the Easter egg. Made to order, ask at the counter.",
      "s5.a1": "Fruit tart with blueberries, raspberries, blackberries and strawberries",
      "s5.fig1": "fig. 6",
      "s5.cap1": "fruit tart",
      "s5.a2": "Raspberry cake with wafer rolls around it",
      "s5.fig2": "fig. 7",
      "s5.cap2": "raspberry cake",
      "s5.a3": "Cake with the words Buona Pasqua and red berries",
      "s5.fig3": "fig. 8",
      "s5.cap3": "with the writing",
      "s5.a4": "The chocolate Easter egg with the words Buona Pasqua da Pancaffè da Ale",
      "s5.fig4": "fig. 9",
      "s5.cap4": "the Easter egg",
      "s6.t": "aperitivo",
      "s6.d": "In the late afternoon, a spritz with the little focaccias: with olives, margherita, plain. Made by us, like everything else.",
      "x.k": "· examples of use",
      "x.h": "How customers use it.",
      "x.p": "Five Google reviews, as they were written. On Google we are at 4.4 with 112 reviews.",
      "x1.c": "Simona S. · 7 months ago · 5 stars",
      "x2.c": "Bob M. · 9 months ago · 5 stars",
      "x3.c": "Guido R. · 7 months ago · 5 stars",
      "x4.c": "Roberta D. V. · 4 years ago · 5 stars",
      "x5.c": "Maddalena F. P. · 2 years ago · 5 stars",
      "y.k": "· synonyms",
      "y.h": "Bakery, pastry shop, café, hot dishes.",
      "y.p": "The three words on the sign and the fourth on the awning. None of them says it all on its own: that is why the word is one.",
      "y.n": "<b>Usage note.</b> A women-owned business; at the counter, as customers write, «the girls».",
      "y.alt": "The shopfront with the green awning Tavola calda and the sign Pancaffè da Ale",
      "y.fig": "fig. 10",
      "y.cap": "the awning and the sign (their photo)",
      "d.k": "· where to find it",
      "d.h": "At viale Fulvio Testi 86, from six to eight.",
      "d.p": "Monday to Saturday, all day. Closed on Sunday. For holidays check Instagram, or call.",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "d.tel": "Call",
      "d.strada": "Get directions",
      "d.mappa": "Map: Pancaffè da Ale, Viale Fulvio Testi 86, Milan",
      "do.h": "The questions we get asked.",
      "qa.1": "What time do you open?",
      "ra.1": "At six in the morning, Monday to Saturday, and we close at eight in the evening with no break. Closed on Sunday.",
      "qa.2": "Is the pizza already there in the morning?",
      "ra.2": "Yes: it is baked from the morning and at half past eight it is in the window, by the slice, together with the focaccias.",
      "qa.3": "Do you make cakes to order?",
      "ra.3": "Yes, for birthdays and parties, with the writing too. Order at the counter or by phone a few days ahead.",
      "qa.4": "Can I have lunch?",
      "ra.4": "Yes: slices of pizza, focaccia, sandwiches and the hot dishes, to take away or at the tables, inside and out.",
      "qa.5": "Are you on Too Good To Go?",
      "ra.5": "Yes, at the end of the day, when something is left. If nothing is left we take the box down: it is worth coming earlier, to the counter.",
      "qa.6": "Are you on Instagram?",
      "ra.6": "Yes, @pancaffedaale: the photos of the day and the notices for the holidays.",
      "piede.s": "bakery · pastry · café · hot dishes · 6 to 20, Mon–Sat",
      "piede.b": "Demo site by <a href=\"https://bespokestud.io\" target=\"_blank\" rel=\"noopener\">Bespoke Studio</a> · texts, hours and services from the business's Google listing and Instagram and from the public Google reviews (September 2026); photographs published by the business on the Google listing.",
      "b.chiama": "Call",
      "b.significati": "Meanings",
      "b.orari": "Hours",
      "b.mappa": "Map",
      "lb.chiudi": "Close",
    },
    /* MULTILINGUA (V4) — per i siti con più di due lingue, al posto di EN:
         LANGS: { en: {chiave:'...'}, ar: {chiave:'...'} }
       L'italiano resta SEMPRE la lingua del DOM e non ha dizionario.
       Se si valorizza EN e non LANGS, il comportamento è identico a prima. */
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],   // lingue che ribaltano dir=rtl
    /* etichette dello stato orari per lingua non-IT; l'IT è nel codice.
       Chiave mancante = fallback all'inglese, poi all'italiano. */
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */
  /* ═══ FIRMA · Pancaffè da Ale — «pancaffè, sostantivo.»: le due parole che si uniscono ═══
     1) [data-lemma]: «pan» + «e » + «caffè». Senza JS è già «pancaffè» (CSS: la «e» a max-width 0, opacity 0).
        Con GSAP: all'avvio i due pezzi sono separati (x ±, la «e» visibile e larga: data-stato=separata),
        poi scivolano l'uno verso l'altro e la «e» sparisce (data-stato=unita). L'intro parte subito, l'hero dopo l'intro.
     2) [data-sillabe]: «pan·caf·fè» — i punti separatori partono invisibili (data-stato=muta) e appaiono uno alla volta
        quando la sezione entra (data-stato=sillabata). Reduced-motion = tutto già unito e sillabato. */
  var lemmiVivi = hasGsap && hasST && !reducedMotion;
  var unisci = function (lemma, subito) {
    var a = lemma.querySelector('.lemma__a'), e = lemma.querySelector('.lemma__e'), b = lemma.querySelector('.lemma__b');
    if (!a || !e || !b) { lemma.setAttribute('data-stato', 'unita'); return; }
    if (subito || !hasGsap) { if (hasGsap) { gsap.set([a, b], { x: 0 }); gsap.set(e, { maxWidth: 0, opacity: 0 }); } lemma.setAttribute('data-stato', 'unita'); return; }
    var tl = gsap.timeline({ onComplete: function () { lemma.setAttribute('data-stato', 'unita'); } });
    tl.to(e, { maxWidth: 0, opacity: 0, duration: .9, ease: 'power3.inOut' }, 0.35)
      .to([a, b], { x: 0, duration: .9, ease: 'power3.inOut' }, 0.35);
  };
  var separa = function (lemma) {
    var a = lemma.querySelector('.lemma__a'), e = lemma.querySelector('.lemma__e'), b = lemma.querySelector('.lemma__b');
    if (!a || !e || !b) return;
    gsap.set(e, { maxWidth: '1.2em', opacity: 1 });
    gsap.set(a, { x: -14 }); gsap.set(b, { x: 14 });
    lemma.setAttribute('data-stato', 'separata');
  };
  var lemmi = Array.prototype.slice.call(document.querySelectorAll('[data-lemma]'));
  var sillabe = Array.prototype.slice.call(document.querySelectorAll('[data-sillabe]'));
  if (lemmiVivi) {
    lemmi.forEach(separa);
    var introL = document.getElementById('introLemma');
    if (introL) { unisci(introL); setTimeout(function () { var f = document.getElementById('introFine'); if (f) f.classList.add('is-on'); }, 1400); }
    sillabe.forEach(function (sf) {
      var punti = sf.querySelectorAll('i'); if (!punti.length) return;
      gsap.set(punti, { opacity: 0, y: 4 });
      sf.setAttribute('data-stato', 'muta');
      ScrollTrigger.create({ trigger: sf, start: 'top 85%', once: true, onEnter: function () {
        gsap.to(punti, { opacity: 1, y: 0, duration: .5, stagger: .22, ease: 'power2.out', onComplete: function () { sf.setAttribute('data-stato', 'sillabata'); } });
      } });
    });
    // rete di sicurezza: dopo 6 s, ciò che è visibile e ancora muto/separato va a posto
    setTimeout(function () {
      sillabe.forEach(function (sf) { if (sf.getAttribute('data-stato') !== 'muta') return; var r = sf.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) { gsap.set(sf.querySelectorAll('i'), { opacity: 1, y: 0 }); sf.setAttribute('data-stato', 'sillabata'); } });
      lemmi.forEach(function (l) { if (l.getAttribute('data-stato') === 'separata') unisci(l, true); });
    }, 6000);
  } else {
    var f0 = document.getElementById('introFine'); if (f0) f0.classList.add('is-on');
  }

  window.bespokeHeroEntrance = function () {
    var hero = document.getElementById('lemmaHero');
    if (hero) { if (lemmiVivi) { unisci(hero); } else { unisci(hero, true); } }
    if (!hasGsap || reducedMotion) return;
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(['.apertura__k', '.apertura__gram', '.apertura__def', '.apertura__stato', '.apertura__azioni', '.apertura__badge'], { opacity: 0, y: 16, duration: .6, stagger: .08 }, 0.5)
      .from('.apertura__foto', { opacity: 0, y: 24, duration: .8 }, '-=.5');
  };

})();
