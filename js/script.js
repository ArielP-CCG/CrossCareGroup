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

    // Parallax Orbs
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        document.querySelectorAll('.glow-orb').forEach((orb, index) => {
            const speed = (index + 1) * 0.15;
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // 4. Form Handling moved to forms.js
    // 5. Sticky Header Resize on Scroll
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }

    // 6. Navigation Active State Highlight
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('#site-header nav a, #mobile-menu nav a');

    // Simple helper to check if a link points to the current page
    const isCurrentPage = (linkUrl) => {
        const normalize = (path) => path.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
        const normalizedCurrent = normalize(currentPath);
        const normalizedLink = normalize(linkUrl.pathname);
        return normalizedCurrent === normalizedLink;
    };

    navLinks.forEach(link => {
        try {
            const linkUrl = new URL(link.href, window.location.origin);

            // 6a. Apply Active State
            if (isCurrentPage(linkUrl)) {
                link.classList.add('active-nav-link');
                link.style.color = '#FFAB40'; // ccg-gold

                // Highlight parent if in dropdown
                const parentGroup = link.closest('.group');
                if (parentGroup) {
                    const parentLink = parentGroup.querySelector('a');
                    if (parentLink && parentLink !== link) {
                        parentLink.style.color = '#FFAB40';
                    }
                }
            }

            // 6b. Desktop Hover Background Effect (lg screens only)
            if (window.innerWidth >= 1024 && link.closest('#site-header')) {
                link.style.borderRadius = '0.75rem';
                link.style.paddingTop = '0.5rem';
                link.style.paddingBottom = '0.5rem';

                link.addEventListener('mouseenter', () => {
                    link.style.backgroundColor = '#003B5C'; // ccg-navy
                    link.style.color = '#FFAB40'; // ccg-gold
                });

                link.addEventListener('mouseleave', () => {
                    link.style.backgroundColor = '';
                    // Return to active color if it's the current page, otherwise reset
                    link.style.color = isCurrentPage(linkUrl) ? '#FFAB40' : '';
                });
            }
        } catch (e) {
            console.error('Nav logic error:', e);
        }
    });
});
