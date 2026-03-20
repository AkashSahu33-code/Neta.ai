/* ========================================
   NētāAI — Dashboard JavaScript
   AI Co-Pilot for Public Leaders
   ======================================== */

// ============================================================
// NAVIGATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDate();
    animateMetrics();
    initCharts();
    initActivityFeed();
    initAgentDemos();
    initLiveDemo();
    initMobileMenu();
    initSettings();
    initScenarioSelector();
    updateApiIndicator();
});

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.dataset.page;

            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            pages.forEach(p => p.classList.remove('active'));
            const target = document.getElementById(`page-${pageId}`);
            if (target) target.classList.add('active');

            // Close mobile sidebar
            document.getElementById('sidebar').classList.remove('open');
        });
    });

    // Agent status cards navigation
    document.querySelectorAll('.agent-status-card').forEach(card => {
        card.addEventListener('click', () => {
            const pageId = card.dataset.page;
            const navItem = document.querySelector(`[data-page="${pageId}"]`);
            if (navItem) navItem.click();
        });
    });
}

function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
}

function initDate() {
    const el = document.getElementById('dateDisplay');
    const now = new Date();
    el.textContent = now.toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}

// ============================================================
// ANIMATED COUNTERS
// ============================================================
function animateMetrics() {
    const counters = document.querySelectorAll('.metric-value');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateCount(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCount(el, target) {
    const duration = 1800;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(eased * target);

        if (target > 1000) {
            el.textContent = current.toLocaleString('en-IN');
        } else if (el.closest('#metric4')) {
            el.textContent = current + '%';
        } else {
            el.textContent = current.toLocaleString('en-IN');
        }

        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// ============================================================
// CHARTS
// ============================================================
function initCharts() {
    initSentimentChart();
    initVoterChart();
}

function initSentimentChart() {
    const ctx = document.getElementById('sentimentChart');
    if (!ctx) return;

    const labels = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    });

    const positiveData = [62, 65, 58, 70, 72, 68, 74, 71, 76, 73, 78, 75, 72, 69, 74, 77, 80, 78, 76, 82, 79, 75, 81, 84, 80, 77, 83, 86, 82, 85];
    const negativeData = [28, 25, 32, 22, 20, 24, 18, 21, 16, 19, 15, 18, 21, 24, 19, 16, 14, 16, 18, 12, 15, 19, 13, 10, 14, 17, 11, 9, 13, 10];
    const neutralData = [10, 10, 10, 8, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Positive',
                    data: positiveData,
                    borderColor: '#4F9CF7',
                    backgroundColor: 'rgba(79, 156, 247, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#4F9CF7'
                },
                {
                    label: 'Negative',
                    data: negativeData,
                    borderColor: '#FF6B9D',
                    backgroundColor: 'rgba(255, 107, 157, 0.05)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#FF6B9D'
                },
                {
                    label: 'Neutral',
                    data: neutralData,
                    borderColor: '#FFB347',
                    backgroundColor: 'rgba(255, 179, 71, 0.05)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#FFB347'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: { color: '#5a5d7a', font: { size: 10 }, maxTicksLimit: 10 }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: { color: '#5a5d7a', font: { size: 10 }, callback: v => v + '%' },
                    min: 0, max: 100
                }
            }
        }
    });
}

function initVoterChart() {
    const ctx = document.getElementById('voterChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Youth (18-35)', 'Farmers', 'Women', 'Businessmen', 'Senior Citizens', 'Others'],
            datasets: [{
                data: [34, 22, 18, 12, 9, 5],
                backgroundColor: ['#4F9CF7', '#4ECDC4', '#FF6B9D', '#FFB347', '#A78BFA', '#6B7280'],
                borderColor: 'rgba(6, 6, 15, 0.8)',
                borderWidth: 3,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#8e91b5',
                        font: { size: 11, family: 'Inter' },
                        padding: 12,
                        usePointStyle: true,
                        pointStyleWidth: 8
                    }
                }
            }
        }
    });
}

// ============================================================
// ACTIVITY FEED
// ============================================================
const activities = [
    { agent: 'blue', text: 'Agent 1 summarized "Budget Allocation FY 2025-26" — 23 action items extracted', time: '2 min ago' },
    { agent: 'green', text: 'Agent 2 completed booth analysis for Ward 14 (Booths 203-208) — 5 key segments identified', time: '5 min ago' },
    { agent: 'amber', text: 'Agent 3 verified road repair completion in Sector 15 — notification sent to 456 households', time: '8 min ago' },
    { agent: 'rose', text: 'Agent 4 detected negative sentiment spike on water supply issue in Sector 22 (+245% mentions)', time: '12 min ago' },
    { agent: 'blue', text: 'Agent 1 drafted speech for "Smart City Project Launch" — 2,400 words, formal tone', time: '18 min ago' },
    { agent: 'green', text: 'Agent 2 identified 890 PM-KISAN beneficiaries in Booth 205 — outreach priority: HIGH', time: '22 min ago' },
    { agent: 'rose', text: 'Agent 4 flagged: Booth 207 worker inactive for 5 days — escalation recommended', time: '28 min ago' },
    { agent: 'amber', text: 'Agent 3 generated micro-accountability report for streetlight installation (200 km covered)', time: '35 min ago' },
];

function initActivityFeed() {
    const feed = document.getElementById('activityFeed');
    if (!feed) return;
    renderActivities(feed);

    document.getElementById('refreshActivity')?.addEventListener('click', () => {
        feed.innerHTML = '';
        setTimeout(() => renderActivities(feed), 300);
    });
}

function renderActivities(container) {
    activities.forEach((a, i) => {
        const div = document.createElement('div');
        div.className = 'activity-item';
        div.style.animationDelay = `${i * 80}ms`;
        div.innerHTML = `
            <div class="activity-dot dot-${a.agent}"></div>
            <div class="activity-content">
                <p>${a.text}</p>
                <span class="activity-time">${a.time}</span>
            </div>
        `;
        container.appendChild(div);
    });
}

