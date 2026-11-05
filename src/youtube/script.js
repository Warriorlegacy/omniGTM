// YouTube Script Generator
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { config } from '../config.js';

const generateScript = async () => {
  console.log('📝 Generating YouTube script...\n');
  
  // Load research
  const researchDir = config.dirs.youtube;
  const date = new Date().toISOString().split('T')[0];
  const researchFile = join(researchDir, `research-${date}.json`);
  
  if (!existsSync(researchFile)) {
    console.log('❌ No research found. Run youtube:research first.');
    return;
  }
  
  const research = JSON.parse(readFileSync(researchFile, 'utf-8'));
  const topic = research[0]; // Use top-ranked topic
  
  console.log(`🎯 Selected topic: ${topic.title}`);
  
  // Generate script
  const script = generateYouTubeScript(topic);
  
  // Save script
  writeFileSync(
    join(researchDir, `script-${date}.json`),
    JSON.stringify(script, null, 2)
  );
  
  console.log('✅ Script generated and saved\n');
  console.log('📋 Script Preview:');
  console.log(`Title: ${script.title}`);
  console.log(`Estimated Duration: ${script.estimatedDuration}\n`);
  
  script.sections.forEach(section => {
    console.log(`[${section.duration}] ${section.name.toUpperCase()}`);
    console.log(`${section.script.slice(0, 150)}...`);
    console.log('');
  });
  
  return script;
};

const generateYouTubeScript = (topic) => {
  const structure = {
    hook: generateHook(topic),
    context: generateContext(topic),
    mainContent: generateMainContent(topic),
    summary: generateSummary(topic),
    cta: generateCTA(topic)
  };
  
  return {
    title: topic.title,
    hook: topic.hook,
    estimatedDuration: '4-5 minutes',
    sections: [
      {
        name: 'hook',
        duration: '0:00-0:30',
        script: structure.hook
      },
      {
        name: 'context',
        duration: '0:30-1:00',
        script: structure.context
      },
      {
        name: 'main-content',
        duration: '1:00-3:30',
        script: structure.mainContent
      },
      {
        name: 'summary',
        duration: '3:30-4:00',
        script: structure.summary
      },
      {
        name: 'cta',
        duration: '4:00-4:30',
        script: structure.cta
      }
    ],
    thumbnailConcept: generateThumbnailConcept(topic),
    tags: generateTags(topic),
    description: generateDescription(topic)
  };
};

const generateHook = (topic) => {
  return `${topic.hook}\n\n` +
    `By the end of this video, you'll know exactly how to [achieve outcome related to topic].\n\n` +
    `And I'm going to show you the exact steps, tools, and mistakes to avoid.\n\n` +
    `[Visual: Quick montage of results/demo]\n\n` +
    `Stick around - this will change how you think about [topic area].`;
};

const generateContext = (topic) => {
  return `Hey, I'm Piyush from Signhify Studio. I've been building AI systems and automation for [time period], and today I want to share something that took me [time] to figure out.\n\n` +
    `The problem with [topic area] is that most people [common misconception or mistake].\n\n` +
    `They try [wrong approach] and get [bad result]. Sound familiar?\n\n` +
    `I was there too. But then I discovered [key insight]...`;
};

const generateMainContent = (topic) => {
  return `Let me break this down into 3 key points.

POINT 1: [Key Principle]

[Explanation with example]

The reason this matters is [reason]. When you [action], you get [result].

I learned this when [personal story or case study].

POINT 2: [Implementation]

Here's how to actually do this:

Step 1: [Actionable step]
- [Detail]
- [Detail]

Step 2: [Actionable step]
- [Detail]
- [Detail]

Step 3: [Actionable step]
- [Detail]
- [Detail]

[Visual: Screen recording or diagram]

POINT 3: [Common Mistake to Avoid]

The biggest mistake I see is [mistake].

Instead, do [correct approach].

Here's why: [explanation]

[Visual: Before/after comparison]`;
};

const generateSummary = (topic) => {
  return `So to recap:

1. [Key point 1]
2. [Key point 2]  
3. [Key point 3]

If you implement these, you'll [expected outcome] within [timeframe].

The key insight is [main takeaway]. Everything else is secondary.`;
};

const generateCTA = (topic) => {
  return `If this video helped you, do me a favor:

1. Hit that like button - it helps more people find this
2. Subscribe for more on [channel topic] - I post every [frequency]
3. Comment below: what's your biggest challenge with [topic]?

I read every comment and often make videos based on your questions.

Up next, I'm covering [related topic]. You won't want to miss it.

Thanks for watching, and I'll see you in the next one.`;
};

const generateThumbnailConcept = (topic) => {
  return {
    style: 'Bold, high-contrast, minimal text',
    elements: [
      'Face (if available) or relevant imagery',
      '2-3 word headline',
      'Arrow or visual cue',
      'Before/after comparison (if applicable)'
    ],
    headlineOptions: [
      'FREE Alternative',
      'Stop Doing This',
      'The Truth',
      'I Tried It'
    ],
    colors: 'Purple gradient (Signhify brand) with white text'
  };
};

const generateTags = (topic) => {
  return [
    topic.title.split(' ')[0],
    'tutorial',
    'how to',
    'guide',
    'Signhify',
    'AI',
    'automation',
    'growth'
  ];
};

const generateDescription = (topic) => {
  return `${topic.hook}

In this video, I break down [topic] and share the exact framework I use.

👋 About:
Piyush Raj Singh, Founder @ Signhify Studio
Building AI-powered solutions for businesses

🔗 Links:
• Signhify Studio: signhify.lovable.app
• GitHub: github.com/yourusername
• LinkedIn: linkedin.com/in/piyushraj-singh

⏱️ Timestamps:
0:00 - Hook
0:30 - Context
1:00 - Main Content
3:30 - Summary
4:00 - CTA

#${topic.title.split(' ')[0]} #tutorial #Signhify`;
};

generateScript().catch(console.error);
