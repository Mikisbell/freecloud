import { NextRequest, NextResponse } from 'next/server';
import { subscribeNewsletter } from '@/lib/supabase';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email('Email inválido').max(150, 'Email muy largo')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    await subscribeNewsletter(result.data.email, 'blog');

    return NextResponse.json({ success: true, message: 'Suscrito exitosamente' });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Error al suscribir' }, { status: 500 });
  }
}
