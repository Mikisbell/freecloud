import { NextRequest, NextResponse } from 'next/server';
import { submitContact } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, email, service, message } = await request.json();

    if (!name || !email || !email.includes('@') || !message) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    await submitContact(name, email, message, service);

    return NextResponse.json({ success: true, message: 'Mensaje enviado exitosamente' });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Error al enviar el mensaje' }, { status: 500 });
  }
}
