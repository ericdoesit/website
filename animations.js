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

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('video[autoplay]').forEach(video => {
    video.play().catch(() => {
      video.addEventListener('canplay', () => video.play().catch(() => {}), { once: true });
    });
  });
});

