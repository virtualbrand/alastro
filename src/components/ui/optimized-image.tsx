import { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> {
  src: string;
  alt: string;
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * Componente de imagem otimizada que gera automaticamente srcset
 * para diferentes tamanhos de tela usando query parameters do Vercel
 * 
 * Features:
 * - Srcset automático para responsive loading
 * - Suporte a fetchPriority
 * - WebP/AVIF automático via Vercel
 * - Dimensões explícitas para prevenir CLS
 */
export function OptimizedImage({ 
  src, 
  alt, 
  sizes = '100vw',
  className,
  loading = 'lazy',
  decoding = 'async',
  priority = false,
  fetchPriority = 'auto',
  width,
  height,
  ...props 
}: OptimizedImageProps) {
  // Remove query params existentes
  const cleanSrc = src.split('?')[0];
  
  // Gera srcset automaticamente para diferentes larguras
  const widths = [400, 640, 750, 828, 1080, 1200, 1920];
  const srcSet = widths
    .map(width => `${cleanSrc}?w=${width}&q=85 ${width}w`)
    .join(', ');

  // Se priority é true, força eager loading
  const actualLoading = priority ? 'eager' : loading;
  const actualFetchPriority = priority ? 'high' : fetchPriority;

  // Extrai largura do sizes para otimização
  const intrinsicWidth = width || 800;
  const intrinsicHeight = height;

  return (
    <picture>
      {/* AVIF para máxima compressão (suporte crescente) */}
      <source
        type="image/avif"
        srcSet={srcSet.replace(/&q=85/g, '&q=75&fm=avif')}
        sizes={sizes}
      />
      
      {/* WebP otimizado para browsers modernos */}
      <source
        type="image/webp"
        srcSet={srcSet}
        sizes={sizes}
      />
      
      {/* Fallback */}
      <img
        src={`${cleanSrc}?w=${intrinsicWidth}&q=85`}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={actualLoading}
        decoding={decoding}
        fetchPriority={actualFetchPriority}
        width={width}
        height={height}
        className={className}
        style={{
          // Previne CLS durante carregamento
          aspectRatio: width && height ? `${width} / ${height}` : undefined,
        }}
        {...props}
      />
    </picture>
  );
}
