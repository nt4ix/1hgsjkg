import { createDiscordClient } from './bot/client.js';
import { validateConfig } from './config/config.js';

async function connectWithRetry(client, token, maxRetries = 3, delayMs = 5000) {
  let retries = maxRetries;
  let lastError = null;

  while (retries > 0) {
    try {
      await client.login(token);
      console.log('Successfully connected to Discord!');
      return true;
    } catch (error) {
      lastError = error;
      retries--;
      
      if (retries > 0) {
        console.log(`Connection failed. Retrying in ${delayMs/1000} seconds... (${retries} attempts remaining)`);
        console.error('Error details:', error.message);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw new Error(`Failed to connect after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}

async function initializeBot() {
  try {
    console.log('Starting Discord bot initialization...');
    
    const config = validateConfig();
    console.log('Configuration validated successfully');

    const client = await createDiscordClient(config);
    console.log('Discord client created successfully');

    console.log('Attempting to connect to Discord...');
    await connectWithRetry(client, config.token);

    return client;
  } catch (error) {
    console.error('Fatal error during bot initialization:', error);
    throw error;
  }
}

// Handle unexpected errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Start the bot
console.log('Starting Discord Website Scraper Bot...');
initializeBot().catch((error) => {
  console.error('Failed to initialize bot:', error);
  process.exit(1);
});