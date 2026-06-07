"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GET_STUDENT, DELETE_STUDENT, GET_STUDENTS } from "@/lib/graphql/queries";

interface Student {
  id: number; name: string; email: string; phone?: string;
  dob?: string; gender?: string; course: string; address?: string;
  imageUrl?: string; createdAt: string;
}

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, loading } = useQuery(GET_STUDENT, { variables: { id: Number(id) } }) as { data: any; loading: boolean };
  const [deleteStudent] = useMutation(DELETE_STUDENT, { refetchQueries: [{ query: GET_STUDENTS }] });

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this student?")) return;
    await deleteStudent({ variables: { id: Number(id) } });
    router.push("/students");
  }

  if (loading) return <div className="loading">Loading...</div>;

  const s: Student = data?.student;
  if (!s) return <div className="loading">Student not found.</div>;

  return (
    <div>
      <Link href="/students" className="back-link">← Back to Students</Link>

      <div className="page-header">
        <h1>Student Profile</h1>
        <div>
          <Link href={`/students/edit/${s.id}`} className="btn btn-primary" style={{ marginRight: 8 }}>Edit</Link>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="profile-banner"></div>
        <div style={{ position: "relative" }}>
          <div className="profile-avatar">
            {s.imageUrl ? <img src={s.imageUrl} alt={s.name} /> : s.name[0]}
          </div>
        </div>
        <div className="profile-info">
          <div className="profile-name">{s.name}</div>
          <div className="profile-course">{s.course}</div>
        </div>

        <div className="detail-grid">
          <dl className="detail-item"><dt>Student ID</dt><dd>#{s.id}</dd></dl>
          <dl className="detail-item"><dt>Email</dt><dd>{s.email}</dd></dl>
          <dl className="detail-item"><dt>Phone</dt><dd>{s.phone ?? "Not provided"}</dd></dl>
          <dl className="detail-item"><dt>Date of Birth</dt><dd>{s.dob ? new Date(s.dob).toLocaleDateString() : "Not provided"}</dd></dl>
          <dl className="detail-item"><dt>Gender</dt><dd>{s.gender ?? "Not provided"}</dd></dl>
          <dl className="detail-item"><dt>Course</dt><dd>{s.course}</dd></dl>
          <dl className="detail-item"><dt>Address</dt><dd>{s.address ?? "Not provided"}</dd></dl>
          <dl className="detail-item"><dt>Joined</dt><dd>{new Date(s.createdAt).toLocaleDateString()}</dd></dl>
        </div>
      </div>
    </div>
  );
}
