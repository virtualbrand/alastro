import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apenas aceitar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validar origem (opcional, mas recomendado)
  const allowedOrigins = [
    'http://localhost:8080',
    'https://somosalastro.com.br',
    'https://www.somosalastro.com.br'
  ];
  
  const origin = req.headers.origin || '';
  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const { name, email, phone, company, message, formType, portfolio, area } = req.body;

    // Validações básicas
    if (!name || !email || !phone || !message || !formType) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL || 'contato@somosalastro.com.br';

    if (!apiKey) {
      return res.status(500).json({ error: 'Configuração do servidor incorreta' });
    }

    // Monta o assunto do email
    const subject = formType === 'contact' 
      ? 'Contato pelo site'
      : 'Quero fazer parte do time Alastro';

    // Monta o corpo do email em HTML
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
              <p style="background: white; padding: 15px; border-radius: 4px;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Este email foi enviado através do formulário de contato do site Alastro.
            </p>
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
              <hr style="border: 1px solid #ddd; margin: 20px 0;">
              <p><strong>Mensagem:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 4px;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Este email foi enviado através do formulário Trabalhe Conosco do site Alastro.
            </p>
          </body>
        </html>
      `;

    // Envia o email via Brevo
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Site Alastro',
          email: contactEmail,
        },
        to: [
          {
            email: contactEmail,
            name: 'Alastro Produtora',
          },
        ],
        subject: subject,
        htmlContent: htmlContent,
        replyTo: {
          email: email,
          name: name,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Erro ao enviar email:', result);
      return res.status(500).json({ error: 'Erro ao enviar email' });
    }

    return res.status(200).json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error('Erro na requisição:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
