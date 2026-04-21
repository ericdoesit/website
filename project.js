const titleHTML = p.title.replace('\n', '<br>');
document.getElementById('project-category').textContent = p.categoryLabel || p.tags.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' / ');
document.getElementById('project-title').innerHTML = titleHTML;
document.getElementById('project-deliverable').textContent = p.deliverable || '';
document.getElementById('project-challenge').textContent = p.challenge || '';
document.getElementById('project-solution').textContent = p.solution || '';
document.getElementById('project-logic').textContent = p.logic || '';
if (p.imageNote) {
  const noteEl = document.createElement('p');
  noteEl.className = 'image-note fade-in';
  noteEl.innerHTML = p.imageNote;
  document.getElementById('image-grid').insertAdjacentElement('afterend', noteEl);
}

if (p.motionSection) {
  document.getElementById('motion-label').textContent = 'Motion';
  document.getElementById('motion-intro').style.display = 'none';
  document.getElementById('motion-concepts').innerHTML = (p.motionSection.concepts || [])
    .map(c => `<div><p class="motion-concept__title">${c.title}</p><p class="motion-concept__body">${c.body}</p></div>`)
    .join('');
} else {
  if (!p.videos || !p.videos.length) {
    document.querySelector('.movie-section').style.display = 'none';
  } else {
    if (p.categoryLabel === 'Motion') {
      document.querySelector('.movie-section .section-header').style.display = 'none';
    }
    document.getElementById('motion-intro').style.display = 'none';
    document.getElementById('motion-concepts').style.display = 'none';
  }
}

if (p.images && p.images.length) {
  const grid = document.getElementById('image-grid');
  const cols = p.imageColumns || 2;
  grid.classList.add(`image-grid-${cols}`);
  if (p.imageMaxHeight) {
    grid.style.setProperty('--image-max-height', `${p.imageMaxHeight}px`);
    grid.style.setProperty('--image-columns', cols);
    grid.classList.add('image-grid--capped');
  }
  grid.innerHTML = p.images
    .map(src => `<img class="image-thumb" src="${src}" loading="eager" alt="">`)
    .join('');
} else {
  document.getElementById('image-grid').style.display = 'none';
}

if (p.videos && p.videos.length) {
  const media = document.getElementById('movie-media');
  if (p.videoMaxHeight) {
    const [rw, rh] = (p.videos[0].ratio || '16/9').split('/').map(Number);
    const maxW = Math.round(p.videoMaxHeight * rw / rh);
    media.style.gridTemplateColumns = '1fr';
    media.style.maxWidth = `${maxW}px`;
    media.style.margin = '0 auto';
  }
  media.innerHTML = p.videos
    .map(v => {
      const [rw, rh] = (v.ratio || '16/9').split('/').map(Number);
      const span = rw > rh ? 'grid-column:1/-1;' : '';
      const src = v.platform === 'youtube' ? `https://www.youtube.com/embed/${v.id}` : `https://player.vimeo.com/video/${v.id}?title=0&byline=0&portrait=0`;
      const allow = v.platform === 'youtube' ? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' : 'autoplay; fullscreen; picture-in-picture';
      const ref = v.platform === 'youtube' ? ' referrerpolicy="strict-origin-when-cross-origin"' : '';
      return `<div class="video-embed" style="${span}aspect-ratio:${v.ratio || '16/9'}"><iframe src="${src}" allow="${allow}"${ref} allowfullscreen></iframe></div>`;
    })
    .join('');
}

function renderBlock(block) {
  switch (block.type) {
    case 'video':
      return `<div class="section-block-video fade-in"><div class="video-embed" style="aspect-ratio:${block.ratio||'16/9'}"><iframe src="https://player.vimeo.com/video/${block.id}?title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div></div>`;
    case 'videos': {
      const cols = block.columns || 2;
      const embeds = block.items.map(v =>
        `<div class="video-embed" style="aspect-ratio:${v.ratio||'1/1'}"><iframe src="https://player.vimeo.com/video/${v.id}?title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`
      ).join('');
      return `<div class="fade-in" style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:10px;padding:10px 20px">${embeds}</div>`;
    }
    case 'credits':
      return `<div class="credits-block fade-in"><p class="credits-label">Credits</p>${block.lines.map(l=>`<p>${l}</p>`).join('')}</div>`;
    case 'text':
      return `<p class="section-text fade-in">${block.body}</p>`;
    case 'images': {
      const cols = block.columns || 2;
      return `<div class="image-grid image-grid-${cols} fade-in">${block.items.map(src=>`<img class="image-thumb" src="${src}" loading="lazy" alt="">`).join('')}</div>`;
    }
    case 'quote':
      return `<div class="quote-block fade-in"><p>${block.text}</p></div>`;
    case 'caption':
      return `<p class="section-caption fade-in">${block.body}</p>`;
  }
  return '';
}

function renderSection(sec, i) {
  const header = !sec.label ? '' : `<div class="section-header fade-in"><span class="section-header__label">${sec.label}</span><div class="section-header__line"></div></div>`;
  return header + sec.blocks.map(renderBlock).join('');
}

const keys = Object.keys(window.PROJECTS);
const navIdx = keys.indexOf(id);
const prevId = navIdx > 0 ? keys[navIdx - 1] : null;
const nextId = navIdx < keys.length - 1 ? keys[navIdx + 1] : null;

const prevBtn = document.getElementById('nav-prev');
const nextBtn = document.getElementById('nav-next');

if (prevId) prevBtn.href = `project.html?id=${prevId}`;
else prevBtn.style.display = 'none';

if (nextId) nextBtn.href = `project.html?id=${nextId}`;
else nextBtn.style.display = 'none';

if (window.matchMedia('(min-width: 769px)').matches) {
  const navBtns = [prevBtn, nextBtn].filter(b => b.style.display !== 'none');
  const hoverTransition = 'background 0.3s cubic-bezier(.12,.23,.5,1), color 0.3s cubic-bezier(.12,.23,.5,1)';
  const returnTransition = `transform 1.25s cubic-bezier(0,0,0.15,1), ${hoverTransition}`;
  let offset = 0;
  let lastScrollY = window.scrollY;
  let returnTimer = null;

  window.addEventListener('scroll', () => {
    const delta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    offset = Math.max(-800, Math.min(800, offset - delta * 0.22));

    navBtns.forEach(b => {
      b.style.transition = hoverTransition;
      b.style.transform = `translateY(calc(-50% + ${offset}px))`;
    });

    clearTimeout(returnTimer);
    returnTimer = setTimeout(() => {
      offset = 0;
      navBtns.forEach(b => {
        b.style.transition = returnTransition;
        b.style.transform = 'translateY(-50%)';
      });
    }, 80);
  });
}

if (p.credits && p.credits.length) {
  const lines = p.credits.map(c =>
    `<p>${c.role} — ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener">${c.name}</a>` : c.name}</p>`
  ).join('');
  document.querySelector('.page-footer').insertAdjacentHTML('beforebegin',
    `<div class="credits-block fade-in"><p class="credits-label">Credits</p>${lines}</div>`
  );
}

if (p.sections) {
  document.getElementById('image-grid').style.display = 'none';
  const existingNote = document.querySelector('.image-note');
  if (existingNote) existingNote.style.display = 'none';
  document.querySelector('.movie-section').style.display = 'none';
  document.querySelector('.page-footer').insertAdjacentHTML('beforebegin', p.sections.map((sec, i) => renderSection(sec, i)).join(''));
}
