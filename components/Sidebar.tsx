"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/students", label: "All Students" },
  { href: "/students/add", label: "Add Student" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>🎓 MFI Students</h2>
        <p>Management System</p>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ href, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={active ? "active" : ""}>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => { window.location.href = "/api/logout"; }}>
          Logout
        </button>
      </div>
    </aside>
  );
}
