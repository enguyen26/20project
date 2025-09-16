(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const yearEl = document.getElementById('year');
  const newsletterForm = document.querySelector('.newsletter-form');
  const formStatus = document.querySelector('.form-status');

  // Year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  navToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(!!open));
  });

  // Newsletter form (demo only)
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(newsletterForm).entries());
    if (formStatus) formStatus.textContent = 'Subscribing...';
    setTimeout(() => {
      if (formStatus) formStatus.textContent = `Thanks${data.email ? `, ${data.email}` : ''}! Check your inbox soon.`;
      newsletterForm.reset();
    }, 700);
  });

  // Smooth scroll for internal links and close nav on click
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


