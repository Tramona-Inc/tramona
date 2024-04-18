import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import AdminPropertyForm from "@/components/admin/AdminPropertyForm";

export default function propertyUpload() {
  return (
    <DashboadLayout type="admin">
      <AdminPropertyForm />
    </DashboadLayout>
  );
}
