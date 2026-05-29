Let me deeply research OpenAI's Ads Manager Beta before designing anything.Below is a complete product specification, written after deeply researching OpenAI's Ads Manager Beta, the Ads API, the existing partner ecosystem, and the validated advertiser pain points. Read it as a real PM doc — every feature listed maps to a real OpenAI capability, real advertiser pain, or real competitive gap.

---

# Product Spec: ChatGPT Ads Launch & Optimization Platform

## 1. What I Researched (and Why It Matters)

Before designing, I went deep on OpenAI's actual infrastructure. Key facts that shape everything below:

**Platform basics (as of May 2026):**
- Ads Manager Beta lives at `ads.openai.com`. Opened to all US advertisers on May 5, 2026 with no minimum spend.
- Three-level object hierarchy: **Campaign → Ad Group → Ad**. Account limits: 5,000 of each.
- Two creation modes: **Guided UI flow** or **Bulk CSV upload** (advertisers download a schema template, fill it, re-upload).
- Onboarding takes four steps: business details, account configuration, Persona identity verification, and a manual review wait that can take days.

**Campaign objectives & bidding:**
- **Reach** (CPM pricing, default max bid $60)
- **Clicks** (CPC pricing, recommended starting max bid $3-5)
- **Conversions** (ships in the dashboard but currently disabled while OpenAI's pixel completes rollout)
- Budget types: daily or lifetime (added in mid-May 2026)
- Geo: country-level only (US, CA, AU, NZ live; UK/MX/BR/JP/KR rolling out)

**Ad Group structure:**
- Context hints: free-text plain-English descriptions, 1-2 sentences per hint, recommended 5-10 per ad group
- Hints sit at ad group level, not ad level — meaning one ad group should map to one persona × one intent
- In CSV format: `["hint1", "hint2"]` JSON array
- Max CPC bid per ad group (overrides campaign default)

**Ad creative specs (Sponsored Recommendation Card — currently the only format):**
- **Title:** 16-24 characters
- **Description:** 32-48 characters
- **Image:** 1200×1200px square, JPG/PNG/WEBP
- **Required:** advertiser name, favicon/logo, title, description, landing page URL, image
- Landing pages must allow `OAI-AdsBot` and `OAI-SearchBot` user agents
- UTM parameters supported and pass through

**Auction:** Relevance-weighted second-price. Context hints + ad copy + landing page all influence selection. CPMs range $25-60. CPC ranges $2.50-8.

**Reporting:**
- Available metrics: impressions, clicks, spend, CTR, average CPC, average CPM, conversions
- 7-hour lag between delivery and dashboard
- Table, chart, CSV export views

**Measurement infrastructure (live as of May 5, 2026):**
- **JavaScript pixel** with 11 standard events
- **Conversions API** (`/v1/conversions`, batches up to 1,000 events, accepts `oppref` parameter to tie conversions back to ad clicks)
- Both can run in parallel with deduplication via shared event IDs

**Advertiser API (`api.ads.openai.com/v1`):**
- Bearer token auth, issued from Ads Manager Settings tab
- Full CRUD on campaigns, ad groups, ads
- Creative asset upload returns `file_id`
- Insights endpoint at four scopes: account, campaign, ad group, ad
- Sort/filter by any metric, configurable time granularity

**Brand-safety policy excludes:** weapons, alcohol, deceptive practices, health, mental health, politics, content targeting under-18, ads in temporary chats / logged-out sessions / after image generation / in ChatGPT Atlas browser.

**The market gap I'm building into:**
- Existing partners (Criteo, Adobe, Pacvue, StackAdapt) serve enterprise with minimums in tens of thousands and up
- AI-Advisors.ai exists with migration tools and pixel install but no pre-spend simulation
- No one has a tool that combines: AI-drafted campaign creation + pre-spend simulation + one-click launch + continuous optimization
- The Reddit pain: "is my context too narrow," "not seeing spend," "no idea what's working" — directly addressable

---

## 2. The Product

**Working name:** AdLab (placeholder — change later)

**One-line positioning:** *"The fastest way to launch and optimize ChatGPT Ads. Brands describe their campaign in natural language, we draft it, simulate it, push it live to OpenAI, and continuously optimize. Ten minutes start to launch."*

**Target customer:** Mid-market DTC brands ($1M-50M revenue) and independent agencies managing 3-20 ChatGPT Ads accounts. Explicitly not enterprise (Criteo's territory).

**Core thesis:** OpenAI's Ads Manager is functional but raw — it gives advertisers an empty form to fill. Our product gives them a *brand-aware co-pilot* that fills the form intelligently, predicts what will work before they spend, pushes it to OpenAI's API in one click, and optimizes continuously based on real performance.

We're not replacing OpenAI's Ads Manager. We're the layer brands use *instead of* logging into ads.openai.com directly, because ours is faster, smarter, and predictive.

---

## 3. End-to-End User Flow

### Stage 1: Onboarding (5-7 minutes total)

**Step 1 — Account creation (30 seconds)**
- Email + password OR Google OAuth
- "What's your role?" — Brand owner / Marketing manager / Agency / Freelancer (gates flow)
- Workspace name

**Step 2 — Brand profile (3 minutes)**

A single multi-field form that becomes the foundation for all future AI generation:
- **Brand name** (text)
- **Brand URL** (text, we'll fetch homepage to extract additional context)
- **One-sentence description** (textarea, e.g., "Affordable, dermatologist-developed skincare for Gen Z")
- **Category** (dropdown with 30 preset categories: DTC beauty, supplements, fashion, electronics, etc., plus "Other")
- **Price range** (selectable: under $20, $20-50, $50-100, $100-300, $300+)
- **Target customer description** (textarea, e.g., "Teens and young adults with sensitive or acne-prone skin")
- **Brand voice** (multi-select chips: friendly, professional, edgy, scientific, warm, minimal, playful)
- **Brand logo** (file upload, used as favicon for ads)
- **Brand colors** (optional, color pickers)
- **Excluded topics** (textarea, e.g., "Don't mention competitors by name")

When the user submits, we fetch their homepage in the background, extract key copy, and store it as additional context for the AI.

**Step 3 — Connect OpenAI Ads (2 minutes)**

Two paths:

*Path A: "I already have an OpenAI Ads account"*
- Walks them to ads.openai.com → Settings → API Keys → Generate → Paste here
- We validate the key with a `GET /v1/account` call
- Save encrypted

*Path B: "I don't have one yet"*
- Embedded tutorial video (60 seconds) walking through OpenAI's onboarding
- Inline checklist: "1. Sign up → 2. Verify with Persona → 3. Add billing → 4. Generate API key → 5. Come back and paste"
- We can't onboard them directly because OpenAI requires their own Persona verification. We *facilitate* the flow.

**Step 4 — Connect tracking (optional, 1 minute)**
- Pixel ID field (optional)
- If they have a pixel installed, we read events
- If not, "We'll show you how to install later — you can still launch campaigns without it"

**Step 5 — First campaign goal**
- "What do you want to accomplish first?"
- Three pre-set goals: Drive purchases / Generate leads / Launch a new product / Build brand awareness
- Plus free text option

After onboarding, dump them directly into the campaign creation flow with their brand profile already loaded.

---

### Stage 2: Campaign Creation (5-10 minutes)

This is where the product earns its keep. The interface defaults to AI-Drafted mode but offers Guided mode for power users.

#### Mode A: AI-Drafted Campaign (Default)

The user sees a single text input at the top:

> "Describe your campaign in plain English"

Example inputs:
- "Launch our new Vitamin C serum to Gen Z and millennials, $1500/month budget, focus on driving first-time buyers"
- "Promote our holiday gift bundles to gift shoppers in the next 30 days, $5000 total budget"
- "Test ChatGPT Ads for our SaaS — target small business owners researching project management tools, $2000/month"

When the user hits Generate, we stream a structured campaign draft into view:

**Phase 1 — Campaign structure decision (3 seconds)**

GPT-4o decides the right hierarchy:
- One campaign with objective + budget + dates
- 1-4 ad groups based on detected sub-intents
- 2-4 ads per group

Display: "We've structured your campaign with 3 ad groups, each targeting a distinct customer mindset. You can edit any of this."

**Phase 2 — Context hint generation per ad group (5-10 seconds per group)**

For each ad group, GPT-4o generates 6-10 context hints following OpenAI's 5 hint patterns:
1. **Persona + Intent** — "Gen Z buyers asking about acne treatment for sensitive skin"
2. **Question** — "How can I treat hyperpigmentation without harsh products"
3. **Topic + Disqualifier** — "Affordable skincare for combo skin, not luxury brands"
4. **Outcome** — "Looking for skincare to improve skin texture in 30 days"
5. **Stack Comparison** — "Alternatives to Glossier and Drunk Elephant for college students"

Each hint is displayed in a card with:
- The hint text (editable inline)
- An auto-generated **predicted match rate** score (computed in Stage 3)
- An auto-generated **intent quality** label (Low / Medium / High)
- A "regenerate this one" button
- A delete button

The user can add custom hints, edit existing ones, or remove any.

**Phase 3 — Creative variant generation per ad group (5 seconds per group)**

GPT-4o generates 3-5 creative variants per ad group, respecting OpenAI's character limits:
- Title: 16-24 characters (validated)
- Description: 32-48 characters (validated)
- Suggested landing page (defaults to brand homepage, user can override per-ad)

Each variant card shows:
- Title (editable, character counter)
- Description (editable, character counter)
- Landing page URL (editable)
- **Quality score** (computed by LLM-as-judge across hook strength, value clarity, context match)
- "Regenerate variant" button

For images, we offer three options:
1. Upload (PNG/JPG/WEBP, validated against 1200×1200 spec)
2. Use existing brand asset (if uploaded during onboarding)
3. AI-generated image via DALL-E (placeholder for MVP, ship later)

**Phase 4 — Bid & budget recommendations**

We compute and display:
- Recommended max CPC range (based on category, conservative middle of OpenAI's $3-5 default)
- Suggested daily/lifetime budget allocation across ad groups based on predicted match volume
- A **Risk Slider**: Conservative ($2-3 bids) | Balanced ($3-5) | Aggressive ($5-7)

User adjusts and proceeds to simulation.

#### Mode B: Guided Creation (for power users)

Identical to OpenAI's flow but with:
- AI suggestions at every step (regeneratable)
- Inline validation (character limits, JSON formatting)
- Context tooltips explaining each field

#### Mode C: Bulk Import (for agencies)

- Upload existing campaign CSV (OpenAI's schema)
- We parse, validate, suggest improvements ("These 4 hints are too narrow," "This ad group lacks creative variants")
- Apply selected improvements

---

### Stage 3: Pre-Spend Simulation (45-90 seconds)

This is the differentiated piece. After the campaign is drafted, a prominent CTA appears:

> **[Simulate Campaign Before Spending]** — *"We'll generate 200-300 realistic ChatGPT user conversations in your category and predict how your campaign will perform"*

When clicked, the user transitions to a two-pane simulation view:

**Left pane: Live conversation generation**

Streaming as it generates:
- A header: "Generating realistic ChatGPT conversations from buyers in your category"
- Counter: "Generated 47 of 250 conversations"
- Conversation cards fade in as each is generated:
  - Persona summary (e.g., "16yo with sensitive combo skin, $40 budget, parent's credit card")
  - Intent stage badge (Discovery / Research / Comparison / Decision)
  - First 2-3 user messages
  - Commercial intent score (small bar)

**Right pane: Live scoring**

As conversations come in, our scoring engine runs against each context hint and creative variant:

For each context hint:
- Match counter updates in real-time
- Match rate progress bar fills
- When complete, hint is color-coded:
  - 🟥 Red (Dead): Match rate <8% — *"Likely to underdeliver"*
  - 🟨 Amber (Marginal): 8-20% — *"Will deliver some impressions"*
  - 🟩 Green (Winner): 20%+ — *"Strong delivery expected"*

For each creative variant:
- Predicted CTR bucket (Low / Medium / High / Very High)
- Win-rate against other variants
- "Why" tooltip explaining the score

**Bottom strip:**
- Overall progress bar
- Estimated time remaining
- Cancel button

**Simulation completes → Results Dashboard:**

A clean dashboard with 4 sections:

**Section A — Campaign overview (4 hero metrics)**
- Predicted weekly impressions (range with confidence interval, e.g., "8,200 - 14,500")
- Recommended max CPC ($X.XX with rationale)
- Predicted average CTR (e.g., "2.8% - 4.1%")
- Estimated weekly spend at recommended bid (e.g., "$320 - $560")

**Section B — Context hint analysis (sortable table)**

| Hint | Pattern | Match Rate | Intent Quality | Est. Weekly Impr. | Recommendation |
|---|---|---|---|---|---|
| "Gen Z buyers asking about acne for sensitive skin" | Persona+Intent | 28% 🟩 | High | 2,400 | Use |
| "How to treat hyperpigmentation without harsh products" | Question | 22% 🟩 | High | 1,900 | Use |
| "Affordable skincare not luxury brands" | Topic+Disq | 12% 🟨 | Medium | 1,000 | Test |
| "Best Gen Z skincare brands" | Outcome | 4% 🟥 | Low | 350 | Drop |
| ... | ... | ... | ... | ... | ... |

Failed hints (red) collapsed by default, expandable with reasoning.

**Section C — Creative variant ranking**

Cards side-by-side, each showing:
- Title + description preview (rendered as it would appear on ChatGPT)
- Predicted CTR
- Win rate vs. other variants
- Quality dimension breakdown (hook strength, value clarity, context match, CTA fit)
- Winner card highlighted with subtle emerald border

**Section D — Action recommendations**

A list of specific actions, each with a one-click "Apply" button:
- "Drop hint #4 (Match rate <5%)"
- "Increase budget allocation to ad group 1 (highest predicted ROI)"
- "Pause creative variant 3 (CTR prediction 40% below variant 1)"
- "Add a new hint variation: 'Recommendations for college students with budget under $25'"

**The user can iterate:**
- Apply individual recommendations → see metrics update without re-running full simulation
- "Re-simulate with my changes" → 30-second incremental simulation
- Edit any field directly and the affected scores update

---

### Stage 4: One-Click Launch to OpenAI

After simulation approval, a prominent CTA:

> **[Launch Campaign to ChatGPT Ads]**

When clicked:

1. **Final validation pre-flight** (2 seconds)
   - Character limits on all ads
   - Image dimensions
   - Landing page URLs reachable (HEAD request)
   - Policy pre-check: scan creative against known banned categories (weapons, alcohol, health claims, etc.)
   - If issues found: surface them inline with fix suggestions

2. **Submission flow** (5-10 seconds)
   - Show animated progress:
     - "Creating campaign in OpenAI Ads Manager... ✓"
     - "Creating 3 ad groups... ✓"
     - "Uploading creative assets... ✓"
     - "Creating 9 ads... ✓"
     - "Submitting for OpenAI review..."

   Behind the scenes we hit:
   - `POST /v1/campaigns` with budget, objective, dates, targeting
   - `POST /v1/ad-groups` for each ad group with context hints and bid
   - `POST /v1/files` for each image asset
   - `POST /v1/ads` for each ad referencing the file_id, headline, description, final_url

3. **Confirmation page**
   - "Your campaign has been submitted to OpenAI for review. Approval typically takes <24 hours."
   - Direct link to view in our dashboard
   - "We'll email you when your campaign starts delivering impressions."
   - Suggested next steps: install pixel, set optimization rules, draft second campaign

---

### Stage 5: Live Performance Dashboard

Once campaigns are approved and serving, the dashboard becomes the user's daily destination.

**Top-level view (workspace home):**
- Today's spend / yesterday's spend / 7-day spend / 30-day spend
- Aggregate metrics: total impressions, clicks, CTR, conversions, CPA, ROAS
- Active campaigns count, paused count, in-review count
- Daily performance chart (multi-line: impressions, clicks, spend)

**Campaign detail view:**

Pulling data from `GET /v1/campaigns/{id}/insights` with daily granularity:

- All standard metrics with time-series charts
- Breakdown by ad group, by ad, by hour-of-day
- **Predicted vs Actual comparison** (our differentiator):
  - For each hint: "Predicted 28% match rate → Actual 24%. ±4% within range."
  - For each creative: "Predicted CTR 3.2% → Actual 2.8%. Within confidence interval."
  - Calibration delta chart over time

**Ad group / ad detail views** — same metrics, scoped down.

**Live optimization recommendations (always visible):**

A panel that updates daily based on real performance:
- "Ad group 'Gen Z Buyers' is overdelivering — consider increasing budget"
- "Creative variant B underperforming variant A by 38%. Pause B?" [One-click Pause]
- "Hint 'best Gen Z skincare brands' has 0 impressions in 48 hours. Drop?" [One-click Drop]
- "Add daypart targeting: 80% of clicks happen between 6-10pm"

---

### Stage 6: Optimization Automation (Pro tier)

For users who want hands-off optimization, configurable rules engine:

**Rule templates:**
- "Pause ad if CTR is below 1% after 1,000 impressions"
- "Pause hint if no impressions in 48 hours"
- "Increase bid by 15% on ad groups with conversion rate above 5%"
- "Decrease bid by 10% if CPA exceeds $X for 72 hours"
- "Reallocate budget weekly: shift 20% of spend from bottom-quartile to top-quartile ad groups"

Each rule:
- Has visible trigger conditions
- Can be enabled/disabled
- Logs every action with rationale
- All actions executed via OpenAI's Advertiser API

**Smart re-simulation:**
- Once per week, re-simulate the campaign using real performance data as priors
- Suggest refined campaign variants the user can launch as A/B tests
- "Based on real performance, your audience is more research-oriented than we predicted. Here's a refined creative direction."

---

### Stage 7: Multi-Brand / Agency Mode

For users with multiple brands (agencies, multi-brand DTCs):

- **Workspace switcher** in top-left
- **Centralized analytics view** across all workspaces
- **Bulk operations:** launch one campaign template across multiple brands with brand-specific customization
- **Team permissions:** Owner / Admin / Editor / Read-only
- **Branded reporting:** export PDF reports with the agency's logo (Pro tier)
- **Client-facing dashboards:** share read-only links with clients (Pro tier)

---

### Stage 8: Reporting & Exports

- Custom date range pickers
- Export any view as CSV
- Scheduled weekly email reports
- Slack integration (alert on performance anomalies)
- API access for embedding in customer's internal dashboards (Enterprise)

---

## 4. The Most Important Features (Ranked by Differentiation)

If forced to ship only some features, this is the priority order:

1. **AI-drafted campaign from natural language** — collapses 30-60 min of work into 30 seconds
2. **Pre-spend simulation with match rate scoring** — addresses the #1 advertiser pain point ("is my context too narrow")
3. **One-click launch to OpenAI Ads API** — removes the manual translation step entirely
4. **Predicted vs Actual calibration display** — builds trust over time, accumulates moat data
5. **Brand-aware creative generation** — every variant tied to brand voice/positioning
6. **Optimization automation rules** — agency time-saver
7. **Multi-brand workspace** — agency-specific
8. **Smart re-simulation with live data** — closes the loop, makes the simulator better over time

---

## 5. Technical Architecture

### Frontend
- Next.js 15 (App Router) + TypeScript strict mode
- Tailwind CSS + shadcn/ui components
- Framer Motion for animations (especially simulation streaming visuals)
- Recharts for analytics dashboards
- TanStack Query for data fetching

### Backend
- Next.js API routes (Node runtime) for transactional endpoints
- Inngest for background jobs (simulation runs, scheduled re-simulations, optimization rule execution)
- PostgreSQL (Supabase or Neon) for state — campaigns, simulation results, calibration data, user accounts
- Redis (Upstash) for caching API responses and rate limiting
- Encrypted storage for OpenAI Ads API keys (use Vercel envs + KMS or similar)

### LLM Stack
- OpenAI `gpt-4o-mini` for high-volume scoring and conversation generation
- OpenAI `gpt-4o` for campaign drafting (more nuanced reasoning)
- OpenAI `text-embedding-3-small` for semantic similarity in hint matching
- All routed through one API client with retry logic and exponential backoff

### Integrations
- **OpenAI Ads API** (`api.ads.openai.com/v1`) — Bearer token, all CRUD operations
- **OpenAI Conversions API** for measurement ingestion (when client has pixel installed)
- **Stripe** for subscription billing
- **Resend** for transactional email
- **Slack webhooks** for alerting
- **PostHog or Mixpanel** for product analytics

### Deployment
- Vercel for app hosting (frontend + API routes)
- Supabase for Postgres + auth (alternative: Clerk + Neon)
- Inngest cloud for background job execution
- Upstash for Redis

### Security
- All OpenAI Ads API keys encrypted at rest
- SOC 2 compliance roadmap (Year 1 priority for agency customers)
- Audit logs of every API write to OpenAI (so users can see exactly what we did on their behalf)
- IP-restricted API keys (optional, Pro+)

---

## 6. Pricing

### Tiered SaaS (Year 1)

**Starter — $199/month**
- 1 brand workspace
- Up to $10K/month managed ad spend
- AI campaign drafting
- Basic pre-spend simulation (1 simulation per day)
- Standard reporting
- Email support

**Growth — $599/month**
- 3 brand workspaces
- Up to $50K/month managed ad spend
- Unlimited simulations
- Optimization automation rules
- Custom alerts
- Predicted vs actual calibration display
- Priority email support

**Pro — $1,999/month**
- 10 brand workspaces
- Up to $250K/month managed ad spend
- White-labeled client dashboards
- Team permissions (5 seats included)
- Slack integration
- API access (read-only insights)
- Phone support

**Enterprise — Custom**
- Unlimited workspaces and spend
- Dedicated account manager
- SLA commitments
- Custom integrations
- SOC 2 compliance documentation

### Pricing rationale
- SaaS tiers chosen because: outcome-based pricing requires proven ROI we don't have yet, and SaaS predictability matches mid-market budget cycles
- Workspace count is the natural agency-pricing axis
- Managed-spend ceilings prevent the cheap tier from cannibalizing higher tiers

### Future: Performance-based add-on (Year 2)
Once we have 3-6 months of calibration data showing lift, offer:
- "Performance Boost" add-on: We keep 8% of incremental ROAS lift above a baseline. Only available to Pro+.

---

## 7. Build Roadmap

### Week 1 (Days 1-7): Foundation

**Backend:**
- Auth + workspace data model (users, workspaces, brand profiles, OpenAI API keys encrypted)
- OpenAI Ads API client wrapper (CRUD operations on campaigns/ad groups/ads/files/insights)
- Validate by reading from real OpenAI Ads test account

**Frontend:**
- Marketing landing page
- Auth flows (signup, login, OAuth)
- Onboarding wizard (brand profile setup, API key connection)
- Empty dashboard shell

**LLM:**
- Campaign drafting prompt (natural language → structured JSON)
- Tested across 5-10 sample brand types

**Deliverable:** A user can sign up, set up brand profile, connect their OpenAI Ads API key, and generate a campaign draft from natural language. No simulation, no launch yet.

### Week 2 (Days 8-14): Simulation Engine

**Backend:**
- Synthetic conversation generation pipeline (uses GPT-4o-mini with persona templates)
- Embedding similarity scoring (text-embedding-3-small)
- LLM-as-judge scoring for hints and creative
- Aggregation/ranking logic
- Background job orchestration via Inngest

**Frontend:**
- Two-pane simulation view with streaming conversations + live scoring
- Results dashboard with all 4 sections (overview, hints, creative, recommendations)
- Apply recommendations / re-simulate flow

**Deliverable:** Full simulation experience working with real OpenAI API calls. Users see predictions before they spend.

### Week 3 (Days 15-21): Launch + Performance

**Backend:**
- One-click launch flow → POST to OpenAI Ads API for campaigns, ad groups, ads
- Image upload to OpenAI's files endpoint
- Pre-flight validation (character limits, image specs, landing page reachability)
- Insights API integration for performance data
- Daily insights sync job

**Frontend:**
- Launch flow with progress animation
- Live performance dashboard (campaign, ad group, ad detail views)
- Predicted vs actual calibration display
- Approval status monitoring

**Deliverable:** End-to-end flow works. A user can sign up, draft, simulate, launch, and monitor a real campaign.

### Week 4 (Days 22-30): Optimization + Polish

**Backend:**
- Optimization rules engine (configurable triggers, scheduled execution, audit logging)
- Smart re-simulation with live data
- Weekly performance reports email job
- Stripe billing integration

**Frontend:**
- Optimization rules UI
- Multi-brand workspace switcher
- Reporting exports (CSV, PDF for Pro)
- Pricing page and checkout
- Onboarding polish and tutorial flow

**Deliverable:** Production-ready V1. Ready for first paying customers.

### Weeks 5-12: Growth & Refinement

- Conversions API ingestion + attribution layer
- Slack integration
- Team permissions
- White-label dashboards
- First case studies with design partners
- Public launch (Product Hunt, Hacker News, PPC/marketing subreddits)
- Aggressive content marketing

---

## 8. What Makes This Different From Everything Else in the Market

| Competitor | What they do | What we do differently |
|---|---|---|
| **OpenAI Ads Manager Beta (native)** | Raw campaign creation UI, post-launch reporting | AI-drafted campaigns, pre-spend simulation, predictive optimization |
| **AI-Advisors.ai** | Methodology content, Google→ChatGPT migration converter, pixel install | Full platform: simulate + launch + optimize, not just methodology |
| **Adthena AdBridge** | Google → ChatGPT migration tool | We don't require existing Google campaigns; we create from natural language |
| **Adobe GenStudio for ChatGPT** | Enterprise creative assembly for Adobe customers | Mid-market self-serve, no Adobe stack required |
| **Criteo Commerce Media → ChatGPT** | Programmatic execution for retail enterprise | Direct API integration, mid-market accessibility, predictive layer |
| **StackAdapt / Pacvue** | Programmatic DSP execution at scale | Self-serve, simulation-first, sub-enterprise |
| **Profound (with OpenAI Ads nodes)** | Workflow automation for AI ad reporting + GEO monitoring | We're the campaign creation + simulation + launch layer; complement, not compete |
| **Singular (MMP)** | Cross-channel attribution including ChatGPT Ads | Different layer entirely; they measure, we create+optimize |
| **Ryze AI** | ChatGPT Ads consulting/education for marketers | Self-serve product, not consulting service |

**The position no one else owns:** *AI-drafted campaign creation + pre-spend simulation + one-click launch to OpenAI Ads, accessible to non-enterprise advertisers.*

---

## 9. What I'd Cut If We Had Even Less Time

If 30 days is too long, the absolute minimum to test product-market fit:

**14-day MVP:**
- Onboarding (brand profile)
- AI-drafted campaign from natural language
- Pre-spend simulation
- CSV export in OpenAI's bulk upload format (user uploads to ads.openai.com themselves)
- No live dashboard yet

That's a "show them the prediction, give them the CSV, they launch themselves" product. Real value, much less code. Add the OpenAI API integration in weeks 3-4.

---

## 10. Key Risks To Track

**Risk 1: OpenAI builds simulation natively in Ads Manager.**
Mitigation: Move fast on calibration data accumulation. Position as cross-platform from month 4 (start scaffolding Perplexity Ads integration before it's even live).

**Risk 2: OpenAI Ads API rate limits.**
Mitigation: Implement aggressive caching, batch operations, exponential backoff. Monitor rate limit headers and alert when approaching ceilings.

**Risk 3: Simulation predictions don't correlate with reality.**
Mitigation: Calibration loop is core to product. Track predicted vs actual at every level (hint, creative, campaign). If correlation <0.5 after 30 days, methodology iteration is priority over feature development.

**Risk 4: Brands don't trust new platforms with ad spend management.**
Mitigation: Audit logs of every API write to OpenAI (transparency), read-only mode option, ability to operate purely as a "simulation + recommendations" layer where the brand executes manually.

**Risk 5: OpenAI changes API or policies.**
Mitigation: Monitor OpenAI's changelog, build adapter layer between our internal model and OpenAI's, test integration daily.

**Risk 6: Self-serve B2B conversion is low.**
Mitigation: Combine self-serve product with concierge onboarding for first 30-50 customers. Every new user gets a setup call.

---

## 11. What to Do This Week

**Days 1-2:**
- Set up OpenAI Ads account (real one with $50 in spend to test)
- Generate API key, start testing every endpoint (`curl` against `api.ads.openai.com/v1`)
- Build the core OpenAI Ads API client wrapper in TypeScript
- Confirm you can create a real campaign and read its insights via API end-to-end

**Days 3-5:**
- Build the AI campaign drafting prompt
- Test it against 5-10 brand types (skincare, supplements, SaaS, fashion, food, B2B services)
- Iterate until output is reliably structured and high-quality

**Days 6-7:**
- Start onboarding flow
- Brand profile data model
- API key encryption + storage

This gives you a foundation by end of week 1 that everything else builds on. The simulation engine in week 2 is the biggest single piece — start preparing the prompts and persona templates in parallel during week 1 evenings.

---

This is the product. It's a real, buildable, defensible thing that addresses a validated market need with a differentiated approach. Every feature ties to something OpenAI's platform actually exposes via API. Every claim about competitor positioning is based on what those products actually do (which I researched, not assumed).

If you want me to drill deeper into any single section — the simulation prompts, the API integration code patterns, the onboarding copy, the pricing rationale — say which one and we'll go further.