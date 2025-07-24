function extractPublicIdFromUrl(url) {
  try {
    // Example: Get the part after `/upload/`
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    const parts = url.substring(uploadIndex + 8).split('/');
    // Remove version (like v1712345678)
    if (parts[0].startsWith('v')) parts.shift();

    // Join remaining parts (this is your public_id with extension)
    const withExtension = parts.join('/');

    // Remove file extension
    const dotIndex = withExtension.lastIndexOf('.');
    return withExtension.substring(0, dotIndex);
  } catch (err) {
    return null;
  }
}

export {extractPublicIdFromUrl};