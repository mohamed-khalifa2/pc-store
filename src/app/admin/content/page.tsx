import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminPanel } from "@/features/admin/components/AdminPanel";
import { HomeSectionTable } from "@/features/home/components/admin/HomeSectionTable";
import { SectionSortControls } from "@/features/home/components/admin/SectionSortControls";
import { getAdminHomeSections } from "@/features/home/queries/get-admin-home-sections";
import { HeroCopyForm } from "@/features/site-content/components/admin/HeroCopyForm";
import { ScrollStepsForm } from "@/features/site-content/components/admin/ScrollStepsForm";
import { getAdminSiteContent } from "@/features/site-content/queries/get-admin-site-content";

export default async function AdminContentPage() {
  const [sections, content] = await Promise.all([getAdminHomeSections(), getAdminSiteContent()]);

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Home & content"
        description="Arrange home page sections and edit the copy that powers the storefront."
      />
      <AdminPanel
        title="Home sections"
        description="Drag sections into order with the controls, then expand a section to edit its details."
      >
        <div className="space-y-8">
          <SectionSortControls sections={sections} />
          <HomeSectionTable sections={sections} />
        </div>
      </AdminPanel>
      <AdminPanel
        title="Hero copy"
        description="The headline and badge shown in the storefront hero."
      >
        <HeroCopyForm entries={content} />
      </AdminPanel>
      <AdminPanel
        title="Scroll story"
        description="Text for each step of the animated scroll experience."
      >
        <ScrollStepsForm entries={content} />
      </AdminPanel>
    </div>
  );
}
