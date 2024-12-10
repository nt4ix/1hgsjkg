export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function getAbsoluteUrl(baseUrl, relativePath) {
  try {
    return new URL(relativePath, baseUrl).href;
  } catch (error) {
    return null;
  }
}