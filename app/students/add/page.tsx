"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ADD_STUDENT, GET_STUDENTS } from "@/lib/graphql/queries";
import ImageUpload from "@/components/ImageUpload";

export default function AddStudentPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [addStudent, { loading }] = useMutation(ADD_STUDENT, {
    refetchQueries: [{ query: GET_STUDENTS }],
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await addStudent({
        variables: {
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
      router.push("/students");
    } catch (err: unknown) {
      setError((err as Error).message ?? "Failed to add student");
    }
  }

  return (
    <div>
      <Link href="/students" className="back-link">← Back to Students</Link>

      <div className="page-header">
        <div>
          <h1>Add New Student</h1>
          <p>Fill in the details below</p>
        </div>
      </div>

      <div className="card">
        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <ImageUpload onUpload={setImageUrl} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" required placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" required placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" placeholder="+1 234 567 8900" />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input name="dob" type="date" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender">
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Course *</label>
              <input name="course" required placeholder="Computer Science" />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea name="address" rows={3} placeholder="123 Main St, City" />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => router.back()}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
