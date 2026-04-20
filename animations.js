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
