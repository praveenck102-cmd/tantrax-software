/**
 * TANTRAX – Modern Software, Web Applications and AI Solutions
 * Script: script.js
 * Vanilla JavaScript implementation (JSON-driven, Component-like modular structure)
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  // Load data from data.json or fallback
  let appData = null;
  try {
    const res = await fetch('./data.json');
    if (res.ok) {
      appData = await res.json();
    }
  } catch (err) {
    console.warn('Could not fetch data.json, using fallback data.', err);
  }

  // Fallback data in case of strict origin/fetch constraints
  if (!appData) {
    appData = getFallbackData();
  }

  const company = appData.company || appData.brand || {};
  const services = appData.services || [];
  const problems = appData.problems || appData.problemSolutions || [];
  const processSteps = appData.processDetails || appData.process || appData.howWeBuild || [];
  const techStack = appData.technologyDetails || appData.technologies || [];

  // Initialize UI modules
  initEmojiIntro();
  initParticleCanvas();
  initNavigation();
  renderProblemSolutions(problems);
  renderServices(services);
  renderProcess(processSteps);
  renderWhyTantrax(appData.whyTantrax);
  renderProjects(appData.projects);
  renderPricing(appData.pricing);
  renderTechStack(techStack);
  renderFAQ(appData.faq);
  initContactForm();
  initProfileEnquiryModal();
  initScrollAnimations();
  initRealCounters();
  initMobileBottomNav();
}

/**
 * Particle Canvas Animation for Tech Background
 */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = Math.min(window.innerHeight, 900));

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = Math.min(window.innerHeight, 900);
  });

  const particleCount = Math.min(Math.floor(width / 24), 45);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 0.8,
      isOrange: Math.random() > 0.85
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / 110) * 0.12;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.isOrange ? 'rgba(249, 115, 22, 0.7)' : 'rgba(34, 211, 238, 0.6)';
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

/**
 * Sticky Navigation & Mobile Drawer
 */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .scroll-trigger');

  // Sticky header background transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // Mobile Drawer Toggle
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    // Close on backdrop click
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        closeDrawer();
      }
    });

    // Close on drawer-close-btn
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeDrawer);
    }
  }

  function openDrawer() {
    drawer?.classList.add('open');
    toggleBtn?.classList.add('is-active');
    toggleBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer?.classList.remove('open');
    toggleBtn?.classList.remove('is-active');
    toggleBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Smooth scroll handler for anchor links
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          closeDrawer();
          const headerHeight = header ? header.offsetHeight : 80;
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Active link highlighter on scroll
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach((lnk) => {
          lnk.classList.remove('active');
          if (lnk.getAttribute('href') === `#${id}`) {
            lnk.classList.add('active');
          }
        });
      }
    });
  }

  // Back to Top button
  const btt = document.getElementById('back-to-top');
  if (btt) {
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}



/**
 * Render Real Problems -> TANTRAX Solutions
 */
