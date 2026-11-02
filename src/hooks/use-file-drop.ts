"use client";

import { useRef, useState } from "react";

/**
 * Transforma um elemento em área de soltar arquivos (arrastar e soltar).
 *
 * `dropProps` vai no elemento; `isDragging` é verdadeiro enquanto um arquivo
 * está por cima, para destacar a área. Só reage a arquivos: arrastar texto ou
 * links pela página não aciona. O contador de profundidade existe porque
 * dragenter/dragleave disparam também ao passar pelos filhos do elemento.
 */
export const useFileDrop = (
  onFiles: (files: File[]) => void,
  { disabled = false }: { disabled?: boolean } = {},
) => {
  const [isDragging, setIsDragging] = useState(false);
  const depth = useRef(0);

  const hasFiles = (event: React.DragEvent) =>
    Array.from(event.dataTransfer.types).includes("Files");

  const dropProps = {
    onDragEnter: (event: React.DragEvent) => {
      if (disabled || !hasFiles(event)) return;
      event.preventDefault();
      depth.current += 1;
      setIsDragging(true);
    },
    onDragOver: (event: React.DragEvent) => {
      if (disabled || !hasFiles(event)) return;
      // Sem isto o navegador não aceita o drop (e abriria o arquivo na aba).
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    onDragLeave: (event: React.DragEvent) => {
      if (disabled || !hasFiles(event)) return;
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setIsDragging(false);
    },
    onDrop: (event: React.DragEvent) => {
      if (disabled || !hasFiles(event)) return;
      event.preventDefault();
      depth.current = 0;
      setIsDragging(false);
      const files = Array.from(event.dataTransfer.files);
      if (files.length > 0) onFiles(files);
    },
  };

  return { isDragging, dropProps };
};
