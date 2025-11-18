// Serverless function for Vercel (or similar) to send emails via Brevo
// Protect your BREVO_API_KEY in the server environment (VERCEL env vars)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const data = req.body || {};
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
      return res.status(500).json({ message: 'Server not configured: missing BREVO_API_KEY' });
    }

    if (!contactEmail) {
      console.error('Missing CONTACT_EMAIL');
      return res.status(500).json({ message: 'Server not configured: missing CONTACT_EMAIL' });
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
      return res.status(fetchRes.status).json(result);
    }

    console.log('Email sent successfully:', result.messageId);
    return res.status(200).json({ messageId: result.messageId, ok: true });
  } catch (err) {
    console.error('Server error sending email:', err);
    return res.status(500).json({ 
      message: err.message || 'Server error',
      error: err.toString()
    });
  }
}
