import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { BannerForm } from "@/features/banners/components/admin/BannerForm";
import { getAdminBanner } from "@/features/banners/queries/get-admin-banner";

type EditBannerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = await params;
  const banner = await getAdminBanner(id);

  if (!banner) notFound();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Edit banner"
        description={`Update the copy, timing, and artwork for "${banner.name}".`}
      />
      <BannerForm banner={banner} />
    </div>
  );
}
