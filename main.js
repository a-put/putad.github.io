// ── Bootstrap ─────────────────────────────────────────────────
fetch('data.json')
  .then(r => r.json())
  .then(data => {
    renderHeader(data);
    initHeaderParticles(data);
    renderAbout(data);
    renderExperience(data);
    renderPublications(data);
    renderTimeline(data);
    renderSkills(data);
    renderMedia(data);
    setupContact(data);
    document.getElementById('footer-name').textContent = `© ${new Date().getFullYear()} ${data.name}`;
  });

// ── Tab switching / mobile scroll-spy ─────────────────────────
const mobileQuery = window.matchMedia('(max-width: 768px)');
let scrollObserver = null;

function setHeaderHeight() {
  const h = document.querySelector('header').offsetHeight;
  document.documentElement.style.setProperty('--header-h', h + 'px');
}

function setupDesktopTabs() {
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('hidden'));

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.getElementById(`tab-${btn.dataset.tab}`)
        .scrollIntoView({ behavior: 'smooth' });
    };
  });

  if (scrollObserver) scrollObserver.disconnect();
  const headerH = document.querySelector('header').offsetHeight;
  scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id.replace('tab-', '');
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.tab === id);
        });
      }
    });
  }, { rootMargin: `-${headerH}px 0px -50% 0px` });

  document.querySelectorAll('.tab-section').forEach(s => scrollObserver.observe(s));
}

function setupMobileTabs() {
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('hidden'));

  const nav = document.querySelector('.sidebar');
  document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');

  const headerH = document.querySelector('header').offsetHeight;
  const navH = nav.offsetHeight;
  const topOffset = headerH + navH;

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.getElementById(`tab-${btn.dataset.tab}`)
        .scrollIntoView({ behavior: 'smooth' });
    };
  });

  if (scrollObserver) scrollObserver.disconnect();
  scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id.replace('tab-', '');
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.tab === id);
        });
        const activeBtn = nav.querySelector(`.tab-btn[data-tab="${id}"]`);
        if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    });
  }, { rootMargin: `-${topOffset}px 0px -50% 0px` });

  document.querySelectorAll('.tab-section').forEach(s => scrollObserver.observe(s));
}

function initTabs() {
  setHeaderHeight();
  if (mobileQuery.matches) setupMobileTabs();
  else setupDesktopTabs();
}

let initTabsTimer;
function initTabsDebounced() { clearTimeout(initTabsTimer); initTabsTimer = setTimeout(initTabs, 120); }

mobileQuery.addEventListener('change', initTabs);
window.addEventListener('resize', initTabsDebounced);
initTabs();

