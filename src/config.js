// Signhify Content Autopilot Configuration
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple date utilities (no external deps)
const getDateStr = () => new Date().toISOString().split('T')[0];
const getWeekNumber = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
};
const getWeekStartDate = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
};
const getWeekEndDate = () => {
  const start = new Date(getWeekStartDate());
  const sunday = new Date(start);
  sunday.setDate(start.getDate() + 6);
  return sunday.toISOString().split('T')[0];
};

// Load environment variables
const loadEnv = () => {
  const envPath = join(__dirname, '..', '.env');
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && !key.startsWith('#')) {
        const value = valueParts.join('=').trim();
        if (value) process.env[key.trim()] = value;
      }
    });
  }
};

loadEnv();

export const config = {
  // AI Provider
  aiProvider: process.env.AI_PROVIDER || 'gemini',
  openaiKey: process.env.OPENAI_API_KEY || '',
  anthropicKey: process.env.ANTHROPIC_API_KEY || '',
  geminiKey: process.env.GEMINI_API_KEY || '',
  
  // Content Settings
  topics: (process.env.CONTENT_TOPICS || 'ai,agents,automation,growth,marketing').split(','),
  tone: (process.env.CONTENT_TONE || 'educational,authentic,practical').split(','),
  targetAudience: (process.env.TARGET_AUDIENCE || 'indie-hackers,developers').split(','),
  
  // Brand
  brandName: process.env.BRAND_NAME || 'Signhify Studio',
  brandVoice: (process.env.BRAND_VOICE || 'technical-but-accessible, honest, helpful').split(','),
  
  // Platforms
  platforms: {
    instagram: {
      enabled: !!process.env.INSTAGRAM_ACCESS_TOKEN,
      frequency: 2,
      format: 'carousel'
    },
    linkedin: {
      enabled: !!process.env.LINKEDIN_ACCESS_TOKEN,
      frequency: 1,
      format: 'text'
    },
    twitter: {
      enabled: !!process.env.TWITTER_API_KEY,
      frequency: 5,
      format: 'mixed'
    },
    youtube: {
      enabled: !!process.env.YOUTUBE_API_KEY,
      frequency: 1,
      format: 'long-form'
    }
  },
  
  // Quality Gate
  qualityThreshold: 60,
  
  // Content Directories
  dirs: {
    root: join(__dirname, '..'),
    ideas: join(__dirname, '..', 'content', 'ideas'),
    drafts: join(__dirname, '..', 'content', 'drafts'),
    published: join(__dirname, '..', 'content', 'published'),
    youtube: join(__dirname, '..', 'content', 'youtube')
  },
  
  // Date helpers
  getDateStr,
  getWeekNumber,
  getWeekStartDate,
  getWeekEndDate
};

// Content templates by platform
export const templates = {
  instagram: {
    carousel: {
      slideCount: [5, 10],
      hookPositions: ['first', 'first-and-last'],
      cta: 'Save this | Follow for more'
    },
    reel: {
      duration: [15, 60],
      style: ['tutorial', 'tips', 'behind-scenes']
    }
  },
  linkedin: {
    post: {
      maxLength: 3000,
      paragraphCount: [3, 6],
      includeQuestion: true
    },
    carousel: {
      slideCount: [5, 10],
      format: 'pdf'
    }
  },
  twitter: {
    tweet: {
      maxLength: 280,
      hashtags: 1
    },
    thread: {
      tweetCount: [5, 10],
      hookTweet: true,
      summaryTweet: true
    }
  },
  youtube: {
    longForm: {
      minDuration: 3,
      maxDuration: 10,
      structure: ['hook', 'context', 'main-content', 'summary', 'cta']
    },
    short: {
      maxDuration: 60,
      style: ['tip', 'fact', 'quick-guide']
    }
  }
};

// Content pillars with example topics
export const contentPillars = {
  aiEducation: {
    name: 'AI Education',
    topics: [
      'How AI agents work',
      'LLM fundamentals explained',
      'Building your first AI agent',
      'RAG systems tutorial',
      'Fine-tuning vs prompting',
      'AI tooling recommendations'
    ]
  },
  buildInPublic: {
    name: 'Build in Public',
    topics: [
      'Project progress updates',
      'Lessons from shipping',
      'Metrics and growth',
      'Failures and learnings',
      'Architecture decisions',
      'Code snippets and demos'
    ]
  },
  growthTips: {
    name: 'Growth Tips',
    topics: [
      'GTM strategies',
      'Content marketing',
      'Social media growth',
      'Automation workflows',
      'Productivity systems',
      'Freelancing to agency'
    ]
  },
  industryInsights: {
    name: 'Industry Insights',
    topics: [
      'AI news analysis',
      'Tool comparisons',
      'Trend predictions',
      'Market observations',
      'Research summaries',
      'Expert interviews'
    ]
  },
  behindTheScenes: {
    name: 'Behind the Scenes',
    topics: [
      'Day in the life',
      'Workspace setup',
      'Workflow breakdown',
      'Tools we use',
      'Team culture',
      'Client stories'
    ]
  }
};
