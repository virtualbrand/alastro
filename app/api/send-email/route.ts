import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      name,
      email,
      phone,
      company,
      message: userMessage,
      formType,
      portfolio,
      linkedin,
      area,
    } = data;

    const apiKey = process.env.BREVO_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL;

    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      hasContactEmail: !!contactEmail,
      formType,
      name,
      email
    });

    if (!apiKey) {
      console.error('Missing BREVO_API_KEY');
      return NextResponse.json(
        { message: 'Server not configured: missing BREVO_API_KEY' },
        { status: 500 }
      );
    }

    if (!contactEmail) {
      console.error('Missing CONTACT_EMAIL');
      return NextResponse.json(
        { message: 'Server not configured: missing CONTACT_EMAIL' },
        { status: 500 }
      );
    }

    const subject = formType === 'contact' ? 'Contato pelo site' : 'Quero fazer parte do time Alastro';

    const htmlContent = formType === 'contact'
      ? `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #d4ec8e;">Novo Contato - Site Alastro</h2>
            <div style="background: #f4f4f4; padding: 20px; border-radius: 8px;">
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Telefone:</strong> ${phone}</p>
              <p><strong>Empresa/Projeto:</strong> ${company || 'Não informado'}</p>
              <hr style="border: 1px solid #ddd; margin: 20px 0;">
              <p><strong>Mensagem:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 4px;">${(userMessage || '').replace(/\n/g, '<br>')}</p>
            </div>
          </body>
        </html>
      `
      : `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #d4ec8e;">Trabalhe Conosco - Site Alastro</h2>
            <div style="background: #f4f4f4; padding: 20px; border-radius: 8px;">
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Telefone:</strong> ${phone}</p>
              <p><strong>Área de Interesse:</strong> ${area || 'Não informado'}</p>
              ${portfolio ? `<p><strong>Portfólio:</strong> <a href="${portfolio}" target="_blank">${portfolio}</a></p>` : ''}
              ${linkedin ? `<p><strong>LinkedIn:</strong> <a href="${linkedin}" target="_blank">${linkedin}</a></p>` : ''}
              <hr style="border: 1px solid #ddd; margin: 20px 0;">
              <p><strong>Mensagem:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 4px;">${(userMessage || '').replace(/\n/g, '<br>')}</p>
            </div>
          </body>
        </html>
      `;

    const payload = {
      sender: { name: 'Site Alastro', email: contactEmail },
      to: [{ email: contactEmail, name: 'Alastro Produtora' }],
      subject,
      htmlContent,
      replyTo: { email, name },
    };

    const fetchRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    const result = await fetchRes.json();

    console.log('Brevo response:', {
      status: fetchRes.status,
      ok: fetchRes.ok,
      result
    });

    if (!fetchRes.ok) {
      console.error('Brevo error:', result);
      return NextResponse.json(result, { status: fetchRes.status });
    }

    console.log('Email sent successfully:', result.messageId);
    return NextResponse.json({ messageId: result.messageId, ok: true });
  } catch (err: any) {
    console.error('Server error sending email:', err);
    return NextResponse.json(
      { 
        message: err.message || 'Server error',
        error: err.toString()
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
