# Configuração de Envio de E-mails

Este projeto utiliza a API SMTP da Brevo (Sendinblue) para envio de e-mails dos formulários.

## Configuração

1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite o arquivo `.env.local` e configure as seguintes variáveis:
   - `VITE_BREVO_API_KEY`: Sua chave API da Brevo
   - `VITE_CONTACT_EMAIL`: E-mail que receberá os contatos

## Variáveis de Ambiente

### VITE_BREVO_API_KEY
Chave de API SMTP da Brevo. Você pode obter uma em: https://app.brevo.com/settings/keys/api

### VITE_CONTACT_EMAIL
E-mail de destino que receberá todas as mensagens dos formulários (contato e trabalhe conosco).
Exemplo: `contato@somosalastro.com.br`

## Formulários Configurados

- **Formulário de Contato** (`ContactSection`): Envia mensagens de contato de clientes
- **Formulário Trabalhe Conosco** (`TrabalheConoscoSection` e `TrabalheConoscoPage`): Envia candidaturas

## Estrutura do E-mail

Os e-mails são enviados em formato HTML e incluem:
- Nome do remetente
- E-mail do remetente
- Telefone
- Informações específicas do formulário (empresa, área de interesse, portfólio, etc.)
- Mensagem

## Desenvolvimento

Durante o desenvolvimento, certifique-se de que:
1. O arquivo `.env.local` está configurado corretamente
2. O servidor de desenvolvimento está reiniciado após adicionar as variáveis de ambiente
3. Nunca commite o arquivo `.env.local` no Git (já está no .gitignore)

## Segurança

- ⚠️ **IMPORTANTE**: Nunca compartilhe sua chave API publicamente
- O arquivo `.env.local` está configurado no `.gitignore` e não será versionado
- Use o arquivo `.env.example` como template (sem dados sensíveis)

## Solução de Problemas

### Erro ao enviar mensagem

Se você está recebendo erro "Erro ao enviar mensagem", verifique:

#### 1. E-mail de Remetente (Sender) Verificado
A Brevo exige que o e-mail usado como **sender** (remetente) esteja verificado na plataforma.

**Solução:**
1. Acesse https://app.brevo.com/senders
2. Verifique se o email `contato@somosalastro.com.br` está verificado
3. Se não estiver, adicione e verifique o domínio ou email

#### 2. Chave API Correta
Verifique se a chave API no arquivo `.env.local` está correta e ativa.

**Solução:**
1. Acesse https://app.brevo.com/settings/keys/api
2. Confirme que a chave está ativa
3. Se necessário, gere uma nova chave

#### 3. Limites da API
Contas gratuitas da Brevo têm limite de 300 emails/dia.

**Solução:**
1. Acesse https://app.brevo.com/account/plan
2. Verifique seu plano e limites
3. Considere upgrade se necessário

#### 4. Console do Navegador
Abra o console do navegador (F12) para ver detalhes do erro específico.

### Testando Manualmente

Você pode testar a API da Brevo diretamente usando curl:

```bash
curl -X POST \
  https://api.brevo.com/v3/smtp/email \
  -H 'accept: application/json' \
  -H 'api-key: SUA_CHAVE_API_AQUI' \
  -H 'content-type: application/json' \
  -d '{
    "sender": {"name": "Alastro", "email": "contato@somosalastro.com.br"},
    "to": [{"email": "contato@somosalastro.com.br", "name": "Teste"}],
    "subject": "Teste",
    "htmlContent": "<html><body><h1>Teste</h1></body></html>"
  }'
```

### Logs no Console
O serviço agora inclui logs detalhados. Abra o console do navegador (F12) para ver:
- Payload enviado para a API
- Resposta detalhada em caso de erro
- Confirmação de sucesso

## Próximos Passos

1. ✅ Verifique o email remetente na Brevo
2. ✅ Reinicie o servidor de desenvolvimento (`npm run dev`)
3. ✅ Teste o formulário e verifique o console do navegador
4. ✅ Confira o painel da Brevo para ver emails enviados
