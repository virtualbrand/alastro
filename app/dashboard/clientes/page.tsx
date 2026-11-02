import { ClientsList } from "@/components/dashboard/ClientsList";
import { getUserPreference } from "@/lib/preferences";
import { DEFAULT_VIEW_MODE, isViewMode } from "@/lib/view-mode";

export default async function DashboardClientsPage() {
  // A visualização é do usuário: lida no servidor para a página já abrir no modo certo.
  const saved = await getUserPreference("clients.view");

  return (
    <ClientsList initialView={isViewMode(saved) ? saved : DEFAULT_VIEW_MODE} />
  );
}
