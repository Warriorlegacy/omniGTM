# Signhify Content Autopilot
## Automated Social Media Content Generation System

**Author:** Piyush Raj Singh  
**Version:** 1.0  
**License:** MIT

Automated content pipeline for Signhify Studio brand growth across Instagram, LinkedIn, Twitter, and YouTube.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTENT AUTOPILOT SYSTEM                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────────┐ │
│  │   IDEA      │───▶│   CONTENT    │───▶│    QUALITY           │ │
│  │   ENGINE    │    │   GENERATOR  │    │    GATE              │ │
│  └─────────────┘    └──────────────┘    └─────────────────────┘ │
│         │                 │                       │              │
│         ▼                 ▼                       ▼              │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────────┐ │
│  │  Trend      │    │  Multi-       │    │  Fact-Check         │ │
│  │  Scanner    │    │  Platform     │    │  Brand Voice        │ │
│  │             │    │  Adapter      │    │  Scoring            │ │
│  └─────────────┘    └──────────────┘    └─────────────────────┘ │
│                                                                  │
│                              ▼                                  │
│                    ┌─────────────────┐                          │
│                    │  SCHEDULE &     │                          │
│                    │  PUBLISH        │                          │
│                    └─────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Content Pillars

1. **AI Education** - How AI agents work, tutorials, explainers
2. **Build in Public** - Signhify project showcases, progress updates
3. **Growth Tips** - GTM strategies, marketing automation, business growth
4. **Industry Insights** - AI news, tool reviews, trend analysis
5. **Behind the Scenes** - Studio life, process breakdowns, lessons learned

---

## Platform Specifications

### Instagram
- Format: Carousel (3-10 slides), Reels (short video)
- Frequency: 1-2 posts/day
- Optimal time: 9-11 AM, 6-9 PM (IST)
- Engagement: Reply to comments within 1 hour

### LinkedIn
- Format: Text posts (1500 chars max), carousels (PDF)
- Frequency: 1 post/day
- Optimal time: 8-10 AM, 12-2 PM (IST)
- Engagement: Comment on 10 relevant posts/day

### Twitter/X
- Format: Short posts (280 chars), threads (5-10 tweets)
- Frequency: 3-5 tweets/day
- Optimal time: Throughout day
- Engagement: Reply, quote tweet, participate in conversations

### YouTube
- Format: Long-form (3-10 min), Shorts (60 sec)
- Frequency: 1 long-form/week, 3-5 shorts/week
- Optimal time: Thursday-Saturday, 2-5 PM (IST)

---

## Automated Workflow (GitHub Actions)

### Daily Content Generation (6 AM IST)

```yaml
name: Daily Content Generation
on:
  schedule:
    - cron: '0 6 * * *'
  workflow_dispatch:

jobs:
  generate-content:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Generate content ideas
        env:
          # Trend sources, topic queues
        run: npm run content:ideas
        
      - name: Generate platform content
        env:
          # AI API keys (free tiers)
        run: npm run content:generate
        
      - name: Quality gate check
        run: npm run content:quality
        
      - name: Create draft posts
        run: npm run content:drafts
        
      - name: Notify for approval
        run: npm run content:notify
```

### Weekly YouTube Video Generation (Monday 8 AM IST)

```yaml
name: Weekly YouTube Video
on:
  schedule:
    - cron: '0 8 * * 1'
  workflow_dispatch:

jobs:
  generate-video:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Research topic
        run: npm run youtube:research
        
      - name: Generate script
        run: npm run youtube:script
        
      - name: Generate voiceover
        run: npm run youtube:voice
        
      - name: Assemble video
        run: npm run youtube:assemble
        
      - name: Generate thumbnail
        run: npm run youtube:thumbnail
        
      - name: Create upload draft
        run: npm run youtube:draft
```

---

## Content Templates

### Instagram Carousel Template

```
SLIDE 1: Hook
"Stop [common mistake]. Do this instead."
[Bold visual, surprising claim]

SLIDE 2-4: Problem
"Most people [wrong approach]"
[Evidence, examples, pain points]

SLIDE 5-7: Solution
"Here's the better way:"
[Step-by-step, actionable]

SLIDE 8: Result
"[Evidence of success]"
[BEFORE/AFTER, metrics]

SLIDE 9: CTA
"Save this for later."
"Follow for more [niche] tips."
```

