import { Events } from 'discord.js';
import { handleWebsiteCommand } from '../commands/website.js';

export function setupEventHandlers(client) {
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Successfully logged in as ${readyClient.user.tag}`);
    console.log('Bot is ready to receive commands!');
  });

  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    
    if (message.content.startsWith('!website')) {
      await handleWebsiteCommand(message);
    }
  });

  client.on(Events.Error, (error) => {
    console.error('Discord client error:', error);
  });
}