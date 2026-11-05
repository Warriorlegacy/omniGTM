// Quality Gate - Score and filter content
import { config } from './config.js';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const qualityCheck = async () => {
  console.log('🔍 Running quality gate checks...\n');
  
  const draftsDir = config.dirs.drafts;
  const files = existsSync(draftsDir) 
    ? readdirSync(draftsDir).filter(f => f.endsWith('.json'))
    : [];
  
  if (files.length === 0) {
    console.log('❌ No drafts found. Run npm run content:generate first.');
    return;
  }
  
  const date = new Date().toISOString().split('T')[0];
  const approved = [];
  const rejected = [];
  
  for (const file of files) {
    const draft = JSON.parse(readFileSync(join(draftsDir, file), 'utf-8'));
    const { score, issues } = scoreDraft(draft);
    
    draft.qualityScore = score;
    draft.qualityIssues = issues;
    draft.qualityChecked = new Date().toISOString();
    
    if (score >= config.qualityThreshold) {
      approved.push(draft);
      draft.status = 'approved';
    } else {
      rejected.push(draft);
      draft.status = 'rejected';
    }
    
    // Update draft file
    writeFileSync(join(draftsDir, file), JSON.stringify(draft, null, 2));
  }
  
  // Save results
  const approvedDir = join(config.dirs.drafts, 'approved');
  if (!existsSync(approvedDir)) {
    mkdirSync(approvedDir, { recursive: true });
  }
  
  writeFileSync(
    join(approvedDir, `approved-${date}.json`),
    JSON.stringify(approved, null, 2)
  );
  
  console.log(`✅ Quality Gate Results:`);
  console.log(`   Approved: ${approved.length}`);
  console.log(`   Rejected: ${rejected.length}`);
  console.log(`   Threshold: ${config.qualityThreshold}/100\n`);
  
  if (rejected.length > 0) {
    console.log('❌ Rejected Content:');
    rejected.forEach(draft => {
      console.log(`   - ${draft.title} (${draft.qualityScore}/100)`);
      console.log(`     Issues: ${draft.qualityIssues.join(', ')}`);
    });
    console.log();
  }
  
  return { approved, rejected };
};

const scoreDraft = (draft) => {
  let score = 0;
  const issues = [];
  
  // Create a minimal idea object from the draft for scoring
  const idea = {
    topic: (draft.title || 'content').toLowerCase().replace(/\bstop\s+/i, '').trim() || 'content',
    pillar: draft.pillar || 'general'
  };
  
  // Check each platform's content
  for (const [platform, content] of Object.entries(draft.content || {})) {
    const platformScore = scorePlatformContent(platform, content, idea);
    score += platformScore.platformScore;
    
    if (platformScore.issues.length > 0) {
      issues.push(...platformScore.issues.map(i => `${platform}: ${i}`));
    }
  }
  
  // Average score across platforms
  const platformCount = Object.keys(draft.content || {}).length || 1;
  score = Math.round(score / platformCount);
  
  // Pillar diversity bonus
  if (draft.pillar) {
    score += 5; // Bonus for staying on-brand
  }
  
  return {
    score: Math.min(100, score),
    issues: issues.slice(0, 5) // Top 5 issues
  };
};

const scorePlatformContent = (platform, content, idea) => {
  let platformScore = 60; // Base score
  const issues = [];
  
  switch (platform) {
    case 'instagram':
      platformScore = scoreInstagram(content, idea, issues);
      break;
    case 'linkedin':
      platformScore = scoreLinkedIn(content, idea, issues);
      break;
    case 'twitter':
      platformScore = scoreTwitter(content, idea, issues);
      break;
    case 'youtube':
      platformScore = scoreYouTube(content, idea, issues);
      break;
  }
  
  return { platformScore, issues };
};

const scoreInstagram = (content, idea, issues) => {
  let score = 60;
  
  // Check slide count
  if (content.slideCount < 5) {
    score -= 10;
    issues.push('Too few slides (min 5 recommended)');
  }
  
  // Check for hook
  const hasHook = content.slides.some(s => s.type === 'hook');
  if (!hasHook) {
    score -= 15;
    issues.push('Missing hook slide');
  }
  
  // Check for CTA
  const hasCTA = content.slides.some(s => s.type === 'cta');
  if (!hasCTA) {
    score -= 10;
    issues.push('Missing CTA slide');
  }
  
  // Check caption length
  if (content.caption && content.caption.length < 100) {
    score -= 5;
    issues.push('Caption too short');
  }
  
  // Check hashtags
  if (!content.hashtags || content.hashtags.length < 5) {
    score -= 5;
    issues.push('Insufficient hashtags');
  }
  
  return Math.max(0, score);
};

const scoreLinkedIn = (content, idea, issues) => {
  let score = 60;
  
  // Check hook strength
  if (content.content) {
    const firstLine = content.content.split('\n')[0];
    if (firstLine.length < 50) {
      score -= 10;
      issues.push('Hook too short - needs more impact');
    }
  }
  
  // Check content length
  if (content.content && content.content.length < 500) {
    score -= 5;
    issues.push('Content too brief for LinkedIn');
  }
  
  // Check for question CTA
  if (!content.content?.includes('?')) {
    score -= 10;
    issues.push('Missing engagement question');
  }
  
  return Math.max(0, score);
};

const scoreTwitter = (content, idea, issues) => {
  let score = 60;
  
  // Check thread structure
  if (content.tweetCount < 5) {
    score -= 10;
    issues.push('Thread too short (min 5 tweets)');
  }
  
  // Check for hook tweet
  const hasHook = content.tweets.some(t => t.type === 'hook');
  if (!hasHook) {
    score -= 15;
    issues.push('Missing hook tweet');
  }
  
  // Check tweet lengths
  for (const tweet of content.tweets) {
    if (tweet.content && tweet.content.length > 280) {
      score -= 5;
      issues.push(`Tweet too long (${tweet.content.length} chars)`);
      break;
    }
  }
  
  return Math.max(0, score);
};

const scoreYouTube = (content, idea, issues) => {
  let score = 60;
  
  // Check for all required sections
  const requiredSections = ['hook', 'context', 'main-content', 'summary', 'cta'];
  const missingSections = requiredSections.filter(
    s => !content.sections.some(sec => sec.name === s)
  );
  
  if (missingSections.length > 0) {
    score -= 20;
    issues.push(`Missing sections: ${missingSections.join(', ')}`);
  }
  
  // Check hook duration
  const hookSection = content.sections.find(s => s.name === 'hook');
  if (hookSection && hookSection.duration > '0:45') {
    score -= 5;
    issues.push('Hook too long (should be under 45 seconds)');
  }
  
  return Math.max(0, score);
};

qualityCheck().catch(console.error);
