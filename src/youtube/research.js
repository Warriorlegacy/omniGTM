// YouTube Topic Research
import { config } from '../config.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const researchTopics = () => {
  console.log('🔍 Researching YouTube topics...\n');
  
  const topics = [
    {
      title: 'How I Built an AI Agent That Automates My Content',
      searchVolume: 'high',
      competition: 'medium',
      relevance: 9,
      hook: 'I automated my entire content pipeline with AI. Here\'s exactly how.'
    },
    {
      title: '5 AI Tools That Replace Expensive Software',
      searchVolume: 'high',
      competition: 'high',
      relevance: 8,
      hook: 'Stop paying for software. These free alternatives do the same thing.'
    },
    {
      title: 'Building in Public: My First 30 Days',
      searchVolume: 'medium',
      competition: 'low',
      relevance: 10,
      hook: 'I shared everything about my business for 30 days. Here\'s what happened.'
    },
    {
      title: 'How to Start an AI Agency with No Money',
      searchVolume: 'high',
      competition: 'high',
      relevance: 9,
      hook: 'You don\'t need capital to start an AI agency. You need this instead.'
    },
    {
      title: 'Why Your AI Projects Fail (And How to Fix It)',
      searchVolume: 'medium',
      competition: 'medium',
      relevance: 8,
      hook: 'Most AI projects fail. Here\'s the #1 reason and the fix.'
    },
    {
      title: 'My Daily Workflow for Managing Multiple Projects',
      searchVolume: 'medium',
      competition: 'low',
      relevance: 9,
      hook: 'How I manage 5 projects without burning out.'
    },
    {
      title: 'SEO for AI Projects: Complete Walkthrough',
      searchVolume: 'medium',
      competition: 'medium',
      relevance: 8,
      hook: 'SEO for AI tools is different. Here\'s the strategy that works.'
    }
  ];
  
  // Score and rank topics
  const scored = topics.map(t => ({
    ...t,
    score: (t.relevance * 0.5 + (t.searchVolume === 'high' ? 30 : t.searchVolume === 'medium' ? 20 : 10) - (t.competition === 'high' ? 10 : t.competition === 'medium' ? 5 : 0))
  }));
  
  scored.sort((a, b) => b.score - a.score);
  
  // Save research
  const outputDir = config.dirs.youtube;
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = join(outputDir, `research-${new Date().toISOString().split('T')[0]}.json`);
  writeFileSync(outputFile, JSON.stringify(scored, null, 2));
  
  console.log('📊 Top Topics:');
  scored.slice(0, 3).forEach((topic, i) => {
    console.log(`\n${i + 1}. ${topic.title}`);
    console.log(`   Score: ${topic.score}/100 | Relevance: ${topic.relevance}/10`);
    console.log(`   Hook: ${topic.hook}`);
  });
  
  console.log(`\n✅ Research saved to: ${outputFile}`);
  
  return scored;
};

researchTopics();
