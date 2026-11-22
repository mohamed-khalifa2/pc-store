import { LinkButton } from "@/components/ui/LinkButton";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminPanel } from "@/features/admin/components/AdminPanel";
import { OverviewStats } from "@/features/admin/components/OverviewStats";
import { RecentOrdersTable } from "@/features/admin/components/RecentOrdersTable";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { getAdminOverview } from "@/features/admin/queries/get-admin-overview";

export default async function AdminPage() {
  const data = await getAdminOverview();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Overview"
        description="Today's orders, revenue, stock pressure, and the latest store activity."
        action={
          <LinkButton href={ADMIN_ROUTES.banners} variant="secondary" size="sm">
            Manage banners
          </LinkButton>
        }
      />
      <div className="space-y-8">
        <OverviewStats data={data} />
        <AdminPanel title="Recent orders" description="The five most recently placed orders.">
          <RecentOrdersTable orders={data.recentOrders} />
        </AdminPanel>
      </div>
    </div>
  );
}
