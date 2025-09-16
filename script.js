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

  // JSON-driven content rendering
  const qs = (sel) => document.querySelector(sel);
  const siteLogo = qs('#siteLogo');
  const footerName = qs('#footerName');
  const favicon = qs('#favicon');
  const heroMedia = qs('#heroMedia');
  const heroTitle = qs('#heroTitle');
  const heroLede = qs('#heroLede');
  const heroCta = qs('#heroCta');
  const destinationsGrid = qs('#destinationsGrid');
  const postsGrid = qs('#postsGrid');
  const aboutText = qs('#aboutText');

  fetch('content.json')
    .then((r) => r.json())
    .then((data) => {
      // Site branding
      if (data.site?.name) {
        if (siteLogo) siteLogo.textContent = data.site.name;
        if (footerName) footerName.textContent = data.site.name;
        document.title = `${data.site.name} — Travel Guides & Journal`;
      }
      if (data.site?.faviconEmoji && favicon) {
        const emoji = encodeURIComponent(data.site.faviconEmoji);
        favicon.setAttribute('href', `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='58' text-anchor='middle' font-size='64'>${emoji}</text></svg>`);
      }

      // Hero
      if (data.hero) {
        if (heroMedia && data.hero.image) heroMedia.style.setProperty('--img', `url('${data.hero.image}')`);
        if (heroTitle && data.hero.title) heroTitle.textContent = data.hero.title;
        if (heroLede && data.hero.lede) heroLede.textContent = data.hero.lede;
        if (heroCta) {
          if (data.hero.ctaLabel) heroCta.textContent = data.hero.ctaLabel;
          if (data.hero.ctaHref) heroCta.href = data.hero.ctaHref;
        }
      }

      // Destinations
      if (destinationsGrid && Array.isArray(data.destinations)) {
        destinationsGrid.innerHTML = data.destinations.map((d) => (
          `<article class="card">
            <a class="card-media" href="${d.href || '#'}" style="--img:url('${d.image || ''}');" aria-label="${d.ariaLabel || d.title || ''}"></a>
            <div class="card-body">
              <h3 class="card-title"><a href="${d.href || '#'}">${d.title || ''}</a></h3>
              <p class="card-meta">${d.meta || ''}</p>
            </div>
          </article>`
        )).join('');
      }

      // Posts
      if (postsGrid && Array.isArray(data.posts)) {
        postsGrid.innerHTML = data.posts.map((p) => (
          `<article class="post">
            <a class="post-media" href="${p.href || '#'}" style="--img:url('${p.image || ''}');"></a>
            <div class="post-body">
              <h3 class="post-title"><a href="${p.href || '#'}">${p.title || ''}</a></h3>
              <p class="post-excerpt">${p.excerpt || ''}</p>
            </div>
          </article>`
        )).join('');
      }

      // About
      if (aboutText && data.about?.text) {
        aboutText.textContent = data.about.text;
      }
    })
    .catch((err) => {
      // If content.json is missing or fails, keep defaults silently
      console.error('Failed to load content.json', err);
    });
})();


