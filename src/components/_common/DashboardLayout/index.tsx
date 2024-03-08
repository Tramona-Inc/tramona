import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <div className="grid min-h-[calc(100vh-4.5rem)] grid-cols-1 lg:grid-cols-12">
        <DashboardSidebar />
        {children}
      </div>
    </>
  );
}
