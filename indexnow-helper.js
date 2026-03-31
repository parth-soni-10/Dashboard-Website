// ────────────────────────────────────────────────────────────────────────────
// IndexNow Helper - Notify search engines instantly when content updates
// ────────────────────────────────────────────────────────────────────────────

const INDEXNOW_CONFIG = {
  key: 'ce3dcd8fd8fde3bc072a783db570897e',
  keyLocation: 'https://contenttrackerdashboard.netlify.app/ce3dcd8fd8fde3bc072a783db570897e.txt',
  host: 'contenttrackerdashboard.netlify.app'
};

/**
 * Notify search engines about updated URLs using IndexNow protocol
 * @param {string|string[]} urls - Single URL or array of URLs to submit
 * @returns {Promise<Object>} Result of the notification
 */
async function notifyIndexNow(urls) {
  // Ensure urls is an array
  const urlList = Array.isArray(urls) ? urls : [urls];
  
  // Validate URLs
  const validUrls = urlList.filter(url => {
    try {
      new URL(url);
      return true;
    } catch {
      console.warn('Invalid URL:', url);
      return false;
    }
  });

  if (validUrls.length === 0) {
    return { success: false, error: 'No valid URLs to submit' };
  }

  // Prepare the IndexNow payload
  const payload = {
    host: INDEXNOW_CONFIG.host,
    key: INDEXNOW_CONFIG.key,
    keyLocation: INDEXNOW_CONFIG.keyLocation,
    urlList: validUrls
  };

  console.log('Sending IndexNow payload:', payload);

  try {
    // Use Netlify Function as a proxy (CORS bypass)
    const response = await fetch('/.netlify/functions/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('Proxy response:', result);

    if (response.ok && (response.status === 200 || response.status === 202)) {
      console.log('✓ IndexNow notification sent successfully');
      return { 
        success: true, 
        urls: validUrls,
        status: response.status 
      };
    } else {
      console.warn('IndexNow error:', result.message);
      return { 
        success: false, 
        error: result.message || `HTTP ${response.status}`,
        urls: validUrls
      };
    }
  } catch (error) {
    console.error('IndexNow notification failed:', error);
    return { 
      success: false, 
      error: error.message,
      urls: validUrls
    };
  }
}

/**
 * Notify search engines when the main page content updates
 * Call this after data is loaded or updated
 */
async function notifyContentUpdate() {
  // Only submit the main page (without fragments)
  const baseUrl = `https://${INDEXNOW_CONFIG.host}`;
  return await notifyIndexNow([baseUrl + '/']);
}

// ────────────────────────────────────────────────────────────────────────────
// USAGE EXAMPLES
// ────────────────────────────────────────────────────────────────────────────
// ... (same as before)