// ============================================================
// AGENT DEMO RESPONSES
// ============================================================
const agentResponses = {
    agent1: {
        summarize: [
            { type: 'heading', text: '📋 SUMMARY' },
            { type: 'bullet', text: '• Municipal Corp of Gurgaon allocated ₹450 crore for infrastructure in FY 2025-26' },
            { type: 'bullet', text: '• 5 key project areas identified across road, drainage, lighting, parks, and water supply' },
            '',
            { type: 'heading', text: '🔑 KEY INSIGHTS' },
            { type: 'bullet', text: '• Road widening (NH-48) gets the largest share at ₹120 crore (26.7% of total budget)' },
            { type: 'bullet', text: '• Water supply enhancement receives ₹170 crore (37.8%) — highest individual allocation' },
            { type: 'bullet', text: '• Smart streetlights cover 200 km — significant for safety and energy savings' },
            '',
            { type: 'heading', text: '⚡ ACTION POINTS' },
            { type: 'highlight', text: '1. Phase 1 Deadline: September 2025 — Monitor progress monthly' },
            { type: 'bullet', text: '2. Assign ward-level officers to track each project independently' },
            { type: 'bullet', text: '3. Schedule public review meeting by June 2025 (mid-phase checkpoint)' },
            { type: 'bullet', text: '4. Coordinate with NHAI for NH-48 road widening approvals' },
            '',
            { type: 'success', text: '✅ Document processed successfully. 4 action items, 3 insights generated.' },
        ],
        speech: [
            { type: 'heading', text: '🎤 DRAFT SPEECH — Budget Announcement' },
            '',
            { type: 'bullet', text: '"Respected citizens of Gurgaon,' },
            { type: 'bullet', text: 'Today, I am proud to announce a transformative ₹450 crore investment' },
            { type: 'bullet', text: 'in our city\'s infrastructure. This is not just a budget — it is our' },
            { type: 'bullet', text: 'commitment to building a smarter, safer, and more livable Gurgaon.' },
            '',
            { type: 'bullet', text: 'From wider roads on NH-48 to 200 km of smart streetlights,' },
            { type: 'bullet', text: 'from modern drainage systems to enhanced water supply —' },
            { type: 'bullet', text: 'every rupee will be spent with accountability and transparency.' },
            '',
            { type: 'highlight', text: 'Phase 1 will be completed by September 2025."' },
            '',
            { type: 'success', text: '✅ Speech draft generated. Word count: 156. Tone: Formal, Inspirational.' },
        ],
        extract: [
            { type: 'heading', text: '🔍 EXTRACTED ACTION ITEMS' },
            '',
            { type: 'highlight', text: '┌─ ITEM 1 ──────────────────────────────────────┐' },
            { type: 'bullet', text: '│ Project: Road widening on NH-48               │' },
            { type: 'bullet', text: '│ Budget: ₹120 crore                             │' },
            { type: 'bullet', text: '│ Owner: Municipal Corp + NHAI                   │' },
            { type: 'bullet', text: '│ Deadline: Sep 2025 (Phase 1)                   │' },
            { type: 'highlight', text: '└────────────────────────────────────────────────┘' },
            '',
            { type: 'highlight', text: '┌─ ITEM 2 ──────────────────────────────────────┐' },
            { type: 'bullet', text: '│ Project: Stormwater drainage (Sectors 45-57)   │' },
            { type: 'bullet', text: '│ Budget: ₹85 crore                              │' },
            { type: 'bullet', text: '│ Owner: Public Works Dept                       │' },
            { type: 'highlight', text: '└────────────────────────────────────────────────┘' },
            '',
            { type: 'highlight', text: '┌─ ITEM 3 ──────────────────────────────────────┐' },
            { type: 'bullet', text: '│ Project: Smart streetlights (200 km)           │' },
            { type: 'bullet', text: '│ Budget: ₹45 crore                              │' },
            { type: 'bullet', text: '│ Owner: Smart City SPV                          │' },
            { type: 'highlight', text: '└────────────────────────────────────────────────┘' },
            '',
            { type: 'success', text: '✅ 3 of 5 action items shown. Total budget tracked: ₹450 crore.' },
        ],
        brief: [
            { type: 'heading', text: '📋 MEETING BRIEFING DOCUMENT' },
            { type: 'bullet', text: 'Prepared for: MLA / Commissioner Review Meeting' },
            { type: 'bullet', text: 'Date: ' + new Date().toLocaleDateString('en-IN') },
            '',
            { type: 'heading', text: '📊 KEY STATISTICS' },
            { type: 'highlight', text: '• Total Budget: ₹450 crore | 5 Projects | Deadline: Sep 2025' },
            { type: 'bullet', text: '• Largest allocation: Water supply (₹170 Cr, 37.8%)' },
            { type: 'bullet', text: '• Coverage: 200 km streetlights, Sectors 45-57 drainage' },
            '',
            { type: 'heading', text: '⚠️ RISKS & RECOMMENDATIONS' },
            { type: 'bullet', text: '• NH-48 approval dependency — coordinate with NHAI early' },
            { type: 'bullet', text: '• Monsoon risk for drainage work — start by April' },
            { type: 'bullet', text: '• Recommend bi-weekly progress tracking dashboard' },
            '',
            { type: 'success', text: '✅ Brief generated. Ready for review.' },
        ]
    },

    agent2: {
        segment: [
            { type: 'heading', text: '📊 BOOTH SUMMARY — Ward 14, Booths 203-208' },
            { type: 'bullet', text: '• Total Voters: 12,450 | Sector 21-23, Gurgaon' },
            '',
            { type: 'heading', text: '👥 KEY SEGMENTS' },
            { type: 'highlight', text: '┌────────────────┬────────┬──────────┐' },
            { type: 'highlight', text: '│ Segment         │ Share  │ Count    │' },
            { type: 'highlight', text: '├────────────────┼────────┼──────────┤' },
            { type: 'bullet', text: '│ Jat Community   │ 35%    │ 4,358    │' },
            { type: 'bullet', text: '│ Yadav Community │ 20%    │ 2,490    │' },
            { type: 'bullet', text: '│ Muslim          │ 15%    │ 1,868    │' },
            { type: 'bullet', text: '│ SC/ST           │ 12%    │ 1,494    │' },
            { type: 'bullet', text: '│ Brahmin         │ 10%    │ 1,245    │' },
            { type: 'bullet', text: '│ Others          │ 8%     │ 995      │' },
            { type: 'highlight', text: '└────────────────┴────────┴──────────┘' },
            '',
            { type: 'heading', text: '🎯 INFLUENTIAL GROUPS' },
            { type: 'bullet', text: '• Jat Community (35%) — Dominant segment, farming background' },
            { type: 'bullet', text: '• Yadav Community (20%) — Active in local politics, key swing voters' },
            '',
            { type: 'heading', text: '🗺️ RECOMMENDED OUTREACH' },
            { type: 'bullet', text: '1. Water supply town hall in Sector 22 (65% complaints)' },
            { type: 'bullet', text: '2. Road repair visibility drive in Sector 21' },
            { type: 'bullet', text: '3. PM-KISAN camp for 890 beneficiaries at Booth 205' },
            '',
            { type: 'success', text: '✅ Segmentation complete. 6 segments, 3 outreach actions identified.' },
        ],
        booth: [
            { type: 'heading', text: '📍 BOOTH-LEVEL ANALYSIS' },
            '',
            { type: 'highlight', text: 'Booth 203: 2,100 voters | Major: Jat (40%) | Issue: Roads' },
            { type: 'highlight', text: 'Booth 204: 1,890 voters | Major: Yadav (35%) | Issue: Water' },
            { type: 'highlight', text: 'Booth 205: 2,450 voters | Major: Mixed | Issue: Water + Cattle' },
            { type: 'highlight', text: 'Booth 206: 1,780 voters | Major: Muslim (30%) | Issue: Sanitation' },
            { type: 'highlight', text: 'Booth 207: 2,130 voters | Major: SC/ST (25%) | Issue: Roads' },
            { type: 'highlight', text: 'Booth 208: 2,100 voters | Major: Brahmin (22%) | Issue: Water' },
            '',
            { type: 'heading', text: '🚨 PRIORITY BOOTHS' },
            { type: 'bullet', text: '• Booth 205 — Highest voter count, multiple issues, high scheme coverage' },
            { type: 'bullet', text: '• Booth 204 — Water crisis affecting core voter base' },
            '',
            { type: 'success', text: '✅ 6 booths analyzed. 2 priority booths flagged.' },
        ],
        beneficiary: [
            { type: 'heading', text: '🎯 SCHEME BENEFICIARY TRACKING' },
            '',
            { type: 'heading', text: '📋 PM-KISAN' },
            { type: 'bullet', text: '• Total beneficiaries: 890 (7.1% of total voters)' },
            { type: 'bullet', text: '• Concentrated in: Booth 205 (340), Booth 203 (250)' },
            { type: 'bullet', text: '• Pending enrollment: ~200 eligible farmers not yet enrolled' },
            '',
            { type: 'heading', text: '🔥 PM Ujjwala Yojana' },
            { type: 'bullet', text: '• Total beneficiaries: 1,200 (9.6% of voters)' },
            { type: 'highlight', text: '• Coverage: Strong in Booths 206-208, weak in 203-204' },
            '',
            { type: 'heading', text: '🏥 Ayushman Bharat' },
            { type: 'bullet', text: '• Total cards issued: 3,400 (27.3% of voters)' },
            { type: 'highlight', text: '• ⚠️ Gap: Booth 207 has only 12% coverage — needs camp' },
            '',
            { type: 'success', text: '✅ 3 schemes tracked. 5,490 total beneficiaries mapped.' },
        ],
        issues: [
            { type: 'heading', text: '⚠️ LOCAL ISSUE MAPPING — Ward 14' },
            '',
            { type: 'highlight', text: '🔴 CRITICAL: Irregular Water Supply' },
            { type: 'bullet', text: '   Complaints: 65% of residents | Sectors: 21, 22, 23' },
            { type: 'bullet', text: '   Duration: Ongoing for 3 weeks' },
            { type: 'bullet', text: '   Sentiment: Highly Negative | Risk: HIGH' },
            '',
            { type: 'highlight', text: '🟡 MODERATE: Broken Roads' },
            { type: 'bullet', text: '   Complaints: 40% | Primary: Sector 21 main road' },
            { type: 'bullet', text: '   Impact: Daily commuters, school buses affected' },
            '',
            { type: 'highlight', text: '🟢 EMERGING: Stray Cattle Menace' },
            { type: 'bullet', text: '   Complaints: 25% | Sectors: 22-23 evening hours' },
            { type: 'bullet', text: '   Trend: Rising (+15% in 2 weeks)' },
            '',
            { type: 'success', text: '✅ 3 issues mapped. 1 critical, 1 moderate, 1 emerging.' },
        ]
    },

    agent3: {
        track: [
            { type: 'heading', text: '🏗️ PROJECT TRACKING REPORT' },
            '',
            { type: 'highlight', text: '━━━ Road Resurfacing — Main Street, Sector 15 ━━━' },
            '',
            { type: 'bullet', text: '📌 Status: 85% Complete' },
            { type: 'bullet', text: '📅 Timeline: Jan 15 → Mar 30, 2025' },
            { type: 'bullet', text: '💰 Budget: ₹2.3 crore | Contractor: ABC Infrastructure' },
            { type: 'bullet', text: '🏘️ Affected: 456 households (Block A-D, Sector 15)' },
            '',
            { type: 'heading', text: '📊 PROGRESS BREAKDOWN' },
            { type: 'bullet', text: '✅ Existing road removed and graded — 100%' },
            { type: 'bullet', text: '✅ Base layer installed — 100%' },
            { type: 'bullet', text: '✅ Fresh asphalt laid — 100%' },
            { type: 'bullet', text: '✅ Drainage system installed — 100%' },
            { type: 'bullet', text: '⏳ Road markings and signage — 60%' },
            { type: 'bullet', text: '⏳ Streetlight repair (2 damaged) — Pending' },
            '',
            { type: 'heading', text: '⚠️ ISSUES' },
            { type: 'bullet', text: '• Minor delay due to rain (3 days lost)' },
            { type: 'bullet', text: '• 2 streetlights damaged during construction — repair pending' },
            '',
            { type: 'success', text: '✅ Project on track. Expected completion: March 25, 2025.' },
        ],
        verify: [
            { type: 'heading', text: '✅ COMPLETION VERIFICATION REPORT' },
            '',
            { type: 'heading', text: '📷 BEFORE vs AFTER EVIDENCE' },
            '',
            { type: 'highlight', text: '┌─ BEFORE ────────────────────────────────────┐' },
            { type: 'bullet', text: '│ • Multiple potholes (12+ reported)          │' },
            { type: 'bullet', text: '│ • Water logging during monsoon               │' },
            { type: 'bullet', text: '│ • No proper drainage                         │' },
            { type: 'bullet', text: '│ • Damaged road edges                         │' },
            { type: 'highlight', text: '└─────────────────────────────────────────────┘' },
            '',
            { type: 'highlight', text: '┌─ AFTER ─────────────────────────────────────┐' },
            { type: 'success', text: '│ ✓ Fresh asphalt — smooth surface            │' },
            { type: 'success', text: '│ ✓ New drainage system — water flow verified  │' },
            { type: 'success', text: '│ ✓ Road edges reinforced                      │' },
            { type: 'success', text: '│ ✓ Road markings — 60% done                  │' },
            { type: 'highlight', text: '└─────────────────────────────────────────────┘' },
            '',
            { type: 'heading', text: '📊 VERIFICATION STATUS' },
            { type: 'success', text: '• Physical inspection: PASSED ✓' },
            { type: 'success', text: '• Photo evidence: VERIFIED ✓' },
            { type: 'bullet', text: '• Citizen feedback: Pending (survey in progress)' },
            '',
            { type: 'success', text: '✅ Verification: 2/3 checks passed. Pending citizen survey.' },
        ],
        notify: [
            { type: 'heading', text: '📢 CITIZEN NOTIFICATION — Generated' },
            '',
            { type: 'heading', text: '🎯 TARGET AUDIENCE' },
            { type: 'bullet', text: '• Location: Sector 15, Block A-D' },
            { type: 'bullet', text: '• Households: 456' },
            { type: 'bullet', text: '• Channel: SMS + WhatsApp + App Push Notification' },
            '',
            { type: 'heading', text: '✉️ NOTIFICATION MESSAGE' },
            { type: 'highlight', text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
            { type: 'bullet', text: '🏗️ Development Update — Sector 15' },
            { type: 'bullet', text: '' },
            { type: 'bullet', text: 'Dear Resident,' },
            { type: 'bullet', text: '' },
            { type: 'bullet', text: 'We are happy to inform you that the road' },
            { type: 'bullet', text: 'resurfacing work on Main Street, Sector 15' },
            { type: 'bullet', text: 'is 85% complete. New asphalt road and drainage' },
            { type: 'bullet', text: 'system have been installed.' },
            { type: 'bullet', text: '' },
            { type: 'bullet', text: 'Remaining: Road markings (Est. completion: Mar 25)' },
            { type: 'bullet', text: '' },
            { type: 'bullet', text: 'Your MLA, [Name] — Committed to development.' },
            { type: 'highlight', text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
            '',
            { type: 'success', text: '✅ Notification ready. 456 recipients targeted.' },
        ],
        report: [
            { type: 'heading', text: '📊 MICRO-ACCOUNTABILITY IMPACT REPORT' },
            '',
            { type: 'bullet', text: 'Generated: ' + new Date().toLocaleDateString('en-IN') },
            { type: 'bullet', text: 'Project: Road Resurfacing, Main Street, Sector 15' },
            '',
            { type: 'heading', text: '👥 CITIZEN IMPACT' },
            { type: 'bullet', text: '• Direct beneficiaries: 456 households (~1,800 people)' },
            { type: 'bullet', text: '• Daily commuters affected: ~3,200' },
            { type: 'bullet', text: '• Businesses on route: 34 shops, 2 schools, 1 hospital' },
            '',
            { type: 'heading', text: '📈 MEASURABLE OUTCOMES' },
            { type: 'highlight', text: '• Pothole complaints: 47 → 0 (100% reduction) ✓' },
            { type: 'highlight', text: '• Water logging risk: HIGH → LOW ✓' },
            { type: 'highlight', text: '• Average commute time: -12 minutes estimated ✓' },
            '',
            { type: 'heading', text: '💰 BUDGET UTILIZATION' },
            { type: 'bullet', text: '• Allocated: ₹2.3 crore' },
            { type: 'bullet', text: '• Spent: ₹1.95 crore (84.8%)' },
            { type: 'bullet', text: '• Remaining: ₹0.35 crore (for markings + lights)' },
            '',
            { type: 'success', text: '✅ Report generated. Transparency score: 94/100.' },
        ]
    },

    agent4: {
        sentiment: [
            { type: 'heading', text: '💬 SENTIMENT ANALYSIS REPORT' },
            { type: 'bullet', text: 'Period: Last 48 hours | Sources: Twitter, Local News' },
            '',
            { type: 'heading', text: '📊 SENTIMENT OVERVIEW' },
            { type: 'highlight', text: '┌──────────┬───────────┬───────────────┐' },
            { type: 'highlight', text: '│ Category │ Mentions  │ Sentiment     │' },
            { type: 'highlight', text: '├──────────┼───────────┼───────────────┤' },
            { type: 'success', text: '│ Positive │ 1,322     │ ████████░░ 58%│' },
            { type: 'bullet', text: '│ Negative │ 578       │ ████░░░░░░ 25%│' },
            { type: 'bullet', text: '│ Neutral  │ 389       │ ███░░░░░░░ 17%│' },
            { type: 'highlight', text: '└──────────┴───────────┴───────────────┘' },
            '',
            { type: 'heading', text: '🔥 KEY ISSUES DETECTED' },
            { type: 'highlight', text: '🔴 Water Supply (Sector 22) — 245 mentions, NEGATIVE' },
            { type: 'bullet', text: '   "Water supply terrible for 3 days" — 245 likes, trending' },
            { type: 'success', text: '🟢 Road Repair (Market area) — 890 likes, POSITIVE' },
            { type: 'bullet', text: '   "MLA ji finally fixed the road" — strong appreciation' },
            { type: 'bullet', text: '🟡 Park Renovation — 156 mentions, NEUTRAL → NEGATIVE trend' },
            { type: 'success', text: '🟢 Streetlights — 432 likes, POSITIVE' },
            '',
            { type: 'heading', text: '⚡ RECOMMENDED ACTIONS' },
            { type: 'highlight', text: '1. URGENT: Address water supply in Sector 22 within 24 hours' },
            { type: 'bullet', text: '2. Amplify road repair success on social media' },
            { type: 'bullet', text: '3. Provide update on park renovation timeline' },
            '',
            { type: 'success', text: '✅ Sentiment analyzed. Net score: +33% (Positive)' },
        ],
        workers: [
            { type: 'heading', text: '👷 WORKER PERFORMANCE SUMMARY' },
            '',
            { type: 'heading', text: '📊 BOOTH-LEVEL PERFORMANCE' },
            '',
            { type: 'success', text: '⭐ Booth 203 — Ravi Kumar' },
            { type: 'bullet', text: '   Homes visited: 45 | Forms distributed: 120' },
            { type: 'bullet', text: '   Performance: EXCELLENT | Engagement rate: 89%' },
            '',
            { type: 'success', text: '⭐ Booth 205 — Priya Singh' },
            { type: 'bullet', text: '   Health camp organized | Attendees: 200' },
            { type: 'bullet', text: '   Performance: EXCELLENT | Community impact: HIGH' },
            '',
            { type: 'highlight', text: '⚠️ Booth 207 — [Unassigned / Inactive]' },
            { type: 'bullet', text: '   No activity reported for 5 DAYS' },
            { type: 'bullet', text: '   Status: CRITICAL — Needs immediate reactivation' },
            { type: 'bullet', text: '   Recommendation: Assign replacement or escalate' },
            '',
            { type: 'heading', text: '📈 TEAM METRICS' },
            { type: 'bullet', text: '• Active workers: 4/6 (67%)' },
            { type: 'bullet', text: '• Total homes visited (week): 287' },
            { type: 'bullet', text: '• Forms distributed: 520' },
            { type: 'bullet', text: '• Events organized: 3' },
            '',
            { type: 'success', text: '✅ Report complete. 1 critical alert raised.' },
        ],
        trends: [
            { type: 'heading', text: '🔥 TREND DETECTION REPORT' },
            { type: 'bullet', text: 'Analysis window: 14 days | Sources: Social, News, Ground' },
            '',
            { type: 'heading', text: '📈 RISING TRENDS' },
            { type: 'highlight', text: '1. Water Supply Crisis ↑↑↑ (+245% in 48 hrs)' },
            { type: 'bullet', text: '   Epicenter: Sector 22 | Spreading to: 21, 23' },
            { type: 'bullet', text: '   Risk level: HIGH — Could become election issue' },
            '',
            { type: 'highlight', text: '2. Smart City Expectations ↑↑ (+89% in 7 days)' },
            { type: 'bullet', text: '   Citizens discussing smart city announcements' },
            { type: 'bullet', text: '   Sentiment: Mixed (Hope + Skepticism)' },
            '',
            { type: 'heading', text: '📉 DECLINING TRENDS' },
            { type: 'success', text: '3. Road Complaints ↓↓ (-62% in 14 days)' },
            { type: 'bullet', text: '   Reason: Recent road repairs showing results' },
            '',
            { type: 'heading', text: '🆕 EMERGING SIGNALS' },
            { type: 'highlight', text: '4. Stray Cattle ↑ (New — 25% mentions in 2 weeks)' },
            { type: 'bullet', text: '   Evening hours, Sectors 22-23' },
            { type: 'bullet', text: '   Action needed: Coordinate with animal husbandry dept' },
            '',
            { type: 'success', text: '✅ 4 trends detected. 1 critical, 1 positive, 2 emerging.' },
        ],
        dashboard: [
            { type: 'heading', text: '📊 REAL-TIME DASHBOARD — Ward 14' },
            '',
            { type: 'heading', text: '🎯 OVERALL SENTIMENT SCORE' },
            { type: 'highlight', text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
            { type: 'success', text: '   72/100  ████████████████░░░░  72%' },
            { type: 'highlight', text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
            '',
            { type: 'heading', text: '📍 BOOTH SENTIMENT HEATMAP' },
            { type: 'success', text: '  Booth 203: ██████████  82% (Positive)' },
            { type: 'success', text: '  Booth 204: ███████░░░  65% (Moderate)' },
            { type: 'success', text: '  Booth 205: █████████░  78% (Positive)' },
            { type: 'bullet', text: '  Booth 206: ██████░░░░  58% (Neutral)' },
            { type: 'highlight', text: '  Booth 207: ████░░░░░░  42% (At Risk) ⚠️' },
            { type: 'success', text: '  Booth 208: ████████░░  75% (Positive)' },
            '',
            { type: 'heading', text: '👷 WORKER SCOREBOARD' },
            { type: 'success', text: '  🏆 Priya Singh (205): 96/100 — TOP PERFORMER' },
            { type: 'success', text: '  🥈 Ravi Kumar (203): 89/100' },
            { type: 'bullet', text: '  🥉 Amit Yadav (204): 72/100' },
            { type: 'highlight', text: '  ⚠️ Booth 207: NO ACTIVE WORKER' },
            '',
            { type: 'success', text: '✅ Dashboard synced. Last updated: Just now.' },
        ]
    }
};

// ============================================================
// AGENT DEMO INTERACTION
// ============================================================
function initAgentDemos() {
    [1, 2, 3, 4].forEach(num => {
        const btn = document.getElementById(`agent${num}-run`);
        if (!btn) return;

        btn.addEventListener('click', async () => {
            const taskSelect = document.getElementById(`agent${num}-task`);
            const inputEl = document.getElementById(`agent${num}-input`);
            const outputEl = document.getElementById(`agent${num}-output`);
            const task = taskSelect.value;
            const userInput = inputEl?.value || '';

            btn.classList.add('running');
            btn.innerHTML = '<div class="spinner" style="width:14px;height:14px;border:2px solid rgba(255,255,255,0.2);border-top-color:white;"></div> Processing...';
            outputEl.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';

            // Check if API is configured
            if (typeof NeetaAPI !== 'undefined' && NeetaAPI.isApiConfigured()) {
                // === LIVE AI MODE ===
                try {
                    const result = await NeetaAPI.runAgent(`agent${num}`, task, userInput);
                    outputEl.innerHTML = '';
                    renderMarkdownOutput(outputEl, result);
                    btn.classList.remove('running');
                    btn.innerHTML = '<i class="fas fa-bolt"></i> Run Agent';
                } catch (err) {
                    outputEl.innerHTML = `<div class="output-line output-highlight" style="color:var(--rose);">❌ API Error: ${err.message}</div><div class="output-line output-bullet">Falling back to mock mode...</div>`;
                    // Fallback to mock
                    const responses = agentResponses[`agent${num}`]?.[task];
                    if (responses) {
                        setTimeout(() => {
                            outputEl.innerHTML = '';
                            typeAgentOutput(outputEl, responses, 0, () => {
                                btn.classList.remove('running');
                                btn.innerHTML = '<i class="fas fa-bolt"></i> Run Agent';
                            });
                        }, 1500);
                    } else {
                        btn.classList.remove('running');
                        btn.innerHTML = '<i class="fas fa-bolt"></i> Run Agent';
                    }
                }
            } else {
                // === MOCK MODE ===
                const responses = agentResponses[`agent${num}`]?.[task];
                if (!responses) { btn.classList.remove('running'); btn.innerHTML = '<i class="fas fa-bolt"></i> Run Agent'; return; }

                setTimeout(() => {
                    outputEl.innerHTML = '';
                    typeAgentOutput(outputEl, responses, 0, () => {
                        btn.classList.remove('running');
                        btn.innerHTML = '<i class="fas fa-bolt"></i> Run Agent';
                    });
                }, 1200);
            }
        });
    });
}

// Render real API markdown output
function renderMarkdownOutput(container, text) {
    const lines = text.split('\n');
    lines.forEach(line => {
        const div = document.createElement('div');
        div.className = 'output-line';

        if (line.startsWith('##') || line.startsWith('📋') || line.startsWith('🔑') || line.startsWith('⚡') || line.startsWith('📊') || line.startsWith('👥') || line.startsWith('🎯') || line.startsWith('💬') || line.startsWith('🏗️') || line.startsWith('📍') || line.startsWith('📢') || line.startsWith('🔥') || line.startsWith('👷')) {
            div.className += ' output-heading';
        } else if (line.startsWith('✅') || line.startsWith('✓')) {
            div.className += ' output-success';
        } else if (line.startsWith('⚠️') || line.startsWith('🔴') || line.startsWith('❌') || line.startsWith('┌') || line.startsWith('└') || line.startsWith('━') || line.startsWith('**')) {
            div.className += ' output-highlight';
        } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./)) {
            div.className += ' output-bullet';
        } else {
            div.className += ' output-bullet';
        }

        div.textContent = line.replace(/\*\*/g, '').replace(/^#+\s*/, '');
        if (line.trim()) container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
}

function typeAgentOutput(container, lines, index, onComplete) {
    if (index >= lines.length) {
        onComplete?.();
        return;
    }

    const line = lines[index];

    if (line === '') {
        container.appendChild(document.createElement('br'));
        setTimeout(() => typeAgentOutput(container, lines, index + 1, onComplete), 40);
        return;
    }

    const div = document.createElement('div');
    div.className = 'output-line';

    if (line.type === 'heading') {
        div.className += ' output-heading';
        div.textContent = line.text;
    } else if (line.type === 'bullet') {
        div.className += ' output-bullet';
        div.textContent = line.text;
    } else if (line.type === 'highlight') {
        div.className += ' output-highlight';
        div.textContent = line.text;
    } else if (line.type === 'success') {
        div.className += ' output-success';
        div.textContent = line.text;
    }

    div.style.animationDelay = `${index * 20}ms`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;

    setTimeout(() => typeAgentOutput(container, lines, index + 1, onComplete), 60);
}

// ============================================================
// LIVE DEMO
// ============================================================
const liveResponses = {
    agent1: [
        { type: 'heading', text: '📋 PROCESSING: Smart City Project Brief' },
        '',
        { type: 'heading', text: 'SUMMARY' },
        { type: 'bullet', text: '• ₹500 crore smart city project announced for constituency' },
        { type: 'bullet', text: '• Key areas: IoT sensors, smart traffic, waste management' },
        { type: 'bullet', text: '• 3-year implementation timeline with 6-month milestones' },
        '',
        { type: 'heading', text: 'ACTION ITEMS' },
        { type: 'highlight', text: '1. Form Smart City Advisory Committee by Week 2' },
        { type: 'bullet', text: '2. Public consultation in first 30 days' },
        { type: 'bullet', text: '3. Vendor selection RFP by Month 2' },
        '',
        { type: 'heading', text: 'SPEECH DRAFT READY' },
        { type: 'success', text: '✅ 2,800-word inaugural speech generated' },
    ],
    agent2: [
        { type: 'heading', text: '📊 ANALYZING: Constituency Impact' },
        '',
        { type: 'heading', text: 'VOTER IMPACT ANALYSIS' },
        { type: 'bullet', text: '• Direct beneficiaries: ~85,000 (24.8% of voters)' },
        { type: 'bullet', text: '• Youth segment most excited (67% positive)' },
        { type: 'bullet', text: '• Farmers concerned about land acquisition (32%)' },
        '',
        { type: 'heading', text: 'CRITICAL SEGMENTS' },
        { type: 'highlight', text: '⚠️ 12 booths near project site need dedicated outreach' },
        { type: 'bullet', text: '• Anti-displacement messaging needed for 3,200 families' },
        '',
        { type: 'success', text: '✅ Impact map generated for 48 booths' },
    ],
    agent3: [
        { type: 'heading', text: '🏗️ SETTING UP: Governance Framework' },
        '',
        { type: 'heading', text: 'PROJECT MONITORING PLAN' },
        { type: 'bullet', text: '• 12 sub-projects identified for tracking' },
        { type: 'bullet', text: '• Before/After checkpoints: Every 30 days' },
        { type: 'bullet', text: '• Citizen notification zones: 48 micro-areas' },
        '',
        { type: 'heading', text: 'TRANSPARENCY MEASURES' },
        { type: 'highlight', text: '• Real-time dashboard for public access' },
        { type: 'bullet', text: '• Monthly accountability reports auto-generated' },
        { type: 'bullet', text: '• QR codes at project sites linked to reports' },
        '',
        { type: 'success', text: '✅ Governance tracking framework initialized' },
    ],
    agent4: [
        { type: 'heading', text: '💬 SCANNING: Public Sentiment' },
        '',
        { type: 'heading', text: 'INITIAL SENTIMENT SNAPSHOT' },
        { type: 'success', text: '• Positive: 58% — "Much needed development"' },
        { type: 'bullet', text: '• Negative: 22% — "Worried about displacement"' },
        { type: 'bullet', text: '• Neutral: 20% — "Want more details"' },
        '',
        { type: 'heading', text: 'WORKER DEPLOYMENT PLAN' },
        { type: 'highlight', text: '• Deploy 15 workers to project-adjacent booths' },
        { type: 'bullet', text: '• Priority: Anti-displacement messaging + scheme info' },
        { type: 'bullet', text: '• Timeline: Immediate (within 48 hours)' },
        '',
        { type: 'heading', text: '🚨 RISK ALERT' },
        { type: 'highlight', text: '• Opposition may frame as "forced displacement"' },
        { type: 'bullet', text: '• Counter: Proactive transparency + consultation' },
        '',
        { type: 'success', text: '✅ Sentiment baseline established. Monitoring active.' },
    ]
};

let selectedScenarioIndex = 0;

function initScenarioSelector() {
    const container = document.getElementById('scenarioCards');
    if (!container || typeof DEMO_SCENARIOS === 'undefined') return;

    DEMO_SCENARIOS.forEach((scenario, i) => {
        const card = document.createElement('div');
        card.className = 'scenario-card' + (i === 0 ? ' selected' : '');
        card.innerHTML = `
            <div class="sc-title">${scenario.title}</div>
            <div class="sc-desc">${scenario.description}</div>
        `;
        card.addEventListener('click', () => {
            container.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedScenarioIndex = i;
        });
        container.appendChild(card);
    });
}

function initLiveDemo() {
    const btn = document.getElementById('launchDemo');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        btn.classList.add('running');
        btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border:2px solid rgba(255,255,255,0.2);border-top-color:white;"></div> Launching Agents...';

        const container = document.getElementById('demoAgentsLive');
        container.style.display = 'grid';

        // Reset all panels
        [1, 2, 3, 4].forEach(num => {
            document.getElementById(`live-output${num}`).innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
            const status = document.getElementById(`live-status${num}`);
            status.classList.remove('done');
            status.innerHTML = '<div class="spinner"></div> Processing';
        });

        // Check if API is available and a real scenario is selected
        const useApi = typeof NeetaAPI !== 'undefined' && NeetaAPI.isApiConfigured() && typeof DEMO_SCENARIOS !== 'undefined';

        if (useApi) {
            // === LIVE API MODE ===
            const scenario = DEMO_SCENARIOS[selectedScenarioIndex];
            const agentInputs = [
                { agentId: 'agent1', task: 'summarize', input: scenario.agent1Input },
                { agentId: 'agent2', task: 'segment', input: scenario.agent2Input },
                { agentId: 'agent3', task: 'track', input: scenario.agent3Input },
                { agentId: 'agent4', task: 'sentiment', input: scenario.agent4Input }
            ];

            // Launch all 4 agents in parallel
            agentInputs.forEach(async (cfg, i) => {
                const num = i + 1;
                const output = document.getElementById(`live-output${num}`);
                const status = document.getElementById(`live-status${num}`);

                try {
                    const result = await NeetaAPI.runAgent(cfg.agentId, cfg.task, cfg.input);
                    output.innerHTML = '';
                    renderMarkdownOutput(output, result);
                    status.classList.add('done');
                    status.innerHTML = '<span style="color:var(--green);font-weight:700;">✓ Complete</span>';
                } catch (err) {
                    // Fallback to mock
                    const responses = liveResponses[`agent${num}`];
                    output.innerHTML = '';
                    typeAgentOutput(output, responses, 0, () => {
                        status.classList.add('done');
                        status.innerHTML = '<span style="color:var(--amber);font-weight:700;">✓ Mock</span>';
                    });
                }

                // Check if all done
                const allDone = [1,2,3,4].every(n => document.getElementById(`live-status${n}`).classList.contains('done'));
                if (allDone) {
                    btn.classList.remove('running');
                    btn.innerHTML = '<i class="fas fa-redo"></i> Run Again';
                }
            });
        } else {
            // === MOCK MODE ===
            const delays = [800, 1600, 2400, 3200];

            [1, 2, 3, 4].forEach((num, i) => {
                setTimeout(() => {
                    const output = document.getElementById(`live-output${num}`);
                    const status = document.getElementById(`live-status${num}`);
                    const responses = liveResponses[`agent${num}`];

                    output.innerHTML = '';
                    typeAgentOutput(output, responses, 0, () => {
                        status.classList.add('done');
                        status.innerHTML = '<span style="color:var(--green);font-weight:700;">✓ Complete</span>';

                        if (num === 4) {
                            setTimeout(() => {
                                btn.classList.remove('running');
                                btn.innerHTML = '<i class="fas fa-redo"></i> Run Again';
                            }, 500);
                        }
                    });
                }, delays[i]);
            });
        }
    });
}

// ============================================================
// SETTINGS MODAL
// ============================================================
function initSettings() {
    const modal = document.getElementById('settingsModal');
    const openBtn = document.getElementById('settingsBtn');
    const closeBtn = document.getElementById('closeSettings');
    const saveBtn = document.getElementById('saveSettings');
    const providerSelect = document.getElementById('settingsProvider');
    const apiKeyInput = document.getElementById('settingsApiKey');
    const openaiOptions = document.getElementById('openaiOptions');
    const statusEl = document.getElementById('settingsStatus');
    const hintEl = document.getElementById('apiHint');

    if (!modal || !openBtn) return;

    // Open
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        // Load current settings
        if (typeof NeetaAPI !== 'undefined') {
            const key = NeetaAPI.getApiKey();
            const provider = NeetaAPI.getProvider();
            apiKeyInput.value = key;
            providerSelect.value = provider;
            toggleOpenaiOptions(provider);

            const settings = NeetaAPI.getSettings();
            if (settings.openaiBaseUrl) document.getElementById('settingsBaseUrl').value = settings.openaiBaseUrl;
            if (settings.openaiModel) document.getElementById('settingsModel').value = settings.openaiModel;
        }
    });

    // Close
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    // Provider toggle
    providerSelect.addEventListener('change', () => {
        const provider = providerSelect.value;
        toggleOpenaiOptions(provider);
    });

    function toggleOpenaiOptions(provider) {
        openaiOptions.style.display = provider === 'openai' ? 'block' : 'none';
        hintEl.innerHTML = provider === 'gemini'
            ? 'Get a free key at <a href="https://aistudio.google.com/apikey" target="_blank" style="color:var(--blue)">aistudio.google.com/apikey</a>'
            : 'Enter your OpenAI API key from <a href="https://platform.openai.com/api-keys" target="_blank" style="color:var(--blue)">platform.openai.com</a>';
    }

    // Save
    saveBtn.addEventListener('click', () => {
        if (typeof NeetaAPI === 'undefined') { statusEl.textContent = '❌ API module not loaded'; statusEl.className = 'settings-status error'; return; }

        const key = apiKeyInput.value.trim();
        const provider = providerSelect.value;

        if (!key || key.length < 10) {
            statusEl.textContent = '❌ Please enter a valid API key';
            statusEl.className = 'settings-status error';
            return;
        }

        NeetaAPI.setApiKey(key);
        NeetaAPI.setProvider(provider);

        if (provider === 'openai') {
            const baseUrl = document.getElementById('settingsBaseUrl').value.trim();
            const model = document.getElementById('settingsModel').value.trim();
            const s = NeetaAPI.getSettings();
            if (baseUrl) s.openaiBaseUrl = baseUrl;
            if (model) s.openaiModel = model;
            NeetaAPI.saveSettings(s);
        }

        statusEl.textContent = '✅ Saved! AI mode activated';
        statusEl.className = 'settings-status success';
        updateApiIndicator();

        setTimeout(() => modal.classList.remove('active'), 1200);
    });
}

function updateApiIndicator() {
    const indicator = document.getElementById('apiModeIndicator');
    if (!indicator) return;
    const dot = indicator.querySelector('.api-dot');
    const label = indicator.querySelector('.api-label');

    if (typeof NeetaAPI !== 'undefined' && NeetaAPI.isApiConfigured()) {
        indicator.classList.add('live');
        dot.classList.remove('offline');
        dot.classList.add('online');
        const provider = NeetaAPI.getProvider();
        label.textContent = provider === 'gemini' ? 'Gemini Live' : 'OpenAI Live';
    } else {
        indicator.classList.remove('live');
        dot.classList.remove('online');
        dot.classList.add('offline');
        label.textContent = 'Mock Mode';
    }
}
