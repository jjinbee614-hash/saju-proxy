exports.handler = async function(event) {
  const ALLOWED_ORIGIN = 'https://saju-today.com';
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Method Not Allowed' };

  try {
    const { lunYear, lunMonth, lunDay, leapMonth } = JSON.parse(event.body);
    const API_KEY = '167d25c7c90d6c0d18dbd3fafa99c3de6323e91a7217bfe45d1b5d209e27f3e8';
    const url = `https://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getSolCalInfo?lunYear=${lunYear}&lunMonth=${lunMonth}&lunDay=${lunDay}&leapMonth=${leapMonth}&ServiceKey=${API_KEY}&_type=json`;

    const res = await fetch(url);
    const data = await res.json();
    const item = data.response.body.items.item;

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        solYear: parseInt(item.solYear),
        solMonth: parseInt(item.solMonth),
        solDay: parseInt(item.solDay),
      })
    };
  } catch(e) {
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
