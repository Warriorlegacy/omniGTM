// Content Idea Generator
import { config, contentPillars } from './config.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const generateIdeas = () => {
  console.log('🔍 Scanning for content ideas...\n');
  
  const ideas = [];
  const date = new Date().toISOString().split('T')[0];
  
  // Generate ideas from each pillar
  for (const [key, pillar] of Object.entries(contentPillars)) {
    const pillarIdeas = generatePillarIdeas(pillar, key);
    ideas.push(...pillarIdeas);
  }
  
  // Score and rank ideas
  const scoredIdeas = ideas.map(idea => ({
    ...idea,
    score: scoreIdea(idea)
  }));
  
  scoredIdeas.sort((a, b) => b.score - a.score);
  
  // Save top ideas
  const outputDir = join(config.dirs.ideas);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = join(outputDir, `ideas-${date}.json`);
  writeFileSync(outputFile, JSON.stringify(scoredIdeas.slice(0, 20), null, 2));
  
  console.log(`✅ Generated ${ideas.length} ideas`);
  console.log(`📝 Top 20 saved to: ${outputFile}\n`);
  
  // Print top 5
  console.log('🏆 Top 5 Ideas:');
  scoredIdeas.slice(0, 5).forEach((idea, i) => {
    console.log(`\n${i + 1}. [${idea.pillar}] ${idea.title}`);
    console.log(`   📝 ${idea.description}`);
    console.log(`   🎯 Score: ${idea.score}/100`);
  });
  
  return scoredIdeas;
};

const generatePillarIdeas = (pillar, key) => {
  const ideas = [];
  
  pillar.topics.forEach((topic, idx) => {
    // Generate 2-3 angles per topic
    const angles = getAnglesForTopic(topic, pillar.name);
    angles.forEach(angle => {
      ideas.push({
        id: `${key}-${idx}-${Date.now()}`,
        pillar: pillar.name,
        pillarKey: key,
        topic,
        title: angle.title,
        description: angle.description,
        format: angle.format,
        platforms: angle.platforms,
        estimatedEffort: angle.effort,
        created: new Date().toISOString()
      });
    });
  });
  
  return ideas;
};

const getAnglesForTopic = (topic, pillar) => {
  const angles = [];
  
  // Different content angles
  const angleTypes = [
    {
      type: 'how-to',
      title: `How to ${topic.toLowerCase()}`,
      description: `Step-by-step guide for ${topic.toLowerCase()}`,
      format: 'carousel',
      platforms: ['instagram', 'linkedin'],
      effort: 'medium'
    },
    {
      type: 'mistake',
      title: `Stop ${topic.toLowerCase()} like this`,
      description: `Common mistakes and better alternatives`,
      format: 'carousel',
      platforms: ['instagram', 'linkedin', 'twitter'],
      effort: 'low'
    },
    {
      type: 'insight',
      title: `What I learned about ${topic.toLowerCase()}`,
      description: `Personal insights and experiences`,
      format: 'text',
      platforms: ['linkedin', 'twitter'],
      effort: 'low'
    },
    {
      type: 'tool',
      title: `${topic.titleCase()} tools you need`,
      description: `Curated tool recommendations`,
      format: 'carousel',
      platforms: ['instagram', 'linkedin'],
      effort: 'medium'
    },
    {
      type: 'comparison',
      title: `${topic.titleCase()} vs alternatives`,
      description: `Honest comparison and recommendations`,
      format: 'text',
      platforms: ['linkedin', 'twitter', 'youtube'],
      effort: 'medium'
    }
  ];
  
  angleTypes.forEach(angle => {
    angles.push({
      title: angle.title,
      description: angle.description,
      format: angle.format,
      platforms: angle.platforms,
      effort: angle.effort,
      angleType: angle.type
    });
  });
  
  return angles;
};

const scoreIdea = (idea) => {
  let score = 50; // Base score
  
  // Effort bonus (lower effort = higher score for consistency)
  if (idea.estimatedEffort === 'low') score += 15;
  if (idea.estimatedEffort === 'medium') score += 10;
  
  // Platform diversity bonus
  if (idea.platforms.length >= 3) score += 10;
  if (idea.platforms.length >= 2) score += 5;
  
  // Format variety bonus
  if (idea.format === 'carousel') score += 5;
  
  // Pillar rotation (ensure variety)
  const pillarOrder = Object.keys(contentPillars);
  const currentIdx = pillarOrder.indexOf(idea.pillarKey);
  if (currentIdx === 0 || currentIdx === pillarOrder.length - 1) {
    score += 5; // Bonus for starting/ending cycle
  }
  
  return Math.min(100, Math.max(0, score));
};

// String prototype for titleCase
String.prototype.titleCase = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

generateIdeas();
