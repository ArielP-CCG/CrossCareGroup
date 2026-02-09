/**
 * Jobs Page Logic
 * Handles job listing data, rendering, and filtering.
 * Enhanced with premium UI/UX design.
 */

const jobsData = [
    {
        id: "support-worker",
        title: "Support Worker (Community Care)",
        roleType: "support",
        roleLabel: "Support Work",
        roleColor: "bg-ccg-teal",
        roleColorText: "text-ccg-teal",
        locations: ["Queensland", "New South Wales", "Tasmania"],
        locationDisplay: "QLD / NSW / TAS",
        type: "Casual / Part-time",
        description: "Support people with daily living and community participation while following a clear support plan.",
        highlights: [
            "Person-centred support",
            "Clear documentation"
        ],
        applyLink: "../../careers/expression-of-interest/?role=Support%20Worker&location=Queensland",
        applyText: "Apply via EOI",
        aboutLink: "../../services/community-care/",
        aboutText: "About Community Care"
    },
    {
        id: "registered-nurse",
        title: "Registered Nurse (In-home)",
        roleType: "nursing",
        roleLabel: "Nursing",
        roleColor: "bg-ccg-gold",
        roleColorText: "text-ccg-gold",
        locations: ["Queensland"],
        locationDisplay: "Queensland",
        type: "Part-time / Casual",
        description: "Support safe transitions from hospital to home through clinically governed care and clear communication.",
        highlights: [
            "Clinical supports",
            "Safe escalation"
        ],
        applyLink: "../../careers/expression-of-interest/?role=Registered%20Nurse&location=Queensland",
        applyText: "Apply via EOI",
        aboutLink: "../../services/hospital-to-home/",
        aboutText: "About Hospital-to-Home"
    },
    {
        id: "occupational-therapist",
        title: "Occupational Therapist",
        roleType: "allied",
        roleLabel: "Allied Health",
        roleColor: "bg-ccg-teal",
        roleColorText: "text-ccg-teal",
        locations: ["New South Wales", "Queensland", "Tasmania"],
        locationDisplay: "NSW / QLD / TAS",
        type: "Contract / Part-time",
        description: "Provide OT assessment and interventions that improve safety, function and independence at home.",
        highlights: [
            "Functional assessments",
            "Practical recommendations"
        ],
        applyLink: "../../careers/expression-of-interest/?role=Occupational%20Therapist&location=New%20South%20Wales",
        applyText: "Apply via EOI",
        aboutLink: "../../services/allied-health/",
        aboutText: "About Allied Health"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('jobsGrid');
    const filterLoc = document.getElementById('filterLocation');
    const filterType = document.getElementById('filterRoleType');
    const filterKey = document.getElementById('filterKeyword');
    const resultsCount = document.getElementById('resultsCount');

    if (!grid) return;

    function render() {
        // Safe access to values
        const loc = filterLoc ? filterLoc.value : 'all';
        const type = filterType ? filterType.value : 'all';
        const keyword = filterKey ? (filterKey.value || '').toLowerCase().trim() : '';

        const filtered = jobsData.filter(job => {
            const locMatch = loc === 'all' || job.locations.includes(loc);
            const typeMatch = type === 'all' || job.roleType === type;
            const content = `${job.title} ${job.description} ${job.roleLabel}`.toLowerCase();
            const keyMatch = !keyword || content.includes(keyword);
            return locMatch && typeMatch && keyMatch;
        });

        const count = filtered.length;
        if (resultsCount) {
            resultsCount.innerHTML = `
                <span class="w-2 h-2 bg-ccg-teal rounded-full animate-pulse"></span>
                Showing ${count} role${count === 1 ? '' : 's'}
            `;
        }

        if (count === 0) {
            grid.innerHTML = `
                <div class="col-span-full py-20 text-center flex flex-col items-center justify-center opacity-60">
                    <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                        <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <p class="text-2xl font-black text-ccg-navy mb-2">No roles found</p>
                    <p class="text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(job => `
            <article class="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden" data-reveal
                data-location="${job.locations.join('|')}" data-role-type="${job.roleType}">
                
                <!-- Top Accent Line -->
                <div class="absolute top-0 left-0 right-0 h-1.5 ${job.roleColor} opacity-80"></div>
                
                <div class="p-8 md:p-10 flex flex-col h-full">
                    <!-- Header -->
                    <div class="flex items-center gap-3 mb-6">
                        <span class="relative flex h-3 w-3">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${job.roleColor} opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-3 w-3 ${job.roleColor}"></span>
                        </span>
                        <span class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:${job.roleColorText} transition-colors">${job.roleLabel}</span>
                    </div>

                    <!-- Title -->
                    <h3 class="text-3xl font-black text-ccg-navy mb-4 leading-[1.1] group-hover:text-ccg-gold/90 transition-colors">${job.title}</h3>
                    
                    <!-- Metadata -->
                    <div class="flex flex-wrap gap-2 mb-6">
                         <span class="inline-flex items-center px-3 py-1 rounded-md bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border border-slate-100">
                            ${job.locationDisplay}
                        </span>
                        <span class="inline-flex items-center px-3 py-1 rounded-md bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border border-slate-100">
                            ${job.type}
                        </span>
                    </div>

                    <!-- Description -->
                    <p class="text-slate-500 leading-relaxed mb-8 border-l-2 border-slate-100 pl-4">${job.description}</p>

                    <!-- Highlights -->
                    <div class="mb-10 space-y-3 bg-slate-50/50 p-6 rounded-2xl border border-slate-100/50">
                        ${job.highlights.map(highlight => `
                            <div class="flex items-start gap-4">
                                <div class="mt-0.5 min-w-[18px] w-[18px] h-[18px] rounded-full ${job.roleColor}/10 flex items-center justify-center">
                                    <svg class="w-2.5 h-2.5 ${job.roleColorText}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <span class="text-sm font-bold text-ccg-navy/70">${highlight}</span>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Buttons -->
                    <div class="flex flex-col gap-4 mt-auto">
                        <a href="${job.applyLink}" 
                           class="relative overflow-hidden w-full bg-ccg-navy text-white text-center py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-ccg-gold hover:text-ccg-navy transition-all duration-300 shadow-lg shadow-navy/10 hover:shadow-gold/20 group/btn">
                           <span class="relative z-10">Apply via EOI</span>
                        </a>
                        
                        <a href="${job.aboutLink}" 
                           class="w-full bg-white text-ccg-navy border-2 border-slate-100 text-center py-3.5 rounded-xl font-black uppercase tracking-widest text-xs hover:border-ccg-navy transition-all duration-300">
                           ${job.aboutText}
                        </a>
                    </div>
                </div>
            </article>
        `).join('');
    }

    [filterLoc, filterType, filterKey].forEach(el => el && el.addEventListener('input', render));

    // Initial render
    render();
});
