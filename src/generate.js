// Content Generator
import { config, templates } from './config.js';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const generateContent = async () => {
  console.log('🎨 Generating platform-specific content...\n');
  
  // Load ideas
  const ideasDir = config.dirs.ideas;
  const date = new Date().toISOString().split('T')[0];
  const ideasFile = join(ideasDir, `ideas-${date}.json`);
  
  if (!existsSync(ideasFile)) {
    console.log('❌ No ideas file found. Run npm run content:ideas first.');
    return;
  }
  
  const ideas = JSON.parse(readFileSync(ideasFile, 'utf-8'));
  const drafts = [];
  
  // Generate content for top ideas
  for (let i = 0; i < Math.min(5, ideas.length); i++) {
    const idea = ideas[i];
    console.log(`📝 Generating content for: ${idea.title}`);
    
    const draft = await generateDraft(idea);
    drafts.push(draft);
    
    // Save draft
    const draftsDir = config.dirs.drafts;
    if (!existsSync(draftsDir)) {
      mkdirSync(draftsDir, { recursive: true });
    }
    
    const draftFile = join(draftsDir, `${draft.id}.json`);
    writeFileSync(draftFile, JSON.stringify(draft, null, 2));
  }
  
  // Save all drafts
  const draftsDir = config.dirs.drafts;
  const allDraftsFile = join(draftsDir, `drafts-${date}.json`);
  writeFileSync(allDraftsFile, JSON.stringify(drafts, null, 2));
  
  console.log(`\n✅ Generated ${drafts.length} drafts`);
  console.log(`📁 Saved to: ${draftsDir}\n`);
  
// Summary
  console.log('📊 Content Summary:');
  drafts.forEach(draft => {
    console.log(`\n${draft.platforms.join(', ').toUpperCase()}:`);
    // Show first platform content preview
    const firstPlatform = draft.platforms[0];
    if (draft.content[firstPlatform]) {
      const content = draft.content[firstPlatform];
      if (content.content) {
        console.log(`   ${content.content.slice(0, 100)}...`);
      } else if (content.slides) {
        console.log(`   ${content.slides[0].text.slice(0, 100)}...`);
      } else if (content.tweets) {
        console.log(`   ${content.tweets[0].content.slice(0, 100)}...`);
      }
    }
  });
  
  return drafts;
};

const generateDraft = async (idea) => {
  const content = generatePlatformContent(idea);
  
  return {
    id: `${idea.id}-draft-${Date.now()}`,
    ideaId: idea.id,
    title: idea.title,
    pillar: idea.pillar,
    created: new Date().toISOString(),
    platforms: idea.platforms,
    content,
    status: 'draft'
  };
};

const generatePlatformContent = (idea) => {
  const content = {};
  
  // Instagram Carousel
  if (idea.platforms.includes('instagram') && idea.format === 'carousel') {
    content.instagram = generateInstagramCarousel(idea);
  }
  
  // LinkedIn Post
  if (idea.platforms.includes('linkedin')) {
    content.linkedin = generateLinkedInPost(idea);
  }
  
  // Twitter/X
  if (idea.platforms.includes('twitter')) {
    content.twitter = generateTwitterContent(idea);
  }
  
  // YouTube (if applicable)
  if (idea.platforms.includes('youtube')) {
    content.youtube = generateYouTubeScript(idea);
  }
  
  return content;
};

const generateInstagramCarousel = (idea) => {
  // Generate carousel slides
  const slides = [
    {
      type: 'hook',
      text: idea.title,
      subtext: 'Save this for later ⬇️',
      visual: 'bold-gradient'
    },
    {
      type: 'context',
      text: getContextSlide(idea),
      visual: 'clean'
    },
    {
      type: 'content',
      text: getContentSlide1(idea),
      visual: 'steps'
    },
    {
      type: 'content',
      text: getContentSlide2(idea),
      visual: 'steps'
    },
    {
      type: 'value',
      text: getValueSlide(idea),
      visual: 'highlight'
    },
    {
      type: 'cta',
      text: 'Follow @signhify.studio for more',
      subtext: 'Share this with someone who needs it',
      visual: 'gradient'
    }
  ];
  
  const caption = generateCaption(idea);
  
  return {
    format: 'carousel',
    slideCount: slides.length,
    slides,
    caption,
    hashtags: generateHashtags(idea).map(h => h.toLowerCase()),
    visualDirection: 'Clean, modern, gradient accents. Consistent with Signhify brand.'
  };
};