function renderProblemSolutions(pairs) {
  const container = document.getElementById('problem-solutions-grid');
  const filterContainer = document.getElementById('ps-filters');
  if (!container || !pairs) return;

  const categories = [
    { key: 'all', label: 'All Real-World Scenarios' },
    { key: 'operations', label: 'Operations & Workflows' },
    { key: 'customer', label: 'CRM & Scheduling' },
    { key: 'data-ai', label: 'Data & AI Automation' }
  ];

  if (filterContainer) {
    filterContainer.innerHTML = categories
      .map(
        (c, idx) => `
      <button class="ps-filter-btn ${idx === 0 ? 'active' : ''}" data-filter="${c.key}" type="button">
        ${c.label}
      </button>
    `
      )
      .join('');

    filterContainer.querySelectorAll('.ps-filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        filterContainer.querySelectorAll('.ps-filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter') || 'all';
        filterCards(filter);
      });
    });
  }

  function filterCards(filter) {
    const cards = container.querySelectorAll('.ps-card');
    cards.forEach((card) => {
      const cat = card.getAttribute('data-category');
      if (filter === 'all' || cat === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function getCategoryForIndex(idx) {
    if (idx === 0 || idx === 3) return 'operations';
    if (idx === 2) return 'customer';
    return 'data-ai';
  }

  container.innerHTML = pairs
    .map((item, idx) => {
      const cat = item.category || getCategoryForIndex(idx);
      const problemDetail = item.problemDetail || `Operational bottleneck causing delays and unorganized data.`;
      const solutionDetail = item.solutionDetail || `Purpose-built software solution engineered for real business impact.`;
      return `
      <div class="ps-card reveal-on-scroll" data-category="${cat}">
        <div class="ps-split-container">
          <!-- Problem Box -->
          <div class="ps-friction-box">
            <div class="ps-friction-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Operational Friction
            </div>
            <h3 class="ps-friction-title">${escapeHtml(item.problem)}</h3>
            <p class="ps-friction-detail">${escapeHtml(problemDetail)}</p>
          </div>

          <!-- Divider -->
          <div class="ps-arrow-divider">
            <div class="ps-arrow-circle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
            </div>
          </div>

          <!-- Solution Box -->
          <div class="ps-solution-box">
            <div class="ps-solution-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              TANTRAX Solution
            </div>
            <h4 class="ps-solution-title">${escapeHtml(item.solution)}</h4>
            <p class="ps-solution-detail">${escapeHtml(solutionDetail)}</p>
          </div>
        </div>
      </div>
    `;
    })
    .join('');
}

/**
 * Render Services Grid
 */
function renderServices(services) {
  const container = document.getElementById('services-grid');
  if (!container || !services) return;

  const icons = {
    globe: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    monitor: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    layout: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
    smartphone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
    brain: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"/></svg>`,
    cpu: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`,
    palette: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/></svg>`,
    cloud: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
    code: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    network: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><line x1="12" y1="12" x2="12" y2="8"/></svg>`,
    'shield-check': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`
  };

  container.innerHTML = services
    .map(
      (srv) => {
        const desc = srv.description || srv.summary || '';
        const deliverables = srv.deliverables || [];
        return `
      <div class="service-card reveal-on-scroll" id="service-${escapeHtml(srv.title.toLowerCase().replace(/[^a-z0-9]/g, '-'))}">
        <div>
          <div class="service-icon-wrapper">
            ${icons[srv.icon] || icons.globe}
          </div>
          <h3 class="service-title">${escapeHtml(srv.title)}</h3>
          <p class="service-summary">${escapeHtml(desc)}</p>
        </div>

        <div>
          ${
            deliverables.length > 0
              ? `
          <ul class="service-deliverables-list">
            ${deliverables
              .map(
                (d) => `
              <li class="service-deliverable-item">
                <span class="deliverable-check">✓</span>
                <span>${escapeHtml(d)}</span>
              </li>
            `
              )
              .join('')}
          </ul>
          `
              : ''
          }

          <button class="service-action-btn" data-service="${escapeHtml(srv.title)}" type="button">
            <span>Request Consultation</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
    `;
      }
    )
    .join('');

  // Service CTA click pre-fills the form
  container.querySelectorAll('.service-action-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const srvName = btn.getAttribute('data-service');
      const projectTypeSelect = document.getElementById('project-type');
      if (projectTypeSelect && srvName) {
        // Find best match in select
        for (let i = 0; i < projectTypeSelect.options.length; i++) {
          if (srvName.toLowerCase().includes(projectTypeSelect.options[i].text.toLowerCase().slice(0, 5))) {
            projectTypeSelect.selectedIndex = i;
            break;
          }
        }
      }
      // Scroll to contact form
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/**
 * Render 6-Step Build Process
 */
function renderProcess(steps) {
  const container = document.getElementById('process-grid');
  if (!container || !steps) return;

  const defaultDescriptions = {
    Discover: 'We analyze your requirements, identify operational bottlenecks, and map out strategic technical milestones.',
    Design: 'Architecting clean database schemas, secure API contracts, and high-converting UI/UX interfaces.',
    Develop: 'Agile full-stack engineering utilizing modern frameworks, clean code principles, and strict typing.',
    Test: 'Rigorous cross-device testing, edge-case validation, OWASP security audits, and performance QA.',
    Deploy: 'Containerized release pipelines, CDN caching, SSL certificates, and zero-downtime production launch.',
    Support: 'Continuous SLA-backed maintenance, server health monitoring, security patches, and scalable evolution.'
  };

  container.innerHTML = steps
    .map((step, idx) => {
      const isObj = typeof step === 'object';
      const stepNum = isObj ? step.step : `0${idx + 1}`;
      const name = isObj ? step.name : step;
      const title = isObj ? step.title : `${step} Phase`;
      const desc = isObj ? step.description : (defaultDescriptions[step] || 'Agile engineering lifecycle stage.');
      return `
      <div class="process-card reveal-on-scroll">
        <div class="process-top-row">
          <span class="process-step-num">${escapeHtml(stepNum)}</span>
          <span class="process-step-badge">${escapeHtml(name)}</span>
        </div>
        <h3 class="process-title">${escapeHtml(title)}</h3>
        <p class="process-desc">${escapeHtml(desc)}</p>
      </div>
    `;
    })
    .join('');
}

/**
 * Render Why TANTRAX Pillars
 */
function renderWhyTantrax(pillars) {
  const container = document.getElementById('why-grid');
  if (!container || !pillars) return;

  const icons = [
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
  ];

  container.innerHTML = pillars
    .map(
      (item, idx) => `
      <div class="why-card reveal-on-scroll">
        <div class="why-icon">
          ${icons[idx % icons.length]}
        </div>
        <h3 class="why-title">${escapeHtml(item.title)}</h3>
        <p class="why-desc">${escapeHtml(item.description)}</p>
      </div>
    `
    )
    .join('');
}

/**
 * Render Project Showcase Cards
 */
function renderProjects(projects) {
  const container = document.getElementById('showcase-grid');
  if (!container || !projects) return;

  container.innerHTML = projects
    .map(
      (p) => `
      <div class="project-card reveal-on-scroll">
        <div class="project-card-top">
          <span class="project-category">${escapeHtml(p.category)}</span>
          <span class="project-badge">
            <span class="badge-dot"></span>
            ${escapeHtml(p.tag || 'Production System')}
          </span>
        </div>

        <div class="project-body">
          <h3 class="project-title">${escapeHtml(p.title)}</h3>
          <p class="project-desc">${escapeHtml(p.description)}</p>

          <div class="project-stats-grid">
            ${p.stats
              .map(
                (s) => `
              <div class="p-stat-box">
                <span class="p-stat-val">${escapeHtml(s.value)}</span>
                <span class="p-stat-lbl">${escapeHtml(s.label)}</span>
              </div>
            `
              )
              .join('')}
          </div>

          <div class="project-tech-tags">
            ${p.tags.map((t) => `<span class="tech-tag-pill">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
      </div>
    `
    )
    .join('');
}

/**
 * Render Pricing Plans (Clearly Indicative & Customizable)
 */
function renderPricing(plans) {
  const container = document.getElementById('pricing-grid');
  if (!container || !plans) return;

  container.innerHTML = plans
    .map(
      (plan) => `
      <div class="pricing-card ${plan.popular ? 'featured' : ''} reveal-on-scroll">
        ${plan.popular ? `<div class="pricing-badge-top">${escapeHtml(plan.badge)}</div>` : ''}

        <h3 class="plan-name">${escapeHtml(plan.name)}</h3>
        <p class="plan-desc">${escapeHtml(plan.description)}</p>

        <div class="plan-price-block">
          <div class="price-main">${escapeHtml(plan.startingPrice)}</div>
          <div class="price-alt">${escapeHtml(plan.altPrice)}</div>
          <div class="price-period">${escapeHtml(plan.period)}</div>
        </div>

        <ul class="plan-features-list">
          ${plan.features
            .map(
              (f) => `
            <li class="plan-feature-item">
              <span class="plan-feature-check">✓</span>
              <span>${escapeHtml(f)}</span>
            </li>
          `
            )
            .join('')}
        </ul>

        <button 
          class="btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} select-plan-btn" 
          data-plan="${escapeHtml(plan.name)}" 
          type="button">
          ${escapeHtml(plan.cta)}
        </button>

        <p class="pricing-note">${escapeHtml(plan.note)}</p>
      </div>
    `
    )
    .join('');

  container.querySelectorAll('.select-plan-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan');
      const budgetSelect = document.getElementById('budget');
      const messageTextarea = document.getElementById('message');

      if (budgetSelect && planName) {
        if (planName.includes('Starter')) budgetSelect.value = 'Starter (< ₹50,000 / $600)';
        else if (planName.includes('Business')) budgetSelect.value = 'Business (₹50,000 - ₹1,50,000 / $1K - $2.5K)';
        else budgetSelect.value = 'Enterprise (₹1,50,000+ / $2.5K+)';
      }

      if (messageTextarea && planName) {
        messageTextarea.value = `Hi TANTRAX, I am interested in the ${planName} package for our upcoming project. Please get in touch.`;
      }

      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/**
 * Render Tech Stack Grid
 */
function renderTechStack(techs) {
  const container = document.getElementById('tech-grid');
  if (!container || !techs) return;

  const defaultTechCategories = {
    HTML: { category: 'Frontend', desc: 'Semantic, accessible structural markup for high-performance interfaces' },
    CSS: { category: 'Styling', desc: 'Modern responsive CSS design systems with custom tokens & micro-interactions' },
    JavaScript: { category: 'Core Language', desc: 'Modern ESNext asynchronous runtime powering client and server logic' },
    React: { category: 'Frontend Framework', desc: 'Reactive, modular component architectures with optimized state management' },
    'Node.js': { category: 'Backend Runtime', desc: 'High-throughput asynchronous server microservices and scalable event loops' },
    Python: { category: 'AI & Backend', desc: 'Data processing pipelines, machine learning integration, and automation' },
    PostgreSQL: { category: 'Relational Database', desc: 'ACID-compliant relational data modeling with rock-solid transactional safety' },
    MongoDB: { category: 'NoSQL Database', desc: 'Flexible schema document storage optimized for high-velocity applications' },
    'REST API': { category: 'Architecture', desc: 'Standardized, secured API contracts connecting distributed services cleanly' },
    Cloud: { category: 'DevOps & Hosting', desc: 'Containerized infrastructure, CI/CD automated deployments, and autoscaling' },
    AI: { category: 'Intelligence', desc: 'Enterprise LLMs, prompt pipelines, neural search, and cognitive automations' }
  };

  container.innerHTML = techs
    .map((t) => {
      const isObj = typeof t === 'object';
      const name = isObj ? t.name : t;
      const cat = isObj ? t.category : defaultTechCategories[t]?.category || 'Core Technology';
      const desc = isObj ? t.desc : defaultTechCategories[t]?.desc || 'Production-grade technology';
      return `
      <div class="tech-box reveal-on-scroll">
        <span class="tech-category-lbl">${escapeHtml(cat)}</span>
        <h4 class="tech-name">${escapeHtml(name)}</h4>
        <p class="tech-desc">${escapeHtml(desc)}</p>
      </div>
    `;
    })
    .join('');
}

/**
 * Render FAQ Accordion
 */
function renderFAQ(faqs) {
  const container = document.getElementById('faq-list');
  if (!container || !faqs) return;

  container.innerHTML = faqs
    .map(
      (item, idx) => `
      <div class="faq-item reveal-on-scroll">
        <button class="faq-question-btn" type="button" aria-expanded="${idx === 0 ? 'true' : 'false'}" id="faq-btn-${idx}">
          <span>${escapeHtml(item.question)}</span>
          <svg class="faq-icon-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="faq-answer-pane" id="faq-pane-${idx}" aria-labelledby="faq-btn-${idx}">
          <p class="faq-answer-text">${escapeHtml(item.answer)}</p>
        </div>
      </div>
    `
    )
    .join('');

  // Make first FAQ active by default
  const items = container.querySelectorAll('.faq-item');
  if (items[0]) {
    items[0].classList.add('active');
  }

  items.forEach((item) => {
    const btn = item.querySelector('.faq-question-btn');
    btn?.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');

      // Close all others
      items.forEach((other) => {
        other.classList.remove('active');
        other.querySelector('.faq-question-btn')?.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isCurrentlyActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Mobile Phone Number Auto-Formatter & Validator
 * Handles +91 10-digit mobile numbers with clean spacing,
 * international codes (+1, +44, +971, etc.), live badge feedback,
 * and standard international E.164 formatting.
 */
function setupMobilePhoneInput(countrySelectId, phoneInputId, hiddenFormattedId, errorSpanId, validIndicatorId) {
  const countrySelect = document.getElementById(countrySelectId);
  const phoneInput = document.getElementById(phoneInputId);
  const hiddenInput = document.getElementById(hiddenFormattedId);
  const errorSpan = document.getElementById(errorSpanId);
  const validIndicator = document.getElementById(validIndicatorId);

  if (!phoneInput) return () => ({ isComplete: false, digits: '', fullInternational: '', cleanNumber: '' });

  function formatAndValidate() {
    const countryCode = countrySelect ? countrySelect.value : '+91';
    let rawVal = phoneInput.value;

    // Extract digits only
    let digits = rawVal.replace(/\D/g, '');

    // Strip accidental user-typed country code inside the input box
    if (countryCode === '+91' && digits.startsWith('91') && digits.length > 10) {
      digits = digits.slice(2);
    } else if (countryCode === '+1' && digits.startsWith('1') && digits.length > 10) {
      digits = digits.slice(1);
    } else if (countryCode === '+44' && digits.startsWith('44') && digits.length > 10) {
      digits = digits.slice(2);
    } else if (countryCode === '+971' && digits.startsWith('971') && digits.length > 9) {
      digits = digits.slice(3);
    }

    // Strip leading 0 for national numbers
    if (countryCode === '+91' && digits.startsWith('0') && digits.length > 10) {
      digits = digits.slice(1);
    }

    let formattedDisplay = '';
    let isComplete = false;

    if (countryCode === '+91') {
      // 10 digits for Indian Mobile: 5 + 5 (e.g. 98765 43210)
      if (digits.length <= 5) {
        formattedDisplay = digits;
      } else {
        formattedDisplay = digits.slice(0, 5) + ' ' + digits.slice(5, 10);
      }
      isComplete = digits.length === 10 && /^[6-9]/.test(digits);
      if (digits.length > 0 && !/^[6-9]/.test(digits) && errorSpan) {
        errorSpan.textContent = 'Indian mobile numbers start with 6, 7, 8, or 9.';
      }
    } else if (countryCode === '+1') {
      // 10 digits for US/Canada: (123) 456-7890
      if (digits.length <= 3) {
        formattedDisplay = digits;
      } else if (digits.length <= 6) {
        formattedDisplay = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else {
        formattedDisplay = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
      isComplete = digits.length === 10;
    } else {
      // General international format: 4 + 4 + ...
      if (digits.length <= 4) {
        formattedDisplay = digits;
      } else if (digits.length <= 8) {
        formattedDisplay = digits.slice(0, 4) + ' ' + digits.slice(4);
      } else {
        formattedDisplay = digits.slice(0, 4) + ' ' + digits.slice(4, 8) + ' ' + digits.slice(8, 14);
      }
      isComplete = digits.length >= 7 && digits.length <= 15;
    }

    phoneInput.value = formattedDisplay;

    const fullInternational = `${countryCode} ${formattedDisplay}`.trim();
    if (hiddenInput) {
      hiddenInput.value = fullInternational;
    }

    const wrapper = phoneInput.closest('.mobile-input-wrapper');

    if (isComplete) {
      if (validIndicator) {
        validIndicator.innerHTML = '✓ Valid Mobile Format';
        validIndicator.style.display = 'inline-flex';
      }
      if (errorSpan && (errorSpan.textContent.includes('mobile') || errorSpan.textContent.includes('phone') || errorSpan.textContent.includes('Indian'))) {
        errorSpan.textContent = '';
      }
      phoneInput.classList.remove('input-error');
      if (wrapper) wrapper.classList.remove('input-error');
    } else {
      if (validIndicator) {
        validIndicator.innerHTML = '';
        validIndicator.style.display = 'none';
      }
    }

    const cleanNumericCode = countryCode.replace(/\D/g, '');
    const cleanNumber = (cleanNumericCode ? cleanNumericCode : '') + digits;

    return {
      digits,
      formattedDisplay,
      fullInternational,
      isComplete,
      cleanNumber
    };
  }

  phoneInput.addEventListener('input', formatAndValidate);
  phoneInput.addEventListener('blur', formatAndValidate);
  if (countrySelect) {
    countrySelect.addEventListener('change', () => {
      formatAndValidate();
      phoneInput.focus();
    });
  }

  return formatAndValidate;
}

/**
 * Form Validation & Client-side submission handling
 */
function initContactForm() {
  const form = document.getElementById('tantrax-contact-form');
  const alertBox = document.getElementById('form-success-alert');
  const messageInput = document.getElementById('message');
  const charCount = document.getElementById('char-count');

  // Input references at outer function scope so all handlers can access them reliably
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const phoneEl = document.getElementById('phone');
  const countryCodeEl = document.getElementById('country-code');
  const companyEl = document.getElementById('company');
  const projectTypeEl = document.getElementById('project-type');
  const budgetEl = document.getElementById('budget');

  // Initialize mobile phone auto-formatting & validation
  const checkMobileFormat = setupMobilePhoneInput(
    'country-code',
    'phone',
    'formatted-full-mobile',
    'phone-error',
    'phone-valid-indicator'
  );

  if (messageInput && charCount) {
    messageInput.addEventListener('input', () => {
      charCount.textContent = `${messageInput.value.length} / 500`;
    });
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validation rules
    function setError(input, errorId, msg) {
      input?.classList.add('input-error');
      const wrapper = input?.closest('.mobile-input-wrapper');
      if (wrapper) wrapper.classList.add('input-error');
      const errSpan = document.getElementById(errorId);
      if (errSpan) errSpan.textContent = msg;
      isValid = false;
    }

    function clearError(input, errorId) {
      input?.classList.remove('input-error');
      const wrapper = input?.closest('.mobile-input-wrapper');
      if (wrapper) wrapper.classList.remove('input-error');
      const errSpan = document.getElementById(errorId);
      if (errSpan) errSpan.textContent = '';
    }

    // Name validation
    if (!nameEl?.value.trim()) {
      setError(nameEl, 'name-error', 'Please provide your full name.');
    } else {
      clearError(nameEl, 'name-error');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailEl?.value.trim() || !emailRegex.test(emailEl.value.trim())) {
      setError(emailEl, 'email-error', 'Please enter a valid business email.');
    } else {
      clearError(emailEl, 'email-error');
    }

    // Mobile Phone validation
    const mobileStatus = checkMobileFormat();
    if (!mobileStatus.isComplete) {
      const code = countryCodeEl ? countryCodeEl.value : '+91';
      if (code === '+91') {
        setError(phoneEl, 'phone-error', 'Please provide a valid 10-digit mobile number (e.g. 98765 43210).');
      } else {
        setError(phoneEl, 'phone-error', 'Please enter a valid mobile number with country code.');
      }
    } else {
      clearError(phoneEl, 'phone-error');
    }

    // Message validation
    if (!messageInput?.value.trim() || messageInput.value.trim().length < 15) {
      setError(messageInput, 'message-error', 'Please describe your project scope (minimum 15 characters).');
    } else {
      clearError(messageInput, 'message-error');
    }

    if (!isValid) return;

    // Process submission state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Send Project Inquiry';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
        <span>Routing to contacttantraxtech@gmail.com...</span>
      `;
    }

    // Extract inquiry details
    const clientName = nameEl?.value.trim() || 'Valued Client';
    const clientEmail = emailEl?.value.trim() || '';
    const clientMobile = mobileStatus.fullInternational || phoneEl?.value.trim() || '';
    const clientMobileDigits = mobileStatus.cleanNumber || clientMobile.replace(/\D/g, '');
    const clientCompany = companyEl?.value.trim() || 'Direct Client / Private Entity';
    const projectType = projectTypeEl?.value || 'Custom Web Application';
    const budget = budgetEl?.value || 'Business (Starting from ₹20,000 / ~$249)';
    const projectMessage = messageInput?.value.trim() || '';

    // Generate unique Lead Reference ID and Timestamp
    const leadRef = 'TNX-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const formattedTimestamp = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Asia/Kolkata'
    }).format(now) + ' (IST)';

    // Build Mobile-Formatted Lead Card for developer inbox (contacttantraxtech@gmail.com)
    const structuredSummary = [
      '📱 TANTRAX INBOUND LEAD — MOBILE FORMATTED',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `⭐ REFERENCE ID : ${leadRef}`,
      `📅 DATE & TIME  : ${formattedTimestamp}`,
      `🎯 RECIPIENT    : contacttantraxtech@gmail.com`,
      `⚡ LEAD PRIORITY: HIGH — Inbound Project Request`,
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '👤 CLIENT CONTACT & MOBILE DETAILS',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `• Client Name   : ${clientName}`,
      `• Mobile Number : ${clientMobile}`,
      `• Business Email: ${clientEmail} (Reply-To enabled)`,
      `• Organization  : ${clientCompany}`,
      '',
      '⚡ ONE-TAP SMARTPHONE QUICK ACTIONS:',
      `• 📞 Tap to Call Client   : tel:+${clientMobileDigits}`,
      `• 💬 Tap to WhatsApp Chat : https://wa.me/${clientMobileDigits}`,
      `• ✉️ Tap to Reply Email   : mailto:${clientEmail}`,
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '💼 PROJECT SPECIFICATIONS',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `• Category      : ${projectType}`,
      `• Indicative Tier: ${budget}`,
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '📋 PROJECT BRIEF & GOALS',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      projectMessage,
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '💡 Direct reply enabled: Click "Reply" in your email client to message ' + clientEmail + ' directly.',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    ].join('\n');

    // Update FormSubmit hidden parameters for recipient inbox
    const subjectInput = document.getElementById('contact-form-subject');
    if (subjectInput) {
      subjectInput.value = `🔥 [TANTRAX LEAD] ${clientName} (${clientMobile}) — ${projectType}`;
    }

    const replyToInput = document.getElementById('contact-form-replyto');
    if (replyToInput) {
      replyToInput.value = clientEmail;
    }

    const refInput = document.getElementById('contact-field-ref');
    if (refInput) refInput.value = leadRef;

    const timeInput = document.getElementById('contact-field-time');
    if (timeInput) timeInput.value = formattedTimestamp;

    const summaryInput = document.getElementById('contact-field-summary');
    if (summaryInput) summaryInput.value = structuredSummary;

    // Formulate direct dispatch links for guaranteed delivery to contacttantraxtech@gmail.com
    const emailSubject = `🔥 [TANTRAX LEAD] ${clientName} (${clientMobile}) — ${projectType}`;
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=contacttantraxtech@gmail.com&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(structuredSummary)}`;
    const mailtoComposeUrl = `mailto:contacttantraxtech@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(structuredSummary)}`;
    const whatsappUrl = `https://wa.me/918838178638?text=${encodeURIComponent(
      `Hello TANTRAX Team,\n\nI have submitted a project inquiry:\n\n*Reference:* ${leadRef}\n*Client Name:* ${clientName}\n*Mobile:* ${clientMobile}\n*Email:* ${clientEmail}\n*Company:* ${clientCompany}\n*Project Type:* ${projectType}\n*Budget:* ${budget}\n\n*Brief:* ${projectMessage}\n\nPlease review and connect.`
    )}`;

    // 1. Deliver directly to contacttantraxtech@gmail.com via hidden iframe gateway
    try {
      form.submit();
    } catch (err) {
      console.warn('Gateway form frame submission handled', err);
    }

    // 2. Dual background async dispatch to FormSubmit API
    try {
      fetch('https://formsubmit.co/ajax/contacttantraxtech@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          _subject: emailSubject,
          _replyto: clientEmail,
          _template: 'table',
          Inquiry_Reference_ID: leadRef,
          Submission_Time: formattedTimestamp,
          Recipient_Inbox: 'contacttantraxtech@gmail.com',
          Client_Full_Name: clientName,
          Client_Mobile_Formatted: clientMobile,
          Client_Email: clientEmail,
          Tap_To_Call_Client: `tel:+${clientMobileDigits}`,
          Tap_To_WhatsApp_Client: `https://wa.me/${clientMobileDigits}`,
          Company_Name: clientCompany,
          Project_Category: projectType,
          Indicative_Budget: budget,
          Project_Brief: projectMessage,
          Mobile_Formatted_Summary: structuredSummary
        })
      }).catch(() => {});
    } catch (e) {
      // primary delivery handled by form submission iframe
    }

    // Render detailed confirmation card
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }

      if (alertBox) {
        alertBox.classList.add('show');
        
        // Populate confirmed lead fields
        const alertName = document.getElementById('success-client-name');
        if (alertName) alertName.textContent = clientName;

        const refCodeEl = document.getElementById('success-ref-id');
        if (refCodeEl) refCodeEl.textContent = leadRef;

        const mobileValEl = document.getElementById('success-client-phone');
        if (mobileValEl) mobileValEl.textContent = clientMobile;

        const emailValEl = document.getElementById('success-client-email');
        if (emailValEl) emailValEl.textContent = clientEmail;

        const projectValEl = document.getElementById('success-client-project');
        if (projectValEl) projectValEl.textContent = projectType;

        const budgetValEl = document.getElementById('success-client-budget');
        if (budgetValEl) budgetValEl.textContent = budget;

        // Configure Gmail Direct Send button
        const gmailBtn = document.getElementById('btn-gmail-direct');
        if (gmailBtn) {
          gmailBtn.href = gmailComposeUrl;
        }

        // Configure Mailto Default App button
        const mailtoBtn = document.getElementById('btn-mailto-backup');
        if (mailtoBtn) {
          mailtoBtn.href = mailtoComposeUrl;
        }

        // Configure WhatsApp Direct Send button
        const waBtn = document.getElementById('btn-whatsapp-backup');
        if (waBtn) {
          waBtn.href = whatsappUrl;
        }

        // Configure Copy Summary button
        const copyBtn = document.getElementById('btn-copy-inquiry');
        const copyText = document.getElementById('copy-btn-text');
        if (copyBtn) {
          copyBtn.onclick = () => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(structuredSummary).then(() => {
                if (copyText) copyText.textContent = '✓ Copied Summary!';
                setTimeout(() => {
                  if (copyText) copyText.textContent = 'Copy Submission Summary';
                }, 2500);
              });
            }
          };
        }

        // Configure Reset / Submit Another button
        const resetBtn = document.getElementById('btn-reset-form');
        if (resetBtn) {
          resetBtn.onclick = () => {
            alertBox.classList.remove('show');
            form.style.display = 'block';
            form.reset();
            if (charCount) charCount.textContent = '0 / 500';
            const validInd = document.getElementById('phone-valid-indicator');
            if (validInd) validInd.textContent = '';
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
          };
        }

        form.style.display = 'none';
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (charCount) charCount.textContent = '0 / 500';
    }, 600);
  });

  // Wire up Quick WhatsApp Dispatch button on the form
  const quickWaBtn = document.getElementById('btn-whatsapp-quick');
  if (quickWaBtn) {
    quickWaBtn.addEventListener('click', () => {
      const cName = nameEl?.value.trim() || 'Client';
      const cPhone = phoneEl?.value.trim() || 'Not specified';
      const cType = projectTypeEl?.value || 'Custom Web Application';
      const cMsg = messageInput?.value.trim() || 'Hello, I would like to inquire about software development services.';
      const quickWaUrl = `https://wa.me/918838178638?text=${encodeURIComponent(
        `Hello TANTRAX Team,\n\n*Name:* ${cName}\n*Phone:* ${cPhone}\n*Project Type:* ${cType}\n*Brief:* ${cMsg}\n\nPlease connect with me.`
      )}`;
      const link = document.createElement('a');
      link.href = quickWaUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}

/**
 * Dedicated Profile Enquiry Modal
 * Routes profile enquiries automatically to contacttantraxtech@gmail.com with formatted brief
 */
function initProfileEnquiryModal() {
  const modalOverlay = document.getElementById('profile-modal-overlay');
  const closeBtn = document.getElementById('profile-modal-close-btn');
  const modalForm = document.getElementById('profile-enquiry-form');
  const modalTitle = document.getElementById('profile-modal-title');
  const modalBadge = document.getElementById('profile-modal-badge');
  const hiddenTarget = document.getElementById('modal-hidden-target');
  const hiddenSubject = document.getElementById('modal-hidden-subject');
  const successAlert = document.getElementById('profile-modal-success');
  const successTarget = document.getElementById('profile-success-target');
  const openButtons = document.querySelectorAll('.open-profile-enquiry-btn');

  if (!modalOverlay || !modalForm) return;

  function closeModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    if (successAlert) successAlert.classList.remove('show');
    modalForm.style.display = 'block';
  }

  function openModal(partnerName, partnerRole) {
    if (modalTitle) modalTitle.textContent = `Enquiry for ${partnerName}`;
    if (modalBadge) modalBadge.textContent = `${partnerName} • ${partnerRole}`;
    if (hiddenTarget) hiddenTarget.value = `${partnerName} (${partnerRole})`;
    if (hiddenSubject) hiddenSubject.value = `💼 [TANTRAX EXECUTIVE] Direct Inquiry for ${partnerName}`;
    if (successTarget) successTarget.textContent = partnerName;

    modalForm.reset();
    if (successAlert) successAlert.classList.remove('show');
    modalForm.style.display = 'block';

    const errElements = modalForm.querySelectorAll('.form-error-msg');
    errElements.forEach((el) => (el.textContent = ''));
    const validInd = document.getElementById('modal-phone-valid-indicator');
    if (validInd) validInd.textContent = '';

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');

    const firstInput = document.getElementById('modal-client-name');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  }

  // Initialize modal mobile phone auto-formatting
  const checkModalMobile = setupMobilePhoneInput(
    'modal-country-code',
    'modal-client-phone',
    'modal-formatted-full-mobile',
    'modal-phone-error',
    'modal-phone-valid-indicator'
  );

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const partnerName = btn.getAttribute('data-partner-name') || 'Executive Lead';
      const partnerRole = btn.getAttribute('data-partner-role') || 'Partner';
      openModal(partnerName, partnerRole);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('modal-client-name');
    const emailInput = document.getElementById('modal-client-email');
    const phoneInput = document.getElementById('modal-client-phone');
    const countryCodeInput = document.getElementById('modal-country-code');
    const companyInput = document.getElementById('modal-client-company');
    const messageInput = document.getElementById('modal-client-message');
    const submitBtn = document.getElementById('modal-submit-btn');

    let isValid = true;

    function setModalError(input, id, msg) {
      const err = document.getElementById(id);
      if (err) err.textContent = msg;
      if (input) input.classList.add('input-error');
      const wrapper = input?.closest('.mobile-input-wrapper');
      if (wrapper) wrapper.classList.add('input-error');
      isValid = false;
    }

    function clearModalError(input, id) {
      const err = document.getElementById(id);
      if (err) err.textContent = '';
      if (input) input.classList.remove('input-error');
      const wrapper = input?.closest('.mobile-input-wrapper');
      if (wrapper) wrapper.classList.remove('input-error');
    }

    if (!nameInput?.value.trim()) {
      setModalError(nameInput, 'modal-name-error', 'Please enter your full name.');
    } else {
      clearModalError(nameInput, 'modal-name-error');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput?.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      setModalError(emailInput, 'modal-email-error', 'Please provide a valid business email.');
    } else {
      clearModalError(emailInput, 'modal-email-error');
    }

    // Mobile Phone Validation
    const modalMobileStatus = checkModalMobile();
    if (!modalMobileStatus.isComplete) {
      const code = countryCodeInput ? countryCodeInput.value : '+91';
      if (code === '+91') {
        setModalError(phoneInput, 'modal-phone-error', 'Please provide a valid 10-digit mobile number (e.g. 98765 43210).');
      } else {
        setModalError(phoneInput, 'modal-phone-error', 'Please enter a valid mobile number with country code.');
      }
    } else {
      clearModalError(phoneInput, 'modal-phone-error');
    }

    if (!messageInput?.value.trim() || messageInput.value.trim().length < 10) {
      setModalError(messageInput, 'modal-message-error', 'Please enter inquiry details (at least 10 characters).');
    } else {
      clearModalError(messageInput, 'modal-message-error');
    }

    if (!isValid) return;

    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Enquiry to Company Mail';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
        <span>Routing to contacttantraxtech@gmail.com...</span>
      `;
    }

    const cName = nameInput?.value.trim() || 'Client';
    const cEmail = emailInput?.value.trim() || '';
    const cMobile = modalMobileStatus.fullInternational || phoneInput?.value.trim() || '';
    const cMobileDigits = modalMobileStatus.cleanNumber || cMobile.replace(/\D/g, '');
    const cCompany = companyInput?.value.trim() || 'Direct Client / Private Entity';
    const cMessage = messageInput?.value.trim() || '';
    const targetLeader = hiddenTarget?.value || 'TANTRAX Executive Leadership';

    const execRef = 'TNX-EX-' + Math.floor(10000 + Math.random() * 90000);
    const execTimestamp = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Asia/Kolkata'
    }).format(new Date()) + ' (IST)';

    // Build Mobile-Formatted Summary for developer mailbox
    const execSummary = [
      '📱 TANTRAX EXECUTIVE CONSULTATION — MOBILE FORMATTED',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `⭐ REFERENCE ID      : ${execRef}`,
      `📅 DATE & TIME       : ${execTimestamp}`,
      `👤 TARGET EXECUTIVE  : ${targetLeader}`,
      `🎯 RECIPIENT INBOX   : contacttantraxtech@gmail.com`,
      `⚡ STATUS            : HIGH — Direct Executive Consultation`,
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '👤 CLIENT CONTACT & MOBILE DETAILS',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `• Client Name   : ${cName}`,
      `• Mobile Number : ${cMobile}`,
      `• Business Email: ${cEmail} (Reply-To enabled)`,
      `• Organization  : ${cCompany}`,
      '',
      '⚡ ONE-TAP SMARTPHONE QUICK ACTIONS:',
      `• 📞 Tap to Call Client   : tel:+${cMobileDigits}`,
      `• 💬 Tap to WhatsApp Chat : https://wa.me/${cMobileDigits}`,
      `• ✉️ Tap to Reply Email   : mailto:${cEmail}`,
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '💼 COLLABORATION BRIEF',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      cMessage,
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '💡 Direct reply enabled: Click "Reply" to message ' + cEmail + ' directly.',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    ].join('\n');

    // Update hidden fields
    const mSub = document.getElementById('modal-hidden-subject');
    if (mSub) mSub.value = `💼 [TANTRAX EXECUTIVE] Direct Inquiry for ${targetLeader} from ${cName} (${cMobile})`;

    const mReply = document.getElementById('modal-hidden-replyto');
    if (mReply) mReply.value = cEmail;

    const mRef = document.getElementById('modal-field-ref');
    if (mRef) mRef.value = execRef;

    const mTime = document.getElementById('modal-field-time');
    if (mTime) mTime.value = execTimestamp;

    const mSum = document.getElementById('modal-field-summary');
    if (mSum) mSum.value = execSummary;

    const execSubject = `💼 [TANTRAX EXECUTIVE] Direct Inquiry for ${targetLeader} from ${cName} (${cMobile})`;
    const mGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=contacttantraxtech@gmail.com&su=${encodeURIComponent(execSubject)}&body=${encodeURIComponent(execSummary)}`;
    const mWaUrl = `https://wa.me/918838178638?text=${encodeURIComponent(
      `Hello TANTRAX Team,\n\nExecutive Consultation Inquiry for *${targetLeader}*:\n\n*Reference:* ${execRef}\n*Name:* ${cName}\n*Mobile:* ${cMobile}\n*Email:* ${cEmail}\n*Company:* ${cCompany}\n\n*Brief:* ${cMessage}\n\nPlease review and connect.`
    )}`;

    // 1. Submit via form target iframe
    try {
      modalForm.submit();
    } catch (err) {
      console.warn('Modal form frame submit handled', err);
    }

    // 2. Dual background async post to FormSubmit
    try {
      fetch('https://formsubmit.co/ajax/contacttantraxtech@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          _subject: execSubject,
          _replyto: cEmail,
          _template: 'table',
          Inquiry_Reference_ID: execRef,
          Submission_Time: execTimestamp,
          Recipient_Inbox: 'contacttantraxtech@gmail.com',
          Target_Leadership: targetLeader,
          Client_Full_Name: cName,
          Client_Mobile_Formatted: cMobile,
          Client_Email: cEmail,
          Tap_To_Call_Client: `tel:+${cMobileDigits}`,
          Tap_To_WhatsApp_Client: `https://wa.me/${cMobileDigits}`,
          Company_Name: cCompany,
          Collaboration_Brief: cMessage,
          Mobile_Formatted_Summary: execSummary
        })
      }).catch(() => {});
    } catch (err) {
      // primary handled
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
      modalForm.style.display = 'none';

      if (successAlert) {
        successAlert.classList.add('show');
        
        const mRefEl = document.getElementById('modal-success-ref');
        if (mRefEl) mRefEl.textContent = execRef;

        const mLeadEl = document.getElementById('modal-success-lead-name');
        if (mLeadEl) mLeadEl.textContent = targetLeader;

        const mMobileEl = document.getElementById('modal-success-client-phone');
        if (mMobileEl) mMobileEl.textContent = cMobile;

        const mGmailBtn = document.getElementById('modal-gmail-direct');
        if (mGmailBtn) {
          mGmailBtn.href = mGmailUrl;
        }

        const mWaBtn = document.getElementById('modal-whatsapp-direct');
        if (mWaBtn) {
          mWaBtn.href = mWaUrl;
        }

        const copyBtn = document.getElementById('modal-copy-btn');
        const copyText = document.getElementById('modal-copy-text');
        if (copyBtn) {
          copyBtn.onclick = () => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(execSummary).then(() => {
                if (copyText) copyText.textContent = '✓ Copied!';
                setTimeout(() => {
                  if (copyText) copyText.textContent = 'Copy Summary';
                }, 2000);
              });
            }
          };
        }

        const closeConfirmBtn = document.getElementById('modal-close-confirm-btn');
        if (closeConfirmBtn) {
          closeConfirmBtn.onclick = closeModal;
        }
      }
    }, 600);
  });
}

