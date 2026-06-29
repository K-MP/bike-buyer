exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch(e) { return { statusCode: 400, body: 'Invalid JSON' }; }

  const { reg, token, apiKey } = body;

  if (!reg || !token || !apiKey) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing reg, token or apiKey' }) };
  }

  try {
    const response = await fetch(`https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${reg}`, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'X-API-Key': apiKey,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'MOT API error', detail: data, status: response.status })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
