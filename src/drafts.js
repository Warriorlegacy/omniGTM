// Draft Manager - Organize and prepare drafts for scheduling
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { config } from './config.js';

const getDateStr = () => new Date().toISOString().split('T')[0];

const organizeDrafts = async () => {
  console.log('📋 Organizing drafts for scheduling...\n');
  
  const draftsDir = config.dirs.drafts;
  const approvedDir = join(draftsDir, 'approved');
  
  if (!existsSync(approvedDir)) {
    console.log('❌ No approved drafts found. Run quality check first.');
    return;
  }
  
  const approvedFiles = existsSync(approvedDir)
    ? readFileSync(join(approvedDir, `approved-${new Date().toISOString().split('T')[0]}.json`), 'utf-8')
    : '[]';
  
  const approved = JSON.parse(approvedFiles);
  const organized = [];
  
  // Group by date and platform
  const schedule = {
    monday: { instagram: [], linkedin: [], twitter: [], youtube: [] },
    tuesday: { instagram: [], linkedin: [], twitter: [], youtube: [] },
    wednesday: { instagram: [], linkedin: [], twitter: [], youtube: [] },
    thursday: { instagram: [], linkedin: [], twitter: [], youtube: [] },
    friday: { instagram: [], linkedin: [], twitter: [], youtube: [] },
    saturday: { instagram: [], linkedin: [], twitter: [], youtube: [] },
    sunday: { instagram: [], linkedin: [], twitter: [], youtube: [] }
  };
  
  // Assign drafts to days based on pillar
  const pillarDayMap = {
    'AI Education': 'monday',
    'Build in Public': 'wednesday',
    'Growth Tips': 'tuesday',
    'Industry Insights': 'thursday',
    'Behind the Scenes': 'friday'
  };
  
  for (const draft of approved) {
    const day = pillarDayMap[draft.pillar] || 'monday';
    
    for (const platform of draft.platforms) {
      if (schedule[day][platform]) {
        schedule[day][platform].push(draft);
      }
    }
  }
  
  // Save organized schedule
  const outputDir = join(config.dirs.drafts, 'scheduled');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = join(outputDir, `schedule-${getDateStr()}.json`);
  writeFileSync(outputFile, JSON.stringify(schedule, null, 2));
  
  console.log('📅 Weekly Schedule:');
  Object.entries(schedule).forEach(([day, platforms]) => {
    const total = Object.values(platforms).reduce((sum, arr) => sum + arr.length, 0);
    if (total > 0) {
      console.log(`\n${day.charAt(0).toUpperCase() + day.slice(1)}:`);
      Object.entries(platforms).forEach(([platform, drafts]) => {
        if (drafts.length > 0) {
          console.log(`   ${platform}: ${drafts.length} posts`);
        }
      });
    }
  });
  
  console.log(`\n✅ Schedule saved to: ${outputFile}`);
  
  return schedule;
};

const createContentCalendar = () => {
  console.log('📆 Creating content calendar...\n');
  
  const calendar = {
    week: getWeekNumber(),
    startDate: getWeekStartDate(),
    endDate: getWeekEndDate(),
    themes: {
      monday: 'AI Education',
      tuesday: 'Growth Tips',
      wednesday: 'Build in Public',
      thursday: 'Industry Insights',
      friday: 'Behind the Scenes',
      saturday: 'Curated Content',
      sunday: 'Rest / Community Engagement'
    },
    platforms: {
      instagram: {
        frequency: 2,
        formats: ['carousel', 'reel'],
        optimalTimes: ['09:00 IST', '18:00 IST']
      },
      linkedin: {
        frequency: 1,
        formats: ['text', 'carousel'],
        optimalTimes: ['08:00 IST', '12:00 IST']
      },
      twitter: {
        frequency: 5,
        formats: ['tweet', 'thread'],
        optimalTimes: ['08:00 IST', '12:00 IST', '18:00 IST', '21:00 IST']
      },
      youtube: {
        frequency: 1,
        formats: ['long-form', 'short'],
        optimalTimes: ['14:00 IST', '16:00 IST']
      }
    },
    notes: 'Adjust based on analytics and audience insights'
  };
  
  const outputDir = join(__dirname, '..', 'content');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = join(outputDir, 'calendar.json');
  writeFileSync(outputFile, JSON.stringify(calendar, null, 2));
  
  console.log(`✅ Calendar saved to: ${outputFile}`);
  console.log(`\n📅 Week ${calendar.week} Theme:`);
  Object.entries(calendar.themes).forEach(([day, theme]) => {
    console.log(`   ${day}: ${theme}`);
  });
  
  return calendar;
};

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

// Export for use in other modules
export { organizeDrafts, createContentCalendar };

// Run if called directly
const args = process.argv.slice(2);
if (args.includes('--calendar')) {
  createContentCalendar();
} else {
  organizeDrafts().catch(console.error);
}
