interface EmailData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  formType: 'contact' | 'trabalhe-conosco';
  portfolio?: string;
  linkedin?: string;
  area?: string;
}

interface BrevoResponse {
  messageId?: string;
  error?: string;
}

export const sendEmail = async (data: EmailData): Promise<BrevoResponse> => {
  const apiKey = import.meta.env.VITE_BREVO_API_KEY;
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'contato@somosalastro.com.br';

  if (!apiKey) {
    throw new Error('Chave API da Brevo não configurada');
  }

  // Monta o assunto do email baseado no tipo de formulário
  const subject = data.formType === 'contact' 
    ? 'Contato pelo site'
    : 'Quero fazer parte do time Alastro';

  // Monta o corpo do email em HTML
  const htmlContent = data.formType === 'contact' 
    ? `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #d4ec8e;">Novo Contato - Site Alastro</h2>
          <div style="background: #f4f4f4; padding: 20px; border-radius: 8px;">
            <p><strong>Nome:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Telefone:</strong> ${data.phone}</p>
            <p><strong>Empresa/Projeto:</strong> ${data.company || 'Não informado'}</p>
            <hr style="border: 1px solid #ddd; margin: 20px 0;">
            <p><strong>Mensagem:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 4px;">${data.message.replace(/\n/g, '<br>')}</p>
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
            <p><strong>Nome:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Telefone:</strong> ${data.phone}</p>
            <p><strong>Área de Interesse:</strong> ${data.area || 'Não informado'}</p>
            ${data.portfolio ? `<p><strong>Portfólio:</strong> <a href="${data.portfolio}" target="_blank">${data.portfolio}</a></p>` : ''}
            ${data.linkedin ? `<p><strong>LinkedIn:</strong> <a href="${data.linkedin}" target="_blank">${data.linkedin}</a></p>` : ''}
            <hr style="border: 1px solid #ddd; margin: 20px 0;">
            <p><strong>Mensagem:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 4px;">${data.message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            Este email foi enviado através do formulário Trabalhe Conosco do site Alastro.
          </p>
        </body>
      </html>
    `;

  try {
    const payload = {
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
        email: data.email,
        name: data.name,
      },
    };

    console.log('Enviando email com payload:', payload);

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Erro ao enviar email:', result);
      throw new Error(result.message || `Erro ${response.status}: ${JSON.stringify(result)}`);
    }

    console.log('Email enviado com sucesso:', result);
    return { messageId: result.messageId };
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};
