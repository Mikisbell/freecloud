// Check available image generation models on OpenRouter
async function main() {
  const res = await fetch('https://openrouter.ai/api/v1/models');
  const data = await res.json();
  
  const imageModels = data.data.filter(m => 
    m.architecture?.modality === 'text->image' ||
    m.architecture?.family === 'image-generation' ||
    m.name?.toLowerCase().includes('flux') ||
    m.name?.toLowerCase().includes('dall') ||
    m.name?.toLowerCase().includes('stable diffusion') ||
    m.name?.toLowerCase().includes('midjourney') ||
    m.name?.toLowerCase().includes('recraft') ||
    m.id?.includes('image')
  );

  console.log('📷 Image Generation Models on OpenRouter:\n');
  imageModels.forEach(m => {
    console.log(`  ${m.id}`);
    console.log(`    Name: ${m.name}`);
    console.log(`    Pricing: ${m.pricing?.prompt ? '$' + m.pricing.prompt + '/1K tokens' : 'Free'}`);
    console.log('');
  });

  // Also search for qwen
  const qwenModels = data.data.filter(m => m.id?.toLowerCase().includes('qwen'));
  console.log('\n🔍 All Qwen models on OpenRouter:\n');
  qwenModels.forEach(m => {
    console.log(`  ${m.id}`);
    console.log(`    Modality: ${m.architecture?.modality || 'N/A'}`);
    console.log(`    Family: ${m.architecture?.family || 'N/A'}`);
    console.log('');
  });
}

main().catch(console.error);
