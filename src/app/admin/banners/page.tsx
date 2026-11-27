import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/LinkButton";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminPanel } from "@/features/admin/components/AdminPanel";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { BannerSortControls } from "@/features/banners/components/admin/BannerSortControls";
import { BannerTable } from "@/features/banners/components/admin/BannerTable";
import { getAdminBanners } from "@/features/banners/queries/get-admin-banners";
import { HeroArtworkForm } from "@/features/site-content/components/admin/HeroArtworkForm";
import { getAdminSiteContent } from "@/features/site-content/queries/get-admin-site-content";

export default async function AdminBannersPage() {
  const [banners, content] = await Promise.all([getAdminBanners(), getAdminSiteContent()]);
  const newBannerAction = (
    <LinkButton href={ADMIN_ROUTES.bannerNew} size="sm">
      New banner
    </LinkButton>
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Hero & banners"
        description="Replace the storefront hero artwork, then schedule campaign banners."
        action={newBannerAction}
      />
      <AdminPanel
        title="Storefront hero artwork"
        description="The full-screen image on the home page. Upload a replacement or keep the default."
      >
        <HeroArtworkForm entries={content} />
      </AdminPanel>
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
