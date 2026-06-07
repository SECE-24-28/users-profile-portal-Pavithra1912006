"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { GET_STUDENTS } from "@/lib/graphql/queries";

interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
  course: string;
  gender?: string;
  createdAt: string;
}

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, loading } = useQuery(GET_STUDENTS, { variables: { search: search || undefined } }) as { data: any; loading: boolean };
  const students: Student[] = data?.students ?? [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>{students.length} student{students.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="search-bar">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or course..."
            style={{ width: 260 }}
          />
          <Link href="/students/add" className="btn btn-primary">+ Add Student</Link>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 40 }}>👤</div>
            <p>{search ? `No results for "${search}"` : "No students yet."}</p>
            {!search && <p><Link href="/students/add">Add your first student</Link></p>}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Course</th>
                <th>Gender</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td style={{ color: "#999", fontSize: 12 }}>{s.id}</td>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.email}</td>
                  <td>{s.phone ?? "—"}</td>
                  <td><span className="badge">{s.course}</span></td>
                  <td>{s.gender ?? "—"}</td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link href={`/students/${s.id}`} className="btn btn-sm btn-secondary" style={{ marginRight: 6 }}>View</Link>
                    <Link href={`/students/edit/${s.id}`} className="btn btn-sm btn-secondary">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
