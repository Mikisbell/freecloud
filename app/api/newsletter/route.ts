import { NextRequest, NextResponse } from 'next/server';
import { subscribeNewsletter } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    await subscribeNewsletter(email, 'blog');

    return NextResponse.json({ success: true, message: 'Suscrito exitosamente' });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Error al suscribir' }, { status: 500 });
  }
}
