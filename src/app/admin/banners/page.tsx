import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/LinkButton";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminPanel } from "@/features/admin/components/AdminPanel";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { BannerSortControls } from "@/features/banners/components/admin/BannerSortControls";
import { BannerTable } from "@/features/banners/components/admin/BannerTable";
import { getAdminBanners } from "@/features/banners/queries/get-admin-banners";

export default async function AdminBannersPage() {
  const banners = await getAdminBanners();
  const newBannerAction = (
    <LinkButton href={ADMIN_ROUTES.bannerNew} size="sm">
      New banner
    </LinkButton>
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Banners"
        description="Schedule campaigns, swap artwork, and choose where promotions appear."
        action={newBannerAction}
      />
      <AdminPanel title="All banners" description="Every campaign, ordered by display position.">
        {banners.length === 0 ? (
          <EmptyState
            title="No banners yet"
            description="Create your first campaign to start promoting builds."
            action={newBannerAction}
          />
        ) : (
          <BannerTable banners={banners} />
        )}
      </AdminPanel>
      {banners.length > 1 ? (
        <AdminPanel
          title="Display order"
          description="Move banners up or down, then save the order."
        >
          <BannerSortControls banners={banners} />
        </AdminPanel>
      ) : null}
    </div>
  );
}
