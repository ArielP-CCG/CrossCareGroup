# Standard Header Template (Based on Accessibility Page)
# We will replace {{PATH}} with the correct relative path
$headerTemplate = @"
<header id="site-header"
    class="fixed top-0 left-0 w-full bg-[#003B5C] lg:bg-white z-[1000] border-b border-white/10 lg:border-navy/5 transition-all duration-500 ease-in-out h-24 lg:h-32">
    <div class="max-w-[1500px] mx-auto px-6 h-full flex items-center justify-between transition-all duration-500">
        <!-- Brand -->
        <a href="{{PATH}}"
            class="shrink-0 transition-transform duration-500 origin-left bg-white px-3 py-1.5 rounded-xl lg:bg-transparent lg:p-0"
            id="header-logo-link">
            <img src="{{PATH}}images/logo.png" alt="Cross Care Group"
                class="h-12 lg:h-16 w-auto transition-all duration-500" id="header-logo">
        </a>

        <!-- Nav Links -->
        <nav class="hidden lg:flex items-center gap-x-8">
            <a href="{{PATH}}get-support/"
                class="text-[17px] lg:text-[16px] font-semibold text-white lg:text-ccg-navy hover:text-ccg-gold px-3 transition-all">Get
                Support</a>
            <div class="relative group">
                <a href="{{PATH}}make-a-referral/"
                    class="text-[17px] lg:text-[16px] font-semibold text-white lg:text-ccg-navy group-hover:text-ccg-gold px-3 transition-all flex items-center gap-1">
                    For Referrers <span
                        class="text-[10px] opacity-70 group-hover:rotate-180 transition-transform">▼</span>
                </a>
                <!-- Dropdown -->
                <div
                    class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-navy/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[1100] py-3 overflow-hidden">
                    <a href="{{PATH}}make-a-referral/#referral-container"
                        class="block px-6 py-3 text-[14px] font-semibold text-ccg-navy/80 hover:text-white hover:bg-ccg-gold transition-all">Referral
                        Form</a>
                </div>
            </div>
            <div class="relative group">
                <a href="{{PATH}}services/community-care/"
                    class="text-[17px] lg:text-[16px] font-semibold text-white lg:text-ccg-navy group-hover:text-ccg-gold px-3 transition-all flex items-center gap-1">
                    Services <span
                        class="text-[10px] opacity-70 group-hover:rotate-180 transition-transform">▼</span>
                </a>
                <!-- Dropdown Menu -->
                <div
                    class="absolute top-[100%] left-0 w-64 bg-white rounded-2xl shadow-xl border border-navy/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[1100] py-3 overflow-hidden">
                    <a href="{{PATH}}services/community-care/"
                        class="block px-6 py-3 text-[14px] font-semibold text-ccg-navy/80 hover:text-white hover:bg-ccg-gold transition-all">Community
                        Care</a>
                    <a href="{{PATH}}services/allied-health/"
                        class="block px-6 py-3 text-[14px] font-semibold text-ccg-navy/80 hover:text-white hover:bg-ccg-gold transition-all">Allied
                        Health</a>
                    <a href="{{PATH}}services/hospital-to-home/"
                        class="block px-6 py-3 text-[14px] font-semibold text-ccg-navy/80 hover:text-white hover:bg-ccg-gold transition-all">Hospital
                        to Home</a>
                    <a href="{{PATH}}services/complex-care/"
                        class="block px-6 py-3 text-[14px] font-semibold text-ccg-navy/80 hover:text-white hover:bg-ccg-gold transition-all">Complex
                        Care</a>
                </div>
            </div>
            <a href="{{PATH}}why-cross-care/"
                class="text-[17px] lg:text-[16px] font-semibold text-white lg:text-ccg-navy hover:text-ccg-gold px-3 transition-all">About</a>
            <div class="relative group">
                <a href="{{PATH}}careers/jobs/"
                    class="text-[17px] lg:text-[16px] font-semibold text-white lg:text-ccg-navy group-hover:text-ccg-gold px-3 transition-all flex items-center gap-1">
                    Careers <span
                        class="text-[10px] opacity-70 group-hover:rotate-180 transition-transform">▼</span>
                </a>
                <!-- Dropdown -->
                <div
                    class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-navy/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[1100] py-3 overflow-hidden">
                    <a href="{{PATH}}careers/jobs/"
                        class="block px-6 py-3 text-[14px] font-semibold text-ccg-navy/80 hover:text-white hover:bg-ccg-gold transition-all">Open
                        Roles</a>
                    <a href="{{PATH}}careers/expression-of-interest/"
                        class="block px-6 py-3 text-[14px] font-semibold text-ccg-navy/80 hover:text-white hover:bg-ccg-gold transition-all">Expression
                        of Interest</a>
                </div>
            </div>

            <div class="relative group">
                <a href="{{PATH}}resources/easy-read/"
                    class="text-[17px] lg:text-[16px] font-semibold text-white lg:text-ccg-navy group-hover:text-ccg-gold px-3 transition-all flex items-center gap-1">
                    Resources <span
                        class="text-[10px] opacity-70 group-hover:rotate-180 transition-transform">▼</span>
                </a>
                <!-- Resources Dropdown -->
                <div
                    class="absolute top-[100%] left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-navy/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[1100] py-3 overflow-hidden">
                    <a href="{{PATH}}resources/blog/"
                        class="block px-6 py-3 text-[14px] font-semibold text-ccg-navy/80 hover:text-white hover:bg-ccg-gold transition-all">Blog</a>
                    <a href="{{PATH}}resources/easy-read/"
                        class="block px-6 py-3 text-[14px] font-semibold text-ccg-navy/80 hover:text-white hover:bg-ccg-gold transition-all">Easy
                        Read</a>
                    <a href="{{PATH}}resources/faqs/"
                        class="block px-6 py-3 text-[14px] font-semibold text-ccg-navy/80 hover:text-white hover:bg-ccg-gold transition-all">FAQs</a>
                    <a href="{{PATH}}resources/forms/"
                        class="block px-6 py-3 text-[14px] font-semibold text-ccg-navy/80 hover:text-white hover:bg-ccg-gold transition-all">Forms
                        & Documents</a>
                    <a href="{{PATH}}resources/guides/"
                        class="block px-6 py-3 text-[14px] font-semibold text-ccg-navy/80 hover:text-white hover:bg-ccg-gold transition-all">Guides
                        & Checklists</a>
                    <a href="{{PATH}}stories/"
                        class="block px-6 py-3 text-[14px] font-semibold text-ccg-navy/80 hover:text-white hover:bg-ccg-gold transition-all">Stories</a>
                </div>
            </div>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-x-2 lg:gap-x-6">
            <!-- CTA -->
            <a href="{{PATH}}contact/"
                class="hidden xl:flex items-center justify-center bg-ccg-gold text-ccg-navy px-8 py-4 rounded-full font-bold text-[16px] hover:bg-white transition-all hover:-translate-y-0.5 shadow-lg whitespace-nowrap">
                Contact
            </a>
            <a href="{{PATH}}get-support/#support-form-container"
                class="bg-ccg-gold text-ccg-navy px-4 py-2 lg:px-8 lg:py-4 rounded-full font-bold text-sm lg:text-[16px] hover:bg-white transition-all hover:-translate-y-0.5 shadow-lg whitespace-nowrap">
                Request Support
            </a>

            <!-- Mobile Toggle -->
            <button id="mobile-menu-toggle" class="lg:hidden p-2 text-white transition-colors hover:text-ccg-gold"
                aria-label="Toggle mobile menu">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path id="menu-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                        d="M4 6h16M4 12h16m-7 6h7"></path>
                    <path id="close-icon" class="hidden" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div id="mobile-menu"
        class="fixed inset-0 bg-[#003B5C] z-[999] opacity-0 invisible translate-x-full transition-all duration-300 lg:hidden text-center md:text-left">
        <!-- Fixed Back Button Overlay (Transparent background to allow in-line alignment) -->
        <div class="fixed top-0 left-0 w-full z-[1001] px-6 h-20 flex items-center pointer-events-none">
            <button id="mobile-menu-back"
                class="p-2 text-white hover:text-ccg-gold transition-colors pointer-events-auto"
                aria-label="Close menu">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7">
                    </path>
                </svg>
            </button>
        </div>
        <div class="flex flex-col h-full pt-20 px-6 pb-10 overflow-y-auto bg-[#003B5C] relative">
            <nav class="flex flex-col gap-y-4 mb-10 items-center">
                <a href="{{PATH}}"
                    class="text-3xl font-black text-white hover:text-ccg-gold transition-colors py-2">Home</a>
                <a href="{{PATH}}get-support/"
                    class="text-3xl font-black text-white hover:text-ccg-gold transition-colors py-2">Get
                    Support</a>
                <div class="flex flex-col gap-y-3 pt-4 items-center text-center">
                    <span class="text-xs font-black uppercase tracking-widest text-white/40">For Referrers</span>
                    <a href="{{PATH}}make-a-referral/#referral-container"
                        class="text-xl font-bold text-white hover:text-ccg-gold transition-colors">Referral
                        Form</a>
                </div>
                <div class="flex flex-col gap-y-3 pt-8 items-center text-center">
                    <span class="text-xs font-black uppercase tracking-widest text-white/40">Services</span>
                    <a href="{{PATH}}services/community-care/"
                        class="text-xl font-bold text-white hover:text-ccg-gold transition-colors">Community
                        Care</a>
                    <a href="{{PATH}}services/allied-health/"
                        class="text-xl font-bold text-white hover:text-ccg-gold transition-colors">Allied
                        Health</a>
                    <a href="{{PATH}}services/hospital-to-home/"
                        class="text-xl font-bold text-white hover:text-ccg-gold transition-colors">Hospital
                        to Home</a>
                    <a href="{{PATH}}services/complex-care/"
                        class="text-xl font-bold text-white hover:text-ccg-gold transition-colors">Complex
                        Care</a>
                </div>
                <a href="{{PATH}}why-cross-care/"
                    class="text-3xl font-black text-white hover:text-ccg-gold transition-colors py-2">About</a>
                <div class="flex flex-col gap-y-3 pt-8 items-center text-center">
                    <span class="text-xs font-black uppercase tracking-widest text-white/40">Careers</span>
                    <a href="{{PATH}}careers/jobs/"
                        class="text-xl font-bold text-white hover:text-ccg-gold transition-colors">Open
                        Roles</a>
                    <a href="{{PATH}}careers/expression-of-interest/"
                        class="text-xl font-bold text-white hover:text-ccg-gold transition-colors">Expression
                        of Interest</a>
                </div>
                <div class="flex flex-col gap-y-3 pt-8 items-center text-center">
                    <span class="text-xs font-black uppercase tracking-widest text-white/40">Resources</span>
                    <a href="{{PATH}}resources/blog/"
                        class="text-xl font-bold text-white hover:text-ccg-gold transition-colors">Blog</a>
                    <a href="{{PATH}}resources/easy-read/"
                        class="text-white/50 hover:text-ccg-gold transition-colors text-[14px] font-bold uppercase tracking-widest">Easy
                        Read</a>
                </div>

                <!-- Your Rights -->
                <div data-reveal>
                    <h3 class="text-white font-black text-xs uppercase tracking-[0.3em] mb-4">Your Rights</h3>
                    <ul class="space-y-3">
                        <li><a href="{{PATH}}legal/privacy-policy/"
                                class="text-white/50 hover:text-ccg-gold transition-colors text-[14px] font-bold uppercase tracking-widest">Our
                                Privacy Commitment</a></li>
                        <li><a href="{{PATH}}policies/"
                                class="text-white/50 hover:text-ccg-gold transition-colors text-[14px] font-bold uppercase tracking-widest">Our
                                Policies</a></li>
                        <li><a href="{{PATH}}legal/terms-of-use/"
                                class="text-white/50 hover:text-ccg-gold transition-colors text-[14px] font-bold uppercase tracking-widest">Terms
                                of Use</a></li>
                        <li><a href="{{PATH}}accessibility/"
                                class="text-white/50 hover:text-ccg-gold transition-colors text-[14px] font-bold uppercase tracking-widest">Accessibility</a>
                        </li>
                        <li><a href="{{PATH}}rights-feedback-complaints/#rights"
                                class="text-white/50 hover:text-ccg-gold transition-colors text-[14px] font-bold uppercase tracking-widest">Rights</a>
                        </li>
                        <li><a href="{{PATH}}rights-feedback-complaints/#feedback"
                                class="text-white/50 hover:text-ccg-gold transition-colors text-[14px] font-bold uppercase tracking-widest">Feedback</a>
                        </li>
                    </ul>
                </div>

                <!-- Contact -->
                <div data-reveal>
                    <h3 class="text-white font-black text-xs uppercase tracking-[0.3em] mb-4">Quick Contact</h3>
                    <div class="space-y-3 text-white/50 text-[14px]">
                        <div class="group">
                            <p class="text-[10px] font-black uppercase tracking-widest text-ccg-gold mb-1 opacity-50">
                                Head Office</p>
                            <p class="font-bold text-white/50 group-hover:text-ccg-gold transition-colors">1300 591 861
                            </p>
                        </div>
                        <div class="group">
                            <p class="text-[10px] font-black uppercase tracking-widest text-ccg-gold mb-1 opacity-50">
                                Email Enquiries</p>
                            <p
                                class="font-bold text-white/50 group-hover:text-ccg-gold transition-colors whitespace-nowrap">
                                clientservices@crosscaregroup.com.au</p>
                        </div>
                        <div class="group">
                            <p class="text-[10px] font-black uppercase tracking-widest text-ccg-gold mb-1 opacity-50">
                                Availability</p>
                            <p class="font-bold text-white/50">Mon–Fri: 8:30am – 5:30pm</p>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </div>
