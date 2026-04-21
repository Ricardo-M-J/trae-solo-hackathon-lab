export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/chat') {
      const body = await request.json();
      const model = body.model || 'moonshot-v1-8k';

      const apiResponse = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.KIMI_API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          messages: body.messages,
          temperature: body.temperature || 0.7,
          stream: body.stream || false
        })
      });

      return new Response(apiResponse.body, {
        status: apiResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    if (url.pathname === '/api/models') {
      return new Response(JSON.stringify({
        models: [
          { id: 'moonshot-v1-8k', name: 'Kimi 8K' },
          { id: 'moonshot-v1-32k', name: 'Kimi 32K' },
          { id: 'moonshot-v1-128k', name: 'Kimi 128K' }
        ]
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response('Not Found', { status: 404 });
  }
};