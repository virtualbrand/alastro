"use client";

import { ExpandableSearch } from "@/components/ui/expandable-search";
import { FilterPopover } from "@/components/ui/filter-popover";
import { CLIENT_TYPES } from "@/types/client";
import type { ClientType } from "@/types/client";

interface ClientsToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  types: ClientType[];
  onTypesChange: (types: ClientType[]) => void;
}

/** Busca e filtro por tipo da lista de clientes. Nenhum tipo marcado = todos. */
export const ClientsToolbar = ({
  query,
  onQueryChange,
  types,
  onTypesChange,
}: ClientsToolbarProps) => (
  <div className="flex items-center gap-2">
    <ExpandableSearch
      value={query}
      onChange={onQueryChange}
      placeholder="Buscar por nome"
      label="Buscar cliente"
    />
    <FilterPopover
      groups={[
        {
          id: "type",
          label: "Tipo de cliente",
          options: CLIENT_TYPES.map(({ value, label }) => ({ value, label })),
          selected: types,
          onChange: (selected) => onTypesChange(selected as ClientType[]),
        },
      ]}
    />
  </div>
);
