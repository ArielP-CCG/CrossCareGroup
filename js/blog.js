/**
 * Blog Page Interactivity
 * Handles search, category filtering, and modal pop-outs for the redesigned blog page.
 */

const blogPosts = [
    {
        id: 'getting-started-community-care',
        category: 'community-care',
        categoryLabel: 'Community Care',
        title: 'Getting started with Community Care: what support at home looks like',
        date: 'Jan 12, 2026',
        readTime: '6 min',
        image: '../images/blog-community-care.png',
        excerpt: 'A plain-language overview of Community Care, who it may suit, and how to take the next step with a clear intake pathway.',
        body: [
            { type: 'paragraph', content: 'Community care is often the first step towards maintaining independence when daily tasks start to feel a little more challenging. It isn’t just about clinical support; it’s about ensuring you can continue living safely and comfortably in your own home, surrounded by your community.' },
            { type: 'heading', content: 'What exactly is Community Care?' },
            { type: 'paragraph', content: 'At its core, community care is a range of services tailored to your specific needs. This might include help with personal care, light domestic assistance like cleaning or meal preparation, or even social support to help you stay connected with friends and local groups.' },
            { type: 'paragraph', content: 'The beauty of this model is its flexibility. As your needs change, so can the level and type of support you receive. It’s a dynamic partnership between you, your family, and your care team.' },
            { type: 'heading', content: 'Is it right for you?' },
            { type: 'paragraph', content: 'If you’ve noticed that things like managing the house, getting to appointments, or even just feeling safe at home are becoming harder, community care could be the answer. It’s designed for anyone who wants to stay independent but needs a little extra help to do so.' },
            { type: 'paragraph', content: 'Taking the first step is often the hardest part, but it starts with a simple conversation. Our intake team focuses on understanding what matters most to you—whether that’s a tidy house, a healthy meal, or the confidence to visit the shops again.' }
        ]
    },
    {
        id: 'occupational-therapy-at-home-what-to-expect',
        category: 'allied-health',
        categoryLabel: 'Allied Health',
        title: 'Occupational Therapy at home: what to expect from an OT visit',
        date: 'Jan 12, 2026',
        readTime: '7 min',
        image: '../images/blog-allied-health.png',
        excerpt: 'What an OT appointment might include, how assessments support independence, and how Allied Health can coordinate with Community Care.',
        body: [
            { type: 'paragraph', content: 'Occupational Therapy (OT) is a specialized branch of healthcare that focuses on enabling people to do the things they want and need to do in their daily lives. When delivered in the home, it becomes even more powerful because it addresses your challenges exactly where they happen.' },
            { type: 'heading', content: 'The functional assessment' },
            { type: 'paragraph', content: 'A typical OT visit starts with a functional assessment. This isn’t a "test"—it’s a collaborative look at your daily routines. Your therapist will observe how you move through your home, how you manage kitchen tasks, and how you access your bathroom.' },
            { type: 'paragraph', content: 'This allows them to identify small barriers that might be impacting your independence. Often, these are things you’ve lived with for years without realizing there’s a safer or easier way.' },
            { type: 'heading', content: 'Practical solutions for everyday life' },
            { type: 'paragraph', content: 'Following the assessment, your OT will recommend practical solutions. This might include simple assistive devices (like long-handled reachers or shower chairs) or more permanent home modifications (like grab rails or ramps).' },
            { type: 'paragraph', content: 'They also provide education on energy conservation and safety techniques. The goal is always to empower you to do as much as possible for yourself, comfortably and safely.' }
        ]
    },
    {
        id: 'hospital-to-home-discharge-planning-checklist',
        category: 'hospital-to-home',
        categoryLabel: 'Hospital-to-Home',
        title: 'Hospital-to-Home discharge checklist: questions to ask',
        date: 'Jan 12, 2026',
        readTime: '8 min',
        image: '../images/blog-hospital-to-home.png',
        excerpt: 'A practical checklist to reduce uncertainty: medications, equipment, supports, follow-ups, and who to contact.',
        body: [
            { type: 'paragraph', content: 'Returning home after a hospital stay should be a time of recovery and relief, but it can often feel confusing and stressful. Discharge planning is the process of preparing for this move, and it’s critical for ensuring a safe and successful transition.' },
            { type: 'heading', content: 'The first 48 hours' },
            { type: 'paragraph', content: 'The most critical time is the first 48 hours back at home. Before you leave the hospital, you should have answers to key questions about your medications, any new equipment you need, and who you should contact if your symptoms change.' },
            { type: 'paragraph', content: 'Our Hospital-to-Home program is designed to bridge this gap. We work alongside hospital discharge teams to ensure that when you arrive home, your support is already in place.' },
            { type: 'heading', content: 'Your discharge checklist' },
            { type: 'paragraph', content: 'A good discharge plan includes a reconciliation of your medications, a schedule for follow-up appointments, and a clear understanding of your activity limits. It also identifies who will be helping with meals, cleaning, and personal care during those first few days.' },
            { type: 'paragraph', content: 'By being proactive and asking the right questions, you can significantly reduce the risk of needing to return to the hospital and focus entirely on your recovery.' }
        ]
    },
    {
        id: 'hospital-in-the-home-understanding-the-pathway',
        category: 'hospital-in-the-home',
        categoryLabel: 'Hospital-in-the-Home',
        title: 'Understanding the Hospital-in-the-Home pathway',
        date: 'Jan 12, 2026',
        readTime: '7 min',
        image: '../images/blog-hospital-in-the-home.png',
        excerpt: 'A general explainer of Hospital-in-the-Home style programs, what needs to be in place, and the importance of governance.',
        body: [
            { type: 'paragraph', content: 'Hospital-in-the-Home (HITH) is an innovative service that allows patients to receive acute-level hospital care in the comfort and privacy of their own home. It’s an increasingly popular option for conditions that require frequent clinical monitoring but don’t necessarily need a hospital bed.' },
            { type: 'heading', content: 'Hospital care without the hospital ward' },
            { type: 'paragraph', content: 'Under a HITH model, you remain under the care of a hospital specialist, but the actual treatment—such as IV antibiotics or complex wound care—is delivered at home by highly trained community nurses.' },
            { type: 'paragraph', content: 'This eliminates the stress of being in a hospital environment, which can often lead to better rest, improved appetite, and a faster overall recovery.' },
            { type: 'heading', content: 'Safety and monitoring' },
            { type: 'paragraph', content: 'Safety is the paramount consideration for HITH. It requires clear clinical governance, protocol-driven treatment pathways, and 24/7 escalation readiness. Not every condition is suitable for HITH, and eligibility is carefully assessed based on clinical stability and home safety.' },
            { type: 'paragraph', content: 'When implemented correctly, HITH provides a seamless extension of hospital care, allowing you to recover in the place where you feel most comfortable.' }
        ]
    },
    {
        id: 'rehab-in-the-home-supporting-recovery',
        category: 'rehab-in-the-home',
        categoryLabel: 'Rehab-in-the-Home',
        title: 'Rehab-in-the-Home: supporting recovery with goals',
        date: 'Jan 12, 2026',
        readTime: '7 min',
        image: '../images/blog-rehab-in-the-home.png',
        excerpt: 'How home-based rehab can support function and confidence after illness or injury, and what to prepare.',
        body: [
            { type: 'paragraph', content: 'Rehabilitation is about regaining function and confidence after an illness, injury, or surgery. While rehab wards have their place, "Rehab-in-the-Home" offers a unique advantage: you learn to master skills and movements in the exact environment where you need them daily.' },
            { type: 'heading', content: 'Goal-focused recovery' },
            { type: 'paragraph', content: 'Successful rehab is built on clear, personalized goals. Instead of just "getting stronger," we focus on "being able to make a cup of tea safely" or "navigating the front steps to get the mail." These "real-world" milestones are much more motivating and carry more meaning.' },
            { type: 'paragraph', content: 'Our team of therapists and nursing staff work together to create a program that challenges you while ensuring you always feel safe and supported.' },
            { type: 'heading', content: 'The role of the home environment' },
            { type: 'paragraph', content: 'Your home is the ultimate gym. Every doorway, chair, and hallway is a potential tool for recovery. By practicing your exercises and daily tasks in your own space, your progress translates directly into your everyday life.' },
            { type: 'paragraph', content: 'It also allows your family and carers to be directly involved, learning how to safely support your journey towards independence.' }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('[data-blog-search]');
    const filterButtons = document.querySelectorAll('[data-blog-filter]');
    const blogCards = document.querySelectorAll('[data-blog-card]');
    const countDisplay = document.querySelector('[data-blog-count]');
    const blogGrid = document.querySelector('.post-grid');
    const blogModal = document.getElementById('blog-modal');
    const modalContainer = document.getElementById('blog-details-container');
    const closeBtn = document.getElementById('close-blog-modal');
    const overlay = document.getElementById('blog-modal-overlay');

    if (!searchInput || !blogGrid) return;

    function filterPosts() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('[data-blog-filter].bg-ccg-navy')?.dataset.blogFilter || 'all';
        let visibleCount = 0;

        blogCards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            const text = card.querySelector('p').innerText.toLowerCase();
            const service = card.dataset.service;

            const matchesSearch = title.includes(searchTerm) || text.includes(searchTerm);
            const matchesFilter = activeFilter === 'all' || service === activeFilter;

            if (matchesSearch && matchesFilter) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (countDisplay) {
            countDisplay.innerText = `Showing ${visibleCount} Article${visibleCount !== 1 ? 's' : ''}`;
        }

        updateNoResultsMessage(visibleCount);
    }

    function updateNoResultsMessage(visibleCount) {
        let noResultsMsg = document.getElementById('no-results-message');

        if (visibleCount === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'no-results-message';
                noResultsMsg.className = 'col-span-full py-20 text-center animate-fade-in';
                noResultsMsg.innerHTML = `
                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
                        <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-ccg-navy mb-2">No articles found</h3>
                    <p class="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
                `;
                blogGrid.appendChild(noResultsMsg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    function openModal(id) {
        const post = blogPosts.find(p => p.id === id);
        if (!post) return;

        modalContainer.innerHTML = `
            <div class="p-8 md:p-16 lg:p-24">
                <!-- Blog Header -->
                <div class="max-w-3xl mx-auto mb-16 text-center">
                    <span class="inline-block bg-ccg-gold/10 text-ccg-navy px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-6 animate-fade-in">${post.categoryLabel}</span>
                    <h2 class="text-4xl md:text-5xl lg:text-6xl font-black text-ccg-navy mb-8 leading-[1.1] animate-fade-in-up">${post.title}</h2>
                    <div class="flex items-center justify-center gap-6 text-ccg-navy/40 font-bold text-[13px] uppercase tracking-widest animate-fade-in delay-200">
                        <span class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            ${post.date}
                        </span>
                        <span class="w-1 h-1 bg-ccg-gold rounded-full"></span>
                        <span class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            ${post.readTime}
                        </span>
                    </div>
                </div>

                <!-- Featured Image -->
                <div class="max-w-5xl mx-auto mb-16 rounded-[4rem] overflow-hidden shadow-2xl animate-fade-in delay-300">
                    <img src="${post.image}" alt="${post.title}" class="w-full h-auto object-cover max-h-[500px]">
                </div>

                <!-- Blog Content -->
                <div class="max-w-3xl mx-auto">
                    <div class="prose prose-lg prose-slate prose-headings:text-ccg-navy prose-headings:font-black prose-p:text-ccg-navy/70 prose-p:leading-relaxed space-y-8 animate-fade-in delay-400">
                        ${post.body.map(item => {
            if (item.type === 'heading') {
                return `<h3 class="text-3xl font-black mt-12 mb-6">${item.content}</h3>`;
            }
            return `<p class="text-xl leading-relaxed">${item.content}</p>`;
        }).join('')}
                    </div>

                    <!-- Article Footer -->
                    <div class="mt-24 pt-16 border-t border-slate-100 italic text-ccg-navy/40 text-sm">
                        Disclaimer: This article provides general information and does not constitute medical advice. Please consult with your clinical team for personalized support.
                    </div>

                    <!-- Call to Action -->
                    <div class="mt-16 p-10 md:p-12 bg-ccg-navy rounded-[3rem] text-white relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-ccg-gold/10 -skew-x-12 translate-x-1/2 -translate-y-1/2"></div>
                        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <h4 class="text-2xl md:text-3xl font-black mb-4">Ready to start your journey?</h4>
                                <p class="text-white/60 font-medium">Speak with our intake team about your specific support needs.</p>
                            </div>
                            <a href="../get-support/" class="bg-ccg-gold text-ccg-navy px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white transition-all whitespace-nowrap">
                                Request Support
                            </a>
                        </div>
                    </div>

                    <div class="mt-20 flex justify-center">
                        <button onclick="window.closeBlogModal()" class="group flex items-center gap-3 text-ccg-navy/40 hover:text-ccg-gold transition-colors font-black uppercase tracking-widest text-xs">
                            <span class="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-ccg-gold transition-colors">←</span>
                            Back to Articles
                        </button>
                    </div>
                </div>
            </div>
        `;

        blogModal.classList.remove('invisible', 'opacity-0', 'pointer-events-none');
        blogModal.classList.add('pointer-events-auto');
        document.body.style.overflow = 'hidden';
    }

    window.closeBlogModal = function () {
        blogModal.classList.add('invisible', 'opacity-0', 'pointer-events-none');
        blogModal.classList.remove('pointer-events-auto');
        document.body.style.overflow = '';
    };

    // Event Listeners
    searchInput.addEventListener('input', filterPosts);

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('bg-ccg-navy', 'text-white', 'shadow-lg', 'shadow-navy/10');
                b.classList.add('bg-white', 'text-ccg-navy/60', 'border', 'border-slate-200');
            });
            btn.classList.add('bg-ccg-navy', 'text-white', 'shadow-lg', 'shadow-navy/10');
            btn.classList.remove('bg-white', 'text-ccg-navy/60', 'border', 'border-slate-200');
            filterPosts();
        });
    });

    blogCards.forEach(card => {
        const links = card.querySelectorAll('a');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // Only intercept internal /blog/ links or clicks that should trigger the modal
                if (link.getAttribute('href').includes('/blog/')) {
                    e.preventDefault();
                    openModal(card.dataset.id);
                }
            });
        });

        // Also make card clickable (but not when clicking the CTA link if we add one)
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A' && !e.target.closest('a')) {
                openModal(card.dataset.id);
            }
        });
    });

    closeBtn.addEventListener('click', window.closeBlogModal);
    overlay.addEventListener('click', window.closeBlogModal);

    // Initial filter run to sync count
    filterPosts();
});
