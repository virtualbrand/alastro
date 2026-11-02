/** URL pública do site, sem barra final. Usada em metadados e JSON-LD. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://somosalastro.com"
).replace(/\/$/, "");

export const SITE_NAME = "Alastro";

/** Organização que presta os serviços, referenciada pelo JSON-LD. */
export const ORGANIZATION_JSON_LD = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.svg`,
  sameAs: ["https://www.youtube.com/@ProdutoraAlastro"],
} as const;
