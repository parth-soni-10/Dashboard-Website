// Netlify Function: Proxy for IndexNow API (bypasses CORS)
exports.handler = async (event) => {   // ← ADDED "=>" after (event)
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the incoming request body
    const payload = JSON.parse(event.body);
    console.log('Received payload:', JSON.stringify(payload, null, 2));

    // Forward the request to the IndexNow API
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    // Read the response body (it may contain error details)
    const responseBody = await response.text();
    console.log('IndexNow response status:', response.status);
    console.log('IndexNow response body:', responseBody);

    // Return the status and response from IndexNow
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: response.status,
        message: responseBody || response.statusText
      })
    };
  } catch (error) {
    console.error('IndexNow proxy error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
