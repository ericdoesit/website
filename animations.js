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
  const words = ['effective', 'meaningful', 'bold', 'cute', 'timeless', 'innovative', 'beautiful', 'classy', 'rad', 'sharp', 'clean', 'smooth'];
  const el = document.querySelector('.hl-c3');
  if (!el) return;

  let current = 0;
  const duration = 500;
  const hold = 2500;

  function next() {
    const prev = el.querySelector('.hl-c3__slot');
    const nextIndex = (current + 1) % words.length;
    current = nextIndex;

    prev.style.animation = `slotOut ${duration}ms cubic-bezier(0, 0, 0.15, 1) forwards`;

    const span = document.createElement('span');
    span.className = 'hl-c3__slot';
    span.textContent = words[current];
    span.style.position = 'absolute';
    span.style.top = '0';
    span.style.left = '0';
    span.style.animation = `slotIn ${duration}ms cubic-bezier(0, 0, 0.15, 1) forwards`;
    el.appendChild(span);

    setTimeout(() => {
      prev.remove();
      span.style.position = '';
      span.style.top = '';
      span.style.left = '';
      span.style.animation = '';
    }, duration);
  }

  setInterval(next, hold + duration);
})();
