const burger = document.getElementById('burgerMenu');
const sidebar = document.querySelector('.sidebar');
const overlay = document.getElementById('sidebarOverlay');
const navLinks = document.querySelectorAll('.sidebar .nav a');
const sections = document.querySelectorAll('section[id]');

/* ===== BURGER MENU + OVERLAY TOGGLE ===== */
burger.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
});

/* ===== SAFE RESIZE HANDLER ===== */
/* Close sidebar on desktop when resizing */
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  }
});

/* ===== ACTIVE LINK DETECTION ===== */
function setActiveLink() {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    /* Detect if in viewport (with offset) */
    if (window.scrollY >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute('id');
    }
  });

  /* Update active states */
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

/* ===== AUTO-CLOSE MENU ON LINK CLICK ===== */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    }
  });
});

/* ===== SCROLL & LOAD EVENTS ===== */
window.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);

/* ===== LOAD EVENTS ===== */
async function loadEvents() {
  const container = document.getElementById('eventsContainer');
  if (!container) return;

  const files = ['greenhills-opening.json', 'holiday-launch.json'];
  let found = false;

  for (const f of files) {
    try {
      const res = await fetch(`content/events/${f}`);
      if (!res.ok) continue;

      const e = await res.json();

      const card = document.createElement('article');
      card.className = 'event-card animate-on-scroll';
      card.innerHTML = `
        ${e.image ? `<img src="${e.image}" alt="${e.title}" class="event-image">` : ''}
        <div class="event-content">
          <h3>${e.title}</h3>
          <p class="date">${e.date}</p>
          <p>${e.description}</p>
          <button onclick="alert('Learn more about: ${e.title}')">
            Learn More
          </button>
        </div>
      `;

      container.appendChild(card);
      found = true;
    } catch (err) {
      console.warn("Event load failed:", f);
    }
  }

  if (!found) {
    container.innerHTML = `
      <p style="text-align:center;color:#999;">
        No upcoming events.
      </p>
    `;
  }

  // 🔥 Re-trigger scroll animations after injecting
  initScrollAnimations();
}


/* ===== ANIMATE ON SCROLL (IntersectionObserver) ===== */
function initScrollAnimations() {
  const opts = { threshold: 0.12, rootMargin: '0px 0px -50px 0px' };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Once animated, unobserve to avoid repeated work
        io.unobserve(entry.target);
      }
    });
  }, opts);

  document.querySelectorAll('.animate-on-scroll').forEach(el => io.observe(el));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}

/* ===== MENU IMAGE ENLARGE (CLICK) ===== */
function initMenuImageModal() {
  // create modal element once
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.innerHTML = '<img class="modal-image" alt="Enlarged menu image">';
  document.body.appendChild(modal);

  const modalImg = modal.querySelector('.modal-image');

  function openModal(src, alt) {
    modalImg.classList.add('loading');
    modalImg.src = src;
    modalImg.alt = alt || 'Menu image';
    modal.classList.add('open');
    // prevent background scroll while modal open
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modalImg.src = '';
    modalImg.alt = '';
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  // remove loading state once image has loaded
  modalImg.addEventListener('load', () => modalImg.classList.remove('loading'));

  // close when clicking overlay (but not when clicking the image)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // toggle browser fullscreen on image click (makes the image truly full)
  modalImg.addEventListener('click', async (e) => {
    // don't propagate to modal overlay
    e.stopPropagation();
    try {
      if (!document.fullscreenElement) {
        if (modalImg.requestFullscreen) await modalImg.requestFullscreen();
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
      }
    } catch (err) {
      // ignore fullscreen errors
    }
  });

  // close on ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // attach click handlers to current and future menu images
  const menuGrid = document.querySelector('.menu-grid');
  if (!menuGrid) return;

  menuGrid.addEventListener('click', (e) => {
    // prefer the explicit img if clicked
    const clickedImg = e.target.closest('.menu-image');
    if (clickedImg) {
      openModal(clickedImg.src, clickedImg.alt);
      return;
    }

    // if user clicked the card, map to the corresponding menuX.jpg
    const item = e.target.closest('.menu-item');
    if (!item) return;

    const items = Array.from(menuGrid.querySelectorAll('.menu-item'));
    const index = items.indexOf(item);
    let src = null;
    // try to find existing image inside the item first
    const innerImg = item.querySelector('.menu-image');
    if (innerImg && innerImg.src) {
      src = innerImg.src;
    }

    // fallback to explicit filenames if no src found
    if (!src && index >= 0) {
      src = `assets/images/menu/menu${index + 1}.jpg`;
    }

    if (src) openModal(src, innerImg ? innerImg.alt : `menu${index + 1}.jpg`);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMenuImageModal);
} else {
  initMenuImageModal();
}
