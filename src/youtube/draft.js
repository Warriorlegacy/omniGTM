// YouTube Upload Draft Creator (metadata + preparation)
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { config } from '../config.js';

const createUploadDraft = async () => {
  console.log('📤 Preparing YouTube upload draft...\n');
  
  const researchDir = config.dirs.youtube;
  const date = new Date().toISOString().split('T')[0];
  
  const scriptFile = join(researchDir, `script-${date}.json`);
  const thumbnailSpecFile = join(researchDir, `thumbnail-spec-${date}.json`);
  
  if (!existsSync(scriptFile)) {
    console.log('❌ No script found. Run youtube:script first.');
    return;
  }
  
  const script = JSON.parse(readFileSync(scriptFile, 'utf-8'));
  const thumbnailSpec = existsSync(thumbnailSpecFile)
    ? JSON.parse(readFileSync(thumbnailSpecFile, 'utf-8'))
    : null;
  
  // Create upload draft
  const uploadDraft = {
    videoFile: join(researchDir, `video-${date}.mp4`),
    thumbnail: join(researchDir, `thumbnail-${date}.png`),
    metadata: {
      title: script.title,
      description: script.description,
      tags: script.tags,
      category: 'Education',
      language: 'en',
      visibility: 'unlisted', // Change to 'public' after review
      premiere: false
    },
    chapters: generateChapters(script),
    communityPost: generateCommunityPost(script),
    qaPrep: generateQAPrep(script),
    timestamp: new Date().toISOString(),
    status: 'ready-for-review'
  };
  
  // Save draft
  const draftsDir = join(researchDir, 'drafts');
  if (!existsExist(draftsDir)) {
    mkdirSync(draftsDir, { recursive: true });
  }
  
  const draftFile = join(draftsDir, `upload-draft-${date}.json`);
  writeFileSync(draftFile, JSON.stringify(uploadDraft, null, 2));
  
  console.log('✅ Upload draft created\n');
  console.log('📋 Upload Summary:');
  console.log(`   Title: ${uploadDraft.metadata.title}`);
  console.log(`   Visibility: ${uploadDraft.metadata.visibility}`);
  console.log(`   Video: ${uploadDraft.videoFile}`);
  console.log(`   Thumbnail: ${uploadDraft.thumbnail}\n`);
  
  console.log('📝 Description Preview:');
  console.log(uploadDraft.metadata.description.slice(0, 300) + '...');
  console.log('\n📊 Chapters:');
  uploadDraft.chapters.forEach(ch => {
    console.log(`   ${ch.time} - ${ch.title}`);
  });
  
  console.log('\n📱 Community Post:');
  console.log(uploadDraft.communityPost);
  
  console.log('\n✅ Review and approve before publishing!');
  console.log('   Change visibility to "public" when ready.\n');
  
  return uploadDraft;
};

const generateChapters = (script) => {
  const chapterMap = {
    'hook': '0:00 - Hook',
    'context': '0:30 - Why This Matters',
    'main-content': '1:00 - Main Content',
    'summary': '3:30 - Summary',
    'cta': '4:00 - What\'s Next'
  };
  
  return script.sections.map(section => ({
    time: chapterMap[section.name] || `${section.duration.split('-')[0]} - ${section.name}`,
    title: section.name.replace('-', ' ').toUpperCase()
  }));
};

const generateCommunityPost = (script) => {
  return `🎬 New video is live!

${script.title}

In this video, I break down [topic] and share [key insight].

Watch here: [link]

👇 What's your biggest challenge with [topic]? Let me know in the comments!

#${script.tags[0]} #tutorial #Signhify`;
};

const generateQAPrep = (script) => {
  return [
    {
      question: 'What tools do you recommend for this?',
      answer: 'I covered the main tools in the video. Check the description for links. For specific recommendations, let me know your use case!'
    },
    {
      question: 'How long did it take you to learn this?',
      answer: 'I\'ve been working on this for [time period]. The basics you can learn in a few hours, but mastery takes practice.'
    },
    {
      question: 'Is this suitable for beginners?',
      answer: 'Yes! I designed this to be accessible for beginners while still valuable for intermediate learners. Let me know if anything needs clarification.'
    }
  ];
};

const existsExist = (path) => existsSync(path);

createUploadDraft().catch(console.error);
