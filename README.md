# Alastro - Produtora Audiovisual

Site institucional da Alastro, uma produtora audiovisual focada em criar conteúdo de qualidade e impacto.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Framer Motion

## Como desenvolver

Para desenvolver localmente, você precisa ter Node.js & npm instalados - [instale com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes React reutilizáveis
  ├── hooks/         # Custom hooks
  ├── lib/          # Utilitários e funções auxiliares
  ├── pages/        # Páginas da aplicação
  └── styles/       # Estilos e configurações CSS
```

## Considerações de Performance

- Otimização de imagens com formato WebP
- Lazy loading de componentes
- Animações otimizadas com Framer Motion

## Deploy

Para fazer o deploy do projeto:

```sh
# Construir o projeto
npm run build

# Testar a build localmente
npm run preview
```

O projeto pode ser hospedado em qualquer plataforma que suporte aplicações estáticas como:
- Vercel
- Netlify
- GitHub Pages
- Amazon S3
- Google Cloud Storage