// ── Header ────────────────────────────────────────────────────
function renderHeader(data) {
  document.title = `${data.name}, ${data.degree}`;

  document.getElementById('header-name').textContent = `${data.name}, ${data.degree}`;
  document.getElementById('header-title').textContent = data.title;
  document.getElementById('header-meta').textContent =
    [data.location, data.languages].filter(Boolean).join('  ·  ');

  const linksEl = document.getElementById('header-links');
  const linkDefs = [
    { label: 'LinkedIn', href: data.linkedin || null, light: 'assets/linkedin.png', dark: 'assets/linkedin_bw.png' },
    { label: 'Facebook', href: data.facebook || null, light: 'assets/facebook.png', dark: 'assets/facebook_bw.png' },
    { label: 'Telegram', href: data.telegram || null, light: 'assets/telegram.png', dark: 'assets/telegram_bw.png' },
    { label: 'Email', href: data.email ? `mailto:${data.email}` : null, light: 'assets/mail.png', dark: 'assets/mail_bw.png' },
  ];
  linkDefs.forEach(({ label, href, light, dark }) => {
    if (!href) return;
    const a = document.createElement('a');
    a.href = href;
    if (!href.startsWith('mailto:')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    a.className = 'social-icon-btn';
    a.title = label;
    a.setAttribute('aria-label', label);
    const img = document.createElement('img');
    img.dataset.iconLight = light;
    img.dataset.iconDark = dark;
    img.alt = label;
    a.appendChild(img);
    linksEl.appendChild(a);
  });
  updateSocialIcons();

  if (data.avatar) {
    const img = document.getElementById('avatar');
    img.src = data.avatar;
  }

  if (data.headerBg) {
    const header = document.querySelector('header');
    header.style.setProperty('--header-bg', `url('${data.headerBg}')`);
    header.classList.add('has-bg-image');
  }
}

// ── About ──────────────────────────────────────────────────────
function renderAbout(data) {
  renderExplainer(data);
  document.getElementById('about-text').textContent = data.about;
  renderEducation(data.education);
}

function renderEducation(list) {
  const container = document.getElementById('education-list');
  list.forEach(item => {
    const el = document.createElement('div');
    el.className = 'edu-card';
    el.innerHTML = `
      <div>
        <div class="edu-degree">${item.degree}</div>
        <div class="edu-institution">${item.institution}${item.note ? ` · ${item.note}` : ''}</div>
      </div>
      <div class="edu-right">
        <div class="edu-period">${item.period}</div>
        <div class="edu-location">${item.location}</div>
      </div>
    `;
    container.appendChild(el);
  });
}

// ── Experience ─────────────────────────────────────────────────
function renderExperience(data) {
  const container = document.getElementById('experience-list');
  data.experience.forEach(job => {
    const el = document.createElement('div');
    el.className = 'exp-card';
    el.innerHTML = `
      <div class="flex justify-between items-start gap-3 flex-wrap">
        <div>
          <div class="exp-role">${job.role}</div>
          <div class="exp-meta">${job.company} · ${job.location}</div>
        </div>
        <span class="exp-period">${job.period}</span>
      </div>
      <ul>${job.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
    `;
    container.appendChild(el);
  });
}

// ── Publications ───────────────────────────────────────────────
const DOWNLOAD_ICON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;

function renderPublications(data) {
  const profilesEl = document.getElementById('pub-profiles');
  const profiles = [
    { label: 'ORCID', href: data.orcid || null, icon: 'assets/orcid.png' },
    { label: 'Google Scholar', href: data.googleScholar || null, icon: 'assets/GoogleScholar.png' },
  ];
  profiles.forEach(({ label, href, icon }) => {
    if (!href) return;
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'pub-profile-btn';
    a.innerHTML = `<img src="${icon}" alt="${label}" /><span>${label}</span>`;
    profilesEl.appendChild(a);
  });

  const container = document.getElementById('publications-list');
  data.publications.forEach(pub => {
    const corrSup = pub.corresponding ? '<sup>†</sup>' : '';
    const authorsHtml = pub.authors.replace(
      /(A\.\s*D\.\s*Putintsev\*?)/g,
      `<strong>$1</strong>${corrSup}`
    );

    const badgesHtml = pub.badges.map(b => {
      const isGold = b === "Editor's Choice" || b === "Editor's Suggestion";
      return `<span class="badge${isGold ? ' badge-gold' : ''}">${b}</span>`;
    }).join('');

    const downloadHtml = pub.pdf
      ? `<a href="${pub.pdf}" target="_blank" class="pub-download-btn" onclick="event.stopPropagation()" title="Download PDF">${DOWNLOAD_ICON}</a>`
      : `<span class="pub-download-btn pub-download-btn--inactive" title="No PDF available">${DOWNLOAD_ICON}</span>`;

    const titleHtml = pub.doi
      ? `<a href="${pub.doi}" target="_blank" class="pub-title-link" onclick="event.stopPropagation()">${pub.title}</a>`
      : pub.title;

    const el = document.createElement('div');
    el.className = 'pub-card';
    el.innerHTML = `
      <div class="pub-title">${titleHtml}${badgesHtml ? '&ensp;' + badgesHtml : ''}</div>
      <div class="pub-authors">${authorsHtml}</div>
      <div class="pub-meta">
        <span class="pub-journal">${pub.journal}</span>
        <span style="color: var(--border-color)">·</span>
        <span>${pub.ref} (${pub.year})</span>
        ${downloadHtml}
      </div>
    `;

    el.addEventListener('click', () => openPubModal(pub));

    container.appendChild(el);
  });
}

function openPubModal(pub) {
  document.getElementById('pm-journal').textContent = `${pub.journal} · ${pub.year}`;
  document.getElementById('pm-title').textContent = pub.title;
  document.getElementById('pm-layman').textContent = pub.layman;

  const imgWrap = document.getElementById('pm-img-wrap');
  const img = document.getElementById('pm-img');
  const modal = document.getElementById('pub-modal');
  const card = document.getElementById('pub-modal-card');

  // Center horizontally over the publications main column
  const mainRect = document.querySelector('.page-layout > main').getBoundingClientRect();
  card.style.left = (mainRect.left + mainRect.width / 2) + 'px';

  if (pub.image) {
    const probe = new Image();
    probe.onload = () => {
      imgWrap.style.display = '';
      img.src = pub.image;
      modal.classList.add('open');
    };
    probe.onerror = () => {
      imgWrap.style.display = 'none';
      modal.classList.add('open');
    };
    probe.src = pub.image;
  } else {
    imgWrap.style.display = 'none';
    modal.classList.add('open');
  }
}

// Modal dismiss
(function () {
  const modal = document.getElementById('pub-modal');
  const card = document.getElementById('pub-modal-card');

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Lock body scroll when modal opens (mobile only)
  new MutationObserver(() => {
    if (modal.classList.contains('open') && window.innerWidth <= 620)
      document.body.style.overflow = 'hidden';
  }).observe(modal, { attributeFilter: ['class'] });

  modal.addEventListener('click', closeModal);
  card.addEventListener('click', e => e.stopPropagation());
  document.getElementById('pub-modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}());

// ── Skills ─────────────────────────────────────────────────────
function renderSkills(data) {
  const container = document.getElementById('skills-list');
  Object.entries(data.skills).forEach(([group, items]) => {
    const el = document.createElement('div');
    el.innerHTML = `
      <div class="skill-group-title">${group}</div>
      <div>${items.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>
    `;
    container.appendChild(el);
  });
}

// ── Explainer card ─────────────────────────────────────────
function renderExplainer(data) {
  if (!data.explainer) return;
  const { headline, body } = data.explainer;
  if (!headline && !body) return;
  const el = document.getElementById('explainer-card');
  el.className = 'explainer-card';
  el.innerHTML = `
    ${headline ? `<div class="explainer-headline">${headline}</div>` : ''}
    ${body ? `<p class="explainer-body">${body}</p>` : ''}
  `;
}

// ── Timeline ───────────────────────────────────────────────
function firstYear(str) {
  const m = String(str).match(/\d{4}/g);
  return m ? parseInt(m[0], 10) : null;
}
function lastYear(str) {
  const m = String(str).match(/\d{4}/g);
  return m ? parseInt(m[m.length - 1], 10) : null;
}

function renderTimeline(data) {
  const container = document.getElementById('timeline-list');
  const events = [];

  (data.experience || []).forEach(job => {
    const year = firstYear(job.period);
    if (year) events.push({
      type: 'work', year, title: job.role,
      subtitle: `${job.company} · ${job.location}`, period: job.period
    });
  });

  (data.education || []).forEach(item => {
    const year = lastYear(item.period);
    if (year) events.push({
      type: 'education', year, title: item.degree,
      subtitle: `${item.institution} · ${item.location}`, period: item.period
    });
  });

  (data.recognition || []).forEach(item => {
    const year = firstYear(item.year);
    if (year) events.push({
      type: 'award', year, title: item.title,
      subtitle: null, period: String(item.year), url: item.url || null
    });
  });

  (data.publications || []).forEach(pub => {
    const year = parseInt(pub.year, 10);
    if (year) events.push({
      type: 'publication', year, title: pub.title,
      subtitle: `${pub.journal} · ${pub.ref}`, period: null
    });
  });

  events.sort((a, b) => b.year - a.year);

  let lastYearSeen = null;
  events.forEach(ev => {
    if (ev.year !== lastYearSeen) {
      const yl = document.createElement('div');
      yl.className = 'tl-year';
      yl.textContent = ev.year;
      container.appendChild(yl);
      lastYearSeen = ev.year;
    }
    const item = document.createElement('div');
    item.className = `tl-item tl-item--${ev.type}`;
    const titleHtml = ev.url
      ? `<a href="${ev.url}" target="_blank" rel="noopener noreferrer" class="tl-card-link">${ev.title}</a>`
      : ev.title;
    item.innerHTML = `
      <div class="tl-dot"></div>
      <div class="tl-card">
        <div class="tl-card-title">${titleHtml}</div>
        ${ev.subtitle ? `<div class="tl-card-sub">${ev.subtitle}</div>` : ''}
        ${ev.period ? `<div class="tl-card-period">${ev.period}</div>` : ''}
      </div>
    `;
    container.appendChild(item);
  });
}

// ── Projects ───────────────────────────────────────────────
function renderProjects(data) {
  const container = document.getElementById('projects-list');
  if (!data.projects || data.projects.length === 0) {
    container.innerHTML = '<p style="color:var(--text-tertiary);font-size:0.875rem;">No projects yet.</p>';
    return;
  }
  data.projects.forEach(proj => {
    const el = document.createElement('div');
    el.className = 'proj-card';

    const tagsHtml = (proj.tags || []).map(t => `<span class="skill-tag">${t}</span>`).join('');
    const linksHtml = (proj.links || []).filter(l => l.url).map(l =>
      `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="header-link">${l.label} ↗</a>`
    ).join('');
    const statusHtml = proj.status
      ? `<span class="proj-status proj-status--${proj.status.toLowerCase().replace(/\s+/g, '-')}">${proj.status}</span>`
      : '';

    el.innerHTML = `
      <div class="proj-header">
        <div class="proj-title">${proj.title}</div>
        ${statusHtml}
      </div>
      ${proj.description ? `<p class="proj-desc">${proj.description}</p>` : ''}
      ${tagsHtml ? `<div class="proj-tags">${tagsHtml}</div>` : ''}
      ${linksHtml ? `<div class="proj-links">${linksHtml}</div>` : ''}
    `;
    container.appendChild(el);
  });
}

// ── Media ──────────────────────────────────────────────────
async function fetchOgImage(url) {
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const { contents } = await res.json();
    const m = contents.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || contents.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

function createMediaCard(item) {
  const el = document.createElement('a');
  el.className = 'media-card';
  el.href = item.url || '#';
  if (item.url) { el.target = '_blank'; el.rel = 'noopener noreferrer'; }

  el.innerHTML = `
    ${item.image ? `<div class="media-img-wrap"><img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.closest('.media-img-wrap').style.display='none'" /></div>` : ''}
    <div class="media-body">
      <div class="media-title">${item.title}</div>
      ${item.description ? `<div class="media-desc">${item.description}</div>` : ''}
      <div class="media-meta">${[item.source, item.date].filter(Boolean).join(' · ')}${item.url ? ' <span class="media-arrow">↗</span>' : ''}</div>
    </div>
  `;

  // Auto-fetch OG image if none was provided
  if (!item.image && item.url) {
    fetchOgImage(item.url).then(ogImg => {
      if (!ogImg) return;
      const wrap = document.createElement('div');
      wrap.className = 'media-img-wrap';
      const img = document.createElement('img');
      img.src = ogImg;
      img.alt = item.title;
      img.loading = 'lazy';
      img.onerror = () => wrap.remove();
      wrap.appendChild(img);
      el.prepend(wrap);
    });
  }

  return el;
}

function makeMediaListRow(item) {
  const el = document.createElement('a');
  el.className = 'media-list-item';
  el.href = item.url || '#';
  if (item.url) { el.target = '_blank'; el.rel = 'noopener noreferrer'; }
  el.innerHTML = `
    <span class="media-list-title">${item.title}</span>
    <span class="media-list-meta">${[item.source, item.date].filter(Boolean).join(' · ')}${item.url ? ' <span class="media-arrow">↗</span>' : ''}</span>
  `;
  return el;
}

function renderMedia(data) {
  const container = document.getElementById('media-list');
  const mediaItems = data.media || [];
  const groups = data.media_groups || [];

  if (mediaItems.length === 0 && groups.length === 0) {
    container.innerHTML = '<p style="color:var(--text-tertiary);font-size:0.875rem;">No media entries yet.</p>';
    return;
  }

  // ── Featured grid (up to 4 cards) ──────────────────────────
  if (mediaItems.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'media-grid';
    mediaItems.slice(0, 4).forEach(item => grid.appendChild(createMediaCard(item)));
    container.appendChild(grid);

    const rest = mediaItems.slice(4);
    if (rest.length > 0) {
      const lbl = document.createElement('p');
      lbl.className = 'subsection-label';
      lbl.textContent = 'More Coverage';
      container.appendChild(lbl);

      const list = document.createElement('div');
      list.className = 'media-list-rows';
      rest.forEach(item => list.appendChild(makeMediaListRow(item)));
      container.appendChild(list);
    }
  }

  // ── Altmetric groups from data.json ────────────────────────
  groups.forEach(group => {
    if (!group.items?.length) return;

    const lbl = document.createElement('p');
    lbl.className = 'subsection-label';
    lbl.textContent = group.label;
    container.appendChild(lbl);

    const list = document.createElement('div');
    list.className = 'media-list-rows';
    group.items.forEach(item => list.appendChild(makeMediaListRow(item)));
    container.appendChild(list);
  });
}

// ── Social icon theme sync ─────────────────────────────────────
function updateSocialIcons() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.querySelectorAll('#header-links img[data-icon-light]').forEach(img => {
    img.src = isDark ? img.dataset.iconDark : img.dataset.iconLight;
  });
}

// ── Theme (dark / light) ───────────────────────────────────────
(function () {
  const STORAGE_KEY = 'cv-theme';
  const html = document.documentElement;
  const btn = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    updateSocialIcons();
  }

  // Sync button icon with whatever the anti-flash script already applied
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  btn.addEventListener('click', function () {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });

  // Follow OS preference if the user hasn't made an explicit choice
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
}());

// ── Contact ────────────────────────────────────────────────────
function setupContact(data) {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const endpoint = data.contact?.formspree_endpoint;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!endpoint || endpoint.includes('YOUR_ID_HERE')) {
      showStatus('Form not configured — paste your Formspree endpoint into data.json.', 'warn');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      const json = await res.json();

      if (res.ok) {
        form.style.display = 'none';
        const success = document.getElementById('form-success');
        success.style.display = 'flex';
        success.classList.remove('hidden');
      } else {
        throw new Error(json.error || 'Unknown error');
      }
    } catch (err) {
      showStatus(`Something went wrong. Email me directly at ${data.contact.email}.`, 'err');
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.style.color = type === 'ok' ? '#188038' : type === 'warn' ? '#92400e' : '#c0392b';
    status.classList.remove('hidden');
  }
}

// ── Header particle field ──────────────────────────────────────
function initHeaderParticles(data) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('header-canvas');
  const ctx = canvas.getContext('2d');
  const header = canvas.closest('header');

  const COUNT = data.particles?.count ?? 340;
  const REPEL_RADIUS = data.particles?.repelRadius ?? 90;
  const REPEL_STR = data.particles?.repelStrength ?? 4;
  const SPRING = data.particles?.spring ?? 0.06;
  const DAMPING = data.particles?.damping ?? 0.82;
  const DOT_R = data.particles?.dotRadius ?? 1.5;
  const CONNECT_RADIUS = data.particles?.connectRadius ?? 70;
  const CONNECT_ALPHA = data.particles?.connectAlpha ?? 0.18;
  const MARGIN = 0.20; // fraction of canvas to extend grid beyond edges
  const DRIFT_AMP = data.particles?.driftAmplitude ?? 20;
  const DRIFT_SPEED = data.particles?.driftSpeed ?? 0.0006;
  const RIPPLE_MAX_R = data.particles?.rippleRadius ?? 200;
  const RIPPLE_STR = data.particles?.rippleStrength ?? 7;
  const DOT_REPEL_R = data.particles?.dotRepelRadius ?? 18;
  const DOT_REPEL_STR = data.particles?.dotRepelStr ?? 0.25;
  const CR2 = CONNECT_RADIUS * CONNECT_RADIUS;
  const DR2 = DOT_REPEL_R * DOT_REPEL_R;

  const BUCKETS = 5;
  const buckets = Array.from({ length: BUCKETS }, () => []);
  const TURB_DECAY = 0.93;
  const TURB_SCALE = 0.04;
  const TURB_MAX = 3.0;
  const GRAVITY_STR = 10;   // max vertical home-offset (px) at full scroll
  const TILT_AMP = 30;   // max px offset for near dots (depth=1) at full tilt
  const WAKE_DURATION = 1000; // ms a dot stays "hot" after cursor contact
  const ATTRACT_STR = 3;    // peak attraction force toward cursor
  const ATTRACT_R = REPEL_RADIUS * 2.2; // attraction radius (wider than repulsion)
  const EXPLODE_STR = 10;   // outward burst velocity on release
  const BEAT_INTERVAL = 2500; // ms between heartbeat ripples (30 bpm)
  const PULSE_WANDER_SPEED = 0.00025; // how fast the heartbeat origin drifts
  let dots = [], dotsByDepth = [], mouse = { x: -9999, y: -9999 },
    prevMouse = { x: -9999, y: -9999 }, turbulence = 0, ripples = [], t = 0,
    scrollProgress = 0, tiltX = 0, tiltY = 0,
    canvasRect = { left: 0, top: 0 },
    attracting = false, longPressTimer = null,
    lastBeat = 0, pulseT = 0;

  // Cache scroll progress and canvas rect — avoid reflow inside rAF
  function updateScroll() {
    const scrollMax = document.body.scrollHeight - window.innerHeight;
    scrollProgress = scrollMax > 0 ? window.scrollY / scrollMax : 0;
    updateRect();
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  // Pseudo-noise from superimposed sines — no library needed
  function noise(x, y) {
    return (Math.sin(x * 1.4 + y * 0.8) +
      Math.sin(x * 0.6 - y * 1.3) +
      Math.sin((x - y) * 1.1)) / 3;
  }

  function getColor() {
    const hasBg = header.classList.contains('has-bg-image');
    const isDark = document.documentElement.dataset.theme === 'dark';
    if (hasBg) return [255, 255, 255];
    if (isDark) return [174, 174, 178];
    return [110, 110, 115];
  }

  function buildDots() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr, h = canvas.height / dpr;
    const mx = w * MARGIN, my = h * MARGIN;
    const W2 = w + 2 * mx, H2 = h + 2 * my;
    const total = Math.round(COUNT * (W2 * H2) / (w * h));
    dots = [];
    const cols = Math.ceil(Math.sqrt(total * (W2 / H2)));
    const rows = Math.ceil(total / cols);
    const cw = W2 / cols, ch = H2 / rows;
    for (let r = 0; r < rows && dots.length < total; r++) {
      for (let c = 0; c < cols && dots.length < total; c++) {
        const hx = -mx + (c + 0.2 + Math.random() * 0.6) * cw;
        const hy = -my + (r + 0.2 + Math.random() * 0.6) * ch;
        const depth = Math.random();
        const phase = Math.random() * Math.PI * 2; // per-dot hue cycle offset
        dots.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0, depth, phase, lastDisplaced: 0 });
      }
    }
    dotsByDepth = dots.slice().sort((a, b) => a.depth - b.depth);
  }

  function updateRect() { canvasRect = canvas.getBoundingClientRect(); }

  let resizeTimer;
  function resize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const dpr = window.devicePixelRatio || 1;
      const newW = header.offsetWidth * dpr;
      const newH = header.offsetHeight * dpr;
      // Skip if dimensions unchanged — prevents mobile address-bar resize from
      // resetting dot positions on every scroll
      if (newW === canvas.width && newH === canvas.height) return;
      canvas.width = newW;
      canvas.height = newH;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
      updateRect();
    }, 100);
  }

  function spawnRipple(clientX, clientY) {
    ripples.push({ x: clientX - canvasRect.left, y: clientY - canvasRect.top, r: 0, str: RIPPLE_STR });
  }

  function tick() {
    t = (t + DRIFT_SPEED) % (Math.PI * 2000);
    pulseT += PULSE_WANDER_SPEED;
    const now = performance.now();
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr, H = canvas.height / dpr;
    ctx.clearRect(0, 0, W, H);

    // ── Wandering heartbeat ───────────────────────────────────
    const px = W * (0.5 + noise(pulseT, 314) * 0.30);
    const py = H * (0.5 + noise(314, pulseT) * 0.22);
    if (now - lastBeat > BEAT_INTERVAL) {
      ripples.push({ x: px, y: py, r: 0, str: RIPPLE_STR * 0.0 });
      lastBeat = now;
    }

    const [cr, cg, cb] = getColor();

    // ── Cursor velocity → turbulence ─────────────────────────
    if (prevMouse.x > -9000) {
      const speed = Math.hypot(mouse.x - prevMouse.x, mouse.y - prevMouse.y);
      turbulence = Math.min(TURB_MAX, Math.max(turbulence * TURB_DECAY, speed * TURB_SCALE));
    } else {
      turbulence *= TURB_DECAY;
    }
    prevMouse.x = mouse.x;
    prevMouse.y = mouse.y;

    // ── Scroll gravity offset ────────────────────────────────
    const gravityOffset = (scrollProgress - 0.5) * GRAVITY_STR;

    // ── Physics ──────────────────────────────────────────────
    for (const d of dots) {
      // Cursor interaction — repulsion normally, attraction when gravity-well active
      const mx = d.x - mouse.x, my = d.y - mouse.y;
      const mdist = Math.hypot(mx, my);
      if (attracting) {
        if (mdist < ATTRACT_R && mdist > 0) {
          const f = (1 - mdist / ATTRACT_R) * (0.3 + 0.7 * d.depth);
          d.vx -= (mx / mdist) * f * ATTRACT_STR; // negative = toward cursor
          d.vy -= (my / mdist) * f * ATTRACT_STR;
          d.lastDisplaced = now;
        }
      } else {
        if (mdist < REPEL_RADIUS && mdist > 0) {
          const f = (1 - mdist / REPEL_RADIUS) * (0.3 + 0.7 * d.depth) * (1 + turbulence);
          d.vx += (mx / mdist) * f * REPEL_STR;
          d.vy += (my / mdist) * f * REPEL_STR;
          d.lastDisplaced = now;
        }
      }

      // Ripple ring forces
      for (const rip of ripples) {
        const rx = d.x - rip.x, ry = d.y - rip.y;
        const rdist = Math.hypot(rx, ry);
        const ring = Math.abs(rdist - rip.r);
        if (ring < 25 && rdist > 0) {
          const f = (1 - ring / 25) * rip.str * (1 - rip.r / RIPPLE_MAX_R);
          d.vx += (rx / rdist) * f;
          d.vy += (ry / rdist) * f;
        }
      }

      // Spring toward noise-drifted home target, shifted by gravity + tilt parallax
      const angle = noise(d.hx * 0.012 + t, d.hy * 0.012) * Math.PI * 2;
      const tiltScale = Math.max(-1, Math.min(1, tiltX / 25)) * TILT_AMP * d.depth;
      const tiltScaleY = Math.max(-1, Math.min(1, tiltY / 25)) * TILT_AMP * d.depth;
      const tx = d.hx + Math.cos(angle) * DRIFT_AMP + tiltScale;
      const ty = d.hy + Math.sin(angle) * DRIFT_AMP + gravityOffset + tiltScaleY;
      d.vx += (tx - d.x) * SPRING;
      d.vy += (ty - d.y) * SPRING;
      // Deeper dots are more sluggish
      const damp = DAMPING + 0.12 * (1 - d.depth);
      d.vx *= damp;
      d.vy *= damp;
    }

    // ── Dot–dot soft repulsion (before position integration) ──
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < DR2 && d2 > 0) {
          const dist = Math.sqrt(d2);
          const f = (1 - dist / DOT_REPEL_R) * DOT_REPEL_STR;
          const fx = (dx / dist) * f;
          const fy = (dy / dist) * f;
          dots[i].vx += fx; dots[i].vy += fy;
          dots[j].vx -= fx; dots[j].vy -= fy;
        }
      }
    }

    // ── Integrate positions ───────────────────────────────────
    for (const d of dots) {
      d.x += d.vx;
      d.y += d.vy;
    }

    // Advance and cull ripples
    for (const rip of ripples) rip.r += 3.5;
    ripples = ripples.filter(rip => rip.r < RIPPLE_MAX_R);

    // ── Draw connections (batched into alpha buckets) ─────────
    for (let i = 0; i < BUCKETS; i++) buckets[i].length = 0;
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < CR2) {
          const depthSim = 1 - Math.abs(dots[i].depth - dots[j].depth);
          if (depthSim < 0.15) continue; // skip cross-layer connections
          const distFactor = 1 - Math.sqrt(d2) / CONNECT_RADIUS;
          const bi = Math.min(BUCKETS - 1, Math.floor(distFactor * depthSim * BUCKETS));
          buckets[bi].push(dots[i].x, dots[i].y, dots[j].x, dots[j].y);
        }
      }
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgb(${cr},${cg},${cb})`;
    for (let bi = 0; bi < BUCKETS; bi++) {
      const lines = buckets[bi];
      if (!lines.length) continue;
      ctx.globalAlpha = ((bi + 0.5) / BUCKETS) * CONNECT_ALPHA;
      ctx.beginPath();
      for (let k = 0; k < lines.length; k += 4) {
        ctx.moveTo(lines[k], lines[k + 1]);
        ctx.lineTo(lines[k + 2], lines[k + 3]);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // ── Draw dots (back-to-front, depth-scaled size + opacity) ──
    const isDark = document.documentElement.dataset.theme === 'dark';
    if (isDark) {
      // Dark mode: bioluminescence — each dot has individual colour, draw one by one
      for (const d of dotsByDepth) {
        const radius = DOT_R * (0.4 + 0.9 * d.depth);
        const disp = Math.hypot(d.x - d.hx, d.y - d.hy);
        const dispFactor = Math.min(1, disp / 25);
        const cycleFactor = (Math.sin(t * 30 + d.phase) + 1) / 2 * 0.65;
        let rippleFactor = 0;
        for (const rip of ripples) {
          const rdist = Math.hypot(d.x - rip.x, d.y - rip.y);
          const ring = Math.abs(rdist - rip.r);
          if (ring < 60) {
            const rf = (1 - ring / 60) * (1 - rip.r / RIPPLE_MAX_R);
            if (rf > rippleFactor) rippleFactor = rf;
          }
        }
        const wakeFactor = Math.max(0, 1 - (now - d.lastDisplaced) / WAKE_DURATION);
        const blend = Math.max(cycleFactor, dispFactor, rippleFactor, wakeFactor);
        const dr = Math.round(90 + 120 * blend);
        const dg = Math.round(110 + 110 * blend);
        const db = Math.round(210 + 45 * blend);
        const alpha = Math.min(1, (0.2 + 0.6 * d.depth) + dispFactor * 0.6 + rippleFactor * 0.7 + wakeFactor * 0.6);
        ctx.fillStyle = `rgba(${dr},${dg},${db},${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Light mode: all dots same colour — batch by alpha bucket to minimise fillStyle changes
      const DBUCKETS = 8;
      for (let bi = 0; bi < DBUCKETS; bi++) {
        const alphaMin = bi / DBUCKETS;
        const alphaMax = (bi + 1) / DBUCKETS;
        const alphaMid = (alphaMin + alphaMax) / 2;
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alphaMid.toFixed(2)})`;
        ctx.beginPath();
        for (const d of dotsByDepth) {
          const alpha = 0.2 + 0.6 * d.depth;
          if (alpha >= alphaMin && alpha < alphaMax) {
            const radius = DOT_R * (0.4 + 0.9 * d.depth);
            ctx.moveTo(d.x + radius, d.y);
            ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
          }
        }
        ctx.fill();
      }
      // Wake glow pass — batch hot dots into 4 alpha buckets
      const WBUCKETS = 4;
      for (let wi = 0; wi < WBUCKETS; wi++) {
        const wMin = wi / WBUCKETS, wMax = (wi + 1) / WBUCKETS;
        const wMid = ((wMin + wMax) / 2 * 0.45);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${wMid.toFixed(2)})`;
        ctx.beginPath();
        for (const d of dotsByDepth) {
          const wf = Math.max(0, 1 - (now - d.lastDisplaced) / WAKE_DURATION);
          if (wf >= wMin && wf < wMax) {
            const radius = DOT_R * (0.4 + 0.9 * d.depth);
            ctx.moveTo(d.x + radius, d.y);
            ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
          }
        }
        ctx.fill();
      }
      // Ripple glow pass — dots briefly brighten as a ripple ring sweeps through
      const RBUCKETS = 4;
      for (let ri = 0; ri < RBUCKETS; ri++) {
        const rMin = ri / RBUCKETS, rMax = (ri + 1) / RBUCKETS;
        const rMid = (rMin + rMax) / 2 * 0.5;
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${rMid.toFixed(2)})`;
        ctx.beginPath();
        for (const d of dotsByDepth) {
          let rf = 0;
          for (const rip of ripples) {
            const rdist = Math.hypot(d.x - rip.x, d.y - rip.y);
            const ring = Math.abs(rdist - rip.r);
            if (ring < 60) {
              const v = (1 - ring / 60) * (1 - rip.r / RIPPLE_MAX_R);
              if (v > rf) rf = v;
            }
          }
          if (rf >= rMin && rf < rMax) {
            const radius = DOT_R * (0.4 + 0.9 * d.depth);
            ctx.moveTo(d.x + radius, d.y);
            ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
          }
        }
        ctx.fill();
      }
    }

    requestAnimationFrame(tick);
  }

  // Burst dots outward from cursor — called on gravity-well release
  function explode() {
    const stamp = performance.now();
    for (const d of dots) {
      const ex = d.x - mouse.x, ey = d.y - mouse.y;
      const edist = Math.hypot(ex, ey);
      if (edist < ATTRACT_R && edist > 0) {
        const f = 1 - edist / ATTRACT_R;
        d.vx += (ex / edist) * f * EXPLODE_STR;
        d.vy += (ey / edist) * f * EXPLODE_STR;
        d.lastDisplaced = stamp;
      }
    }
  }

  header.addEventListener('mousemove', e => {
    mouse.x = e.clientX - canvasRect.left;
    mouse.y = e.clientY - canvasRect.top;
  });
  header.addEventListener('mouseleave', () => {
    mouse.x = mouse.y = -9999;
    if (attracting) { attracting = false; explode(); }
  });

  // Desktop: Shift key toggles gravity well
  window.addEventListener('keydown', e => {
    if (e.key === 'Shift' && !attracting && mouse.x > -9000) attracting = true;
  });
  window.addEventListener('keyup', e => {
    if (e.key === 'Shift' && attracting) { attracting = false; explode(); }
  });

  // Touch: repulsion tracking + ripple on tap; long-press (500ms) = gravity well
  let touchFired = false;
  header.addEventListener('touchstart', e => {
    touchFired = true;
    updateRect();
    const t0 = e.touches[0];
    mouse.x = t0.clientX - canvasRect.left;
    mouse.y = t0.clientY - canvasRect.top;
    longPressTimer = setTimeout(() => {
      attracting = true;
      longPressTimer = null;
    }, 500);
    Array.from(e.touches).forEach(touch => spawnRipple(touch.clientX, touch.clientY));
  }, { passive: true });
  header.addEventListener('touchmove', e => {
    const t0 = e.touches[0];
    mouse.x = t0.clientX - canvasRect.left;
    mouse.y = t0.clientY - canvasRect.top;
  }, { passive: true });
  document.addEventListener('touchend', () => {
    clearTimeout(longPressTimer); longPressTimer = null;
    if (attracting) { attracting = false; explode(); }
    mouse.x = mouse.y = -9999;
  }, { passive: true });
  document.addEventListener('touchcancel', () => {
    clearTimeout(longPressTimer); longPressTimer = null;
    attracting = false;
    mouse.x = mouse.y = -9999;
  }, { passive: true });

  // ── Device tilt parallax (mobile) ────────────────────────
  function setupTilt() {
    if (typeof DeviceOrientationEvent === 'undefined') return;
    let calibX = null, calibY = null;

    function onOrientation(e) {
      if (e.gamma === null) return;
      if (calibX === null) { calibX = e.gamma; calibY = e.beta; }
      const dx = e.gamma - calibX;
      const dy = e.beta - calibY;
      // Low-pass filter to smooth sensor jitter
      tiltX += (dx - tiltX) * 0.18;
      tiltY += (dy - tiltY) * 0.18;
    }

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ — requestPermission must be called from a click event
      document.addEventListener('click', function reqPerm() {
        DeviceOrientationEvent.requestPermission()
          .then(s => { if (s === 'granted') window.addEventListener('deviceorientation', onOrientation); })
          .catch(() => { });
      }, { once: true });
    } else {
      window.addEventListener('deviceorientation', onOrientation);
    }
  }
  setupTilt();

  // Mouse click (desktop only — skip if touch already handled it)
  header.addEventListener('click', e => {
    if (touchFired) { touchFired = false; return; }
    spawnRipple(e.clientX, e.clientY);
  });
  window.addEventListener('resize', resize);

  // Initial setup — run immediately, not debounced
  const dpr0 = window.devicePixelRatio || 1;
  canvas.width = header.offsetWidth * dpr0;
  canvas.height = header.offsetHeight * dpr0;
  ctx.setTransform(dpr0, 0, 0, dpr0, 0, 0);
  buildDots();
  updateRect();
  tick();
}
