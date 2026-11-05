// Notification System - Alert for content approval
import { config } from './config.js';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const notifyForApproval = async () => {
  console.log('🔔 Preparing approval notifications...\n');
  
  const draftsDir = config.dirs.drafts;
  const approvedFile = join(draftsDir, 'approved', `approved-${new Date().toISOString().split('T')[0]}.json`);
  
  if (!existsSync(approvedFile)) {
    console.log('❌ No approved content to notify about.');
    return;
  }
  
  const approved = JSON.parse(readFileSync(approvedFile, 'utf-8'));
  
  // Generate notification message
  const notification = generateNotification(approved);
  
  console.log('📧 Notification Preview:\n');
  console.log(notification);
  console.log('\n---');
  console.log('\n💡 To enable actual notifications:');
  console.log('1. Set up Discord webhook in .env');
  console.log('2. Set up Telegram bot in .env');
  console.log('3. Or copy/paste this to your preferred channel');
  
  // Save notification for reference
  const notificationsDir = join(draftsDir, 'notifications');
  if (!existsSync(notificationsDir)) {
    mkdirSync(notificationsDir, { recursive: true });
  }
  
  writeFileSync(
    join(notificationsDir, `notification-${new Date().toISOString().split('T')[0]}.txt`),
    notification
  );
  
  console.log(`\n✅ Notification saved to: ${notificationsDir}`);
  
  return notification;
};

const generateNotification = (approved) => {
  const date = new Date().toISOString().split('T')[0];
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  let message = `
╔═══════════════════════════════════════════════════════════╗
║     📱 SIGNIFY CONTENT APPROVAL - ${date}                    ║
╚═══════════════════════════════════════════════════════════╝

📅 ${dayName} Content Ready for Review

${approved.length} posts approved for publishing:

`;
  
  approved.forEach((draft, idx) => {
    message += `
${idx + 1}. ${draft.title}
   📌 Pillar: ${draft.pillar}
   📱 Platforms: ${draft.platforms.join(', ')}
   🎯 Quality: ${draft.qualityScore}/100
   
`;
  });
  
  message += `
═══════════════════════════════════════════════════════════════

📋 QUICK REVIEW:
`;

  // Group by platform
  const byPlatform = {};
  approved.forEach(draft => {
    draft.platforms.forEach(p => {
      if (!byPlatform[p]) byPlatform[p] = [];
      byPlatform[p].push(draft.title);
    });
  });

  Object.entries(byPlatform).forEach(([platform, titles]) => {
    message += `\n${platform.toUpperCase()}:`;
    titles.forEach(title => {
      message += `\n   • ${title}`;
    });
  });

  message += `\n\n⏰ Scheduled posts will go live according to optimal times.
🔗 Full drafts in content/drafts/approved/

👉 APPROVAL NEEDED: Review and confirm before publishing.
   (Set up auto-publishing in .env to enable automatic posting)

---
Powered by Signhify Content Autopilot
`;
  
  return message;
};

// Send to Discord webhook if configured
const sendToDiscord = (message) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('❌ Discord webhook not configured');
    return false;
  }
  
  // Would use fetch to send webhook
  // fetch(webhookUrl, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ content: message })
  // });
  
  console.log('✅ Would send to Discord (configure DISCORD_WEBHOOK_URL to enable)');
  return true;
};

// Send to Telegram if configured
const sendToTelegram = (message) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    console.log('❌ Telegram not configured');
    return false;
  }
  
  // Would use Telegram API
  // fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     chat_id: chatId,
  //     text: message,
  //     parse_mode: 'Markdown'
  //   })
  // });
  
  console.log('✅ Would send to Telegram (configure TELEGRAM_BOT_TOKEN to enable)');
  return true;
};

notifyForApproval().catch(console.error);
