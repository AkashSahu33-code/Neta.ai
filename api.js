/* ========================================
   NētāAI — LLM API Integration Layer
   Connects to Google Gemini / OpenAI
   ======================================== */

const NeetaAPI = (() => {
    // ============================================================
    // SYSTEM PROMPTS — One per Agent
    // ============================================================
    const SYSTEM_PROMPTS = {
        agent1: `You are the Document Intelligence Agent of an AI Co-Pilot designed for public leaders and administrators.

Your role is to process documents, meeting transcripts, and policy papers and convert them into actionable insights.

Tasks you must perform:
1. Summarize long documents into concise bullet points.
2. Extract key action items, deadlines, and responsible departments.
3. Generate speech drafts based on the provided topic and audience.
4. Draft official responses, statements, and public announcements.
5. Highlight important statistics, facts, and policy implications.

Guidelines:
- Use clear, formal language suitable for public officials.
- Focus on impact, policy outcomes, and citizen benefits.
- Keep outputs structured with headings and bullet points.
- Use emojis for section headings to make output visually engaging.

Output format:
📋 Summary
🔑 Key Insights
⚡ Action Points
📝 Draft Content (if requested)
✅ Status`,

        agent2: `You are the Community Intelligence Agent responsible for analyzing constituency and booth-level data.

Your goal is to identify key voter segments and extract actionable insights.

Tasks:
1. Classify booth-level voter data into segments such as:
   - Youth
   - Farmers
   - Women
   - Businessmen
   - Senior Citizens
2. Identify key voter groups that influence decision making.
3. Track government scheme beneficiaries and map them geographically.
4. Detect local issues affecting specific communities.
5. Generate booth-level insights for targeted outreach.

Guidelines:
- Provide hyper-local insights.
- Focus on data-driven segmentation.
- Highlight influential voter clusters.
- Use tables and structured formatting.
- Use emojis for section headings.

Output format:
📊 Booth Summary
👥 Key Segments
🎯 Influential Groups
⚠️ Local Issues
🗺️ Recommended Outreach Strategy`,

        agent3: `You are the Governance Accountability Agent.

Your role is to track development work and ensure transparency between public leaders and citizens.

Tasks:
1. Monitor development projects such as roads, streetlights, water supply, sanitation, etc.
2. Verify project completion using before and after evidence.
3. Identify which streets or neighborhoods are affected.
4. Send targeted notifications only to residents of the affected area.
5. Generate micro-level accountability reports.

Guidelines:
- Focus on transparency and proof-based updates.
- Ensure notifications are location-specific.
- Highlight the citizen impact of each development activity.
- Use emojis for section headings.

Output format:
🏗️ Project Summary
📍 Location
📷 Before vs After Evidence
👥 Impact on Residents
📢 Notification Message`,

        agent4: `You are the Sentiment and Worker Management Agent for a political intelligence platform.

Your role is to monitor public sentiment and coordinate party workers.

Tasks:
1. Analyze sentiment from social media, surveys, and news.
2. Classify sentiment as Positive, Negative, or Neutral.
3. Detect emerging issues or concerns among citizens.
4. Track activities of party workers and volunteers.
5. Monitor outreach performance and engagement metrics.
6. Generate dashboards showing booth-level sentiment and worker performance.

Guidelines:
- Provide clear insights that support faster decision making.
- Detect trends and potential risks early.
- Highlight areas requiring urgent attention.
- Use visual indicators like bars and emojis.

Output format:
💬 Sentiment Overview
🔥 Key Issues
📍 Booth-Level Trends
👷 Worker Performance Summary
⚡ Recommended Actions`
    };

    // Task-specific instruction prefixes
    const TASK_INSTRUCTIONS = {
        agent1: {
            summarize: 'Summarize the following document and extract key insights:',
            speech: 'Draft a formal speech based on the following information:',
            extract: 'Extract all action items, deadlines, and responsible parties from:',
            brief: 'Generate a comprehensive meeting briefing document from:'
        },
        agent2: {
            segment: 'Perform voter segmentation analysis on the following constituency data:',
            booth: 'Generate a detailed booth-level analysis from:',
            beneficiary: 'Track and map government scheme beneficiaries from:',
            issues: 'Map and prioritize local issues from the following data:'
        },
        agent3: {
            track: 'Generate a project tracking report from the following details:',
            verify: 'Generate a completion verification report with before/after analysis from:',
            notify: 'Create a citizen notification message for the following project update:',
            report: 'Generate a micro-accountability impact report from:'
        },
        agent4: {
            sentiment: 'Analyze public sentiment from the following social media data and reports:',
            workers: 'Generate a worker performance summary from the following data:',
            trends: 'Detect and report emerging trends from:',
            dashboard: 'Generate a comprehensive sentiment and worker performance dashboard from:'
        }
    };

    // ============================================================
    // SETTINGS MANAGEMENT
    // ============================================================
    function getSettings() {
        try {
            return JSON.parse(localStorage.getItem('netaai_settings') || '{}');
        } catch {
            return {};
        }
    }

    function saveSettings(settings) {
        localStorage.setItem('netaai_settings', JSON.stringify(settings));
    }

    function getApiKey() {
        return getSettings().apiKey || '';
    }

    function setApiKey(key) {
        const s = getSettings();
        s.apiKey = key;
        saveSettings(s);
    }

    function getProvider() {
        return getSettings().provider || 'gemini';
    }

    function setProvider(provider) {
        const s = getSettings();
        s.provider = provider;
        saveSettings(s);
    }

    function isApiConfigured() {
        return getApiKey().length > 10;
    }

    // ============================================================
    // API CALLS
    // ============================================================
    async function callGemini(systemPrompt, userMessage) {
        const apiKey = getApiKey();
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const body = {
            contents: [
                {
                    role: 'user',
                    parts: [{ text: `${systemPrompt}\n\n---\n\n${userMessage}` }]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
                topP: 0.95
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    }

    async function callOpenAI(systemPrompt, userMessage) {
        const apiKey = getApiKey();
        const baseUrl = getSettings().openaiBaseUrl || 'https://api.openai.com/v1';
        const model = getSettings().openaiModel || 'gpt-4o-mini';

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 2048
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'No response generated.';
    }

    // ============================================================
    // MAIN AGENT CALL
    // ============================================================
    async function runAgent(agentId, taskType, userInput) {
        if (!isApiConfigured()) {
            throw new Error('API_NOT_CONFIGURED');
        }

        const systemPrompt = SYSTEM_PROMPTS[agentId];
        const taskInstruction = TASK_INSTRUCTIONS[agentId]?.[taskType] || '';
        const fullMessage = `${taskInstruction}\n\n${userInput}`;

        const provider = getProvider();
        if (provider === 'openai') {
            return await callOpenAI(systemPrompt, fullMessage);
        } else {
            return await callGemini(systemPrompt, fullMessage);
        }
    }

    // ============================================================
    // LIVE DEMO — Multi-Agent
    // ============================================================
    async function runLiveDemo(scenario) {
        if (!isApiConfigured()) {
            throw new Error('API_NOT_CONFIGURED');
        }

        const promises = [
            runAgent('agent1', 'summarize', scenario.agent1Input),
            runAgent('agent2', 'segment', scenario.agent2Input),
            runAgent('agent3', 'track', scenario.agent3Input),
            runAgent('agent4', 'sentiment', scenario.agent4Input)
        ];

        return Promise.allSettled(promises);
    }

    // ============================================================
    // PUBLIC API
    // ============================================================
    return {
        getSettings,
        saveSettings,
        getApiKey,
        setApiKey,
        getProvider,
        setProvider,
        isApiConfigured,
        runAgent,
        runLiveDemo,
        SYSTEM_PROMPTS,
        TASK_INSTRUCTIONS
    };
})();


// ============================================================
// DEMO SCENARIOS — For Live Demo Page
// ============================================================
const DEMO_SCENARIOS = [
    {
        id: 'smart-city',
        title: '🏙️ Smart City Project Launch',
        description: 'A new ₹500 crore smart city project is announced. The leader needs a full briefing — document summary, voter impact, governance plan, and sentiment assessment.',
        agent1Input: 'The Government of Haryana has approved a ₹500 crore Smart City Mission project for the constituency covering Sectors 14-30. Key components include: IoT-based traffic management (₹80 crore), smart water metering for 50,000 households (₹120 crore), integrated waste management with AI sorting (₹65 crore), solar-powered smart streetlights across 350 km (₹90 crore), public WiFi zones in 25 locations (₹15 crore), and a smart governance digital platform (₹130 crore). Implementation timeline: 3 years with Phase 1 (traffic + streetlights) to be completed in 12 months. The project will create approximately 8,000 direct jobs. Land acquisition is required for 2 data centres (5 acres each) in Sector 18 and Sector 25.',
        agent2Input: 'Constituency data for Smart City project impact area (Sectors 14-30): Total voters: 342,568. Demographics: Youth 18-35 (34%), Women (48%), Farmers/Rural (12%), Business community (18%), Senior citizens (9%), SC/ST (14%). Key booths near project sites: Booths 140-165 (Sector 18 data centre), Booths 200-225 (Sector 25 data centre). Areas with land acquisition: 450 families potentially affected in Sector 18, 380 families in Sector 25. Current scheme beneficiaries in area: PM-KISAN: 4,200, Ujjwala: 8,900, Ayushman Bharat: 45,000. Top local issues: unemployment (youth), water supply (women), road conditions (business). Previous election margin: 12,400 votes.',
        agent3Input: 'Smart City Mission Project — Governance Tracking Setup. 12 sub-projects identified: 1) IoT Traffic (Sectors 14-20), 2) IoT Traffic (Sectors 21-30), 3) Smart Water Metering Phase-A (25,000 homes), 4) Smart Water Metering Phase-B (25,000 homes), 5) AI Waste Management Central Plant, 6) AI Waste Management Collection Network, 7) Solar Streetlights Zone-A (175 km), 8) Solar Streetlights Zone-B (175 km), 9) Public WiFi (13 locations), 10) Public WiFi (12 locations), 11) Data Centre Sector-18, 12) Data Centre Sector-25. Total affected population: approximately 180,000 residents across 48 wards. Budget milestones: Quarterly reviews, public dashboard required by Smart City Mission guidelines.',
        agent4Input: 'Social media and ground data for Smart City announcement (last 72 hours): Twitter: "Finally our area is getting smart city! About time!" (1,200 likes), "What about the families being displaced for data centres?" (3,400 likes, trending), "Will this actually happen or another jumla?" (890 likes), "8000 jobs is huge, youth will benefit" (650 likes), "My shop is in Sector 18, nobody told us about land acquisition" (2,100 likes). News coverage: 3 positive articles, 2 critical articles about displacement. Ground reports from workers: Sector 18 residents anxious about displacement (Worker Rajesh, 67 homes visited). Sector 25 mixed reactions (Worker Meena, 45 homes visited). Youth excited about jobs (Worker Amit, tech meetup with 200 attendees). Opposition party criticizing land acquisition process. Overall ground sentiment: 55% positive, 30% negative, 15% neutral.'
    },
    {
        id: 'water-crisis',
        title: '💧 Water Supply Crisis',
        description: 'A severe water supply disruption affects multiple wards. Citizens are angry. The leader needs rapid situation assessment, affected demographics, response plan, and sentiment tracking.',
        agent1Input: 'URGENT BRIEFING: The main water supply pipeline from Yamuna Water Treatment Plant to Sectors 40-57 has developed a major leak at the junction near Sector 45 interchange. Water supply has been disrupted for 72 hours affecting an estimated 85,000 residents. The municipal corporation issued a press note stating repairs will take 5-7 more days. Currently, 40 water tankers have been deployed but coverage is only 30% of affected areas. The opposition has called for a protest march on Thursday. Media coverage is intensifying. A PIL has been filed in the High Court. The CM office has sought a status report. Budget allocated for water infrastructure in current FY: ₹170 crore, of which only ₹45 crore has been utilized (26.5%). The pipeline was last maintained 8 years ago.',
        agent2Input: 'Affected area analysis — Water Crisis Sectors 40-57: Total voters affected: 85,200. Community breakdown: Jat (25%), Yadav (18%), Muslim (20%), Brahmin (12%), SC/ST (15%), Others (10%). 64 booths directly impacted (Booths 401-464). Most vulnerable groups: Senior citizens (8,500 — health risk), Pregnant women (estimated 2,100 — urgent), Families with infants (3,800). Areas with ZERO tanker coverage: Sectors 48, 51, 53 (combined 22,000 voters). Government scheme overlap: Jal Jeevan Mission beneficiaries in area: 34,000. Previous complaints on water: 4,200 in last 6 months. Key opposition stronghold booths: 420-435 (Sector 48-51). Swing voter concentration: Booths 440-455.',
        agent3Input: 'Water Crisis Emergency Response Tracking. Current infrastructure status: Main pipeline breach at Sector 45 junction — 3 meters of pipe needs replacement. Contractor mobilized: Haryana Water Utilities, Est. repair time: 5-7 days. Emergency measures: 40 tankers deployed, covering Sectors 40-44 and 54-57. Sectors 45-53 have poor coverage. Temporary boring wells: 6 activated, 4 more being drilled. Bottled water distribution: 15,000 bottles distributed at 8 points. Before: Regular water supply 6 AM and 6 PM daily. After (current): No piped supply for 72 hrs. Citizens filling from borewells and tankers, long queues reported. Sanitation impact: Reports of increased stomach illness from untreated borewell water in Sector 51.',
        agent4Input: 'WATER CRISIS — Sentiment Analysis (72 hours). Twitter/X: #WaterCrisis trending locally (8,400 tweets), "3 days without water, where is our MLA?" (5,600 likes), "Old people standing in line for hours for one bucket" (with photo, 12,000 likes), "Thank you MLA ji for sending tanker to our colony finally" (340 likes), "Opposition rally on Thursday against water mismanagement" (2,800 likes). Facebook local groups: 450+ angry posts, 89 posts tagging MLA. WhatsApp forwards: Fake news about contaminated supply (going viral). News: "Water crisis exposes infrastructure neglect" (Dainik Bhaskar), "MLA promises swift action" (local TV channel). Worker reports: Booth 420 — Suresh (visited 80 homes, anger level HIGH), Booth 435 — Kamla (60 homes, people demanding compensation), Booth 445 — NO WORKER ASSIGNED. Booth 455 — Ravi (organized tanker camp, positive response, 200 families served).'
    },
    {
        id: 'election-prep',
        title: '🗳️ Election Preparation',
        description: 'Elections are 3 months away. Run a comprehensive constituency audit — document achievements, analyze voter mood by booth, track development scorecards, and build an outreach strategy.',
        agent1Input: 'Prepare a 5-year achievement summary for MLA [Constituency XYZ]. Key accomplishments: 1) Roads: 450 km new/repaired roads (₹890 crore), 2) Water: Connected 45,000 homes to Jal Jeevan Mission (₹340 crore), 3) Education: 12 new government schools, 3 skill development centres, 4) Health: 2 new PHCs, 1 upgraded CHC, free health camps serving 120,000 people, 5) Employment: 8,000 direct jobs created through industrial development, 6) Digital: 150 CSC centres, free WiFi in 25 public areas, 7) Housing: 6,500 PM Awas Yojana houses completed, 8) Women: 3,200 SHGs formed, ₹45 crore micro-loans disbursed. Pending promises: Sports complex (under construction, 60%), college campus (approved, land acquired), bus terminal (delayed). Generate a manifesto-ready summary and talking points.',
        agent2Input: 'Full constituency voter analysis for election prep. Total voters: 342,568 (up 8% from last election). 256 booths across 48 wards. Booth-level breakdown needed. Previous results: Won by 12,400 votes (52.3% vs 47.7%). Strong booths (>60%): 89 booths (Youth + Women dominated). Weak booths (<45%): 47 booths (Opposition stronghold, mostly Sectors 48-57). Swing booths (45-55%): 120 booths (KEY BATTLEGROUND). New voters added: 28,000 (mostly youth 18-25). Voter demographics shift: Youth proportion increased from 30% to 34%, Women turnout was 58% last time (target: 65%). Community sentiment: Jat community (35%) — mostly supportive, Yadav (20%) — split, Muslim (15%) — needs outreach, SC/ST (12%) — supportive due to schemes. Key issues by segment: Youth — jobs, Farmers — MSP & crop insurance, Women — safety & SHGs, Business — GST & regulation.',
        agent3Input: 'Development scorecard for election — all projects in constituency, last 5 years. COMPLETED: Roads repaired: 450 km (target: 500 km — 90%), JJM connections: 45,000 (target: 50,000 — 90%), Schools built: 12 (target: 15 — 80%), Health camps: 480 (target: 500 — 96%), PM Awas houses: 6,500 (target: 8,000 — 81.25%), Streetlights: 15,000 installed (target: 15,000 — 100%), Drains cleaned: 280 km (target: 300 km — 93%). IN PROGRESS: Sports Complex — 60% done (deadline: 2 months), College Campus — land acquired, construction starting, Bus Terminal — delayed by 1 year, 25% done. PENDING: Flyover at Sector 14 (approved, ₹120 crore), Community hall in Sector 30 (not started). Generate before/after evidence summary and ward-wise development map.',
        agent4Input: 'Pre-election sentiment and worker readiness audit. Overall constituency sentiment (survey of 5,000 voters): Satisfied: 54%, Unsatisfied: 28%, Neutral: 18%. Issue-wise satisfaction: Roads — 72% positive, Water — 45% positive (recent crisis hurt), Health — 68% positive, Education — 61% positive, Employment — 39% positive (WEAK POINT). Worker army status: Total workers: 890, Active (last 30 days): 567 (63.7%), Dormant: 212, Unresponsive: 111. Booths with NO assigned worker: 34 out of 256 (13.3% UNCOVERED). Top performers: Ward 12 team (8 workers, 340 homes/week), Ward 5 team (6 workers, 280 homes/week). Weakest: Ward 38 (2 workers, barely active), Ward 42 (3 workers, opposition influence high). Social media presence: MLA handle — 45,000 followers, average engagement 2.3%. Competitor handle — 62,000 followers, engagement 4.1%.'
    }
];
