/**
 * download-official-logos.ts
 * Download official brand SVG logos from Simple Icons
 */

import fs from 'fs';
import path from 'path';

const LOGOS_DIR = path.join(process.cwd(), 'public', 'logos');

// Ensure directory exists
if (!fs.existsSync(LOGOS_DIR)) {
  fs.mkdirSync(LOGOS_DIR, { recursive: true });
}

// Brands with their Simple Icons slugs and target filenames
const BRANDS = [
  { slug: 'autodesk', filename: 'autodesk.svg', name: 'Autodesk (Revit, AutoCAD, Civil 3D, Navisworks, Robot)' },
  { slug: 'python', filename: 'python.svg', name: 'Python' },
  { slug: 'typescript', filename: 'typescript.svg', name: 'TypeScript' },
  { slug: 'microsoftexcel', filename: 'microsoft-excel.svg', name: 'Microsoft Excel' },
  { slug: 'sketchup', filename: 'sketchup.svg', name: 'SketchUp' },
  { slug: 'supabase', filename: 'supabase.svg', name: 'Supabase' },
];

async function downloadLogo(slug: string, filename: string): Promise<boolean> {
  try {
    const url = `https://cdn.simpleicons.org/${slug}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      console.log(`   ❌ ${slug}: ${res.status} ${res.statusText}`);
      return false;
    }

    const svg = await res.text();
    const filePath = path.join(LOGOS_DIR, filename);
    fs.writeFileSync(filePath, svg);
    console.log(`   ✅ ${filename} (${svg.length} bytes)`);
    return true;
  } catch (e: any) {
    console.log(`   ❌ ${slug}: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('📥 Descargando logos oficiales desde Simple Icons\n');

  let downloaded = 0;

  for (const brand of BRANDS) {
    console.log(`📌 ${brand.name}`);
    const success = await downloadLogo(brand.slug, brand.filename);
    if (success) downloaded++;
  }

  console.log(`\n📊 Descargados: ${downloaded}/${BRANDS.length}`);
  
  // Now create specific logos for Autodesk products
  // Since Simple Icons only has the main Autodesk logo, we'll create labeled variants
  const autodeskProducts = [
    { filename: 'revit.svg', label: 'Revit' },
    { filename: 'autocad.svg', label: 'AutoCAD' },
    { filename: 'civil3d.svg', label: 'Civil 3D' },
    { filename: 'navisworks.svg', label: 'Navisworks' },
    { filename: 'robot.svg', label: 'Robot' },
    { filename: 'etabs.svg', label: 'ETABS' },
  ];

  console.log('\n📌 Creando logos de productos Autodesk/CSI con labels...');
  
  // Read the base Autodesk logo SVG
  const autodeskSvg = fs.readFileSync(path.join(LOGOS_DIR, 'autodesk.svg'), 'utf8');
  
  for (const product of autodeskProducts) {
    // Create a simple SVG with the product name
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <rect width="128" height="128" rx="24" fill="#0696D7"/>
  <text x="64" y="72" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white">${product.label}</text>
</svg>`;
    
    const filePath = path.join(LOGOS_DIR, product.filename);
    fs.writeFileSync(filePath, svgContent);
    console.log(`   ✅ ${product.filename} creado`);
  }

  console.log('\n✅ Logos descargados y creados correctamente');
}

main().catch(console.error);
