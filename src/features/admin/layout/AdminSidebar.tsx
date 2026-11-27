import { ADMIN_NAV_ITEMS } from "@/features/admin/config/navigation";
import { AdminNavLink } from "@/features/admin/layout/AdminNavLink";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

type AdminSidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

export function AdminSidebar({ onNavigate, className }: AdminSidebarProps) {
  return (
    <aside className={className}>
      <div className="border-surface-800 flex h-16 items-center border-b px-5">
        <Link
          href={ROUTES.home}
          onClick={onNavigate}
          className="text-lg font-black tracking-tight text-white"
        >
          PC<span className="text-accent">{"//"}</span>STORE
        </Link>
      </div>
      <nav aria-label="Admin navigation" className="flex flex-col py-4">
        {ADMIN_NAV_ITEMS.map((item) => (
          <AdminNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </aside>
  );
}
