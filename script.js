/**
 * Val Signature Website — Main Script
 * Handles: Menu toggle, scroll animations, form submission, smooth scroll helpers
 */

/* ========================================
   PRELOADER DISMISSAL
======================================== */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.remove();
        }, 800); // Matches CSS transition time
    }
});

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================
       0. HERO INTERACTIVE FLIP GRID
    ======================================== */
    const SQUARE_SIZE = 160; // px — increase this for bigger squares

    function buildHeroGrid() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const grid = document.createElement('div');
        grid.className = 'hero-grid';

        const cols = Math.ceil(hero.offsetWidth / SQUARE_SIZE);
        const rows = Math.ceil(hero.offsetHeight / SQUARE_SIZE);

        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        grid.style.gridTemplateRows    = `repeat(${rows}, 1fr)`;

        const total = cols * rows;
        for (let i = 0; i < total; i++) {
            const sq = document.createElement('div');
            sq.className = 'grid-sq';

            const inner = document.createElement('div');
            inner.className = 'grid-sq-inner';

            const front = document.createElement('div');
            front.className = 'grid-sq-front';

            const back = document.createElement('div');
            back.className = 'grid-sq-back';

            inner.append(front, back);
            sq.appendChild(inner);
            grid.appendChild(sq);
        }

        // Insert behind hero content (first child so content layers above)
        hero.insertBefore(grid, hero.children[1]); // after hero-bg-img
    }

    buildHeroGrid();

    // Rebuild on resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const old = document.querySelector('.hero-grid');
            if (old) old.remove();
            buildHeroGrid();
        }, 300);
    });

    /* ========================================
       1. FULLSCREEN MENU TOGGLE
    ======================================== */
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const fullscreenMenu = document.getElementById('fullscreenMenu');

    function openMenu() {
        fullscreenMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuToggle.querySelector('i').classList.replace('fa-bars', 'fa-times');
    }

    function closeMenuFn() {
        fullscreenMenu.classList.remove('active');
        document.body.style.overflow = '';
        menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
    }

    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (closeMenu) closeMenu.addEventListener('click', closeMenuFn);

    // Close menu when a nav link is clicked
    if (fullscreenMenu) {
        fullscreenMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenuFn);
        });
        // Close on backdrop click
        fullscreenMenu.addEventListener('click', (e) => {
            if (e.target === fullscreenMenu) closeMenuFn();
        });
    }

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenMenu?.classList.contains('active')) {
            closeMenuFn();
        }
    });

    /* ========================================
       2. SCROLL ANIMATIONS (Intersection Observer)
    ======================================== */
    const fadeEls = document.querySelectorAll('.fade-up');

    if (fadeEls.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        fadeEls.forEach(el => observer.observe(el));
    }

    /* ========================================
       3. SMOOTH SCROLL FOR ANCHOR LINKS
    ======================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ========================================
       4. NAVBAR SCROLL BEHAVIOR
       Hide on scroll down, show on scroll up (after hero)
    ======================================== */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 600;
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Past hero styling
            if (currentScrollY > heroHeight * 0.6) {
                navbar.classList.add('past-hero');
            } else {
                navbar.classList.remove('past-hero');
            }

            // Directional hide/show
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                navbar.classList.add('nav-hidden');
            } else {
                // Scrolling up
                navbar.classList.remove('nav-hidden');
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    /* ========================================
       5. SERVICE ITEMS — highlight on hover
    ======================================== */
    document.querySelectorAll('.service-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.querySelector('.service-num').style.color = '#D4AF37';
        });
        item.addEventListener('mouseleave', () => {
            item.querySelector('.service-num').style.color = '#ddd';
        });
    });

});

/* ========================================
   6. GLOBAL HELPERS
======================================== */

/** Smooth-scroll helper called from HTML onclick attributes */
function scrollToSection(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Form submission handler */
function handleSubmit(event, form) {
    event.preventDefault();

    const btn = form.querySelector('.btn-submit');
    const originalText = btn.textContent;

    // Show sending state
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    // Simulate send (replace with real API call if needed)
    setTimeout(() => {
        btn.textContent = '✓ Sent!';
        btn.style.opacity = '1';
        btn.style.background = '#2a7a2a';
        form.reset();

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }, 1200);
}
