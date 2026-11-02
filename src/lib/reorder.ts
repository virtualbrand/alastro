/**
 * Estilo de uma linha enquanto é arrastada, compartilhado pelas listas
 * reordenáveis do painel (cases, clientes e futuras).
 *
 * Só sombra: nada de `scale`. Ampliar a linha a deixa mais larga que as
 * vizinhas, e se a animação de soltar for interrompida ela fica assim.
 * `zIndex` mantém a linha arrastada por cima das outras.
 */
export const WHILE_DRAG = {
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  zIndex: 10,
} as const;
