// Video Assembly with FFmpeg (free, open source)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { config } from '../config.js';
import { execSync } from 'child_process';

const assembleVideo = async () => {
  console.log('🎬 Assembling video with FFmpeg...\n');
  
  const researchDir = config.dirs.youtube;
  const date = new Date().toISOString().split('T')[0];
  const scriptFile = join(researchDir, `script-${date}.json`);
  
  if (!existsSync(scriptFile)) {
    console.log('❌ No script found. Run youtube:script first.');
    return;
  }
  
  const script = JSON.parse(readFileSync(scriptFile, 'utf-8'));
  
  // Check FFmpeg
  const ffmpegAvailable = checkFFmpeg();
  
  if (!ffmpegAvailable) {
    console.log('❌ FFmpeg not found. Install from https://ffmpeg.org');
    console.log('   Or use: brew install ffmpeg (macOS) / apt install ffmpeg (Linux)\n');
    return;
  }
  
  console.log('✅ FFmpeg detected\n');
  
  // Video assembly plan
  const assemblyPlan = {
    input: {
      voiceover: join(researchDir, `voiceover-${date}.mp3`),
      background: 'content/youtube/assets/background.mp4 (or generate)',
      overlays: 'content/youtube/assets/overlays/ (text, graphics)'
    },
    output: join(researchDir, `video-${date}.mp4`),
    specs: {
      resolution: '1080x1920 (9:16 for Shorts) or 1920x1080 (16:9)',
      fps: 30,
      bitrate: '5000k',
      format: 'mp4'
    }
  };
  
  console.log('📋 Assembly Plan:');
  console.log(`   Input: Voiceover + Background + Overlays`);
  console.log(`   Output: ${assemblyPlan.output}`);
  console.log(`   Resolution: ${assemblyPlan.specs.resolution}`);
  
  // FFmpeg commands (example)
  const commands = generateFFmpegCommands(assemblyPlan, date);
  
  console.log('\n🔧 FFmpeg Commands (run in order):');
  commands.forEach((cmd, i) => {
    console.log(`\n[Step ${i + 1}] ${cmd.slice(0, 100)}...`);
  });
  
  // Save assembly plan
  writeFileSync(
    join(researchDir, `assembly-${date}.json`),
    JSON.stringify({
      plan: assemblyPlan,
      commands,
      timestamp: new Date().toISOString()
    }, null, 2)
  );
  
  console.log('\n✅ Assembly plan saved');
  console.log('\n📁 Required assets to prepare:');
  console.log('   1. Background video (free from Pexels/Pixabay)');
  console.log('   2. Text overlays (generate with FFmpeg drawtext or Canva)');
  console.log('   3. Logos/branding (Signhify logo)');
  console.log('   4. Intro/outro clips (optional)');
  
  return assemblyPlan;
};

const checkFFmpeg = () => {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

const generateFFmpegCommands = (plan, date) => {
  const commands = [];
  const outputBase = join(config.dirs.youtube, `temp-${date}`);
  
  // Step 1: Create audio visualization (optional)
  commands.push(
    `ffmpeg -i "${plan.input.voiceover}" -filter_complex "showwaves=s=1920x100:colors=white" -frames:v 1 -q:v 2 "${outputBase}/waveform.png"`
  );
  
  // Step 2: Create text overlays (example with drawtext)
  commands.push(
    `ffmpeg -f lavfi -i color=c=black:s=1920x1080:d=5 -vf "drawtext=text='${plan.title.replace(/'/g, "\\'")}':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" -t 5 -c:v libx264 "${outputBase}/title.png"`
  );
  
  // Step 3: Combine voiceover with background
  commands.push(
    `ffmpeg -i "${plan.input.voiceover}" -i background.mp4 -filter_complex "[1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2[v];[0:a]afade=t=out:st=0:d=0.5[fade];[v][fade]concat=n=1:v=1:a=1" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 192k "${outputBase}/synced.mp4"`
  );
  
  // Step 4: Add text overlays throughout
  commands.push(
    `ffmpeg -i "${outputBase}/synced.mp4" -vf "drawtext=text='Chapter 1':fontsize=32:fontcolor=white:x=20:y=50" -c:v libx264 -preset fast -c:a copy "${outputBase}/with-overlays.mp4"`
  );
  
  // Step 5: Add intro/outro
  commands.push(
    `ffmpeg -i intro.mp4 -i "${outputBase}/with-overlays.mp4" -i outro.mp4 -filter_complex "[0:v][0:a][1:v][1:a][2:v][2:a]concat=n=3:v=1:a=1" -c:v libx264 -preset fast -crf 23 "${plan.output}"`
  );
  
  return commands;
};

assembleVideo().catch(console.error);
