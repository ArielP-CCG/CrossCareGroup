/**
 * Cross Care Group - Human Depth Interactive Engine
 * Focus: Sophisticated motion, premium fluid reveals, and clinical authority.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Fluid Reveal Engine V3 (Staggered)
    const revealItems = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        // Filter and sort entries that are intersecting to apply stagger
        const intersectingEntries = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);

        intersectingEntries.forEach((entry, index) => {
            // Add a small delay for staggered appearance
            setTimeout(() => {
                entry.target.classList.add('is-revealed');
            }, index * 150);
            revealObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealItems.forEach(el => {
        el.classList.add('reveal-init');
        revealObserver.observe(el);
    });

    // 2. Kinetic Interaction Engine V4 (Proximity & Parallax)
    document.querySelectorAll('.card, .btn, .path-card, .process-card, .service-grid-card-premium').forEach(target => {
        target.addEventListener('mousemove', (e) => {
            const rect = target.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            target.style.setProperty('--mouse-x', `${x}%`);
            target.style.setProperty('--mouse-y', `${y}%`);

            // Subtle tilt for high-end feel
            if (target.classList.contains('card') || target.classList.contains('path-card') || target.classList.contains('process-card') || target.classList.contains('service-grid-card-premium')) {
                const tiltX = (y - 50) / 12;
                const tiltY = (x - 50) / -12;
                target.style.transform = `translateY(-12px) scale(1.02) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
                target.style.zIndex = "50";
            }
        });

        target.addEventListener('mouseleave', () => {
            if (target.classList.contains('card') || target.classList.contains('path-card') || target.classList.contains('process-card') || target.classList.contains('service-grid-card-premium')) {
                target.style.transform = '';
                target.style.zIndex = "";
            }
        });
    });

    // Optimized Scroll Handler (Throttled & Cached)
    const glowOrbs = document.querySelectorAll('.glow-orb');
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScroll(lastScrollY);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    function updateScroll(scrollY) {
        // Parallax Orbs
        glowOrbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.15;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });

        // Sticky Header
        if (header) {
            if (scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        }
    }

    // 6. Navigation Active State Highlight
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('#site-header nav a, #mobile-menu nav a');

    // Normalize path helper
    const normalizePath = (path) => {
        if (!path) return '';
        return path.toLowerCase()
            .replace(/\/index\.html$/, '')
            .replace(/\/$/, '') || '/';
    };

    const normalizedCurrent = normalizePath(currentPath);

    // Helper to check if a link points to the current page
    const isActive = (link) => {
        try {
            const linkUrl = new URL(link.href, window.location.origin);
            const normalizedLink = normalizePath(linkUrl.pathname);

            // 1. Exact match (Home or deep link matching current)
            const isExact = normalizedCurrent === normalizedLink;

            // 2. Sub-page match (e.g., /services/ highlights /services)
            // We only allow this for paths deeper than / to avoid Home matching everything
            const isSubPage = (normalizedLink !== '/' &&
                normalizedLink.length > 2 &&
                normalizedCurrent.startsWith(normalizedLink + '/'));

            if (isExact || isSubPage) {
                // EXCLUSION: Don't highlight if it's just an anchor on the same page
                // We check if the pathname (after removing index.html) is identical
                const currentFull = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
                const linkFull = linkUrl.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';

                if (linkUrl.hash && currentFull === linkFull) {
                    return false;
                }
                return true;
            }
        } catch (e) { return false; }
        return false;
    };

    navLinks.forEach(link => {
        // 6a. Apply Initial Active State
        if (isActive(link)) {
            link.classList.add('active-nav-link');
            link.style.color = '#FFAB40'; // ccg-gold
            link.style.fontWeight = '800';

            // Highlight parent if in dropdown
            const parentGroup = link.closest('.group');
            if (parentGroup) {
                const parentLink = parentGroup.querySelector('a');
                if (parentLink && parentLink !== link) {
                    parentLink.style.color = '#FFAB40';
                    parentLink.style.fontWeight = '800';
                }
            }
        }

        // 6b. Desktop Hover Effect
        if (window.innerWidth >= 1024 && link.closest('#site-header')) {
            link.style.transition = 'all 0.3s ease';
            link.style.borderRadius = '0.75rem';

            link.addEventListener('mouseenter', () => {
                link.style.backgroundColor = '#003B5C'; // ccg-navy
                link.style.color = '#FFAB40'; // ccg-gold
            });

            link.addEventListener('mouseleave', () => {
                link.style.backgroundColor = '';
                // Only return to gold if truly active for this page
                link.style.color = isActive(link) ? '#FFAB40' : '';
            });
        }
    });
});