/**
 * Scroll Animations using IntersectionObserver
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach((el) => observer.observe(el));
  } else {
    // Fallback if no observer
    elements.forEach((el) => el.classList.add('is-visible'));
  }
}

/**
 * Real numbers animated counter (only for provided/actual figures)
 */
function initRealCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    counterElements.forEach((el) => observer.observe(el));
  } else {
    counterElements.forEach((el) => {
      el.textContent = el.getAttribute('data-counter') || '';
    });
  }

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-counter') || '0');
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const isDecimal = target % 1 !== 0;

    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function update(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

      const current = start + (target - start) * easeProgress;
      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + (isDecimal ? target.toFixed(1) : target) + suffix;
      }
    }

    requestAnimationFrame(update);
  }
}

/**
 * Fallback Data
 */
function getFallbackData() {
  return {
    brand: {
      name: 'TANTRAX',
      legalName: 'TANTRAX Pvt. Ltd.',
      tagline: 'IDEAS TO IMPACT',
      phone: '8838178638',
      email: 'contacttantraxtech@gmail.com',
      location: 'Neyveli Block 1, Cuddalore, Tamil Nadu 607801'
    },
    services: [
      { id: 'custom-web-apps', title: 'Custom Web Applications', icon: 'globe', summary: 'Bespoke multi-tenant platforms built for high scale, security and low latency.', deliverables: ['SaaS Architectures', 'Custom Portals', 'SPA & SSR Systems', 'Enterprise RBAC'] },
      { id: 'business-websites', title: 'Business Websites', icon: 'layout', summary: 'High-converting digital presences with high speed and SEO.', deliverables: ['Corporate Portals', 'Landing Funnels', 'Headless CMS', 'Core Web Vitals'] },
      { id: 'mobile-applications', title: 'Mobile Applications', icon: 'smartphone', summary: 'Cross-platform iOS and Android solutions with native-grade performance.', deliverables: ['React Native Apps', 'Offline Caching', 'Push Notifications', 'Store Deployment'] },
      { id: 'ai-automation', title: 'AI & Automation', icon: 'cpu', summary: 'Integrating LLMs, predictive intelligence, and algorithmic pipelines.', deliverables: ['Enterprise LLMs & RAG', 'Doc Processing', 'Autonomous Agents', 'Custom NLP'] },
      { id: 'ui-ux-design', title: 'UI/UX Design', icon: 'palette', summary: 'Human-centered design systems crafted for visual clarity.', deliverables: ['Interactive Prototypes', 'Design Systems', 'Usability Audits', 'Ergonomic Flows'] },
      { id: 'cloud-devops', title: 'Cloud & DevOps', icon: 'cloud', summary: 'Hardened container infrastructure and CI/CD pipelines.', deliverables: ['Docker & K8s', 'CI/CD Automation', 'Cloud IaC', 'Disaster Recovery'] },
      { id: 'api-integration', title: 'API Integration', icon: 'network', summary: 'Microservice bridges and standardized REST interfaces.', deliverables: ['Third-party Connectors', 'Payment Gateways', 'Webhooks', 'API Rate Limiting'] },
      { id: 'maintenance-support', title: 'Maintenance & Support', icon: 'shield-check', summary: 'Proactive 24/7 uptime monitoring and vulnerability patching.', deliverables: ['Health Audits', 'DB Optimization', 'SLA Bug Resolution', 'Version Upgrades'] }
    ],
    problemSolutions: [
      { problem: 'Manual business operations', problemDetail: 'Time-consuming manual data entry and human error.', solution: 'Business automation', solutionDetail: 'Bespoke digital engines reducing manual cycles by up to 80%.' },
      { problem: 'Paper-based workflows', problemDetail: 'Fragile physical records and disorganized filing.', solution: 'Digital workflow systems', solutionDetail: 'Cloud-synced digital record tracking with instant approvals.' },
      { problem: 'Poor customer management', problemDetail: 'Lost leads and fragmented communication.', solution: 'CRM solutions', solutionDetail: 'Tailored portals with deal pipelines and unified correspondence.' },
      { problem: 'Inventory problems', problemDetail: 'Stockouts, overstocking, and tracking discrepancies.', solution: 'Inventory management', solutionDetail: 'Real-time SKU tracking with automated reorder thresholds.' },
      { problem: 'Appointment problems', problemDetail: 'Double-bookings and manual rescheduling chaos.', solution: 'Booking platform', solutionDetail: 'Automated calendar sync and self-service reservation.' },
      { problem: 'Data scattered across spreadsheets', problemDetail: 'Conflicting Excel versions and no single source of truth.', solution: 'Centralized dashboard', solutionDetail: 'Single pane-of-glass executive dashboards aggregating live data.' },
      { problem: 'Repetitive office work', problemDetail: 'Staff spending hours copy-pasting numbers and reading invoices.', solution: 'AI automation', solutionDetail: 'Intelligent neural extraction parsing documents directly into ERP.' },
      { problem: 'Lack of business analytics', problemDetail: 'Decisions made on guesswork and delayed monthly reports.', solution: 'Real-time analytics dashboard', solutionDetail: 'Instant telemetry on revenue trends and operational throughput.' }
    ],
    howWeBuild: [
      { step: '01', name: 'Discover', title: 'Requirements & Strategy', description: 'Deep discovery into constraints, user personas and technical prerequisites.' },
      { step: '02', name: 'Design', title: 'Architecture & UI/UX', description: 'Architecting database schemas, API contracts, and high-fidelity wireframes.' },
      { step: '03', name: 'Develop', title: 'Clean Code Implementation', description: 'Building with modular patterns, strict type-safety, and test-driven code.' },
      { step: '04', name: 'Test', title: 'Security & Quality Assurance', description: 'Cross-browser testing, penetration hardening, and edge-case verification.' },
      { step: '05', name: 'Deploy', title: 'Zero-Downtime Release', description: 'Containerized pipelines, CDN caching, and production monitoring.' },
      { step: '06', name: 'Support', title: 'Monitoring & Evolution', description: 'SLA-backed maintenance, server health monitoring, and scaling.' }
    ],
    whyTantrax: [
      { title: 'Client-Focused Development', description: 'Aligning technical choices with revenue milestones and commercial pain points.' },
      { title: 'Transparent Communication', description: 'Direct engineering access, weekly demonstrations, and total visibility.' },
      { title: 'Scalable Architecture', description: 'Engineered from day one for horizontal scalability and clean decoupling.' },
      { title: 'Security-First Development', description: 'Data encryption in transit and rest, OWASP compliance, and zero-trust auth.' },
      { title: 'Responsive Support', description: 'Rapid turnaround with direct engineer escalation paths.' },
      { title: 'Modern Technology', description: 'Battle-tested tech stack: React, TypeScript, Node.js, Python, and AI.' }
    ],
    projects: [
      {
        id: 'nexus-erp',
        title: 'Nexus Enterprise Operations Hub',
        category: 'Enterprise Resource Planning',
        tag: 'Conceptual UI / Architectural Showcase',
        description: 'A unified web platform replacing 14 disjointed legacy tools. Consolidates procurement, employee workflow routing, and live inventory.',
        stats: [{ label: 'Data Latency', value: '< 80ms' }, { label: 'Concurrent Users', value: '10,000+' }, { label: 'Manual Time Cut', value: '65%' }],
        tags: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'WebSockets'],
        mockupType: 'dashboard'
      },
      {
        id: 'flow-crm',
        title: 'FlowScale B2B Pipeline & CRM',
        category: 'Customer Relationship Management',
        tag: 'Conceptual UI / Architectural Showcase',
        description: 'High-velocity sales pipeline suite featuring automated meeting synchronization and instant customer correspondence logs.',
        stats: [{ label: 'Follow-up Velocity', value: '3x Faster' }, { label: 'Pipeline Visibility', value: '100%' }, { label: 'API Sync Speed', value: 'Real-time' }],
        tags: ['TypeScript', 'Python', 'MongoDB', 'REST APIs', 'Tailwind'],
        mockupType: 'crm'
      },
      {
        id: 'medsync-booking',
        title: 'MedSync Clinical Booking Engine',
        category: 'Healthcare & Appointment Portal',
        tag: 'Conceptual UI / Architectural Showcase',
        description: 'Zero-collision scheduling architecture for multi-specialty clinics with automated WhatsApp confirmations.',
        stats: [{ label: 'No-Show Drop', value: '42%' }, { label: 'Scheduling Collision', value: '0.0%' }, { label: 'Patient Rating', value: '4.9 / 5' }],
        tags: ['React', 'Node.js', 'PostgreSQL', 'Cloud', 'SMS Gateway'],
        mockupType: 'booking'
      },
      {
        id: 'cogni-ai',
        title: 'CogniExtract Document AI Engine',
        category: 'AI & Process Automation',
        tag: 'Conceptual UI / Architectural Showcase',
        description: 'Autonomous invoice and contract processing engine utilizing vision transformers and LLMs.',
        stats: [{ label: 'Extraction Accuracy', value: '99.4%' }, { label: 'Processing Speed', value: '1.2s / doc' }, { label: 'Audit Compliance', value: '100%' }],
        tags: ['Python', 'AI / LLMs', 'FastAPI', 'Vector Search', 'Cloud'],
        mockupType: 'ai'
      }
    ],
    pricing: [
      {
        id: 'starter',
        name: 'Starter',
        badge: 'For Emerging Businesses',
        startingPrice: 'Starting from ₹12,000',
        altPrice: '$149 (Indicative)',
        period: 'one-time project',
        popular: false,
        description: 'Ideal for startups and growing businesses needing a professional, fast digital presence or MVP.',
        features: ['Custom responsive web application', 'Up to 5 high-converting core pages', 'Mobile-first design & cross-browser testing', 'Basic SEO metadata & performance tuning', 'Contact form with alerts', '30 days warranty support', 'Full source code ownership'],
        cta: 'Get Started',
        note: 'Prices are indicative and customized based on your exact scope.'
      },
      {
        id: 'business',
        name: 'Business',
        badge: 'Most Popular',
        startingPrice: 'Starting from ₹20,000',
        altPrice: '$249 (Indicative)',
        period: 'tailored build',
        popular: true,
        description: 'Engineered for scaling businesses requiring custom database backends, authentication, and workflow automation.',
        features: ['Full-stack custom web application', 'Secure user authentication & RBAC', 'Relational database design (PostgreSQL / Mongo)', 'Automated workflow & notification hooks', 'Third-party API & payment integration', 'Admin dashboard for live data', '60 days dedicated support', 'CI/CD cloud deployment setup'],
        cta: 'Build Business Solution',
        note: 'Prices are indicative and customized based on your exact scope.'
      },
      {
        id: 'enterprise',
        name: 'Custom Enterprise',
        badge: 'Enterprise Grade',
        startingPrice: 'Starting from ₹25,000',
        altPrice: '$299+ (Custom Scope)',
        period: 'turnkey enterprise',
        popular: false,
        description: 'For organizations requiring mission-critical architecture, custom AI models, microservices, and dedicated SLA.',
        features: ['High-concurrency microservices platform', 'Enterprise AI, LLM workflow & automations', 'Multi-branch role-based permissions & audit trails', 'Advanced telemetry dashboards', 'Zero-trust security compliance', 'Dedicated project lead & agile sprints', 'Priority 24/7 SLA maintenance', 'Disaster recovery architecture'],
        cta: 'Request Enterprise Proposal',
        note: 'Prices are indicative and customized based on your exact scope.'
      }
    ],
    technologies: [
      { name: 'HTML5', category: 'Frontend', desc: 'Semantic, accessible markup' },
      { name: 'CSS3 / Modern CSS', category: 'Frontend', desc: 'Tailwind & modern fluid layout' },
      { name: 'JavaScript', category: 'Core Language', desc: 'ESNext & asynchronous engines' },
      { name: 'React', category: 'Frontend Framework', desc: 'Dynamic, responsive user interfaces' },
      { name: 'Node.js', category: 'Backend Runtime', desc: 'High-throughput event-driven servers' },
      { name: 'Python', category: 'AI & Backend', desc: 'Data science, automation & ML backends' },
      { name: 'PostgreSQL', category: 'Relational Database', desc: 'ACID-compliant robust data integrity' },
      { name: 'MongoDB', category: 'NoSQL Database', desc: 'Flexible document storage & high scale' },
      { name: 'REST APIs', category: 'Architecture', desc: 'Standardized, secure microservice contracts' },
      { name: 'Cloud', category: 'DevOps & Hosting', desc: 'AWS, GCP & containerized deployments' },
      { name: 'AI', category: 'Intelligence', desc: 'LLM workflows, embeddings & neural automations' }
    ],
    faq: [
      { question: 'Do I own 100% of the code and intellectual property?', answer: 'Yes. Upon project completion and final milestone sign-off, full intellectual property, source code repositories, databases, and assets are transferred entirely to your organization with zero vendor lock-in.' },
      { question: 'How do you provide estimates and scope out projects?', answer: 'We conduct an initial discovery session to understand your operational requirements and milestones. We then provide a clear, transparent statement of work (SOW) outlining deliverables, architecture, timelines, and milestone-based indicative pricing.' },
      { question: 'Can TANTRAX modernize our existing legacy software?', answer: 'Absolutely. We specialize in refactoring legacy codebases, migrating fragile spreadsheets into modern centralized dashboards, and adding AI/automation layers without disrupting your existing day-to-day operations.' },
      { question: 'How long does a typical software project take to deliver?', answer: 'Targeted starter applications and MVPs typically deploy in 2 to 4 weeks. Comprehensive business applications generally take 6 to 10 weeks, delivered in two-week agile sprint increments with live demo previews.' },
      { question: 'What kind of ongoing maintenance and support do you provide?', answer: 'Every project includes post-launch warranty support. Additionally, we offer ongoing SLA maintenance packages covering 24/7 uptime monitoring, security patching, database optimization, and ongoing feature rollouts.' },
      { question: 'How do we get started?', answer: 'Submit our contact form below or call us directly at 8838178638. We will schedule a free architectural consultation within 24 hours to explore your requirements.' }
    ]
  };
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Mobile App-style Bottom Navigation Bar
 */
