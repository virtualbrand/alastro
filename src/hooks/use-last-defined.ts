"use client";

import { useRef } from "react";

/**
 * Devolve o último valor não nulo recebido.
 *
 * Modais e drawers guardam o que exibem em estado que vira `null` ao fechar. Se
 * o conteúdo depende disso, ele some no mesmo instante e a animação de saída
 * roda numa janela vazia (o modal "colapsa" numa linha). Renderizando este
 * valor, o conteúdo fica na tela até a animação terminar e o Radix desmontar.
 */
export const useLastDefined = <T>(value: T | null): T | null => {
  const last = useRef<T | null>(value);
  if (value !== null) last.current = value;
  return last.current;
};
