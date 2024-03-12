import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <div className="grid min-h-screen-minus-header grid-cols-1 lg:grid-cols-12">
        <DashboardSidebar />
        {children}
      </div>
    </>
  );
}