const getContextSlide = (idea) => {
  const contexts = [
    `Most people get this wrong. Here's why...`,
    `I used to struggle with this too. Then I discovered...`,
    `After ${idea.pillar.toLowerCase()} for 2+ years, here's what I learned...`,
    `The problem with ${idea.topic.toLowerCase()} isn't what you think...`
  ];
  return contexts[Math.floor(Math.random() * contexts.length)];
};

const getContentSlide1 = (idea) => {
  return `💡 Step 1: ${getStepAdvice(idea, 1)}\n\n${getExplanation(idea, 1)}`;
};

const getContentSlide2 = (idea) => {
  return `🎯 Step 2: ${getStepAdvice(idea, 2)}\n\n${getExplanation(idea, 2)}`;
};

const getStepAdvice = (idea, step) => {
  const advice = [
    `Understand the fundamentals before tools`,
    `Start with a clear goal in mind`,
    `Build systems, not one-off actions`,
    `Measure what matters`,
    `Iterate based on data`
  ];
  return advice[(idea.id.length + step) % advice.length];
};

const getExplanation = (idea, step) => {
  const explanations = [
    `This might seem obvious, but most people skip it. Don't be most people.`,
    `I see this mistake constantly. Here's the fix...`,
    `This single change made the biggest difference for me.`,
    `The key insight: ${idea.topic.toLowerCase()} isn't about X, it's about Y.`
  ];
  return explanations[(idea.id.length + step * 2) % explanations.length];
};

const getValueSlide = (idea) => {
  const values = [
    `The result? ${idea.title.split(' ').slice(0, 3).join(' ')} becomes 10x easier.`,
    `This approach saved me hours every week. Try it.`,
    `Remember: consistency beats perfection every time.`,
    `The best time to start was yesterday. The second best time is now.`
  ];
  return values[Math.floor(Math.random() * values.length)];
};

const generateCaption = (idea) => {
  return `${idea.title}\n\n` +
    `${getContextSlide(idea)}\n\n` +
    `Full breakdown in the carousel 👆\n\n` +
    `Which step do you struggle with most? Let me know in the comments 👇\n\n` +
    `#${titleCase(idea.topic)} #${idea.pillar.replace(' ', '')} #Signhify`;
};

const generateHashtags = (idea) => {
  const baseTags = ['#AI', '#Automation', '#Growth', '#Builder', '#Signhify'];
  const topicTags = [`#${titleCase(idea.topic)}`, `#${idea.pillar.replace(' ', '')}`];
  return [...baseTags, ...topicTags].slice(0, 10);
};

const generateLinkedInPost = (idea) => {
  const hook = getLinkedInHook(idea);
  const body = getLinkedInBody(idea);
  const cta = getLinkedInCTA(idea);
  
  return {
    format: 'text',
    content: `${hook}\n\n${body}\n\n${cta}`,
    length: `${hook.length + body.length + cta.length} chars`,
    includeMedia: false,
    tags: [...generateHashtags(idea).slice(0, 3)]
  };
};

const getLinkedInHook = (idea) => {
  const hooks = [
    `I ${idea.topic.toLowerCase()} for 2 years. Here's what nobody tells you.`,
    `Most ${idea.topic.toLowerCase()} advice is wrong. Here's what actually works.`,
    `After helping ${idea.pillar.toLowerCase()} clients, one pattern stands out.`,
    `The biggest ${idea.topic.toLowerCase()} mistake I see (and how to fix it)`
  ];
  return hooks[Math.floor(Math.random() * hooks.length)];
};

const getLinkedInBody = (idea) => {
  return `When I started with ${idea.topic.toLowerCase()}, I thought the key was [common misconception].

I was wrong.

What actually matters is:

1. ${getStepAdvice(idea, 1)} - This is where most people fail
2. ${getStepAdvice(idea, 2)} - The compound effect here is massive
3. Consistency over perfection - Ship, learn, improve

The result isn't just better ${idea.topic.toLowerCase()} - it's a fundamentally different approach to ${idea.pillar.toLowerCase()}.

Want to go deeper? I break this down in my Newsletter/YouTube. Link in bio.`;
};

