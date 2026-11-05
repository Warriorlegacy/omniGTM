// Thumbnail Generator (using ImageMagick or Canva)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { config } from '../config.js';
import { execSync } from 'child_process';

const generateThumbnail = async () => {
  console.log('🖼️ Generating thumbnail...\n');
  
  const researchDir = config.dirs.youtube;
  const date = new Date().toISOString().split('T')[0];
  const scriptFile = join(researchDir, `script-${date}.json`);
  
  if (!existsSync(scriptFile)) {
    console.log('❌ No script found. Run youtube:script first.');
    return;
  }
  
  const script = JSON.parse(readFileSync(scriptFile, 'utf-8'));
  
  // Check ImageMagick
  const imagemagickAvailable = checkImageMagick();
  
  console.log('🎨 Thumbnail Concept:');
  console.log(`   Title: ${script.title}`);
  console.log(`   Style: ${script.thumbnailConcept.style}`);
  console.log(`   Headlines: ${script.thumbnailConcept.headlineOptions.join(', ')}`);
  console.log(`   Colors: ${script.thumbnailConcept.colors}\n`);
  
  if (imagemagickAvailable) {
    // Generate with ImageMagick
    console.log('✅ ImageMagick detected. Generating thumbnail...\n');
    
    const thumbnails = generateImageMagickThumbnails(script, researchDir, date);
    
    console.log('🖼️ Generated thumbnails:');
    thumbnails.forEach(t => console.log(`   - ${t}`));
  } else {
    console.log('⚠️  ImageMagick not found.');
    console.log('📝 Thumbnail design saved. Create manually in Canva or similar.\n');
    console.log('🎨 Canva instructions:');
    console.log('   1. Create design: YouTube Thumbnail (1280x720)');
    console.log('   2. Background: Purple gradient or solid dark');
    console.log('   3. Text: Choose from headline options above');
    console.log('   4. Add: Arrow, face (if available), visual element');
    console.log('   5. Export as PNG');
    console.log(`   6. Save to: content/youtube/thumbnail-${date}.png`);
  }
  
  // Save thumbnail spec
  writeFileSync(
    join(researchDir, `thumbnail-spec-${date}.json`),
    JSON.stringify({
      concept: script.thumbnailConcept,
      scriptTitle: script.title,
      headlines: script.thumbnailConcept.headlineOptions,
      suggestedColors: script.thumbnailConcept.colors,
      timestamp: new Date().toISOString()
    }, null, 2)
  );
  
  return script.thumbnailConcept;
};

const checkImageMagick = () => {
  try {
    execSync('convert --version', { stdio: 'ignore' });
    return true;
  } catch {
    try {
      execSync('magick --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
};

const generateImageMagickThumbnails = (script, outputDir, date) => {
  const generated = [];
  const colors = ['#6D28D9', '#7C3AED', '#8B5CF6']; // Purple gradient options
  
  // Generate 3 variations with different headlines
  script.thumbnailConcept.headlineOptions.forEach((headline, i) => {
    const color = colors[i % colors.length];
    const outputPath = join(outputDir, `thumbnail-${date}-v${i+1}.png`);
    
    // Create gradient background
    execSync(`
      convert -size 1280x720 gradient:${color}00:${color}ff \
        -fill white -font Helvetica-Bold -pointsize 72 \
        -gravity center -annotate +0+0 "${headline}" \
        "${outputPath}"
    `.trim());
    
    generated.push(outputPath);
  });
  
  return generated;
};

generateThumbnail().catch(console.error);
