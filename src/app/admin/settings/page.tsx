import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminPanel } from "@/features/admin/components/AdminPanel";
import { SiteSettingsForm } from "@/features/site-content/components/admin/SiteSettingsForm";
import { getAdminSiteContent } from "@/features/site-content/queries/get-admin-site-content";

export default async function AdminSettingsPage() {
  const content = await getAdminSiteContent();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Site settings"
        description="Manage store identity, contact details, social links, footer copy, and SEO metadata."
      />
      <AdminPanel
        title="Configuration"
        description="Values fall back to the built-in defaults until you save your own."
      >
        <SiteSettingsForm entries={content} />
      </AdminPanel>
    </div>
  );
}
