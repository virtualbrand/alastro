import { CasesList } from "@/components/dashboard/CasesList";
import { getUserPreference } from "@/lib/preferences";
import { DEFAULT_VIEW_MODE, isViewMode } from "@/lib/view-mode";

export default async function DashboardCasesPage() {
  // A visualização é do usuário: lida no servidor para a página já abrir no modo certo.
  const saved = await getUserPreference("cases.view");

  return (
    <CasesList initialView={isViewMode(saved) ? saved : DEFAULT_VIEW_MODE} />
  );
}
