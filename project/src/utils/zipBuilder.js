import AdmZip from 'adm-zip';
import { downloadAsset } from './assetDownloader.js';

function getFileName(url, defaultName) {
  try {
    return url.split('/').pop() || defaultName;
  } catch {
    return defaultName;
  }
}

export async function createWebsiteZip(content) {
  const zip = new AdmZip();
  const stats = {
    total: 0,
    success: 0,
    failed: 0
  };

  // Create directories
  zip.addFile('css/', Buffer.from(''));
  zip.addFile('js/', Buffer.from(''));
  zip.addFile('images/', Buffer.from(''));
  zip.addFile('fonts/', Buffer.from(''));

  // Add main HTML
  zip.addFile('index.html', Buffer.from(content.html));

  async function addAssets(assets, directory, defaultName) {
    for (const url of assets) {
      stats.total++;
      const result = await downloadAsset(url, content.baseUrl);
      const fileName = getFileName(url, defaultName);
      
      if (result.success) {
        zip.addFile(`${directory}/${fileName}`, Buffer.from(result.content));
        stats.success++;
      } else {
        stats.failed++;
        console.error(`Failed to download ${url}: ${result.error}`);
      }
    }
  }

  // Download and add all assets
  await Promise.all([
    addAssets(content.cssLinks, 'css', 'style.css'),
    addAssets(content.scriptSrcs, 'js', 'script.js'),
    addAssets(content.imageUrls, 'images', 'image.png'),
    addAssets(content.fontUrls, 'fonts', 'font.woff')
  ]);

  return {
    buffer: zip.toBuffer(),
    stats
  };
}