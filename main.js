/* ===== JAVASCRIPT DO PORTFOLIO – Gabriel Melo ===== */

// ── Particles
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.3;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.3;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
        this.reset();
        // Spawns them on the edges to avoid popping
        if (Math.random() > 0.5) this.x = Math.random() > 0.5 ? 0 : W;
        else this.y = Math.random() > 0.5 ? 0 : H;
      }

      // Mouse interaction
      if (mouse.x != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * 2;
          const directionY = forceDirectionY * force * 2;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,232,143,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,232,143,${0.2 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
      
      // Lines connecting to mouse
      if (mouse.x != null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0,232,143,${0.3 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── Navbar scroll
(function initNav() {
  const nav = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  // Hamburger (mobile)
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.toggle('mobile-open');
    });
  }
})();

// ── Typed text
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const words = [
    'Desenvolvedor Backend',
    'Especialista em FastAPI',
    'Automatizador de Processos',
    'Arquiteto de APIs REST',
    'Builder de Sistemas SaaS'
  ];
  let wi = 0, ci = 0, deleting = false;
  const speed = 90, deleteSpeed = 45, pause = 2000;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) {
        deleting = true;
        setTimeout(type, pause);
        return;
      }
    } else {
      el.textContent = word.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? deleteSpeed : speed);
  }
  type();
})();

// ── Scroll reveal
(function initReveal() {
  document.querySelectorAll(
    '.section-header, .about-grid, .skill-category, .project-card, .stat-card, .timeline-item, .testimonial-card, .contact-card, .contact-form, .highlight-item'
  ).forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), idx * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ── Skill bars animation
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width;
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => observer.observe(b));
})();

// ── Counter animation
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = +e.target.dataset.target;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          e.target.textContent = Math.floor(current);
          if (current >= target) clearInterval(timer);
        }, 16);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
})();

// ── Project filter
(function initFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? 'flex' : 'none';
        if (show) {
          card.style.animation = 'fadeInUp 0.4s ease both';
        }
      });
    });
  });
})();

// ── Testimonials slider
(function initTestimonials() {
  const track = document.getElementById('testimonials-track');
  const dots = document.querySelectorAll('.test-dot');
  if (!track) return;
  let current = 0;
  const total = dots.length;

  function goTo(idx) {
    current = idx;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(+dot.dataset.idx));
  });

  // Auto-play
  setInterval(() => goTo((current + 1) % total), 5000);
})();

// ── Contact form (legacy - disabled)
// Form was replaced with WhatsApp composer

// ── WhatsApp sender
function sendWhatsApp() {
  const name    = (document.getElementById('wpp-name').value || '').trim();
  const subject = document.getElementById('wpp-subject').value;

  let text = 'Olá, Gabriel! Vi seu portfólio e gostaria de conversar.';
  if (name)    text += `\n\nMeu nome é *${name}*`;
  if (subject) text += ` e tenho interesse em: *${subject}*`;
  text += '.\n\nPodemos conversar? 😊';

  const url = `https://wa.me/5573999636435?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

// ── Hero scroll indicator hide
window.addEventListener('scroll', () => {
  const scrollHint = document.querySelector('.hero-scroll');
  if (scrollHint) scrollHint.style.opacity = window.scrollY > 80 ? '0' : '1';
}, { passive: true });

// ── Project Modal Logic
(function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close');
  if (!modal) return;

  const cards = document.querySelectorAll('.project-card');
  
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Ignore if clicking a button with a link (like GitHub demo)
      if (e.target.closest('.proj-demo')) return;
      e.preventDefault();

      // Extract elements from the card
      const img = card.querySelector('.project-img').src;
      const title = card.querySelector('.project-title').innerHTML;
      const desc = card.querySelector('.project-desc').innerHTML;
      const detailGrid = card.querySelector('.project-detail-grid') ? card.querySelector('.project-detail-grid').outerHTML : '';
      const tech = card.querySelector('.project-tech') ? card.querySelector('.project-tech').outerHTML : '';
      const results = card.querySelector('.project-results') ? card.querySelector('.project-results').outerHTML : '';
      
      // Clone actions (excluding "Saiba Mais")
      const actionsEl = card.querySelector('.project-actions');
      let actionsHTML = '';
      if (actionsEl) {
        const clonedActions = actionsEl.cloneNode(true);
        const saibaMaisBtn = clonedActions.querySelector('.proj-code');
        if (saibaMaisBtn) saibaMaisBtn.remove();
        actionsHTML = clonedActions.outerHTML;
      }

      // Populate modal
      modalBody.innerHTML = `
        <img src="${img}" class="project-img" alt="${title}" />
        <h3 class="project-title">${title}</h3>
        <p class="project-desc">${desc}</p>
        ${detailGrid}
        ${tech}
        ${results}
        ${actionsHTML}
      `;

      // Show modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
})();
