/** Modos de visualização de uma listagem do painel. */
export const VIEW_MODES = ["list", "grid-3", "grid-2"] as const;

export type ViewMode = (typeof VIEW_MODES)[number];

export const DEFAULT_VIEW_MODE: ViewMode = "list";

export const isViewMode = (value: unknown): value is ViewMode =>
  typeof value === "string" && (VIEW_MODES as readonly string[]).includes(value);
