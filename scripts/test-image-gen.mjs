import fs from 'fs';
const envContent = fs.readFileSync('.env', 'utf8');
const apiKey = envContent.match(/OPENROUTER_API_KEY=(.*)/m)?.[1]?.trim();

if (!apiKey) {
  console.error('❌ OPENROUTER_API_KEY not found');
  process.exit(1);
}

console.log('📷 Testing image generation via Chat Completions endpoint...\n');

// Image generation on OpenRouter goes through chat completions with response_format
fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://freecloud.pe',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash-image',
    messages: [
      { role: 'user', content: 'Generate an image of a beautiful sunset over mountains, photorealistic style' }
    ],
    response_format: {
      type: 'image',
      modalities: ['image'],
    },
  }),
})
.then(async (r) => {
  console.log('📡 Status:', r.status, r.statusText);
  const text = await r.text();
  console.log('📦 Response:', text.slice(0, 2000));
})
.catch((e) => {
  console.error('❌ Error:', e.message);
});
