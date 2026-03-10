import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load directly to avoid Next.js env issues in simple script
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  try {
    // 1. Get Category ID for 'Ingeniería BIM'
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name')
      .ilike('name', '%BIM%');
      
    if (catError) throw catError;
    
    let categoryId = categories?.[0]?.id;
    
    // Fallback if category doesn't exist
    if (!categoryId) {
      const { data: newCat, error: insertCatError } = await supabase
        .from('categories')
        .insert([{
          name: 'Ingeniería BIM',
          slug: 'ingenieria-bim',
          description: 'Automatización y flujos BIM para proyectos.',
          emoji: '🏗️',
          color: 'blue'
        }])
        .select()
        .single();
        
      if (insertCatError) throw insertCatError;
      categoryId = newCat.id;
      console.log('Created new category:', newCat.name);
    } else {
      console.log('Found category:', categories[0].name);
    }

    // 2. Read the MDX content
    const mdxPath = path.join(process.cwd(), 'content', 'blog', 'automatizacion-bim-python.mdx');
    const mdxContent = fs.readFileSync(mdxPath, 'utf-8');
    
    // Extract frontmatter visually to populate DB fields
    const contentBody = mdxContent.split('---')[2].trim();
    
    // 3. Upsert the Post
    const postData = {
      title: 'Automatiza Tareas BIM con Python: La Guía Definitiva',
      slug: 'automatizacion-bim-python',
      content: contentBody,
      excerpt: 'Descubre cómo la automatización BIM con Python y plataformas como Revit o Dynamo está transformando la ingeniería. Ejemplos, librerías clave.',
      cover_image: '/blog/img1.png', // Fallback cover_image
      meta_title: 'Automatización BIM con Python y Revit | Guía',
      meta_description: 'Descubre cómo la automatización BIM con Python y plataformas como Revit o Dynamo está transformando la ingeniería civil y estructural.',
      status: 'published',
      published_at: new Date().toISOString(),
      category_id: categoryId,
      featured: false,
      author: 'FreeCloud'
    };

    const { data: existingPost } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', postData.slug)
      .single();

    if (existingPost) {
      console.log('Post exists, updating...');
      const { error: updateError } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', existingPost.id);
      if (updateError) throw updateError;
      console.log('✅ Post updated successfully!');
    } else {
      console.log('Inserting new post...');
      const { error: insertError } = await supabase
        .from('posts')
        .insert([postData]);
      if (insertError) throw insertError;
      console.log('✅ Post inserted successfully!');
    }
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Error:', String(error));
    }
  }
}

main();
