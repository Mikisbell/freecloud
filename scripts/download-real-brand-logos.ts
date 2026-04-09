/**
 * download-real-brand-logos.ts
 * Download REAL official brand logo SVGs from wikimedia and official sources
 */

import fs from 'fs';
import path from 'path';

const LOGOS_DIR = path.join(process.cwd(), 'public', 'logos');

const BRANDS = [
  {
    name: 'Autodesk Revit',
    filename: 'revit.svg',
    // Wikimedia Commons official Revit logo
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Autodesk_Revit_2015_logo.svg',
  },
  {
    name: 'Autodesk AutoCAD',
    filename: 'autocad.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Autocad-logo.svg',
  },
  {
    name: 'Autodesk Navisworks',
    filename: 'navisworks.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Autodesk_Navisworks_2015_logo.svg',
  },
  {
    name: 'Autodesk Civil 3D',
    filename: 'civil3d.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Autodesk_Civil_3D_2015_logo.svg',
  },
  {
    name: 'Autodesk Robot Structural Analysis',
    filename: 'robot.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Autodesk_Robot_Structural_Analysis_Professional_2015_logo.svg',
  },
  {
    name: 'CSI ETABS',
    filename: 'etabs.svg',
    // ETABS doesn't have a simple SVG on wikimedia, use a clean text-based one
    url: 'https://www.csiamerica.com/assets/img/csi-logo.svg',
  },
];

async function downloadLogo(brand: typeof BRANDS[0]): Promise<boolean> {
  try {
    console.log(`📥 ${brand.name}...`);
    const res = await fetch(brand.url);
    
    if (!res.ok) {
      console.log(`   ❌ ${res.status} ${res.statusText}`);
      return false;
    }

    const svg = await res.text();
    
    // Validate it's actually an SVG
    if (!svg.trim().startsWith('<svg') && !svg.trim().startsWith('<?xml')) {
      console.log(`   ❌ Not a valid SVG file`);
      return false;
    }

    const filePath = path.join(LOGOS_DIR, brand.filename);
    fs.writeFileSync(filePath, svg);
    console.log(`   ✅ ${brand.filename} (${(svg.length / 1024).toFixed(1)} KB)`);
    return true;
  } catch (e: any) {
    console.log(`   ❌ ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('📥 Descargando logos REALES de marcas oficiales\n');

  let downloaded = 0;

  for (const brand of BRANDS) {
    const success = await downloadLogo(brand);
    if (success) downloaded++;
  }

  console.log(`\n📊 Logos reales descargados: ${downloaded}/${BRANDS.length}`);
  
  if (downloaded < BRANDS.length) {
    console.log('\n⚠️  Algunos logos no se pudieron descargar. Alternativas:');
    console.log('   - Revisar las URLs en el código');
    console.log('   - Descargar manualmente desde los sitios oficiales');
    console.log('   - Usar logos de https://simpleicons.org/ para marcas genéricas');
  }
}

main().catch(console.error);
