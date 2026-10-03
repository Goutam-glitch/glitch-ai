const SYSTEM_PROMPT = 'You are Glitch AI, a friendly, thoughtful, and clear personal AI assistant. Answer the user directly. Use markdown when it improves readability.';
const MAX_MESSAGES = 20;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') return json({ ok: true, provider: 'Cloudflare Workers AI' });

    if (url.pathname === '/api/chat') {
      if (request.method !== 'POST') return json({ error: 'Use POST to send a chat message.' }, 405);
      let body;
      try { body = await request.json(); } catch { return json({ error: 'The request must contain valid JSON.' }, 400); }
      if (!Array.isArray(body.messages) || body.messages.length === 0) return json({ error: 'Add a message to start the conversation.' }, 400);
      const messages = body.messages.slice(-MAX_MESSAGES).map((message) => ({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: String(message.content ?? '').slice(0, 8000),
      }));
      try {
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const allowed = await env.CHAT_LIMITER.limit({ key: ip });
        if (!allowed.success) return json({ error: 'That is a lot of messages in a short time. Please wait a minute and try again.' }, 429);
        const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
          max_tokens: 600,
        });
        const generated = typeof result === 'string'
          ? result
          : result?.response ?? result?.output_text ?? result?.choices?.[0]?.message?.content;
        const reply = typeof generated === 'string' ? generated.trim() : '';
        return json({ reply: reply || 'The AI returned an empty response. Please try again.' });
      } catch (error) {
        console.error('Workers AI request failed:', error);
        return json({ error: 'The hosted AI service is busy or its free daily quota has been reached. Try again later.' }, 503);
      }
    }

    if (url.pathname.startsWith('/api/')) return json({ error: 'API route not found.' }, 404);
    return env.ASSETS.fetch(request);
  },
};

