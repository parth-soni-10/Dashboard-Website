// ────────────────────────────────────────────────────────────────────────────
// IndexNow Helper - Notify search engines instantly when content updates
// ────────────────────────────────────────────────────────────────────────────

const INDEXNOW_CONFIG = {
  key: 'ce3dcd8fd8fde3bc072a783db570897e',
  keyLocation: 'https://contenttrackerdashboard.netlify.app/ce3dcd8fd8fde3bc072a783db570897e.txt',
  host: 'contenttrackerdashboard.netlify.app'   // bare domain (no protocol)
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
    host: INDEXNOW_CONFIG.host,   // bare domain
    key: INDEXNOW_CONFIG.key,
    keyLocation: INDEXNOW_CONFIG.keyLocation,
    urlList: validUrls
  };

  try {
    // Use Netlify Function as a proxy (CORS bypass)
    const response = await fetch('/.netlify/functions/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok || response.status === 202) {
      console.log('✓ IndexNow notification sent successfully');
      return { 
        success: true, 
        urls: validUrls,
        status: response.status 
      };
    } else {
      console.warn('IndexNow response:', response.status, response.statusText);
      return { 
        success: false, 
        error: `HTTP ${response.status}`,
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

// Example 1: Notify after initial data load
// Add this to your loadData() function after successful load:
//
// async function loadData() {
//   try {
//     // ... your existing data loading code ...
//     
//     // Notify search engines (optional - only if content changed)
//     notifyContentUpdate();
//   } catch (e) {
//     console.warn('Data load failed:', e);
//   }
// }

// Example 2: Notify when a new suggestion is submitted
// Add this to your submitSuggestion() function after successful submission:
//
// async function submitSuggestion() {
//   // ... your existing submission code ...
//   
//   if (json && json.status === 'ok') {
//     // Notify search engines about the suggestions page update
//     notifyIndexNow([
//       'https://yourwebsite.com/'
//     ]);
//   }
// }

// Example 3: Manual trigger via console
// You can manually trigger from the browser console:
// notifyContentUpdate();

// ────────────────────────────────────────────────────────────────────────────
// INTEGRATION INSTRUCTIONS
// ────────────────────────────────────────────────────────────────────────────
// 1. Update INDEXNOW_CONFIG.host with your actual domain (bare, e.g. example.com)
// 2. Update INDEXNOW_CONFIG.keyLocation with your actual domain
// 3. Upload the key file (ce3dcd8fd8fde3bc072a783db570897e.txt) to your website root
// 4. Ensure the Netlify function exists at netlify/functions/indexnow.js
// 5. Include this script in your HTML or merge it with app.js
// 6. Call notifyContentUpdate() when content changes (optional, but recommended)
// ────────────────────────────────────────────────────────────────────────────

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { notifyIndexNow, notifyContentUpdate };
}
