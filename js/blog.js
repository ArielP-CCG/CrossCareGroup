/**
 * Blog Page Logic
 * Handles articles data, rendering, filtering, search, and modal interactions.
 */

console.log("Blog script loaded");

const articles = [
    {
        id: "article-hospital-to-home-1",
        category: "hospital-to-home",
        categoryLabel: "Hospital to Home",
        title: "Seamless Transitions: From Hospital Ward to Home Comfort",
        date: "Feb 8, 2024",
        readTime: "4 min read",
        image: "../../images/blog-hospital-to-home.png",
        excerpt:
            "Explore the critical steps in transitioning from hospital to home, and how dedicated support can reduce readmission risks and speed up recovery.",
        body: [
            { type: "heading", content: "The Critical Transition Phase" },
            {
                type: "paragraph",
                content:
                    "Leaving the hospital is a significant milestone in any recovery journey. It signals a move away from acute care and back towards independence. However, the first few weeks at home are crucial. Without the right support, this transition can be overwhelming and fraught with challenges.",
            },
            {
                type: "paragraph",
                content:
                    "At Cross Care Group, we specialise in bridging this gap. We understand that recovery doesn’t stop at the hospital exit doors; it continues in the comfort and familiarity of your own home.",
            },
            { type: "heading", content: "Clinical Expertise at Home" },
            {
                type: "paragraph",
                content:
                    "One of the biggest concerns during this transition is the loss of immediate clinical oversight. Our Hospital to Home service addresses this by brings essential care directly to your living room.",
            },
            {
                type: "paragraph",
                content:
                    "From medication management and wound care to monitoring vital signs, our registered nurses and support staff ensure that your medical needs are met with the highest standards of safety and professionalism.",
            },
            { type: "heading", content: "Reducing Readmission Risks" },
            {
                type: "paragraph",
                content:
                    "Studies show that proper post-acute support significantly lowers the chance of hospital readmission. By having a dedicated team to identify early warning signs and manage complications, we help you stay safely at home.",
            },
            {
                type: "paragraph",
                content:
                    "Our approach is proactive, not reactive. We work closely with your hospital discharge team to create a seamless care plan that anticipates your needs before you even walk through your front door.",
            },
            { type: "heading", content: "Restoring Confidence" },
            {
                type: "paragraph",
                content:
                    "Beyond the physical aspects, returning home can be emotionally taxing. Our support workers provide the reassurance and companionship needed to rebuild confidence, empowering you to reclaim your daily routine at your own pace.",
            },
        ],
    },
    {
        id: "article-community-care-1",
        category: "community-care",
        categoryLabel: "Community Care",
        title: "Empowering Independence: The Heart of Community Care",
        date: "Feb 5, 2024",
        readTime: "5 min read",
        image: "../../images/blog-community-care.png",
        excerpt:
            "Discover how community care services support individuals to live independently, stay connected, and thrive in their own homes and neighbourhoods.",
        body: [
            { type: "heading", content: "More Than Just Support" },
            {
                type: "paragraph",
                content:
                    "Community care is fundamentally about fostering a sense of belonging and autonomy. It allows individuals who might otherwise need institutional care to remain in the homes they love, surrounded by the memories and communities they cherish.",
            },
            {
                type: "paragraph",
                content:
                    "At Cross Care Group, we believe that support should be an enabler, not a limitation. Our goal is to provide just the right amount of assistance to help you maintain your independence without compromising your dignity.",
            },
            { type: "heading", content: "Staying Connected" },
            {
                type: "paragraph",
                content:
                    "Isolation can be a major challenge for many living with disabilities or age-related conditions. Community care plays a vital role in combating loneliness by facilitating social connections.",
            },
            {
                type: "paragraph",
                content:
                    "Whether it’s assistance with grocery shopping, transport to social clubs, or simply a companion for a morning coffee, our support workers are there to ensure you remain an active and valued member of your community.",
            },
            { type: "heading", content: "Tailored to You" },
            {
                type: "paragraph",
                content:
                    "No two individuals are alike, and neither are our care plans. We take a person-centred approach, listening to your preferences, goals, and routines to design a support structure that fits seamlessly into your life.",
            },
            {
                type: "paragraph",
                content:
                    "From assistance with daily household tasks and meal preparation to personal care and mobility support, our services are flexible and adaptable, changing as your needs change.",
            },
            { type: "heading", content: "A Partnership of Trust" },
            {
                type: "paragraph",
                content:
                    "Inviting someone into your home requires trust. We pride ourselves on building strong, respectful relationships with our clients. Our support workers are not just service providers; they are partners in your journey towards a fulfilling and independent life.",
            },
        ],
    },
    {
        id: "article-1",
        category: "allied-health",
        categoryLabel: "Allied Health",
        title: "Rheumatoid Arthritis and the Role of Physical Exercise",
        date: "Feb 1, 2024",
        readTime: "6 min read",
        image: "../../images/blog-allied-health-article-1.png",
        excerpt:
            "A plain-language guide to how tailored, low-impact exercise can help manage rheumatoid arthritis—reducing pain and stiffness, improving strength and mobility, and supporting overall wellbeing.",
        body: [
            {
                type: "paragraph",
                content:
                    "Rheumatoid arthritis (RA) is a chronic autoimmune disease impacting not only joints but also significantly affecting overall quality of life. The discomfort and stiffness that accompany RA often lead to reduced physical activity. However, it’s important to understand the beneficial dynamics between rheumatoid arthritis and exercise.",
            },
            {
                type: "paragraph",
                content:
                    "Engaging in regular, specifically designed physical activity is crucial for individuals with rheumatoid arthritis. It can notably decrease joint pain, enhance flexibility, boost muscle strength, and improve general wellbeing. Incorporating low-impact exercises such as walking, cycling, aquatic aerobics, swimming, and yoga can be an effective way to integrate exercise into daily life.",
            },
            {
                type: "paragraph",
                content:
                    "At the core of managing RA lies a paradox: the need for physical activity despite experiencing pain and discomfort. Contrary to possibly causing more pain, well-chosen and appropriate exercises can actually serve as a valuable tool in managing RA symptoms.",
            },
            { type: "heading", content: "The Benefits of Exercise for Rheumatoid Arthritis Management" },
            {
                type: "paragraph",
                content:
                    "Exercise plays a vital role in managing RA, offering multiple health benefits that might appear counterintuitive initially. Moving joints that are affected by RA pain can actually lead to significant improvements.",
            },
            { type: "heading", content: "To find out more, reach out!" },
        ],
    },
    {
        id: "article-complex-care-24-7",
        category: "complex-care",
        categoryLabel: "Complex Care",
        title: "24/7 Care for Complex Needs: A Cross Care Group Approach",
        date: "Jan 30, 2024",
        readTime: "4 min read",
        image: "../../images/blog-complex-care-article-24-7.png",
        excerpt:
            "An overview of Cross Care Group’s 24/7 complex care approach—personalised support plans, continuous staffing, and NDIS-aligned care that adapts as needs change.",
        body: [
            { type: "heading", content: "Complexity simplified" },
            {
                type: "paragraph",
                content:
                    "At Cross Care Group, we understand that each individual with complex needs has a unique story. Our mission is to provide comprehensive 24/7 care that addresses not just the physical aspects of these needs, but the emotional and social ones as well.",
            },
            {
                type: "paragraph",
                content:
                    "Because needs can change, we prioritise flexibility in care planning. Our care plans are regularly reviewed and updated to ensure support remains relevant, effective, and aligned to current needs.",
            },
        ],
    },
    {
        id: "article-complex-care-needs-aus",
        category: "complex-care",
        categoryLabel: "Complex Care",
        title: "Understanding the Needs of Complex Care Patients in Australia",
        date: "Jan 23, 2024",
        readTime: "3 min read",
        image: "../../images/blog-complex-care-understanding-needs-australia.png",
        excerpt:
            "An overview of who complex care patients are in Australia, why their needs are multifaceted, and how a coordinated, multidisciplinary approach supports better outcomes.",
        body: [
            {
                type: "paragraph",
                content:
                    "Complex care patients in Australia are individuals who require intensive, multidisciplinary medical care due to multiple, chronic, or severe health conditions.",
            },
            {
                type: "paragraph",
                content:
                    "A patient-centred, multidisciplinary approach is essential to help people live fulfilling, as-independent-as-possible lives while managing high or changing support needs.",
            },
        ],
    },
    {
        id: "article-tailored-care-plans-complex-care",
        category: "complex-care",
        categoryLabel: "Complex Care",
        title: "Tailored Care Plans: Pioneering Success in Complex Care",
        date: "Dec 14, 2023",
        readTime: "5 min read",
        image: "../../images/blog-complex-care-tailored-care-plans.png",
        excerpt:
            "A plain-language look at why personalised NDIS care plans matter—built through collaboration, customised to the individual, and continuously updated to achieve meaningful outcomes.",
        body: [
            { type: "heading", content: "Conclusion" },
            {
                type: "paragraph",
                content:
                    "Cross Care Group’s commitment to crafting tailored care plans aligned with best-practice NDIS provision reflects a personalised approach aimed at transforming lives.",
            },
        ],
    },
];

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const grid = document.getElementById("articles-grid");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const searchInput = document.getElementById("blog-search");

    // Modal Elements
    const modal = document.getElementById("article-modal");
    const modalContainer = document.getElementById("article-details-container");
    const modalCloseBtn = document.getElementById("close-modal");
    const modalContent = document.getElementById("modal-content");

    // State
    let activeFilter = "all";
    let activeSearch = "";
    let lastFocusedElement = null;

    if (!grid) return; // Exit if not on blog page

    // ---- Helpers ----

    function escapeHtml(str) {
        return String(str)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function hasAnyContent() {
        return Array.isArray(articles) && articles.length > 0;
    }

    function showLoadingSkeleton() {
        grid.innerHTML = `
      ${Array.from({ length: 6 })
                .map(
                    () => `
        <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-pulse">
          <div class="h-64 bg-slate-100"></div>
          <div class="p-8">
            <div class="h-3 w-2/3 bg-slate-100 rounded mb-4"></div>
            <div class="h-8 w-full bg-slate-100 rounded mb-4"></div>
            <div class="h-3 w-full bg-slate-100 rounded mb-2"></div>
            <div class="h-3 w-5/6 bg-slate-100 rounded mb-8"></div>
            <div class="h-3 w-1/3 bg-slate-100 rounded"></div>
          </div>
        </div>
      `
                )
                .join("")}
    `;
    }

    function showComingSoonState() {
        grid.innerHTML = `
      <div class="col-span-full py-20 text-center flex flex-col items-center">
        <div class="bg-white border border-slate-100 shadow-sm p-10 rounded-[3rem] max-w-2xl w-full">
          <div class="mx-auto w-16 h-16 rounded-2xl bg-ccg-gold/10 flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-ccg-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-black text-ccg-navy mb-3">Articles are coming soon</h2>
          <p class="text-slate-500 font-medium leading-relaxed">
            This page is set up as a searchable hub. We’re currently preparing our first set of articles and will publish them here shortly.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="../../get-support/" class="bg-ccg-navy text-white px-8 py-4 rounded-full font-bold hover:bg-ccg-gold hover:text-ccg-navy transition-all">
              Get Support
            </a>
            <a href="../../contact/" class="bg-white border border-slate-200 text-ccg-navy px-8 py-4 rounded-full font-bold hover:border-ccg-gold hover:bg-ccg-gold/10 transition-all">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    `;
    }

    function showNoResultsState() {
        grid.innerHTML = `
      <div class="col-span-full py-20 text-center flex flex-col items-center">
        <div class="bg-slate-50 p-6 rounded-full mb-4">
          <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <p class="text-slate-600 font-black text-2xl">No results found</p>
        <p class="text-slate-400 text-sm mt-2">Try a different search or clear your filters.</p>
        <button id="clear-filters"
          class="mt-8 bg-white border border-slate-200 text-ccg-navy px-8 py-4 rounded-full font-bold hover:border-ccg-gold hover:bg-ccg-gold/10 transition-all">
          Clear filters
        </button>
      </div>
    `;

        const clearBtn = document.getElementById("clear-filters");
        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                activeFilter = "all";
                activeSearch = "";
                if (searchInput) searchInput.value = "";
                setActiveFilterButton("all");
                renderArticles();
            });
        }
    }

    function setActiveFilterButton(filterValue) {
        filterBtns.forEach((b) => {
            const isActive = b.dataset.filter === filterValue;
            b.classList.toggle("active", isActive);

            if (isActive) {
                b.classList.add("bg-ccg-navy", "text-white");
                b.classList.remove("bg-white", "text-ccg-navy/60", "border-slate-200");
                b.setAttribute("aria-pressed", "true");
            } else {
                // keep their base classes but ensure consistent state
                b.classList.remove("bg-ccg-navy", "text-white");
                b.classList.add("bg-white", "text-ccg-navy/60", "border-slate-200");
                b.setAttribute("aria-pressed", "false");
            }
        });
    }

    function getFilteredArticles() {
        const search = activeSearch.trim().toLowerCase();
        return articles.filter((a) => {
            const matchesFilter = activeFilter === "all" || a.category === activeFilter;
            const matchesSearch =
                !search ||
                a.title.toLowerCase().includes(search) ||
                a.excerpt.toLowerCase().includes(search) ||
                (Array.isArray(a.body) &&
                    a.body.some((p) => String(p.content || "").toLowerCase().includes(search)));
            return matchesFilter && matchesSearch;
        });
    }

    // ---- Rendering ----

    function renderArticles() {
        // If the dataset is empty, don’t pretend it’s a filter hub.
        if (!hasAnyContent()) {
            showComingSoonState();
            return;
        }

        const filtered = getFilteredArticles();

        if (filtered.length === 0) {
            showNoResultsState();
            return;
        }

        grid.innerHTML = "";

        filtered.forEach((article) => {
            const card = document.createElement("div");
            card.className =
                "article-card bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col cursor-pointer overflow-hidden group focus-visible:ring-4 focus-visible:ring-ccg-gold focus:outline-none";
            card.setAttribute("tabindex", "0");
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `Read article: ${article.title}`);
            card.dataset.articleId = article.id;

            // Mouse click
            card.addEventListener("click", () => openModal(article.id, card));

            // Keyboard Enter/Space
            card.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openModal(article.id, card);
                }
            });

            card.innerHTML = `
        <div class="relative h-64 overflow-hidden">
          <img src="${escapeHtml(article.image)}" alt="" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-ccg-navy/40 to-transparent"></div>
          <div class="absolute top-6 left-6">
            <span class="bg-white/95 backdrop-blur-md text-ccg-navy px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              ${escapeHtml(article.categoryLabel)}
            </span>
          </div>
        </div>
        <div class="p-8 flex flex-col flex-1">
          <div class="flex items-center gap-3 mb-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <span>${escapeHtml(article.date)}</span>
            <span class="w-1 h-1 bg-ccg-gold rounded-full"></span>
            <span>${escapeHtml(article.readTime)}</span>
          </div>
          <h3 class="text-2xl font-black text-ccg-navy mb-4 leading-tight group-hover:text-ccg-teal transition-colors line-clamp-2">
            ${escapeHtml(article.title)}
          </h3>
          <p class="text-slate-500 text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
            ${escapeHtml(article.excerpt)}
          </p>
          <div class="flex items-center gap-2 text-ccg-gold font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-3 transition-all mt-auto">
            Read article
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </div>
        </div>
      `;

            grid.appendChild(card);
        });
    }

    // ---- Modal ----

    function openModal(id, triggerEl) {
        const article = articles.find((a) => a.id === id);
        if (!article) return;

        lastFocusedElement = triggerEl || document.activeElement;

        modalContainer.innerHTML = `
      <div class="p-8 md:p-16 max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 bg-[#F0F7F9] px-4 py-2 rounded-full mb-8">
            <span class="w-2 h-2 bg-ccg-gold rounded-full"></span>
            <span class="text-ccg-navy font-black text-[10px] uppercase tracking-widest leading-none">${escapeHtml(
            article.categoryLabel
        )}</span>
          </div>
          <h2 class="text-4xl md:text-6xl font-black text-ccg-navy mb-8 leading-[1.1] tracking-tight text-center">
            ${escapeHtml(article.title)}
          </h2>
          <div class="flex items-center justify-center gap-6 text-slate-400 font-bold text-[13px] uppercase tracking-[0.2em]">
            <span>${escapeHtml(article.date)}</span>
            <span class="w-1.5 h-1.5 bg-ccg-gold rounded-full"></span>
            <span>${escapeHtml(article.readTime)}</span>
          </div>
        </div>

        <div class="rounded-[3rem] overflow-hidden mb-16 shadow-2xl h-[400px]">
          <img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}" class="w-full h-full object-cover">
        </div>

        <div class="prose prose-xl max-w-none text-slate-600 font-medium leading-relaxed">
          ${Array.isArray(article.body)
                ? article.body
                    .map((item) => {
                        if (item.type === "heading") {
                            return `<h3 class="text-3xl font-black text-ccg-navy mt-12 mb-6">${escapeHtml(
                                item.content
                            )}</h3>`;
                        }
                        return `<p class="mb-8">${escapeHtml(item.content)}</p>`;
                    })
                    .join("")
                : ""}
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
            <a href="../../contact/" class="bg-ccg-gold text-ccg-navy px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-gold-500/10">
              TALK TO US
            </a>
          </div>
        </div>

        <button id="close-article-btn"
          class="mt-20 block mx-auto text-xs font-black text-ccg-navy hover:text-ccg-gold transition-colors uppercase tracking-[0.2em] bg-slate-50 px-10 py-4 rounded-full">
          Close Article
        </button>
      </div>
    `;

        // Show modal
        modal.classList.remove("invisible", "opacity-0");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        // Reset scroll inside modal content
        if (modalContent) modalContent.scrollTop = 0;

        // Focus close button
        if (modalCloseBtn) modalCloseBtn.focus();

        const innerClose = document.getElementById("close-article-btn");
        if (innerClose) innerClose.addEventListener("click", closeModal);
    }

    function closeModal() {
        modal.classList.add("invisible", "opacity-0");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
    }

    // ---- Event listeners ----

    // Filters
    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            activeFilter = btn.dataset.filter || "all";
            setActiveFilterButton(activeFilter);
            renderArticles();
        });
    });

    // Search
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            activeSearch = e.target.value || "";
            renderArticles();
        });
    }

    // Close button
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);

    // Overlay click
    const overlay = modal ? modal.querySelector(".modal-overlay") : null;
    if (overlay) overlay.addEventListener("click", closeModal);

    // Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && !modal.classList.contains("invisible")) {
            closeModal();
        }
    });

    // ---- Initial paint ----
    // Prevent “empty hub” perception: show skeleton immediately, then render.
    showLoadingSkeleton();
    // next tick so the skeleton paints even on fast loads
    setTimeout(() => {
        setActiveFilterButton(activeFilter);
        renderArticles();
    }, 0);
});
