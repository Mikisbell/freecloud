import { NextRequest, NextResponse } from 'next/server';
import { submitContact } from '@/lib/supabase';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto').max(100, 'Nombre muy largo'),
  email: z.string().email('Email inválido').max(150, 'Email muy largo'),
  service: z.string().max(100, 'Servicio muy largo').optional().or(z.literal('')),
  message: z.string().min(10, 'Mensaje muy corto').max(1500, 'Mensaje demasiado largo')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { name, email, service, message } = result.data;

    await submitContact(name, email, message, service);

    return NextResponse.json({ success: true, message: 'Mensaje enviado exitosamente' });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Error al enviar el mensaje' }, { status: 500 });
  }
}
