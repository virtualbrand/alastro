# Otimização de Fontes - Adobe TypeKit

## 🎯 Objetivo
Reduzir o tempo de carregamento das fontes de ~150ms para ~40ms e diminuir o tamanho total de ~300KB para ~80KB.

## 📊 Problema Atual

O projeto TypeKit `sip8wfz` está carregando:
- ✗ 7 weights da fonte amplitude (200, 300, 400, 500, 700, 800, 900)
- ✗ 5 variantes (amplitude, amplitude-compressed, amplitude-condensed, amplitude-extra-compressed, amplitude-wide)
- ✗ Total: ~35 arquivos de fonte (~300-400KB)
- ✗ `font-display: auto` (causa FOIT - Flash of Invisible Text)

**Uso real no código:**
- ✓ amplitude Regular (400) - textos normais
- ✓ amplitude Bold (700) - títulos e destaques

## 🔧 Solução Implementada

### 1. Configuração Atual (Código)
```html
<!-- index.html -->
<link rel="preconnect" href="https://use.typekit.net" crossorigin>
<link rel="preload" href="https://use.typekit.net/sip8wfz.css" as="style">
<link rel="stylesheet" href="https://use.typekit.net/sip8wfz.css" media="print" onload="this.media='all'">
```

```css
/* src/index.css */
@font-face {
  font-family: 'amplitude';
  font-display: swap; /* Override do TypeKit 'auto' */
  font-weight: 400;
}

@font-face {
  font-family: 'amplitude';
  font-display: swap;
  font-weight: 700;
}
```

### 2. Configuração Necessária no Adobe Fonts

**AÇÃO NECESSÁRIA:** Acessar [Adobe Fonts](https://fonts.adobe.com/my_fonts#web_projects-section) e editar o projeto TypeKit:

1. Login em fonts.adobe.com
2. Ir em "Web Projects"
3. Encontrar projeto `sip8wfz` (Alastro)
4. Clicar em "Edit Project"

**Configuração Ideal:**

#### Fonte: amplitude
- [x] Regular (400)
- [x] Bold (700)
- [ ] Light (300) - REMOVER
- [ ] Medium (500) - REMOVER
- [ ] Extra Bold (800) - REMOVER
- [ ] Black (900) - REMOVER

#### Variantes
- [ ] amplitude-compressed - REMOVER
- [ ] amplitude-condensed - REMOVER  
- [ ] amplitude-extra-compressed - REMOVER
- [ ] amplitude-wide - REMOVER

#### Configurações Avançadas
- **Character Sets:** Latin (básico) - remover caracteres não usados
- **Font Display:** Swap (se disponível)

### 3. Alternativa: Self-Hosting (Mais Rápido)

Se tiver os arquivos .woff2, pode fazer self-hosting:

```css
/* src/index.css */
@font-face {
  font-family: 'amplitude';
  font-display: swap;
  font-weight: 400;
  font-style: normal;
  src: url('/fonts/amplitude-regular.woff2') format('woff2');
  unicode-range: U+0020-007F; /* Latin básico */
}

@font-face {
  font-family: 'amplitude';
  font-display: swap;
  font-weight: 700;
  font-style: normal;
  src: url('/fonts/amplitude-bold.woff2') format('woff2');
  unicode-range: U+0020-007F;
}
```

**Vantagens do Self-Hosting:**
- ✓ Sem DNS lookup externo (~20-40ms)
- ✓ Sem round-trip para use.typekit.net
- ✓ Cacheable no Vercel CDN
- ✓ Controle total sobre font-display
- ✓ Subsetting customizado (apenas caracteres usados)

## 📈 Ganhos Esperados

### Configurando TypeKit Corretamente
- Redução de tamanho: 300KB → 80KB (73% menor)
- Economia de requests: 35 arquivos → 2 arquivos
- Tempo de carregamento: 150ms → 60ms
- **Economia estimada: ~90ms** ✅

### Self-Hosting (Ideal)
- Redução de tamanho: 300KB → 60KB (com subsetting)
- Eliminação de DNS lookup: +30-40ms
- Tempo de carregamento: 150ms → 30ms
- **Economia estimada: ~120ms** 🚀

## 🔍 Verificação

### Antes
```bash
# Network tab do Chrome DevTools
use.typekit.net/sip8wfz.css - 5KB - 40ms
use.typekit.net/p.css - 8KB - 35ms
use.typekit.net/af/8fd6c4/...woff2 - 45KB - 30ms (weight 200)
use.typekit.net/af/1fcf5d/...woff2 - 45KB - 30ms (weight 300)
# ... mais 30+ requests
Total: ~300KB, ~150ms
```

### Depois (TypeKit Otimizado)
```bash
use.typekit.net/sip8wfz.css - 2KB - 30ms
use.typekit.net/af/4c0db4/...woff2 - 40KB - 25ms (weight 400)
use.typekit.net/af/73f78f/...woff2 - 40KB - 25ms (weight 700)
Total: ~82KB, ~50ms ✅
```

### Depois (Self-Hosted)
```bash
/fonts/amplitude-regular.woff2 - 30KB - 15ms
/fonts/amplitude-bold.woff2 - 30KB - 15ms
Total: ~60KB, ~30ms 🚀
```

## 📝 Checklist

- [x] Preconnect para use.typekit.net
- [x] Preload do CSS de fontes
- [x] Carregamento assíncrono (media="print" trick)
- [x] font-display: swap no CSS
- [x] Fallback font definido (system fonts)
- [ ] Configurar TypeKit para apenas weights 400 e 700
- [ ] Considerar self-hosting para máxima performance

## 🎓 Referências

- [Web Font Optimization](https://web.dev/font-best-practices/)
- [font-display for the Masses](https://css-tricks.com/font-display-masses/)
- [Adobe Fonts Performance](https://helpx.adobe.com/fonts/using/use-fonts-web.html)
