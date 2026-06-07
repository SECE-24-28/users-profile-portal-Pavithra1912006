import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">{children}</div>
    </div>
  );
}
