import { requireAdmin } from "@/features/auth/lib/require-admin";

const OVERVIEW_CARDS = [
  { title: "Products", description: "Manage catalog items, pricing, and stock." },
  { title: "Categories", description: "Organize the store taxonomy." },
  { title: "Banners", description: "Control campaigns and home-page promos." },
  { title: "Orders", description: "Review and fulfil customer orders." },
] as const;

export async function AdminOverview() {
  const claims = await requireAdmin();

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-accent text-xs font-black tracking-[0.35em] uppercase">
          {"// CONTROL ROOM"}
        </p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">Overview</h1>
        <p className="text-surface-400 text-sm">
          Signed in as <span className="text-white">{claims.email ?? claims.sub}</span>
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {OVERVIEW_CARDS.map((card) => (
          <article
            key={card.title}
            className="border-surface-800 bg-surface-900/60 rounded-card border p-6"
          >
            <h2 className="text-lg font-black text-white">{card.title}</h2>
            <p className="text-surface-400 mt-2 text-sm leading-relaxed">{card.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
