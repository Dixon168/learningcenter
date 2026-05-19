exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'OPENROUTER_API_KEY not set in Netlify env vars' }) };
  }

  try {
    const { messages, system, model } = JSON.parse(event.body);
    const fullMessages = system ? [{ role: 'system', content: system }, ...messages] : messages;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://learningcenter.netlify.app',
        'X-Title': 'Learning Center'
      },
      body: JSON.stringify({
        model: model || 'anthropic/claude-3.5-haiku',
        messages: fullMessages,
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return { statusCode: response.status, headers, body: JSON.stringify({ error: errText }) };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    return { statusCode: 200, headers, body: JSON.stringify({ content }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
