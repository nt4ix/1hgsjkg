import axios from 'axios';
import { getAbsoluteUrl } from './urlHelper.js';

export async function downloadAsset(url, baseUrl) {
  try {
    const absoluteUrl = getAbsoluteUrl(baseUrl, url);
    if (!absoluteUrl) {
      throw new Error(`Invalid URL: ${url}`);
    }

    const response = await axios.get(absoluteUrl, {
      responseType: 'arraybuffer',
      timeout: 5000,
      maxContentLength: 10 * 1024 * 1024 // 10MB limit
    });

    return {
      content: response.data,
      contentType: response.headers['content-type'],
      success: true
    };
  } catch (error) {
    console.error(`Failed to download asset ${url}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
}