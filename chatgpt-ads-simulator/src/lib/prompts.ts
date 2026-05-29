import type { BrandProfile, Conversation, CreativeWithId, Persona } from "./types";

export const SYNTHETIC_CONVERSATION_PROMPT = (params: {
  category: string;
  persona: Persona;
}) => `You are generating realistic ChatGPT user conversations to simulate what real people in the ${params.category} space actually ask ChatGPT.

Generate ONE realistic multi-turn conversation where this specific user asks ChatGPT for help.

USER PERSONA:
- Demographics: ${params.persona.demographics}
- Budget sensitivity: ${params.persona.budgetSensitivity}
- Intent stage: ${params.persona.intentStage}
- Knowledge level: ${params.persona.knowledgeLevel}
- Urgency: ${params.persona.urgency}
- Specific situation: ${params.persona.situation}
- Concerns: ${params.persona.concerns.join(", ")}

The conversation must feel REAL:
- Use casual, conversational language with occasional typos, abbreviations, lowercase starts
- 3-6 user messages, getting more specific over time
- Show natural refinement — the user updates what they want as they think
- Include personal context naturally (mentions of partner, kids, weather, time pressure, social situation)
- The user does NOT name specific brands unless deeply relevant to their question
- Don't write the assistant's responses — only user messages

Return ONLY valid JSON, no preamble, no code fences:

{
  "persona_summary": "30-word summary of who this person is and what they're trying to do",
  "intent_stage": "discovery" | "research" | "comparison" | "decision" | "post_purchase",
  "commercial_intent_score": 0.0-1.0,
  "implied_needs": ["need1", "need2", "need3"],
  "key_themes": ["theme1", "theme2", "theme3"],
  "messages": [
    {"role": "user", "content": "...", "turn": 1},
    {"role": "user", "content": "...", "turn": 2}
  ]
}`;

export const HINT_SCORING_PROMPT = (params: {
  conversation: Conversation;
  hint: string;
  productDescription: string;
}) => `You are scoring whether an ad with a specific context hint would be likely to surface in a ChatGPT conversation, using OpenAI's relevance-weighted second-price auction model.

USER CONVERSATION (all user messages):
${params.conversation.messages.map((message) => `[Turn ${message.turn}] ${message.content}`).join("\n")}

PERSONA SUMMARY: ${params.conversation.persona_summary}
COMMERCIAL INTENT: ${params.conversation.commercial_intent_score}
INTENT STAGE: ${params.conversation.intent_stage}

ADVERTISER PRODUCT: ${params.productDescription}
ADVERTISER CONTEXT HINT: "${params.hint}"

Score on three dimensions, then output a final eligibility decision.

Return ONLY valid JSON:
{
  "topical_relevance": 0.0-1.0,
  "intent_alignment": 0.0-1.0,
  "natural_fit": 0.0-1.0,
  "weighted_score": 0.0-1.0,
  "would_surface": true | false,
  "reasoning": "1-sentence explanation"
}

Use this weighted_score formula: 0.4 * topical_relevance + 0.4 * intent_alignment + 0.2 * natural_fit
Use this rule: would_surface = true only if weighted_score >= 0.55 AND commercial_intent_score from the conversation >= 0.3`;

export const CREATIVE_SCORING_PROMPT = (params: {
  conversation: Conversation;
  creative: CreativeWithId;
  category: string;
}) => `You are predicting click-through rate for an ad variant shown to a specific user in a ChatGPT conversation.

CONVERSATION CONTEXT (final user message):
"${params.conversation.messages[params.conversation.messages.length - 1]?.content ?? ""}"

USER PERSONA: ${params.conversation.persona_summary}
INTENT STAGE: ${params.conversation.intent_stage}
CATEGORY: ${params.category}

AD VARIANT:
Title: "${params.creative.title}"
Description: "${params.creative.description}"
Landing page: "${params.creative.landingPage}"

Predict whether this user, in this conversation, would click on this ad.

Return ONLY valid JSON:
{
  "predicted_ctr": 0.0-15.0,
  "hook_strength": 0.0-1.0,
  "value_clarity": 0.0-1.0,
  "context_match": 0.0-1.0,
  "cta_fit": 0.0-1.0,
  "would_click_probability": 0.0-1.0,
  "reasoning": "1-sentence explanation"
}

Use these CTR benchmarks based on context: poor match (0.5-1.5%), okay match (1.5-3%), good match (3-6%), excellent match (6-10%), perfect fit (10-15%).`;

export const DRAFT_CAMPAIGN_PROMPT = (params: {
  brand: BrandProfile;
  naturalLanguageBrief: string;
}) => `You are an expert ChatGPT Ads strategist. The advertiser has described their campaign goal in natural language. Generate a complete campaign draft following OpenAI Ads Manager's structure (Campaign → Ad Groups → Ads).

BRAND PROFILE:
Name: ${params.brand.name}
URL: ${params.brand.url}
Category: ${params.brand.category}
Price range: ${params.brand.priceRange}
Description: ${params.brand.description}
Target customer: ${params.brand.targetCustomer}
Brand voice: ${params.brand.brandVoice.join(", ")}
Excluded topics: ${params.brand.excludedTopics}

ADVERTISER'S CAMPAIGN BRIEF:
"${params.naturalLanguageBrief}"

Generate a campaign draft. Follow these rules:
- Create 1 campaign with an appropriate objective (Reach for awareness, Clicks for traffic/leads, Conversions for sales)
- Create 2-4 ad groups, each targeting a distinct persona × intent combination
- For each ad group, generate 6-9 context hints following one of OpenAI's 5 hint patterns: Persona+Intent, Question, Topic+Disqualifier, Outcome, Stack Comparison
- For each ad group, generate 3 ad variants
- Ad titles: 16-24 characters EXACTLY (validated)
- Ad descriptions: 32-48 characters EXACTLY (validated)
- Suggest a recommended max CPC bid ($3-5 default range, adjust for category)
- Suggest a daily budget distribution

Return ONLY valid JSON, no preamble, no code fences:
{
  "campaign": {
    "name": "string",
    "objective": "reach" | "clicks" | "conversions",
    "daily_budget_usd": number,
    "duration_days": number,
    "rationale": "1-sentence explanation of structure choice"
  },
  "ad_groups": [
    {
      "id": "ag_1",
      "name": "string",
      "persona_summary": "30-word description",
      "intent_stage": "discovery|research|comparison|decision",
      "context_hints": [
        {
          "id": "hint_1",
          "text": "string",
          "pattern": "persona_intent|question|topic_disqualifier|outcome|stack_comparison"
        }
      ],
      "ads": [
        {
          "id": "ad_1",
          "title": "string (16-24 chars)",
          "description": "string (32-48 chars)",
          "landing_page": "string",
          "creative_angle": "string"
        }
      ],
      "max_cpc_bid_usd": number,
      "budget_allocation_pct": number
    }
  ]
}`;
