import { createFileRoute } from "@tanstack/react-router";
import { PulsoReal } from "@/components/pulsoreal";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "Conversa com Lena | PulsoReal" },
      {
        name: "description",
        content:
          "Sua conversa com Lena: analise a liquidez e as dívidas da amostra fictícia Plaid Sandbox, antes de decidir.",
      },
      { property: "og:title", content: "Conversa com Lena | PulsoReal" },
      {
        property: "og:description",
        content:
          "Decisões financeiras em perspectiva, com histórico local e dados fictícios em USD.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ThreadPage,
});
function ThreadPage() {
  const { threadId } = Route.useParams();
  return <PulsoReal threadId={threadId} />;
}
