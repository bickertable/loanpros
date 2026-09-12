// XLP Processing Site — page script
// Contains: processing carousel behavior (peeking scroll-snap cards), footer year.

(function () {
  var viewport = document.getElementById('procViewport');
  var dotsWrap = document.getElementById('procDots');
  var prevBtn = document.getElementById('procPrev');
  var nextBtn = document.getElementById('procNext');
  if (!viewport) return;

  var slides = Array.prototype.slice.call(viewport.children);
  var count = slides.length;
  var index = 0;
  var AUTOPLAY_MS = 6000;
  var timer = null;

  for (var i = 0; i < count; i++) {
    var dot = document.createElement('button');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    (function (idx) {
      dot.addEventListener('click', function () { goTo(idx); restart(); });
    })(i);
    dotsWrap.appendChild(dot);
  }

  function render() {
    slides[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    var dots = dotsWrap.children;
    for (var i = 0; i < dots.length; i++) {
      dots[i].setAttribute('aria-selected', i === index ? 'true' : 'false');
    }
  }

  function goTo(i) {
    index = (i + count) % count;
    render();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function start() { timer = setInterval(next, AUTOPLAY_MS); }
  function stop() { clearInterval(timer); }
  function restart() { stop(); start(); }

  nextBtn.addEventListener('click', function () { next(); restart(); });
  prevBtn.addEventListener('click', function () { prev(); restart(); });

  viewport.addEventListener('mouseenter', stop);
  viewport.addEventListener('mouseleave', start);
  viewport.addEventListener('focusin', stop);
  viewport.addEventListener('focusout', start);

  var touchStartX = null;
  viewport.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    stop();
  }, { passive: true });
  viewport.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    touchStartX = null;
    start();
  }, { passive: true });

  render();
  start();
})();

// footer year
(function () {
  var el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();
