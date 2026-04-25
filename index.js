// Set responsive video source for featured Noom video
function setResponsiveVideoSource() {
  const video = document.getElementById('noom-featured-video');
  if (!video) return;

  const width = window.innerWidth;
  let src;

  if (width >= 1200) {
    src = video.dataset.large;
  } else if (width >= 600) {
    src = video.dataset.medium;
  } else {
    src = video.dataset.small;
  }

  if (src && video.querySelector('source').src !== src) {
    video.querySelector('source').src = src;
    video.load();
  }
}

setResponsiveVideoSource();
window.addEventListener('resize', setResponsiveVideoSource);

const projectsContainer = document.querySelector('.projects');
let projectItems = Array.from(document.querySelectorAll('.project-item'));

// Sort by year descending (if PROJECTS data is available)
if (typeof PROJECTS !== 'undefined') {
  projectItems.sort((a, b) => {
    const getId = (href) => href.split('id=')[1];
    const yearA = PROJECTS[getId(a.href)]?.year || 0;
    const yearB = PROJECTS[getId(b.href)]?.year || 0;
    return yearB - yearA;
  });

  projectItems.forEach(item => {
    const id = item.href.split('id=')[1];

    if (!item.querySelector('.project-reveal-img')) {
      const img = document.createElement('img');
      img.src = `images/thumbs/${id}.jpg`;
      img.className = 'project-reveal-img';
      img.loading = 'lazy';
      img.alt = PROJECTS[id]?.title.replace('\n', ' ') || 'Project image';
      item.appendChild(img);
    }

    projectsContainer.appendChild(item);
  });

  // Refresh reference after DOM reordering
  projectItems = Array.from(document.querySelectorAll('.project-item'));
}

projectItems.forEach(item => {
  item.addEventListener('mouseover', () => {
    item.classList.remove('dim');
    projectItems.forEach(other => {
      if (other !== item && !other.classList.contains('filtered-out'))
        other.classList.add('dim');
    });
  });
});
document.querySelector('.projects').addEventListener('mouseleave', () => {
  projectItems.forEach(item => item.classList.remove('dim'));
});

const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.category;
    projectItems.forEach(item => {
      item.classList.remove('filtered-out');
      if (cat !== 'all' && !item.dataset.tags.split(' ').includes(cat))
        item.classList.add('filtered-out');
    });
  });
});
