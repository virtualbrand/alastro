# Performance Testing Guide

## Como Testar Localmente

### Opção 1: Script Automatizado
```bash
./test-performance.sh
```

### Opção 2: Manual

1. **Build de produção**
```bash
npm run build
npm run start
```

2. **Teste no Chrome DevTools**
- Abra http://localhost:3000
- F12 > Lighthouse
- Selecione "Performance" + "Best Practices"
- Teste em Mobile e Desktop

3. **Teste com PageSpeed Insights**
- Deploy no Vercel
- Acesse: https://pagespeed.web.dev/
- Cole a URL do site

## Métricas Alvo

| Métrica | Mobile | Desktop |
|---------|--------|---------|
| Performance Score | 90+ | 95+ |
| LCP | < 2.5s | < 1.5s |
| FID | < 100ms | < 100ms |
| CLS | < 0.1 | < 0.1 |
| FCP | < 1.8s | < 1.0s |
| TBT | < 200ms | < 150ms |

## Checklist Pré-Deploy

- [ ] Build sem erros
- [ ] Lighthouse score > 90
- [ ] Imagens todas com width/height
- [ ] Videos com preload="none"
- [ ] Fonts carregadas assincronamente
- [ ] Cache headers configurados
- [ ] No console.logs em produção

## Troubleshooting

### Score baixo em Mobile?
- Verifique 3G throttling
- Teste imagens carregando
- Confirme lazy loading ativo

### CLS alto?
- Todas as imagens têm width/height?
- Fontes têm font-display: swap?
- Ads/embeds reservam espaço?

### LCP lento?
- Hero image tem preload?
- Servidor respondendo rápido?
- CDN configurado corretamente?
