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
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Erro ao enviar email (serverless):', result);
      throw new Error(result.message || 'Erro ao enviar email');
    }

    return { messageId: result.messageId };
  } catch (error) {
    console.error('Erro na requisição para /api/send-email:', error);
    throw error;
  }
};
