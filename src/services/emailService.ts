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
  // Now call the serverless endpoint which holds the BREVO_API_KEY securely
  try {
    console.log('Enviando email para:', '/api/send-email');
    console.log('Dados:', data);
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    let result;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const text = await response.text();
      console.error('Resposta não é JSON:', text);
      throw new Error(`Resposta inválida do servidor: ${text.substring(0, 100)}`);
    }

    if (!response.ok) {
      console.error('Erro ao enviar email (serverless):', result);
      throw new Error(result.message || `Erro ao enviar email (${response.status})`);
    }

    console.log('Email enviado com sucesso:', result);
    return { messageId: result.messageId };
  } catch (error) {
    console.error('Erro na requisição para /api/send-email:', error);
    throw error;
  }
};
