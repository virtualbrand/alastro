import { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> {
  src: string;
  alt: string;
  sizes?: string;
  width?: number;
  height?: number;
}

/**
 * Componente de imagem otimizada que gera automaticamente srcset
 * para diferentes tamanhos de tela usando query parameters do Vercel
 */
export function OptimizedImage({ 
  src, 
  alt, 
  sizes = '100vw',
  className,
  loading = 'lazy',
  decoding = 'async',
  ...props 
}: OptimizedImageProps) {
  // Remove query params existentes
  const cleanSrc = src.split('?')[0];
  
  // Gera srcset automaticamente para diferentes larguras
  const widths = [400, 640, 750, 828, 1080, 1200, 1920];
  const srcSet = widths
    .map(width => `${cleanSrc}?w=${width}&q=85 ${width}w`)
    .join(', ');

  return (
    <picture>
      {/* WebP otimizado para browsers modernos */}
      <source
        type="image/webp"
        srcSet={srcSet}
        sizes={sizes}
      />
      
      {/* Fallback */}
      <img
        src={`${cleanSrc}?w=800&q=85`}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={className}
        {...props}
      />
    </picture>
  );
}
