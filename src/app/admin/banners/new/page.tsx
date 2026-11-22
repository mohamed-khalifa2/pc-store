import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { BannerForm } from "@/features/banners/components/admin/BannerForm";

export default function NewBannerPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="New banner"
        description="Create a campaign for the storefront, cart, or checkout."
      />
      <BannerForm />
    </div>
  );
}
