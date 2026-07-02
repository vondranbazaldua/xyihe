/* ==========================================================================
   XYIHE.COM - Main JavaScript
   Tesla-style interactions: scroll reveal, parallax, magnetic cursor, etc.
   ========================================================================== */

(function () {
    'use strict';

    /* --------------------------------------------------------
       1. Loader
    -------------------------------------------------------- */
    window.addEventListener('load', function () {
        const loader = document.querySelector('.loader');
        if (loader) {
            setTimeout(function () { loader.classList.add('hidden'); }, 1100);
        }
    });

    /* --------------------------------------------------------
       2. Sticky Header
    -------------------------------------------------------- */
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = function () {
            if (window.scrollY > 24) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* --------------------------------------------------------
       3. Mobile navigation
    -------------------------------------------------------- */
    const navToggle = document.querySelector('.nav-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    if (navToggle && navMobile) {
        navToggle.addEventListener('click', function () {
            navMobile.classList.toggle('open');
        });
        navMobile.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                navMobile.classList.remove('open');
            });
        });
    }

    /* --------------------------------------------------------
       4. Scroll Reveal (IntersectionObserver)
    -------------------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger > *');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('in-view'); });
    }

    /* --------------------------------------------------------
       5. Animated counters
    -------------------------------------------------------- */
    const counters = document.querySelectorAll('[data-counter]');
    if ('IntersectionObserver' in window && counters.length) {
        const counterIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseFloat(el.getAttribute('data-counter'));
                    const suffix = el.getAttribute('data-suffix') || '';
                    const duration = parseInt(el.getAttribute('data-duration') || '1800', 10);
                    const start = performance.now();
                    const animate = function (now) {
                        const p = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - p, 3);
                        const value = (target * eased).toFixed(target % 1 === 0 ? 0 : 1);
                        el.textContent = value + suffix;
                        if (p < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                    counterIO.unobserve(el);
                }
            });
        }, { threshold: 0.6 });
        counters.forEach(function (c) { counterIO.observe(c); });
    }

    /* --------------------------------------------------------
       6. Custom cursor
    -------------------------------------------------------- */
    if (!('ontouchstart' in window) && window.matchMedia('(min-width: 901px)').matches) {
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        const ring = document.createElement('div');
        ring.className = 'cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px) translate(-50%, -50%)';
        });
        const loop = function () {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';
            requestAnimationFrame(loop);
        };
        loop();

        // Hover state
        document.querySelectorAll('a, button, .card, .news-card, .app-card').forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                ring.style.width = '56px';
                ring.style.height = '56px';
                ring.style.borderColor = 'rgba(232, 33, 39, 0.8)';
                dot.style.width = '4px';
                dot.style.height = '4px';
            });
            el.addEventListener('mouseleave', function () {
                ring.style.width = '32px';
                ring.style.height = '32px';
                ring.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                dot.style.width = '8px';
                dot.style.height = '8px';
            });
        });
    }

    /* --------------------------------------------------------
       7. Magnetic buttons
    -------------------------------------------------------- */
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = 'translate(' + x * 0.25 + 'px, ' + y * 0.25 + 'px)';
        });
        btn.addEventListener('mouseleave', function () {
            btn.style.transform = '';
        });
    });

    /* --------------------------------------------------------
       8. Parallax for hero orbs / images
    -------------------------------------------------------- */
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (parallaxEls.length) {
        window.addEventListener('scroll', function () {
            const y = window.scrollY;
            parallaxEls.forEach(function (el) {
                const speed = parseFloat(el.getAttribute('data-parallax-speed') || '0.2');
                el.style.transform = 'translate3d(0, ' + (y * speed * -1) + 'px, 0)';
            });
        }, { passive: true });
    }

    /* --------------------------------------------------------
       9. Smooth anchor scroll
    -------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1) {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    window.scrollTo({
                        top: target.getBoundingClientRect().top + window.scrollY - offset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    /* --------------------------------------------------------
       10. Cookie banner
    -------------------------------------------------------- */
    const cookieBanner = document.querySelector('.cookie-banner');
    if (cookieBanner) {
        if (!localStorage.getItem('xyihe-cookie-accepted')) {
            cookieBanner.style.display = 'flex';
        } else {
            cookieBanner.style.display = 'none';
        }
        document.querySelectorAll('[data-cookie]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                localStorage.setItem('xyihe-cookie-accepted', '1');
                cookieBanner.style.display = 'none';
            });
        });
    }

    /* --------------------------------------------------------
       11. Contact form (simple handler)
    -------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const status = contactForm.querySelector('.form-status');
            if (status) {
                status.textContent = 'Sending your message...';
                status.style.color = 'var(--color-text-soft)';
                setTimeout(function () {
                    status.textContent = 'Thank you. We will get back to you within 24 hours.';
                    status.style.color = 'var(--color-accent)';
                    contactForm.reset();
                }, 900);
            }
        });
    }

    /* --------------------------------------------------------
       12. Stat number reveal animation
    -------------------------------------------------------- */
    const statNums = document.querySelectorAll('.stat-num[data-counter]');

    /* --------------------------------------------------------
       13. SVG line drawing animation
    -------------------------------------------------------- */
    const svgPaths = document.querySelectorAll('.draw-path');
    if ('IntersectionObserver' in window) {
        const pathIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const path = entry.target;
                    const len = path.getTotalLength();
                    path.style.strokeDasharray = len;
                    path.style.strokeDashoffset = len;
                    path.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.19, 1, 0.22, 1)';
                    requestAnimationFrame(function () {
                        path.style.strokeDashoffset = '0';
                    });
                    pathIO.unobserve(path);
                }
            });
        }, { threshold: 0.3 });
        svgPaths.forEach(function (p) { pathIO.observe(p); });
    }

    /* --------------------------------------------------------
       14. Dynamic year
    -------------------------------------------------------- */
    document.querySelectorAll('[data-year]').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    /* --------------------------------------------------------
       15. Card spotlight
    -------------------------------------------------------- */
    document.querySelectorAll('.card, .feature-card, .app-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
            card.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
        });
    });

    /* --------------------------------------------------------
       16. Hover wave on links
    -------------------------------------------------------- */
    document.querySelectorAll('.link-wave').forEach(function (link) {
        link.innerHTML = link.textContent.replace(/\S/g, '<span class="lnk">$&</span>');
    });

})();
