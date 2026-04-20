export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { messages, system } = req.body;
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: system,
        messages: messages
      })
    });
    const data = await response.json();
    res.json({ reply: data.content?.[0]?.text || 'Pas de réponse.' });
  } catch(e) {
    res.status(500).json({ reply: 'Erreur serveur.' });
  }
}
