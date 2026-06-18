document.addEventListener('DOMContentLoaded', () => {
  // NAV SCROLL
  const nav = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });

  // MOBILE MENU
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // CLOSE MENU ON LINK CLICK
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // REVEAL ON SCROLL (Intersection Observer)
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // GALLERY LIGHTBOX
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // COUNTER ANIMATION
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const match = text.match(/(\d+)/);
        if (match) {
          const target = parseInt(match[0]);
          const suffix = text.replace(match[0], '');
          let current = 0;
          const increment = Math.ceil(target / 60);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current + suffix;
          }, 30);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // PARALLAX HERO (subtle)
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-bg img');
    if (hero && window.scrollY < window.innerHeight) {
      hero.style.transform = `scale(1.05) translateY(${window.scrollY * 0.15}px)`;
    }
  });

  // ACTIVE NAV LINK ON SCROLL
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) link.style.color = 'var(--gold)';
    });
  });
});

// FORM SUBMISSION HANDLER — sends via Eventos Prime API (Resend) + WhatsApp
async function handleFormSubmit(e, tipo) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // Collect form data
  const data = new FormData(form);
  const fields = {};
  const servicios = [];
  for (const [key, value] of data.entries()) {
    if (key === 'servicios') { servicios.push(value); }
    else if (value) { fields[key] = value; }
  }
  if (servicios.length) fields.servicios = servicios.join(', ');

  // Build WhatsApp message
  let msg = tipo === 'publicidad' 
    ? '🏢 *PROPUESTA DE PUBLICIDAD / PATROCINIO*\n_Se Siente Ecuador — Copa del Mundo 2026_\n\n'
    : '🎤 *SOLICITUD DE CONTRATACIÓN ARTÍSTICA*\n_Karen Vargas y Las Latinas del Son_\n\n';
  for (const [key, value] of Object.entries(fields)) {
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    msg += `*${label}:* ${value}\n`;
  }
  msg += '\n_Enviado desde karenvargas.eventosprimeai.com_';

  // Build email HTML
  const isPublicidad = tipo === 'publicidad';
  const color = isPublicidad ? '#c9a84c' : '#e91e8c';
  const title = isPublicidad ? 'Nueva Propuesta de Publicidad / Patrocinio' : 'Nueva Solicitud de Contratación Artística';
  const subtitle = isPublicidad ? 'Se Siente Ecuador — Copa del Mundo 2026' : 'Karen Vargas y Las Latinas del Son';
  let rows = '';
  for (const [key, value] of Object.entries(fields)) {
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    rows += `<tr><td style="padding:8px 12px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #1a1a1a;width:140px;">${label}</td><td style="padding:8px 12px;color:#f0f0f0;font-size:14px;border-bottom:1px solid #1a1a1a;">${value}</td></tr>`;
  }
  const emailHtml = `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;color:#f0f0f0;border-radius:12px;overflow:hidden;border:1px solid #1a1a1a;"><div style="background:linear-gradient(135deg,${color}22,${color}08);padding:28px;text-align:center;border-bottom:1px solid ${color}33;"><h1 style="margin:0;font-size:1.3rem;color:${color};">${title}</h1><p style="margin:6px 0 0;color:#888;font-size:.85rem;">${subtitle}</p></div><div style="padding:20px;"><table style="width:100%;border-collapse:collapse;">${rows}</table></div><div style="padding:16px 20px;border-top:1px solid #1a1a1a;text-align:center;"><p style="margin:0;color:#555;font-size:.7rem;">Enviado desde karenvargas.eventosprimeai.com</p></div></div>`;

  // Send email via Eventos Prime API
  try {
    await fetch('https://eventosprimeai.com/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Karen Vargas Web <cloud@eventosprimeai.com>',
        to: 'ventas@eventosprimeai.com',
        subject: `[Karen Vargas] ${title}`,
        html: emailHtml
      })
    });
  } catch (err) {
    console.log('Email fallback to WhatsApp:', err);
  }

  // Open WhatsApp as secondary channel
  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/593969324140?text=${encoded}`, '_blank');

  // Show success
  btn.textContent = '✓ Enviado';
  btn.style.opacity = '.6';
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.opacity = '1';
    btn.disabled = false;
    form.reset();
  }, 3000);
}

