import { Client, Events, GatewayIntentBits } from 'discord.js';
import { setupEventHandlers } from './events.js';

export async function createDiscordClient(config) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  setupEventHandlers(client);

  return client;
}