const getLinkedInCTA = (idea) => {
  return `What's your experience with ${idea.topic.toLowerCase()}? I'd love to hear your perspective in the comments. 👇`;
};

const generateTwitterContent = (idea) => {
  // Generate a thread
  const tweets = [
    {
      type: 'hook',
      content: `${idea.title}\n\nA thread on ${idea.topic.toLowerCase()} 🧵`
    },
    {
      type: 'intro',
      content: `I've spent the last 2 years deep in ${idea.topic.toLowerCase()}. Here are ${idea.platforms.length > 2 ? '7' : '5'} lessons that changed everything:`
    },
    {
      type: 'point',
      content: `1/ ${getStepAdvice(idea, 1)}\n\nMost people overlook this. Here's why it matters...`
    },
    {
      type: 'point',
      content: `2/ ${getStepAdvice(idea, 2)}\n\nThe key insight: it's not about the tool, it's about the system.`
    },
    {
      type: 'point',
      content: `3/ The framework I use:\n• Identify the bottleneck\n• Remove friction\n• Automate the repetitive\n• Focus on high-leverage activities`
    },
    {
      type: 'insight',
      content: `4/ ${getExplanation(idea, 1)}\n\nThis one change had the biggest ROI for me.`
    },
    {
      type: 'summary',
      content: `To recap:\n• ${getStepAdvice(idea, 1)}\n• ${getStepAdvice(idea, 2)}\n• Stay consistent\n\nWhat would you add?`
    },
    {
      type: 'cta',
      content: `Follow me @signhify_studio for more on ${idea.topic.toLowerCase()} and ${idea.pillar.toLowerCase()}.\n\nBookmark this thread for later 🔖`
    }
  ];
  
  return {
    format: 'thread',
    tweetCount: tweets.length,
    tweets,
    hashtags: generateHashtags(idea).slice(0, 2).map(h => h.toLowerCase())
  };
};

const generateYouTubeScript = (idea) => {
  return {
    format: 'long-form',
    estimatedDuration: '4-5 minutes',
    sections: [
      {
        name: 'hook',
        duration: '0:00-0:30',
        script: `${idea.title}\n\nBy the end of this video, you'll know exactly how to ${idea.topic.toLowerCase()} without [common pain point].\n\nStick around - this will save you hours.`
      },
      {
        name: 'context',
        duration: '0:30-1:00',
        script: `Hey, I'm Piyush from Signhify Studio. I've been ${idea.topic.toLowerCase()} for [time period], and today I'm sharing what I've learned.

Here's the thing - most people approach ${idea.topic.toLowerCase()} wrong. They [common mistake]. And that's why they struggle.

But it doesn't have to be that way.`
      },
      {
        name: 'main-content',
        duration: '1:00-3:30',
        script: `Let me break this down into actionable steps.

Step 1: ${getStepAdvice(idea, 1)}

[Explain with example]

This matters because [reason]. Here's what happens when you do this...

Step 2: ${getStepAdvice(idea, 2)}

[Explain with example]

The key insight here is...

Step 3: [Additional tip specific to topic]

[Explain with example]`
      },
      {
        name: 'summary',
        duration: '3:30-4:00',
        script: `So to recap:\n\n1. ${getStepAdvice(idea, 1)}\n2. ${getStepAdvice(idea, 2)}\n3. [Additional tip]\n\nImplement these and you'll see results within [timeframe].`
      },
      {
        name: 'cta',
        duration: '4:00-4:30',
        script: `If this helped, hit like and subscribe for more on ${idea.topic.toLowerCase()}.

Next video: [tease related topic]

Question for you: What's your biggest challenge with ${idea.topic.toLowerCase()}? Let me know in the comments.`
      }
    ],
    title: idea.title,
    description: `Learn how to ${idea.topic.toLowerCase()} effectively. In this video, I break down [key points] that will help you [outcome].\n\n👋 About: Piyush Raj Singh, Founder @ Signhify Studio\n🔗 Links: [your links]\n\n#${idea.topic.titleCase()} #${idea.pillar.replace(' ', '')}`,
    tags: [...generateHashtags(idea).slice(0, 5).map(t => t.slice(1))]
  };
};

// Helper function for titleCase
const titleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Run generation
generateContent().catch(console.error);
