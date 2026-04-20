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

  document.addEventListener('click', e => {
    const thumb = e.target.closest('img.image-thumb');
    if (!thumb) return;
    img.src = thumb.src;
    img.alt = thumb.alt;
    overlay.classList.add('open');
  });

  overlay.addEventListener('click', () => overlay.classList.remove('open'));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.classList.remove('open');
  });
})();
