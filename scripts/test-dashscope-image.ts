/**
 * test-dashscope-image.ts
 * Test multiple DashScope image generation endpoints
 */

import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = process.env.DASHSCOPE_API_KEY;

if (!apiKey) {
  console.error('❌ DASHSCOPE_API_KEY not found');
  process.exit(1);
}

console.log('🔑 Key:', apiKey.slice(0, 12) + '...\n');

// Test 1: Compatible mode (Singapore)
async function testCompatibleMode() {
  console.log('📡 Test 1: Compatible mode (Singapore)');
  try {
    const res = await fetch('https://dashscope-intl.aliyuncs.com/compatible-mode/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'wanx-v1',
        prompt: 'A professional engineering spreadsheet with seismic analysis charts on a laptop screen',
        n: 1,
        size: '1024*1024',
      }),
    });
    console.log(`   Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(`   Body: ${text.slice(0, 300)}\n`);
    return res.ok ? text : null;
  } catch (e: any) {
    console.log(`   Error: ${e.message}\n`);
    return null;
  }
}

// Test 2: Compatible mode with qwen-image model
async function testQwenImage() {
  console.log('📡 Test 2: Compatible mode with qwen-image');
  try {
    const res = await fetch('https://dashscope-intl.aliyuncs.com/compatible-mode/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-image',
        prompt: 'Professional engineering blog featured image about BIM and Revit',
        n: 1,
        size: '1024*1024',
      }),
    });
    console.log(`   Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(`   Body: ${text.slice(0, 300)}\n`);
    return res.ok ? text : null;
  } catch (e: any) {
    console.log(`   Error: ${e.message}\n`);
    return null;
  }
}

// Test 3: Async native endpoint
async function testAsyncNative() {
  console.log('📡 Test 3: Async native endpoint');
  try {
    const res = await fetch('https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable',
      },
      body: JSON.stringify({
        model: 'wanx-v1',
        input: { prompt: 'Professional engineering spreadsheet' },
        parameters: { size: '1024*1024', n: 1 },
      }),
    });
    console.log(`   Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(`   Body: ${text.slice(0, 300)}\n`);
    return res.ok ? text : null;
  } catch (e: any) {
    console.log(`   Error: ${e.message}\n`);
    return null;
  }
}

// Test 4: Async with qwen-image
async function testAsyncQwen() {
  console.log('📡 Test 4: Async native with qwen-image');
  try {
    const res = await fetch('https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable',
      },
      body: JSON.stringify({
        model: 'qwen-image',
        input: { prompt: 'Professional engineering blog image' },
        parameters: { size: '1024*1024', n: 1 },
      }),
    });
    console.log(`   Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(`   Body: ${text.slice(0, 300)}\n`);
    return res.ok ? text : null;
  } catch (e: any) {
    console.log(`   Error: ${e.message}\n`);
    return null;
  }
}

async function main() {
  await testCompatibleMode();
  await testQwenImage();
  await testAsyncNative();
  await testAsyncQwen();

  console.log('\n✅ Tests completed');
}

main().catch(console.error);
