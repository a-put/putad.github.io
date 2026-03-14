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
    renderProjects(data);
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
  if (scrollObserver) { scrollObserver.disconnect(); scrollObserver = null; }
  const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab || 'about';
  document.querySelectorAll('.tab-section').forEach(s => {
    s.classList.toggle('hidden', s.id !== `tab-${activeTab}`);
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-section').forEach(s => s.classList.add('hidden'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.remove('hidden');
    };
  });
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

mobileQuery.addEventListener('change', initTabs);
window.addEventListener('resize', setHeaderHeight);
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
    { label: 'LinkedIn', href: data.linkedin || null,                       icon: 'assets/linkedin.png' },
    { label: 'Facebook', href: data.facebook || null,                       icon: 'assets/facebook.png' },
    { label: 'Telegram', href: data.telegram || null,                       icon: 'assets/telegram.png' },
    { label: 'Email',    href: data.email ? `mailto:${data.email}` : null,  icon: 'assets/mail.png'     },
  ];
  linkDefs.forEach(({ label, href, icon }) => {
    if (!href) return;
    const a = document.createElement('a');
    a.href = href;
    if (!href.startsWith('mailto:')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    a.className = 'social-icon-btn';
    a.title = label;
    a.setAttribute('aria-label', label);
    const img = document.createElement('img');
    img.src = icon;
    img.alt = label;
    a.appendChild(img);
    linksEl.appendChild(a);
  });

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
    { label: 'ORCID',          href: data.orcid         || null, icon: 'assets/orcid.png' },
    { label: 'Google Scholar', href: data.googleScholar  || null, icon: 'assets/GoogleScholar.png' },
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
  document.getElementById('pm-title').textContent   = pub.title;
  document.getElementById('pm-layman').textContent  = pub.layman;

  const imgWrap = document.getElementById('pm-img-wrap');
  const img     = document.getElementById('pm-img');
  const modal   = document.getElementById('pub-modal');
  const card    = document.getElementById('pub-modal-card');

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
  const card  = document.getElementById('pub-modal-card');
  modal.addEventListener('click', () => modal.classList.remove('open'));
  card.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') modal.classList.remove('open');
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
    ${body     ? `<p class="explainer-body">${body}</p>` : ''}
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
    if (year) events.push({ type: 'work', year, title: job.role,
      subtitle: `${job.company} · ${job.location}`, period: job.period });
  });

  (data.education || []).forEach(item => {
    const year = lastYear(item.period);
    if (year) events.push({ type: 'education', year, title: item.degree,
      subtitle: `${item.institution} · ${item.location}`, period: item.period });
  });

  (data.recognition || []).forEach(item => {
    const year = firstYear(item.year);
    if (year) events.push({ type: 'award', year, title: item.title,
      subtitle: null, period: String(item.year), url: item.url || null });
  });

  (data.publications || []).forEach(pub => {
    const year = parseInt(pub.year, 10);
    if (year) events.push({ type: 'publication', year, title: pub.title,
      subtitle: `${pub.journal} · ${pub.ref}`, period: null });
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
        ${ev.period   ? `<div class="tl-card-period">${ev.period}</div>` : ''}
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
  const container  = document.getElementById('media-list');
  const mediaItems = data.media || [];
  const groups     = data.media_groups || [];

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

// ── Theme (dark / light) ───────────────────────────────────────
(function () {
  const STORAGE_KEY = 'cv-theme';
  const html = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');

  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      icon.textContent = '☾';
    } else {
      html.removeAttribute('data-theme');
      icon.textContent = '☀';
    }
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
  const form      = document.getElementById('contact-form');
  const status    = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const key       = data.contact?.web3forms_key;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!key || key === 'YOUR_ACCESS_KEY') {
      showStatus('Form not configured — paste your Web3Forms key into data.json.', 'warn');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const fd = new FormData(form);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: key,
          name:       fd.get('name'),
          email:      fd.get('email'),
          message:    fd.get('message'),
          subject:    `CV site — message from ${fd.get('name')}`,
          from_name:  'Anton Putintsev CV',
          botcheck:   fd.get('botcheck'),
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        showStatus("Message sent — I'll get back to you soon.", 'ok');
        form.reset();
      } else {
        throw new Error(json.message || 'Unknown error');
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

  const COUNT        = data.particles?.count         ?? 220;
  const REPEL_RADIUS = data.particles?.repelRadius   ?? 90;
  const REPEL_STR    = data.particles?.repelStrength ?? 4;
  const SPRING       = data.particles?.spring        ?? 0.06;
  const DAMPING      = data.particles?.damping       ?? 0.82;
  const DOT_R        = data.particles?.dotRadius     ?? 1.5;

  let dots = [], mouse = { x: -9999, y: -9999 };

  function dotColor() {
    const hasBg  = header.classList.contains('has-bg-image');
    const isDark = document.documentElement.dataset.theme === 'dark';
    if (hasBg)  return 'rgba(255, 255, 255, 0.40)';
    if (isDark) return 'rgba(174, 174, 178, 0.28)';
    return              'rgba(110, 110, 115, 0.22)';
  }

  function buildDots() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr, h = canvas.height / dpr;
    dots = [];
    const cols = Math.ceil(Math.sqrt(COUNT * (w / h)));
    const rows = Math.ceil(COUNT / cols);
    const cw = w / cols, ch = h / rows;
    for (let r = 0; r < rows && dots.length < COUNT; r++) {
      for (let c = 0; c < cols && dots.length < COUNT; c++) {
        const hx = (c + 0.2 + Math.random() * 0.6) * cw;
        const hy = (r + 0.2 + Math.random() * 0.6) * ch;
        dots.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0 });
      }
    }
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = header.offsetWidth  * dpr;
    canvas.height = header.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    buildDots();
  }

  function tick() {
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr, H = canvas.height / dpr;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = dotColor();
    for (const d of dots) {
      const dx = d.x - mouse.x, dy = d.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < REPEL_RADIUS && dist > 0) {
        const force = (1 - dist / REPEL_RADIUS);
        d.vx += (dx / dist) * force * REPEL_STR;
        d.vy += (dy / dist) * force * REPEL_STR;
      }
      d.vx += (d.hx - d.x) * SPRING;
      d.vy += (d.hy - d.y) * SPRING;
      d.vx *= DAMPING;
      d.vy *= DAMPING;
      d.x  += d.vx;
      d.y  += d.vy;
      ctx.beginPath();
      ctx.arc(d.x, d.y, DOT_R, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  header.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  header.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
  window.addEventListener('resize', resize);

  resize();
  tick();
}