</header>
"@

$rootPath = Get-Location

# Function to update file
function Update-File ($relPath, $depthPath) {
    $fullPath = Join-Path $rootPath $relPath
    if (Test-Path $fullPath) {
        Write-Host "Updating $relPath..."
        $content = Get-Content -Raw $fullPath
        
        # Prepare Header
        $thisHeader = $headerTemplate -replace '\{\{PATH\}\}', $depthPath
        
        # 1. Replace existing <nav> OR <header>...
        # Legal pages have <nav class="...">...</nav>
        # Error pages usually have <header>...</header> or something different.
        
        # We try to match either:
        # <nav class="p-6.*?</nav> (Legal pages)
        # <header.*?</header> (System pages)
        
        # Regex for Legal Pages (Simplified Nav)
        $legalRegex = '(?s)<nav class="p-6.*?</nav>'
        if ($content -match $legalRegex) {
             $content = $content -replace $legalRegex, $thisHeader
        }
        
        # Regex for System Pages (Existing Header)
        # Be careful not to replace the just-inserted header if we run this logic blindly
        # But since we check match first, it should be ok.
        # Actually proper System pages like 404 might have <header class="site-header"...>
        $systemRegex = '(?s)<header.*?</header>'
        if ($content -match $systemRegex -and -not ($content -match $legalRegex)) { 
             # Only if we didn't just replace the nav. 
             # But wait, checking match again on $content might match the NEW header.
             # So we need to be careful.
             
             # Let's simple check if we are targeting legal or system.
             if ($relPath -like "*legal*" -or $relPath -like "*policies*") {
                 # Already handled by legalRegex usually, but policies might use header?
                 # Let's assume standard replacement of <header> is safe for others.
             } else {
                 $content = $content -replace $systemRegex, $thisHeader
             }
        }
        
        # 2. Inject Scripts
        # Check if script.js is present
        if (-not ($content -match 'src=".*?js/script\.js"')) {
            $scripts = @"
    <script src="${depthPath}js/script.js" defer></script>
    <script src="${depthPath}js/app.js" defer></script>
    <script src="${depthPath}js/config.js"></script>
    <script src="${depthPath}js/forms.js" defer></script>
</body>
"@
            $content = $content -replace '</body>', $scripts
        }
        
        Set-Content -Path $fullPath -Value $content -NoNewline
    } else {
        Write-Warning "File not found: $relPath"
    }
}

# Update Files
Update-File "legal\privacy-policy\index.html" "../../"
Update-File "legal\terms-of-use\index.html" "../../"
Update-File "policies\index.html" "../"
Update-File "404.html" "./"
Update-File "500.html" "./"
Update-File "403.html" "./"
Update-File "400.html" "./"
Update-File "503.html" "./"

Write-Host "Header Standardization Complete."
