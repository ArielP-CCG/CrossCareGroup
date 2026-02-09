/**
 * Blog Page Logic
 * Handles articles data, rendering, filtering, search, and modal interactions.
 */

// Blog Data
const articles = [
    {
        id: 'article-1',
        category: 'community-care',
        categoryLabel: 'Community Care',
        title: 'Getting started with Community Care: what support at home looks like',
        date: 'Jan 12, 2026',
        readTime: '6 min read',
        image: '../../images/blog-community-care.png',
        excerpt: 'A plain-language overview of Community Care, who it may suit, and how to take the next step with a clear intake pathway.',
        body: [
            { type: 'paragraph', content: 'Community care is often the first step towards maintaining independence when daily tasks start to feel a little more challenging. It’s not just about clinical support; it’s about ensuring you can continue living safely and comfortably in your own home, surrounded by your community.' },
            { type: 'heading', content: 'What exactly is Community Care?' },
            { type: 'paragraph', content: 'At its core, community care is a range of services tailored to your specific needs. This might include help with personal care, light domestic assistance like cleaning or meal preparation, or even social support to help you stay connected with friends and local groups.' },
            { type: 'paragraph', content: 'The beauty of this model is its flexibility. As your needs change, so can the level and type of support you receive. It’s a dynamic partnership between you, your family, and your care team.' },
            { type: 'heading', content: 'Is it right for you?' },
            { type: 'paragraph', content: 'If you’ve noticed that things like managing the house, getting to appointments, or even just feeling safe at home are becoming harder, community care could be the answer. It’s designed for anyone who wants to stay independent but needs a little extra help to do so.' },
            { type: 'paragraph', content: 'Taking the first step is often the hardest part, but it starts with a simple conversation. Our intake team focuses on understanding what matters most to you—whether that’s a tidy house, a healthy meal, or the confidence to visit the shops again.' }
        ]
    },
    {
        id: 'article-2',
        category: 'allied-health',
        categoryLabel: 'Allied Health',
        title: 'Occupational Therapy at home: what to expect from an OT visit',
        date: 'Jan 12, 2026',
        readTime: '7 min read',
        image: '../../images/blog-allied-health.png',
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
        id: 'article-3',
        category: 'hospital-to-home',
        categoryLabel: 'Hospital-to-Home',
        title: 'Hospital-to-Home discharge checklist: questions to ask',
        date: 'Jan 12, 2026',
        readTime: '8 min read',
        image: '../../images/blog-hospital-to-home.png',
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
        id: 'article-4',
        category: 'allied-health',
        categoryLabel: 'Allied Health',
        title: 'Why a hospital-to-home care plan is vital for success',
        date: 'Jan 15, 2026',
        readTime: '6 min read',
        image: '../../images/allied-health-featured.png',
        excerpt: 'Understanding the structured support needed to transition safely from clinical care to home comfort.',
        body: [
            { type: 'paragraph', content: 'Transitioning from the structured environment of a hospital to the comfort of home is a major milestone in any recovery journey. However, it requires careful planning to ensure that the clinical standards established in the hospital are maintained in the home setting.' },
            { type: 'heading', content: 'The components of a successful plan' },
            { type: 'paragraph', content: 'A robust care plan is more than just a schedule of visits. It encompasses medication management, wound care protocols, physical therapy exercises, and nutrition plans. It also identifies potential risks in the home environment and provides strategies to mitigate them.' },
            { type: 'paragraph', content: 'When these elements are coordinated effectively, the results are significant: lower readmission rates, improved functional outcomes, and a much higher level of patient and family satisfaction.' },
            { type: 'heading', content: 'Clinical Governance' },
            { type: 'paragraph', content: 'At Cross Care Group, we prioritize clinical governance. Every care plan is overseen by qualified clinical leads who ensure that all support staff are working towards the same goals and that any changes in status are addressed immediately.' }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {

    // Grid & Filter Logic
    const grid = document.getElementById('articles-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('blog-search');

    // Modal Logic
    const modal = document.getElementById('article-modal');
    const modalContainer = document.getElementById('article-details-container');

    if (!grid) return; // Exit if not on blog page

    function renderArticles(filter = 'all', search = '') {
        grid.innerHTML = '';
        const filtered = articles.filter(a => {
            const matchesFilter = filter === 'all' || a.category === filter;
            const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                a.excerpt.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = '<div class="col-span-full py-20 text-center text-slate-400 font-medium">No articles found matching your criteria.</div>';
            return;
        }

        filtered.forEach(article => {
            const card = document.createElement('div');
            card.className = 'article-card bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col cursor-pointer overflow-hidden group';
            card.onclick = () => openModal(article.id);

            card.innerHTML = `
                <div class="relative h-64 overflow-hidden">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-ccg-navy/40 to-transparent"></div>
                    <div class="absolute top-6 left-6">
                        <span class="bg-white/95 backdrop-blur-md text-ccg-navy px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">${article.categoryLabel}</span>
                    </div>
                </div>
                <div class="p-8 flex flex-col flex-1">
                    <div class="flex items-center gap-3 mb-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>${article.date}</span>
                        <span class="w-1 h-1 bg-ccg-gold rounded-full"></span>
                        <span>${article.readTime}</span>
                    </div>
                    <h3 class="text-2xl font-black text-ccg-navy mb-4 leading-tight group-hover:text-ccg-teal transition-colors line-clamp-2">${article.title}</h3>
                    <p class="text-slate-500 text-sm leading-relaxed mb-8 flex-1 line-clamp-3">${article.excerpt}</p>
                    <div class="flex items-center gap-2 text-ccg-gold font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-3 transition-all mt-auto">
                        Read article
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function openModal(id) {
        const article = articles.find(a => a.id === id);
        if (!article) return;

        modalContainer.innerHTML = `
            <div class="p-8 md:p-16 max-w-4xl mx-auto">
                <div class="text-center mb-16">
                    <div class="inline-flex items-center gap-2 bg-[#F0F7F9] px-4 py-2 rounded-full mb-8">
                        <span class="w-2 h-2 bg-ccg-gold rounded-full"></span>
                        <span class="text-ccg-navy font-black text-[10px] uppercase tracking-widest leading-none">${article.categoryLabel}</span>
                    </div>
                    <h2 class="text-4xl md:text-6xl font-black text-ccg-navy mb-8 leading-[1.1] tracking-tight text-center">${article.title}</h2>
                    <div class="flex items-center justify-center gap-6 text-slate-400 font-bold text-[13px] uppercase tracking-[0.2em]">
                        <span>${article.date}</span>
                        <span class="w-1.5 h-1.5 bg-ccg-gold rounded-full"></span>
                        <span>${article.readTime}</span>
                    </div>
                </div>

                <div class="rounded-[3rem] overflow-hidden mb-16 shadow-2xl h-[400px]">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover">
                </div>

                <div class="prose prose-xl max-w-none text-slate-600 font-medium leading-relaxed">
                    ${article.body.map(item => {
            if (item.type === 'heading') return `<h3 class="text-3xl font-black text-ccg-navy mt-12 mb-6">${item.content}</h3>`;
            return `<p class="mb-8">${item.content}</p>`;
        }).join('')}
                </div>

                <div class="mt-20 pt-12 border-t border-slate-100 italic text-slate-400 text-sm">
                    Disclaimer: This article provides general information and does not constitute clinical advice. Please consult with your medical practitioner or clinical lead for specific support questions.
                </div>

                <div class="mt-16 p-12 bg-ccg-navy rounded-[3rem] text-white relative overflow-hidden group">
                    <div class="absolute -right-10 -top-10 w-48 h-48 bg-ccg-gold/10 rounded-full blur-3xl transition-transform group-hover:scale-110"></div>
                    <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                        <div>
                            <h4 class="text-2xl font-black mb-2">Need a clinical transition plan?</h4>
                            <p class="text-white/60 font-medium">Our specialists help bridge the gap between hospital and home.</p>
                        </div>
                        <a href="../../contact/" class="bg-ccg-gold text-ccg-navy px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-gold-500/10">TALK TO US</a>
                    </div>
                </div>

                <button id="close-article-btn" class="mt-20 block mx-auto text-xs font-black text-ccg-navy hover:text-ccg-gold transition-colors uppercase tracking-[0.2em] bg-slate-50 px-10 py-4 rounded-full">Close Article</button>
            </div>
        `;

        modal.classList.remove('invisible', 'opacity-0');
        document.body.style.overflow = 'hidden';
        document.getElementById('modal-content').scrollTop = 0;

        // Bind close button
        document.getElementById('close-article-btn').addEventListener('click', closeModalFunc);
    }

    function closeModalFunc() {
        modal.classList.add('invisible', 'opacity-0');
        document.body.style.overflow = '';
    }

    // Event Listeners
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => {
                    b.classList.remove('active', 'bg-ccg-navy', 'text-white');
                    b.classList.add('bg-white', 'text-ccg-navy/60', 'border-slate-200');
                });
                btn.classList.add('active', 'bg-ccg-navy', 'text-white');
                btn.classList.remove('bg-white', 'text-ccg-navy/60', 'border-slate-200');
                renderArticles(btn.dataset.filter, searchInput.value);
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeBtn = document.querySelector('.filter-btn.active');
            const activeFilter = activeBtn ? activeBtn.dataset.filter : 'all';
            renderArticles(activeFilter, e.target.value);
        });
    }

    const modalCloseBtn = document.getElementById('close-modal');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModalFunc);

    if (modal) {
        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) overlay.addEventListener('click', closeModalFunc);
    }

    // Initial Render
    renderArticles();

});
