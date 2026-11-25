import { createFileRoute } from "@tanstack/react-router";
import { PulsoReal } from "@/components/pulsoreal";

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PulsoReal | Seu caixa com Lena" },
      {
        name: "description",
        content:
          "Copiloto de decisão financeira para autônomos e MEIs. Explore liquidez e dívidas com Lena em uma demonstração local Plaid Sandbox.",
      },
      { property: "og:title", content: "PulsoReal | Seu caixa com Lena" },
      {
        property: "og:description",
        content:
          "Clareza antes de assumir um compromisso financeiro. Demonstração educacional com dados fictícios.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <PulsoReal />;
}
