import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

config();

export function validateConfig() {
  const requiredEnvVars = ['DISCORD_TOKEN', 'CLIENT_ID'];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  const token = process.env.DISCORD_TOKEN;
  if (!token.includes('.')) {
    throw new Error('Invalid Discord token format - must contain at least one dot');
  }

  const clientId = process.env.CLIENT_ID;
  if (!clientId.match(/^\d+$/)) {
    throw new Error('Invalid client ID format - must be a numeric string');
  }

  return {
    token: token.trim(),
    clientId: clientId.trim()
  };
}