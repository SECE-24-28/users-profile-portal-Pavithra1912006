"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { GET_DASHBOARD_STATS, GET_ME } from "@/lib/graphql/queries";

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  createdAt: string;
}

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: stats, loading } = useQuery(GET_DASHBOARD_STATS) as { data: any; loading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: me } = useQuery(GET_ME) as { data: any };

  const total = stats?.dashboardStats?.total ?? 0;
  const recent: Student[] = stats?.dashboardStats?.recent ?? [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome, {me?.me?.email ?? "..."}</p>
        </div>
        <Link href="/students/add" className="btn btn-primary">+ Add Student</Link>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{loading ? "..." : total}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{loading ? "..." : recent.length}</div>
          <div className="stat-label">Recent Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{loading ? "..." : new Set(recent.map((s) => s.course)).size}</div>
          <div className="stat-label">Courses</div>
        </div>
      </div>

      {/* Quick Actions */}
      <p className="section-title">Quick Actions</p>
      <div className="quick-actions">
        <Link href="/students/add" className="quick-action"><span>➕</span>Add Student</Link>
        <Link href="/students" className="quick-action"><span>👥</span>All Students</Link>
        <Link href="/students" className="quick-action"><span>🔍</span>Search</Link>
        <Link href="/students" className="quick-action"><span>📋</span>Reports</Link>
      </div>

      {/* Recent Students */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p className="section-title" style={{ margin: 0 }}>Recently Added</p>
        <Link href="/students" style={{ fontSize: 13 }}>View all</Link>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : recent.length === 0 ? (
          <div className="empty-state">
            <p>No students yet. <Link href="/students/add">Add one now</Link></p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td><span className="badge">{s.course}</span></td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td><Link href={`/students/${s.id}`} className="btn btn-sm btn-secondary">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
