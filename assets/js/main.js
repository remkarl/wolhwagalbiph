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

  const files = ['birthday-treat.json', 'holiday-launch.json'];
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

/* ===== MENU IMAGE ENLARGE (CLICK) ===== */
function initMenuImageModal() {

  const menuImages = document.querySelectorAll('.menu-image');
  if (!menuImages.length) return;

  // Create modal once
  const modal = document.createElement('div');
  modal.className = 'image-modal';

  modal.innerHTML = `
    <button class="modal-close">&times;</button>
    <img class="modal-image" alt="Enlarged menu image">
  `;

  document.body.appendChild(modal);

  const modalImg = modal.querySelector('.modal-image');
  const closeBtn = modal.querySelector('.modal-close');

  function openModal(src, alt) {
    modalImg.src = src;
    modalImg.alt = alt || '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modalImg.src = '';
    document.body.style.overflow = '';
  }

  // Attach click to each image
  menuImages.forEach(img => {
    img.addEventListener('click', () => {
      openModal(img.src, img.alt);
    });
  });

  // Close button
  closeBtn.addEventListener('click', closeModal);

  // Click outside image
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initMenuImageModal();
    loadEvents();
});
