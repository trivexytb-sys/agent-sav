const https = require('https');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { messages, system } = req.body;
  
  const body = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    system: system,
    messages: messages
  });

  const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  try {
    const reply = await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.content?.[0]?.text || 'Pas de réponse.');
          } catch {
            reject(new Error('Parse error'));
          }
        });
      });
      request.on('error', reject);
      request.write(body);
      request.end();
    });
    res.json({ reply });
  } catch(e) {
    res.status(500).json({ reply: 'Erreur serveur.' });
  }
};
