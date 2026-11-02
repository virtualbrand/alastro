import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <Suspense>
        <LoginForm />
      </Suspense>

      {/* Coluna visual — apenas no desktop, para manter o formulário
          acima da dobra no mobile. */}
      <aside
        aria-hidden="true"
        className="relative hidden w-1/2 overflow-hidden bg-[var(--color-surface)] lg:block"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/time-alastro.jpg')" }}
        >
          {/* Mesmo véu discreto usado em /trabalhe-conosco */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </aside>
    </main>
  );
}
