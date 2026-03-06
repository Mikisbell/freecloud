import { NextRequest, NextResponse } from 'next/server';
import { subscribeNewsletter } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email('Email inválido').max(150, 'Email muy largo')
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip, 5, 60_000)) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta en un minuto.' }, { status: 429 });
    }
    const body = await request.json();

    // Honeypot trap: Si el campo oculto está lleno, es un bot 100% seguro.
    // Retornamos 200 OK (silent success) para que el bot no sepa que falló, y ahorramos costo en DB.
    if (body._bot_honey) {
      console.log('🤖 Bot de Newsletter atrapado y anulado silenciosamente.');
      return NextResponse.json({ success: true, message: 'Suscrito exitosamente' });
    }

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
