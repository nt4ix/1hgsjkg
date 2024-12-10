import axios from 'axios';
import * as cheerio from 'cheerio';
import { getAbsoluteUrl } from './urlHelper.js';

async function extractAssets($, selector, attribute, baseUrl) {
  return $(selector)
    .map((_, el) => $(el).attr(attribute))
    .get()
    .map(path => getAbsoluteUrl(baseUrl, path))
    .filter(Boolean);
}

export async function downloadWebsiteContent(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      maxContentLength: 50 * 1024 * 1024 // 50MB limit
    });

    const $ = cheerio.load(response.data);
    
    // Extract all types of assets
    const cssLinks = await extractAssets($, 'link[rel="stylesheet"]', 'href', url);
    const scriptSrcs = await extractAssets($, 'script[src]', 'src', url);
    const imageUrls = await extractAssets($, 'img', 'src', url);
    const fontUrls = await extractAssets($, 'link[rel="preload"][as="font"], link[rel="font"]', 'href', url);
    
    // Update HTML to use relative paths
    $('link[rel="stylesheet"]').each((_, el) => {
      const href = $(el).attr('href');
      const fileName = href?.split('/').pop() || 'style.css';
      $(el).attr('href', `css/${fileName}`);
    });

    $('script[src]').each((_, el) => {
      const src = $(el).attr('src');
      const fileName = src?.split('/').pop() || 'script.js';
      $(el).attr('src', `js/${fileName}`);
    });

    $('img').each((_, el) => {
      const src = $(el).attr('src');
      const fileName = src?.split('/').pop() || 'image.png';
      $(el).attr('src', `images/${fileName}`);
    });

    return {
      html: $.html(),
      cssLinks,
      scriptSrcs,
      imageUrls,
      fontUrls,
      baseUrl: url
    };
  } catch (error) {
    throw new Error(`Failed to download website content: ${error.message}`);
  }
}