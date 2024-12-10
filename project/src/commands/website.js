import { AttachmentBuilder } from 'discord.js';
import { isValidUrl } from '../utils/urlHelper.js';
import { downloadWebsiteContent } from '../utils/websiteDownloader.js';
import { createWebsiteZip } from '../utils/zipBuilder.js';

export async function handleWebsiteCommand(message) {
  const args = message.content.split(' ');
  if (args.length !== 2) {
    await message.reply('Please provide a website URL. Usage: !website https://example.com');
    return;
  }

  const url = args[1];
  if (!isValidUrl(url)) {
    await message.reply('Please provide a valid URL starting with http:// or https://');
    return;
  }

  try {
    const statusMessage = await message.reply('🔄 Fetching website content...');
    
    const content = await downloadWebsiteContent(url);
    await statusMessage.edit('📦 Downloading assets and creating ZIP file...');
    
    const { buffer, stats } = await createWebsiteZip(content);
    
    const attachment = new AttachmentBuilder(buffer, { name: 'website.zip' });
    
    await statusMessage.edit({ 
      content: `✅ Website downloaded successfully!\n` +
               `📊 Stats:\n` +
               `- Total assets: ${stats.total}\n` +
               `- Successfully downloaded: ${stats.success}\n` +
               `- Failed: ${stats.failed}`,
      files: [attachment] 
    });
  } catch (error) {
    console.error('Error:', error);
    await message.reply('❌ An error occurred while fetching the website. ' +
                       'Please make sure the URL is valid, accessible, and the website is not too large.');
  }
}