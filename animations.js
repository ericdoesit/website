(function () {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting);
    visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    visible.forEach((entry, i) => {
      setTimeout(() => entry.target.classList.add('animate-in'), i * 100);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(
    '.fade-in, .feature-card, .project-item, .section-header, .page-footer'
  ).forEach(el => observer.observe(el));
})();

(function () {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  const closeBtn = document.createElement('div');
  closeBtn.className = 'lightbox-close';
  closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  const img = document.createElement('img');
  overlay.appendChild(closeBtn);
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  let currentGrid = null;
  let currentIndex = -1;

  function showImage(index) {
    if (!currentGrid) return;
    const thumbs = currentGrid.querySelectorAll('img.image-thumb');
    if (index < 0 || index >= thumbs.length) {
      overlay.classList.remove('open');
      return;
    }
    currentIndex = index;
    const thumb = thumbs[index];
    img.src = thumb.src;
    img.alt = thumb.alt;
  }

  document.addEventListener('click', e => {
    const thumb = e.target.closest('img.image-thumb');
    if (!thumb) return;
    currentGrid = thumb.closest('.image-grid') || thumb.closest('[style*="grid"]');
    const thumbs = currentGrid ? Array.from(currentGrid.querySelectorAll('img.image-thumb')) : [];
    currentIndex = thumbs.indexOf(thumb);
    img.src = thumb.src;
    img.alt = thumb.alt;
    overlay.classList.add('open');
  });

  overlay.addEventListener('click', () => overlay.classList.remove('open'));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.classList.remove('open');
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
})();

(function () {
  const words = ['effective', 'fearless', 'expressive', 'dynamic', 'vibrant', 'refined', 'innovative', 'beautiful', 'elegant', 'timeless', 'impactful', 'engaging'];
  const el = document.querySelector('.hl-c3');
  if (!el) return;

  const initial = el.querySelector('.hl-c3__slot');
  initial.style.position = 'absolute';
  initial.style.top = '0';
  initial.style.left = '0';

  let current = 0;
  let iterations = 0;
  const duration = 300;
  const hold = 3000;
  // Realistic heavy drop: Fast acceleration, sharp impact, 2 diminishing bounces.
  const easing = 'linear(0, 0.006, 0.025, 0.055, 0.098, 0.152, 0.219, 0.297, 0.387, 0.488, 0.601, 0.725, 0.861, 1, 0.91, 0.85, 0.82, 0.81, 0.82, 0.85, 0.91, 1, 0.97, 0.95, 0.95, 0.97, 1)';
  // const easing = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';


  function next() {
    if (iterations >= words.length - 1) return;
    iterations++;

    const prev = el.querySelector('.hl-c3__slot');
    const nextIndex = (current + 1) % words.length;
    current = nextIndex;

    prev.style.animation = `slotOut ${duration}ms ${easing} forwards`;

    const span = document.createElement('span');
    span.className = 'hl-c3__slot';
    span.textContent = words[current];
    span.style.position = 'absolute';
    span.style.top = '0';
    span.style.left = '0';
    span.style.animation = `slotIn ${duration}ms ${easing} forwards`;
    el.appendChild(span);

    setTimeout(() => {
      prev.remove();
      span.style.animation = '';
    }, duration);

    if (iterations < words.length - 1) {
      setTimeout(next, hold + duration);
    }
  }

  setTimeout(next, hold + duration);
})();
