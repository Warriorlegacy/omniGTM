// Voiceover Generator using VoiceStudio (local, free)
// Requires VoiceStudio installed locally
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { config } from '../config.js';
import { execSync } from 'child_process';

const generateVoiceover = async () => {
  console.log('🎤 Generating voiceover...\n');
  
  // Load script
  const researchDir = config.dirs.youtube;
  const date = new Date().toISOString().split('T')[0];
  const scriptFile = join(researchDir, `script-${date}.json`);
  
  if (!existsSync(scriptFile)) {
    console.log('❌ No script found. Run youtube:script first.');
    return;
  }
  
  const script = JSON.parse(readFileSync(scriptFile, 'utf-8'));
  
  // Check if VoiceStudio is available
  const voiceStudioAvailable = checkVoiceStudio();
  
  if (!voiceStudioAvailable) {
    console.log('⚠️  VoiceStudio not found. Install from https://voicestudio.sh');
    console.log('📝 Script is ready. Generate voiceover manually or use alternative TTS.\n');
    console.log('Alternative free TTS options:');
    console.log('  - Edge TTS (free, Python package)');
    console.log('  - Google TTS (free tier)');
    console.log('  - system voice (macOS/Windows built-in)');
    return;
  }
  
  // Generate voiceover using VoiceStudio
  console.log('✅ VoiceStudio detected. Generating voiceover...\n');
  
  // Extract full script text
  const fullScript = script.sections.map(s => s.script).join('\n\n');
  
  // Save script as text for VoiceStudio
  const scriptTextFile = join(researchDir, `script-text-${date}.txt`);
  writeFileSync(scriptTextFile, fullScript);
  
  console.log('📝 Script saved to:', scriptTextFile);
  console.log('\n🎙️ To generate voiceover:');
  console.log(`   1. Open VoiceStudio`);
  console.log(`   2. Import script from: ${scriptTextFile}`);
  console.log(`   3. Select voice (recommend: deep, clear, professional)`);
  console.log(`   4. Generate and export as WAV/MP3`);
  console.log(`   5. Save to: content/youtube/voiceover-${date}.mp3`);
  
  // If VoiceStudio CLI is available, could automate:
  // execSync(`voicestudio generate --script "${scriptTextFile}" --output "${researchDir}/voiceover-${date}.mp3"`);
  
  console.log('\n✅ Voiceover generation ready');
  
  return {
    scriptPath: scriptTextFile,
    outputPath: join(researchDir, `voiceover-${date}.mp3`),
    voiceRecommendation: 'Deep, clear, professional (similar to tech educator style)'
  };
};

const checkVoiceStudio = () => {
  try {
    // Check if VoiceStudio CLI is available
    execSync('which voicestudio', { stdio: 'ignore' });
    return true;
  } catch {
    // Check common installation paths
    const paths = [
      '/usr/local/bin/voicestudio',
      '/opt/voicestudio/bin/voicestudio',
      join(process.env.HOME, 'VoiceStudio', 'bin', 'voicestudio')
    ];
    
    return paths.some(p => existsSync(p));
  }
};

generateVoiceover().catch(console.error);
