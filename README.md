# Signhify Content Autopilot

Automated social media content generation system for Signhify Studio brand growth.

## 🚀 Quick Start

```bash
# Generate content ideas
npm run content:ideas

# Generate platform-specific content
npm run content:generate

# Run quality gate
npm run content:quality

# Organize drafts for scheduling
npm run content:drafts

# Create content calendar
npm run content:drafts -- --calendar

# Full pipeline
npm run all
```

## 📁 Project Structure

```
signhify-content-autopilot/
├── src/
│   ├── config.js          # Configuration & templates
│   ├── ideas.js           # Content idea generation
│   ├── generate.js        # Content generation (IG, LI, Twitter, YouTube)
│   ├── quality.js         # Quality gate scoring
│   ├── drafts.js          # Draft organization & scheduling
│   ├── notify.js          # Approval notifications
│   └── youtube/
│       ├── research.js    # YouTube topic research
│       ├── script.js      # Video script generation
│       ├── voice.js       # Voiceover preparation (VoiceStudio)
│       ├── assemble.js    # Video assembly (FFmpeg)
│       ├── thumbnail.js   # Thumbnail generation
│       └── draft.js       # Upload draft creation
├── content/
│   ├── ideas/             # Generated content ideas
│   ├── drafts/            # Generated drafts
│   │   ├── approved/      # Quality-approved drafts
│   │   └── scheduled/     # Scheduled by day
│   ├── published/         # Published content log
│   └── youtube/           # YouTube video assets
├── .github/
│   └── workflows/
│       ├── daily-content.yml       # Daily content generation
│       ├── weekly-youtube.yml      # Weekly YouTube video
│       └── weekly-social-posts.yml # Auto-posting to platforms
├── package.json
├── .env.example
└── README.md
```

## 🎯 Content Pillars

1. **AI Education** - How AI agents work, tutorials, explainers
2. **Build in Public** - Project showcases, progress updates  
3. **Growth Tips** - GTM strategies, marketing automation
4. **Industry Insights** - AI news, tool reviews, trends
5. **Behind the Scenes** - Studio life, process, lessons

## 🔄 Automated Workflow

### Daily Content (6 AM IST)
1. **Ideas** - Generate 150+ content ideas from pillars
2. **Generate** - Create platform-specific content
3. **Quality** - Score and filter (threshold: 60/100)
4. **Schedule** - Organize by day and platform
5. **Notify** - Alert for manual approval

### Weekly YouTube (Monday 8 AM IST)
1. **Research** - Find trending topics
2. **Script** - Generate full video script
3. **Voice** - Prepare voiceover (VoiceStudio)
4. **Assemble** - Build video with FFmpeg
5. **Thumbnail** - Generate thumbnail variations
6. **Draft** - Create upload-ready package

## 🛠️ Tech Stack (All Free)

| Component | Tool | Cost |
|-----------|------|------|
| Code | GitHub | Free |
| CI/CD | GitHub Actions | Free (2000 min/mo) |
| Scheduling | GitHub Actions cron | Free |
| Storage | Files in repo | Free |
| AI | Gemini/OpenAI free tiers | Free |
| Voice | VoiceStudio (local) | Free |
| Video | FFmpeg | Free |
| Design | Manual/Canva free | Free |

## 📝 Content Templates

### Instagram Carousel
- 6 slides: Hook → Context → Step 1 → Step 2 → Value → CTA
- Caption with hashtags
- Visual direction included

### LinkedIn Post
- Hook + Body (3-6 paragraphs) + CTA question
- 500-1500 characters
- 3 hashtags

### Twitter Thread
- 8 tweets: Hook → Intro → 4 points → Summary → CTA
- Under 280 chars per tweet
- 2 hashtags

### YouTube Script
- 5 sections: Hook (30s) → Context (30s) → Main (2.5min) → Summary (30s) → CTA (30s)
- Title, description, tags, chapters
- Thumbnail concepts

## 🔐 Environment Variables

```bash
# AI Providers (pick one, all have free tiers)
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key
# or
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key

# Social APIs (optional - enables auto-posting)
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_ACCOUNT_ID=
LINKEDIN_ACCESS_TOKEN=
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_SECRET=
YOUTUBE_API_KEY=

# Notifications (optional)
DISCORD_WEBHOOK_URL=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

## 📊 Sample Output

### Generated Instagram Carousel:
```
📝 Stop how ai agents work like this

