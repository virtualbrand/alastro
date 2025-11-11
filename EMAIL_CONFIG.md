# Configuração de Envio de E-mails

Sistema de envio de e-mails usando Brevo via função serverless segura.

## Configuração no Vercel

No painel do Vercel (Project → Settings → Environment Variables):

1. **BREVO_API_KEY**
   - Value: `SUA_CHAVE_BREVO_AQUI` (começa com xkeysib-)
   - Environment: Production, Preview, Development

2. **CONTACT_EMAIL**
   - Value: `contato@somosalastro.com.br`
   - Environment: Production, Preview, Development

3. Clique em **Save**

4. Faça redeploy do projeto

## Como Funciona

- Frontend chama `POST /api/send-email`
- Função serverless usa as variáveis do Vercel para enviar via Brevo
- Chave API nunca é exposta ao cliente

## Testar

Após deploy, envie um formulário e verifique:
- Console do navegador (sem erros)
- Painel Brevo → Transactional logs
- Caixa de entrada do email configurado

## Desenvolvimento Local

Para testar localmente com Vercel Dev:

```bash
vercel env pull .env.local
vercel dev
```
