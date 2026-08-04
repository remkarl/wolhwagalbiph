document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burgerMenu');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const navLinks = document.querySelectorAll('.sidebar .nav a');
  const sections = document.querySelectorAll('section[id]');

  loadEvents();
  initMenuImageModal();
  initMenuSlider();
  initScrollAnimations();

  /* ===== BURGER MENU ===== */
  if (burger && sidebar && overlay) {
    burger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && sidebar && overlay) {
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

      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900 && sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
      }
    });
  });

  window.addEventListener('scroll', setActiveLink);
  window.addEventListener('load', setActiveLink);

  /* ===== LOAD EVENTS ===== */
  async function loadEvents() {
    const container = document.getElementById('eventsContainer');
    if (!container) return;

    const files = ['birthday-treat.json', 'opening-promo.json'];
    let found = false;

    for (const fileName of files) {
      try {
        const res = await fetch(`assets/content/events/${fileName}`, { cache: 'no-store' });
        if (!res.ok) continue;

        const eventData = await res.json();

        const card = document.createElement('article');
        card.className = 'event-card animate-on-scroll';
        card.innerHTML = `
          ${eventData.image ? `<img src="${eventData.image}" alt="${eventData.title}" class="event-image">` : ''}
          <div class="event-content">
            <h3>${eventData.title}</h3>
            <p class="date">${eventData.date}</p>
            <p>${eventData.description}</p>
            <button class="event-learn-btn"
                    data-image="${eventData.image || ''}"
                    data-title="${eventData.title}">
              Learn More
            </button>
          </div>
        `;

        container.appendChild(card);
        found = true;
      } catch (error) {
        console.warn('Event load failed:', fileName, error);
      }
    }

    if (!found) {
      container.innerHTML = `
        <p style="text-align:center;color:#999;">No upcoming events.</p>
      `;
    }

    initScrollAnimations();
  }

  /* ===== SCROLL ANIMATION ===== */
  function initScrollAnimations() {
    const options = { threshold: 0.12, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  }

  /* ===== MENU IMAGE MODAL ===== */
  function initMenuImageModal() {
    const menuImages = document.querySelectorAll('.menu-image');
    if (!menuImages.length) return;

    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
      <button class="modal-close" type="button">&times;</button>
      <img class="modal-image" alt="Menu preview">
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('.modal-image');
    const closeBtn = modal.querySelector('.modal-close');

    function openModal(src) {
      modalImg.src = src;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      modalImg.src = '';
      document.body.style.overflow = '';
    }

    menuImages.forEach(img => {
      img.addEventListener('click', () => openModal(img.src));
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', event => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeModal();
    });
  }

  /* ===== EVENT IMAGE MODAL ===== */
  document.addEventListener('click', event => {
    if (!event.target.classList.contains('event-learn-btn')) return;

    const src = event.target.dataset.image;
    if (!src) return;

    const modal = document.querySelector('.image-modal');
    if (!modal) return;

    const img = modal.querySelector('.modal-image');
    img.src = src;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  /* ===== MENU SLIDER ===== */
  function initMenuSlider() {
    const track = document.querySelector('.slider-track');
    const prev = document.querySelector('.slider-btn.prev');
    const next = document.querySelector('.slider-btn.next');

    if (!track || !prev || !next) return;

    const getScrollAmount = () => {
      const slide = track.querySelector('.slide');
      if (!slide) return Math.max(320, track.clientWidth * 0.8);

      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      return slide.getBoundingClientRect().width + gap;
    };

    const updateButtons = () => {
      const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth - 1);
      prev.disabled = track.scrollLeft <= 0;
      next.disabled = track.scrollLeft >= maxScrollLeft;
    };

    prev.addEventListener('click', () => {
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    next.addEventListener('click', () => {
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateButtons);
    }, { passive: true });

    window.addEventListener('resize', updateButtons);
    updateButtons();
  }
});
