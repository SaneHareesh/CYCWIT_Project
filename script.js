/**
 * CYCWIT — script.js
 * Handles: Theme toggle, navbar scroll, scroll-reveal,
 *          ripple effects, mobile menu, stat counters, smooth scroll.
 */

/* ═══════════════════════════════════════════════
   1. THEME TOGGLE (Dark / Light)
═══════════════════════════════════════════════ */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

const THEME_KEY = 'cycwit-theme';

function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem(THEME_KEY, theme);
}

// Load saved preference
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');

    // subtle scale animation
    themeToggle.classList.add('spin');
    setTimeout(() => themeToggle.classList.remove('spin'), 400);
});


/* ═══════════════════════════════════════════════
   2. NAVBAR — scroll shadow & active link
═══════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    // Add shadow when scrolled
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Highlight active nav link
    let current = '';
    sections.forEach(sec => {
        const top = sec.offsetTop - 100;
        if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, { passive: true });


/* ═══════════════════════════════════════════════
   3. MOBILE MENU (Hamburger)
═══════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function openMenu() {
    navLinksEl.classList.add('open');
    navOverlay.classList.add('show');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    navLinksEl.classList.remove('open');
    navOverlay.classList.remove('show');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    navLinksEl.classList.contains('open') ? closeMenu() : openMenu();
});

navOverlay.addEventListener('click', closeMenu);

// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});


/* ═══════════════════════════════════════════════
   4. SMOOTH SCROLL for anchor links
═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


/* ═══════════════════════════════════════════════
   5. SCROLL REVEAL (IntersectionObserver)
═══════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger children if inside a grid
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

// Add stagger delays to grid children
function addStaggerToChildren(parentSelector, childSelector) {
    const grids = document.querySelectorAll(parentSelector);
    grids.forEach(grid => {
        const children = grid.querySelectorAll(childSelector);
        children.forEach((child, i) => {
            child.dataset.delay = i * 100;
        });
    });
}

addStaggerToChildren('.paths-grid', '.path-card');
addStaggerToChildren('.features-grid', '.feature-card');
addStaggerToChildren('.about-grid', '.about-card');

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});


/* ═══════════════════════════════════════════════
   6. RIPPLE EFFECT on Buttons
═══════════════════════════════════════════════ */
function createRipple(event) {
    const button = event.currentTarget;
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();

    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
}

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', createRipple);
});


/* ═══════════════════════════════════════════════
   7. ANIMATED STAT COUNTERS
═══════════════════════════════════════════════ */
function animateCounter(el) {
    const target = +el.dataset.target;
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

const statsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(animateCounter);
                statsObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.4 }
);

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statsObserver.observe(statsGrid);


/* ═══════════════════════════════════════════════
   8. HERO ORBS — subtle parallax on mouse move
═══════════════════════════════════════════════ */
const hero = document.querySelector('.hero');
if (hero) {
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const xRatio = (clientX / innerWidth - 0.5) * 20;
        const yRatio = (clientY / innerHeight - 0.5) * 20;

        document.querySelectorAll('.hero-orb').forEach((orb, i) => {
            const factor = (i + 1) * 0.5;
            orb.style.transform = `translate(${xRatio * factor}px, ${yRatio * factor}px)`;
        });
    });
}
