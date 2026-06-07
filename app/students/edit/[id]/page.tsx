"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GET_STUDENT, UPDATE_STUDENT, GET_STUDENTS } from "@/lib/graphql/queries";
import ImageUpload from "@/components/ImageUpload";

interface Student {
  id: number; name: string; email: string; phone?: string;
  dob?: string; gender?: string; course: string; address?: string; imageUrl?: string;
}

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, loading } = useQuery(GET_STUDENT, { variables: { id: Number(id) } }) as { data: any; loading: boolean };
  const [updateStudent, { loading: saving }] = useMutation(UPDATE_STUDENT, {
    refetchQueries: [{ query: GET_STUDENTS }, { query: GET_STUDENT, variables: { id: Number(id) } }],
  });
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const s: Student = data?.student;

  useEffect(() => { if (s?.imageUrl) setImageUrl(s.imageUrl); }, [s]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!s) return <div className="loading">Student not found.</div>;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await updateStudent({
        variables: {
          id: Number(id),
          name: fd.get("name") as string,
          email: fd.get("email") as string,
          phone: (fd.get("phone") as string) || null,
          dob: (fd.get("dob") as string) || null,
          gender: (fd.get("gender") as string) || null,
          course: fd.get("course") as string,
          address: (fd.get("address") as string) || null,
          imageUrl: imageUrl || null,
        },
      });
      router.push(`/students/${id}`);
    } catch (err: unknown) {
      setError((err as Error).message ?? "Failed to update student");
    }
  }

  const dobValue = s.dob ? new Date(s.dob).toISOString().split("T")[0] : "";

  return (
    <div>
      <Link href={`/students/${id}`} className="back-link">← Back to Profile</Link>

      <div className="page-header">
        <div>
          <h1>Edit Student</h1>
          <p>Updating: {s.name}</p>
        </div>
      </div>

      <div className="card">
        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <ImageUpload currentImage={s.imageUrl} onUpload={setImageUrl} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" required defaultValue={s.name} />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" required defaultValue={s.email} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" defaultValue={s.phone ?? ""} />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input name="dob" type="date" defaultValue={dobValue} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" defaultValue={s.gender ?? ""}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Course *</label>
              <input name="course" required defaultValue={s.course} />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea name="address" rows={3} defaultValue={s.address ?? ""} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => router.back()}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Update Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