function initMobileBottomNav() {
  const bottomBar = document.getElementById('mobile-app-bottom-bar');
  if (!bottomBar) return;

  const bottomTabs = bottomBar.querySelectorAll('.mobile-app-tab[data-section]');
  const trackedSections = Array.from(bottomTabs)
    .map(tab => tab.getAttribute('data-section'))
    .filter(Boolean);

  function updateBottomTabs() {
    const scrollPos = window.scrollY + 140;
    let currentSectionId = trackedSections[0];

    trackedSections.forEach(id => {
      const sec = document.getElementById(id);
      if (sec) {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = id;
        }
      }
    });

    bottomTabs.forEach(tab => {
      if (tab.getAttribute('data-section') === currentSectionId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateBottomTabs, { passive: true });

  // Smooth scroll for bottom tabs
  bottomTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const href = tab.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 70;
          const pos = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      }
    });
  });
}

/**
 * 3-Second TANTRAX Launch Emoji Intro Screen
 * Shows the flaming T emblem styled as a 3D animated emoji badge with particle sparks
 * Displays for exactly 3 seconds on website load, with smooth transition to the site.
 */
function initEmojiIntro() {
  const introEl = document.getElementById('tantrax-emoji-intro');
  if (!introEl) return;

  const skipBtn = document.getElementById('emoji-skip-btn');
  const dot1 = document.getElementById('dot-1');
  const dot2 = document.getElementById('dot-2');
  const dot3 = document.getElementById('dot-3');

  document.body.classList.add('emoji-intro-active');

  let dismissed = false;
  let timerId = null;
  let dot1Timer = null;
  let dot2Timer = null;
  let dot3Timer = null;

  function dismissIntro() {
    if (dismissed) return;
    dismissed = true;

    if (timerId) clearTimeout(timerId);
    if (dot1Timer) clearTimeout(dot1Timer);
    if (dot2Timer) clearTimeout(dot2Timer);
    if (dot3Timer) clearTimeout(dot3Timer);

    introEl.classList.add('dismissing');

    setTimeout(() => {
      introEl.classList.add('hidden');
      introEl.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('emoji-intro-active');
    }, 380);
  }

  // Ticking countdown dots: at 1s, 2s, 2.7s
  dot1Timer = setTimeout(() => {
    if (dot1) dot1.classList.add('done');
  }, 1000);

  dot2Timer = setTimeout(() => {
    if (dot2) dot2.classList.add('done');
  }, 2000);

  dot3Timer = setTimeout(() => {
    if (dot3) dot3.classList.add('done');
  }, 2700);

  // Auto-dismiss at exactly 3.0 seconds (3000ms)
  timerId = setTimeout(() => {
    dismissIntro();
  }, 3000);

  // Click anywhere on overlay to skip
  introEl.addEventListener('click', () => {
    dismissIntro();
  });

  // Skip button click
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissIntro();
    });
  }

  // Escape key to skip
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !dismissed) {
      dismissIntro();
    }
  });

  // Expose global replay function
  window.replayEmojiIntro = function() {
    dismissed = false;
    introEl.classList.remove('hidden', 'dismissing');
    introEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('emoji-intro-active');

    if (dot1) dot1.classList.remove('done');
    if (dot2) dot2.classList.remove('done');
    if (dot3) dot3.classList.remove('done');

    // Reset countdown SVG ring animation
    const ring = document.getElementById('emoji-ring-progress');
    if (ring) {
      ring.style.animation = 'none';
      void ring.offsetHeight; // trigger reflow
      ring.style.animation = 'countdownStroke 3s linear forwards';
    }

    // Reset card animation
    const card = document.getElementById('emoji-intro-card');
    if (card) {
      card.style.animation = 'none';
      void card.offsetHeight;
      card.style.animation = 'emojiCardEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
    }

    dot1Timer = setTimeout(() => { if (dot1) dot1.classList.add('done'); }, 1000);
    dot2Timer = setTimeout(() => { if (dot2) dot2.classList.add('done'); }, 2000);
    dot3Timer = setTimeout(() => { if (dot3) dot3.classList.add('done'); }, 2700);

    timerId = setTimeout(() => {
      dismissIntro();
    }, 3000);
  };

  // Replay on header logo click if user is already at top of home
  const brandLink = document.getElementById('header-brand-link');
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      if (window.scrollY < 100) {
        e.preventDefault();
        window.replayEmojiIntro();
      }
    });
  }
}
