// Test DashScope native async image generation API
import fs from 'fs';
const envContent = fs.readFileSync('.env', 'utf8');
const apiKey = envContent.match(/DASHSCOPE_API_KEY=(.*)/m)?.[1]?.trim();
const baseUrl = envContent.match(/DASHSCOPE_BASE_URL=(.*)/m)?.[1]?.trim() || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1';

if (!apiKey) {
  console.error('❌ DASHSCOPE_API_KEY not found');
  process.exit(1);
}

console.log('🔑 API Key:', apiKey.slice(0, 12) + '...');
console.log('📡 Testing multiple DashScope endpoints...\n');

const prompt = 'A beautiful sunset over mountains';
const body = JSON.stringify({
  model: 'qwen-image-2.0',
  input: { prompt },
  parameters: { size: '1024*1024', n: 1 },
});

// Try multiple endpoints
const endpoints = [
  'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
  'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
  'https://dashscope-intl.aliyuncs.com/api/v1/aigc/text2image/image-synthesis',
  'https://dashscope.aliyuncs.com/api/v1/aigc/text2image/image-synthesis',
];

for (const url of endpoints) {
  console.log(`📤 Trying: ${url}`);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable',
      },
      body,
    });
    const data = await res.json();
    console.log(`   Status: ${res.status} ${res.statusText}`);
    console.log(`   Body: ${JSON.stringify(data).slice(0, 200)}`);

    if (res.ok && data.output?.task_id) {
      console.log(`\n✅ WORKS! Task ID: ${data.output.task_id}`);
      console.log('Polling for result...');

      // Determine poll URL from the working URL
      const baseUrl = url.replace('/api/v1/services/aigc/text2image/image-synthesis', '').replace('/api/v1/aigc/text2image/image-synthesis', '');
      const pollUrl = `${baseUrl}/api/v1/tasks/${data.output.task_id}`;

      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const pollRes = await fetch(pollUrl, {
          headers: { 'Authorization': `Bearer ${apiKey}` },
        });
        const pollData = await pollRes.json();
        const status = pollData.output?.task_status || 'UNKNOWN';
        console.log(`  [${i + 1}] Status: ${status}`);

        if (status === 'SUCCEEDED') {
          console.log('\n✅ Image generated!');
          console.log('URLs:', JSON.stringify(pollData.output.results, null, 2));
          process.exit(0);
        }
        if (status === 'FAILED') {
          console.log('\n❌ Task failed:', JSON.stringify(pollData, null, 2));
          break;
        }
      }
      break;
    }
  } catch (e) {
    console.log(`   Error: ${e.message}`);
  }
  console.log('');
}

console.log('\n❌ No endpoint worked.');