Most people get this wrong. Here's why...

Full breakdown in the carousel 👆

Which step do you struggle with most? 
Let me know in the comments 👇

#Howaiagentswork #AIEucation #Signhify
```

### Generated LinkedIn Post:
```
I ai for 2 years. Here's what nobody tells you.

When I started with ai, I thought the key was 
[common misconception].

I was wrong.

What actually matters is:

1. Understand the fundamentals before tools - 
   This is where most people fail
2. Start with a clear goal in mind - 
   The compound effect here is massive
3. Consistency over perfection - Ship, learn, improve

What's your experience with ai? 
I'd love to hear your perspective in the comments. 👇
```

## 🎬 YouTube Workflow

### 1. Research
```bash
npm run youtube:research
```
Outputs: Ranked topics with scores, search volume estimates, hooks

### 2. Script
```bash
npm run youtube:script
```
Outputs: Full script with sections, timestamps, description, tags

### 3. Voiceover (requires VoiceStudio)
```bash
npm run youtube:voice
```
Or use alternative TTS: Edge TTS, Google TTS

### 4. Assemble (requires FFmpeg)
```bash
npm run youtube:assemble
```
Creates final video with background, overlays, audio

### 5. Thumbnail
```bash
npm run youtube:thumbnail
```
Generates 3 variations with different headlines

### 6. Upload Draft
```bash
npm run youtube:draft
```
Metadata, chapters, community post, QA prep

## 📈 Growth Strategy

### Month 1 Targets
- Instagram: 2,500 followers (+50%)
- LinkedIn: 1,000 followers (+43%)
- Twitter: 500 followers (+100%)
- YouTube: 100 subscribers, 5 videos
- Content output: 20 posts/week

### Posting Cadence
| Platform | Frequency | Format | Optimal Time |
|----------|-----------|--------|--------------|
| Instagram | 2/day | Carousel, Reel | 9-11 AM, 6-9 PM IST |
| LinkedIn | 1/day | Text, Carousel | 8-10 AM, 12-2 PM IST |
| Twitter | 5/day | Tweet, Thread | Throughout day |
| YouTube | 1/week | Long-form | Thu-Sat, 2-5 PM IST |

### Content Mix
- 30% AI Education (tutorial/how-to)
- 25% Build in Public (projects/progress)
- 20% Growth Tips (strategies/advice)
- 15% Industry Insights (news/analysis)
- 10% Behind the Scenes (personal/process)

## 🔌 Integrations

### Discord Notifications
1. Create webhook in Discord server
2. Add `DISCORD_WEBHOOK_URL` to .env
3. Content approval alerts sent automatically

### Telegram Notifications
1. Create bot via @BotFather
2. Get bot token and chat ID
3. Add to .env

### Auto-Posting (requires API keys)
1. Instagram: Graph API (Facebook Developer)
2. LinkedIn: LinkedIn API (limited free access)
3. Twitter: Twitter API v2 (free tier has limits)
4. YouTube: YouTube Data API

## 🎯 Career Integration

This system doubles as a portfolio piece demonstrating:
- ✅ Automation engineering
- ✅ AI integration
- ✅ Content systems design
- ✅ Full-stack development
- ✅ Social media strategy

**For job applications**: "Built an automated content system generating 150+ ideas/week with quality scoring, deployed via GitHub Actions with multi-platform output."

## 🤖 GitHub Actions

### Daily Content
```yaml
on:
  schedule:
    - cron: '30 5 * * *'  # 6 AM IST
  workflow_dispatch:
```

### Weekly YouTube
```yaml
on:
  schedule:
    - cron: '30 2 * * 1'  # Monday 8 AM IST
  workflow_dispatch:
```

### Auto-Post
```yaml
on:
  schedule:
    - cron: '0 * * * *'  # Every hour
```

## 📚 Next Steps

1. **Configure .env** with API keys
2. **Test locally**: Run `npm run all`
3. **Set up GitHub Actions**: Push to repo, enable workflows
4. **Connect platforms**: Add API keys for auto-posting
5. **Monitor and iterate**: Review analytics, adjust content mix

## 📄 License

MIT License - Free to use and modify.

Built with ❤️ by Signhify Studio