### LinkedIn Post Template

```
HOOK (1-2 lines):
Provocative statement or surprising insight

BODY (3-5 paragraphs):
- Context/problem
- Your perspective/approach
- Specific example or case study
- Lessons learned

CTA (1 line):
Question to drive engagement
"Agree or disagree?"
"What's your experience?"
```

### Twitter Thread Template

```
TWEET 1 (Hook):
"X lesson I learned building [project]..."
[Intriguing opening]

TWEET 2-8 (Content):
- Insight 1
- Insight 2
- ...
- Each tweet: 1 clear idea

TWEET 9 (Summary):
Key takeaway in 1 sentence

TWEET 10 (CTA):
"Follow me for more [niche]."
"Bookmark this for later."
```

### YouTube Script Template (3-5 min)

```
0:00-0:30 - Hook
[Surprising statement, question, or visual]
"By the end of this video, you'll know [specific outcome]"

0:30-1:00 - Context
[Why this matters, who it's for]
"The problem with [common approach] is..."

1:00-3:00 - Main Content
[2-3 key points with examples]
"Point 1: [explanation + example]"
"Point 2: [explanation + example]"

3:00-4:00 - Deep Dive
[One point explored in detail]
"Let me show you exactly how..."

4:00-4:30 - Summary
"So here's what we covered..."

4:30-5:00 - CTA
"If this helped, [subscribe/like/comment]"
"Next up: [tease next video]"
```

---

## Quality Gate Scoring

Each piece of content is scored 0-100:

| Category | Weight | Criteria |
|----------|--------|----------|
| Hook Strength | 25% | Grabs attention, creates curiosity |
| Value Density | 25% | Actionable, specific, useful |
| Clarity | 20% | Easy to understand, no jargon |
| Brand Alignment | 15% | Matches Signhify voice and values |
| Originality | 15% | Unique angle, not generic |

**Pass threshold: 70/100**

---

## Free Tech Stack

| Component | Tool | Cost |
|-----------|------|------|
| Code hosting | GitHub | Free |
| CI/CD | GitHub Actions | Free (2000 min/month) |
| Scheduling | GitHub Actions cron | Free |
| Database | SQLite (local) | Free |
| Content storage | GitHub repo (drafts/) | Free |
| AI generation | OpenAI/Anthropic/Gemini free tiers | Free |
| Voice generation | VoiceStudio (local) | Free |
| Video assembly | FFmpeg | Free |
| Thumbnails | Canva free / ImageMagick | Free |
| Deployment | Vercel (dashboard) | Free |

---

## Setup Instructions

1. Clone this repo
2. Configure environment (see .env.example)
3. Set up content calendar (content/calendar.json)
4. Configure platform integrations (optional)
5. Run `npm run content:generate` to test
6. Set up GitHub Actions for automation

---

## Content Calendar Template

```json
{
  "week": "2026-W45",
  "themes": {
    "monday": "AI Education",
    "tuesday": "Build in Public",
    "wednesday": "Growth Tips",
    "thursday": "Industry Insights",
    "friday": "Behind the Scenes",
    "saturday": "Curated Content",
    "sunday": "Rest / Engagement"
  },
  "platforms": {
    "instagram": {"frequency": 2, "format": "carousel"},
    "linkedin": {"frequency": 1, "format": "text"},
    "twitter": {"frequency": 5, "format": "mixed"},
    "youtube": {"frequency": 1, "format": "long-form"}
  }
}
```

---

## Metrics to Track

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| Instagram followers | 2,500 (+50%) | 10,000 |
| LinkedIn followers | 1,000 (+43%) | 2,500 |
| Twitter followers | 500 (+100%) | 2,000 |
| YouTube subscribers | 100 | 1,000 |
| Engagement rate | 3% | 5% |
| Content output | 20 posts/week | 30 posts/week |

---

*Built with ❤️ by Signhify Studio*
*Free and open source*
