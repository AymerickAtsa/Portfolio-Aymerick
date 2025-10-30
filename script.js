// script.js

// Smooth appearance for sections using IntersectionObserver
document.addEventListener('DOMContentLoaded', () => {
  // Toggle header style on scroll
  const header = document.querySelector('header');
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('header-glass');
      header.classList.remove('nav-transparent');
    } else {
      header.classList.remove('header-glass');
      header.classList.add('nav-transparent');
    }
  });

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  navToggle && navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  // Make nav links close mobile menu on click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      }
    });
  });

  // Reveal elements
  const reveals = document.querySelectorAll('.section-inner, .project-card, .skill-card, .visual-placeholder, .hero-text');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        entry.target.classList.remove('reveal');
      }
    });
  }, {threshold: 0.12});
  reveals.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Animate progress bars when visible
  const progressBars = document.querySelectorAll('.progress');
  const progressObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.progress-bar');
        const percent = parseInt(entry.target.getAttribute('data-percent') || '0', 10);
        bar.style.width = percent + '%';
      }
    });
  }, {threshold: 0.25});
  progressBars.forEach(pb => progressObserver.observe(pb));

  // Contact form validation + success toast
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('successToast');
  const toastClose = document.getElementById('toastClose');

  function validateEmail(email) {
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // simple validation
    if (!name) {
      alert('Please enter your name.');
      form.name.focus();
      return;
    }
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      form.email.focus();
      return;
    }
    if (!message || message.length < 6) {
      alert('Please enter a longer message (at least 6 characters).');
      form.message.focus();
      return;
    }

    // Fake send (no backend). Show success toast and reset form.
    showToast();
    form.reset();
  });

  toastClose && toastClose.addEventListener('click', hideToast);

  function showToast() {
    if(!toast) return;
    toast.hidden = false;
    toast.style.opacity = 0;
    toast.animate([{opacity:0, transform:'translateY(8px)'},{opacity:1, transform:'translateY(0)'}], {duration:260, easing:'ease-out', fill:'forwards'});
    setTimeout(() => {
      // auto hide after 5 seconds
      hideToastTimeout = setTimeout(hideToast, 5000);
    }, 300);
  }

  let hideToastTimeout = null;
  function hideToast() {
    if(!toast) return;
    if (hideToastTimeout) { clearTimeout(hideToastTimeout); hideToastTimeout = null; }
    const anim = toast.animate([{opacity:1, transform:'translateY(0)'},{opacity:0, transform:'translateY(8px)'}], {duration:200, easing:'ease-in', fill:'forwards'});
    anim.onfinish = () => { toast.hidden = true; };
  }

  // Add subtle hover glow for project cards & skill cards
  document.querySelectorAll('.project-card, .skill-card').forEach(card => {
    card.addEventListener('mouseover', () => {
      card.style.transition = 'box-shadow 250ms ease, transform 250ms ease';
      // small gold glow
      card.style.boxShadow = '0 10px 30px rgba(255,215,0,0.06)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });

  // Accessibility: allow 'View My Work' press to focus projects
  const projectsSection = document.getElementById('projects');
  document.querySelectorAll('a[href="#projects"]').forEach(link => {
    link.addEventListener('click', (e) => {
      // after small delay to allow scroll, focus first project
      setTimeout(() => {
        const firstProject = projectsSection && projectsSection.querySelector('.project-card');
        if (firstProject) firstProject.querySelector('button')?.focus();
      }, 400);
    });
  });

  // Small enhancement: close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks || !navToggle) return;
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    }
  });
});
