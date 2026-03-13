exports.handler = async function(event) {
  const ALLOWED_ORIGIN = 'https://saju-today.com';
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Method Not Allowed' };

  console.log('API KEY 앞 10자:', (process.env.ANTHROPIC_API_KEY || 'MISSING').slice(0, 10));
  console.log('body:', event.body ? event.body.slice(0, 100) : 'EMPTY');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: event.body,
    });

    const text = await response.text();
    console.log('Anthropic 응답:', text.slice(0, 200));

    return {
      statusCode: response.status,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: text,
    };
  } catch (e) {
    console.log('에러:', e.message);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
