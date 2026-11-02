import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /*
   * Há outros package-lock.json nas pastas acima; sem isto o Turbopack
   * escolhe a pasta pai como raiz e passa a varrer e observar o material de
   * marca (PDFs, .ai, logos), o que trava o dev server.
   */
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 ano
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizeCss: true,
    /*
     * 404 de rota inexistente sem passar pelo layout raiz (app/global-not-found.tsx).
     * No dev, abrir uma página 404 num navegador fazia o Turbopack consumir
     * ~600% de CPU e vários GB por minutos, travando todas as outras rotas.
     */
    globalNotFound: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'framer-motion'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  /**
   * Propostas fora do índice também por cabeçalho HTTP.
   *
   * A meta tag só é lida se o robô interpretar o HTML. O X-Robots-Tag vale
   * para qualquer resposta da rota — inclusive o payload RSC que o Next
   * serve nas navegações internas, que não carrega <head>.
   */
  async headers() {
    return [
      {
        source: "/proposta/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },

  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
