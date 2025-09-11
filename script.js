(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const themeToggle = document.querySelector('.theme-toggle');
  const yearEl = document.getElementById('year');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const tiles = document.querySelectorAll('#galleryGrid .tile');
  const form = document.querySelector('.contact-form');
  const formStatus = document.querySelector('.form-status');

  // Year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  navToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(!!open));
  });

  // Theme toggle with localStorage
  const THEME_KEY = 'colorsplash-theme';
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  };
  applyTheme(localStorage.getItem(THEME_KEY));
  themeToggle?.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  // Gallery filter
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const region = btn.dataset.filter;
      tiles.forEach(tile => {
        if (region === 'all' || tile.dataset.region === region) {
          tile.style.display = '';
        } else {
          tile.style.display = 'none';
        }
      });
    });
  });

  // Contact form (demo only)
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    formStatus.textContent = 'Sending...';
    setTimeout(() => {
      formStatus.textContent = `Thanks, ${data.name || 'friend'}! Your rainbow note is delivered.`;
      form.reset();
    }, 700);
  });

  // Back to top smoothness for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (ev) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        ev.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
      if (nav?.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();


