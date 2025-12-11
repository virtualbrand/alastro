# Configuração Recomendada para Deploy no Vercel

## Environment Variables

Configure no Vercel Dashboard:

```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Build Settings

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
npm install
```

## Vercel.json Otimizado

Já configurado no projeto com:
- Cache headers agressivos (1 ano) para imagens e vídeos
- Headers de segurança
- Compression automática

## Rewrite Rules

O projeto já está configurado para:
- SPA routing
- API routes preservadas
- Static assets com cache máximo

## Edge Functions (Opcional)

Para melhor performance global, considere:

```json
{
  "functions": {
    "api/**/*": {
      "runtime": "edge"
    }
  }
}
```

## Domínio Personalizado

1. Adicione seu domínio no Vercel
2. Configure DNS:
   - A record: 76.76.21.21
   - AAAA record: 2606:4700:10::ac43:1515
3. Ative HTTPS automático
4. Configure www redirect se necessário

## Analytics (Recomendado)

1. Ative Vercel Analytics no dashboard
2. Monitore Core Web Vitals reais
3. Compare com Lighthouse scores

## Edge Caching

Automático na Vercel para:
- ✅ Static files
- ✅ Images via Next/Image
- ✅ API routes com cache headers
- ✅ Páginas SSG

## Otimizações Automáticas da Vercel

A Vercel já aplica automaticamente:

1. **Image Optimization**
   - AVIF/WebP automático
   - Resize on-demand
   - Smart caching

2. **Edge Network**
   - CDN global
   - Smart routing
   - DDoS protection

3. **Compression**
   - Brotli/Gzip automático
   - Asset minification

## Monitoramento

### Core Web Vitals
- Real User Monitoring via Vercel Analytics
- Field data > Lab data

### Lighthouse CI
```bash
npm install -g @lhci/cli
lhci autorun --collect.url=https://seu-site.vercel.app
```

## Checklist Pré-Deploy

- [ ] `npm run build` sem erros
- [ ] Lighthouse score > 90 localmente
- [ ] Environment variables configuradas
- [ ] Domínio personalizado apontando
- [ ] Analytics ativado
- [ ] robots.txt configurado
- [ ] Sitemap gerado (se aplicável)

## Post-Deploy

1. **Teste imediato**
   ```bash
   curl -I https://seu-site.vercel.app
   ```
   Verifique headers: Cache-Control, Content-Encoding

2. **PageSpeed Insights**
   - https://pagespeed.web.dev/
   - Teste mobile e desktop

3. **WebPageTest**
   - https://www.webpagetest.org/
   - Teste de múltiplas localizações

4. **Lighthouse CI**
   - Configure GitHub Actions para testes automáticos

## Troubleshooting

### Build Failing?
- Verifique Node version no package.json
- Limpe cache: `vercel --force`

### Slow Load Times?
- Confirme Edge Network ativo
- Verifique origin response time
- Analise bundle size

### Images Not Optimizing?
- Confirme formato correto (jpg, png, webp)
- Verifique paths relativos corretos
- Teste URL direta da imagem

## Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Optimization](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web.dev Performance](https://web.dev/performance/)

---

**Última atualização**: Dezembro 2024
