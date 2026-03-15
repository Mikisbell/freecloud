#!/usr/bin/env node
/**
 * IndexNow Bulk URL Submission Script
 * 
 * Submits all URLs from the live sitemap.xml to the IndexNow API,
 * notifying Bing, Yandex, Seznam, Naver (and indirectly Google) instantly.
 * 
 * Usage:
 *   node scripts/indexnow-submit.mjs
 *   node scripts/indexnow-submit.mjs --dry-run   # Preview without sending
 */

const SITE_URL = 'https://freecloud.pe';
const API_KEY = 'cc2c66c4e123af418ac9739ed299f288';
const KEY_LOCATION = `${SITE_URL}/${API_KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

const isDryRun = process.argv.includes('--dry-run');

async function fetchSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  const xml = await res.text();
  
  // Extract all <loc> URLs from the sitemap XML
  const urls = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function submitToIndexNow(urls) {
  const payload = {
    host: 'freecloud.pe',
    key: API_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  console.log(`\n📡 Submitting ${urls.length} URLs to IndexNow...`);
  
  if (isDryRun) {
    console.log('\n🏷️  --dry-run mode: NOT sending request.');
    console.log('Payload preview:');
    console.log(JSON.stringify(payload, null, 2));
    return { status: 'dry-run', count: urls.length };
  }

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  // IndexNow returns 200 or 202 on success
  if (res.ok || res.status === 202) {
    console.log(`✅ IndexNow accepted! Status: ${res.status}`);
    return { status: 'success', httpStatus: res.status, count: urls.length };
  } else {
    const body = await res.text().catch(() => '');
    console.error(`❌ IndexNow rejected. Status: ${res.status}`);
    console.error(`   Response: ${body}`);
    return { status: 'error', httpStatus: res.status, body };
  }
}

async function main() {
  console.log('🔍 Fetching sitemap from production...');
  
  const urls = await fetchSitemapUrls();
  console.log(`📄 Found ${urls.length} URLs in sitemap.xml:`);
  urls.forEach((url, i) => console.log(`   ${i + 1}. ${url}`));

  const result = await submitToIndexNow(urls);
  
  console.log('\n--- Summary ---');
  console.log(`URLs submitted: ${result.count || 0}`);
  console.log(`Status: ${result.status}`);
  console.log(`Engines notified: Bing, Yandex, Seznam, Naver`);
  console.log(`Google: Monitors IndexNow signals (indirect benefit)`);
  
  if (result.status === 'success') {
    console.log('\n🚀 All search engines have been notified instantly!');
    console.log('   They will crawl your updated pages within minutes to hours.');
  }
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
