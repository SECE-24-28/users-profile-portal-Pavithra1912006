import Sidebar from "@/components/Sidebar";

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">{children}</div>
    </div>
  );
}
