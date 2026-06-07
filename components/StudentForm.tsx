"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";

interface Student {
  id?: number;
  name: string;
  email: string;
  phone?: string | null;
  dob?: Date | null;
  gender?: string | null;
  course: string;
  address?: string | null;
  imageUrl?: string | null;
}

interface StudentFormProps {
  student?: Student;
  action: (formData: FormData) => Promise<{ error?: string } | undefined | void>;
}

export default function StudentForm({ student, action }: StudentFormProps) {
  const [imageUrl, setImageUrl] = useState(student?.imageUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.set("imageUrl", imageUrl);
    const result = await action(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  const dobValue = student?.dob
    ? new Date(student.dob).toISOString().split("T")[0]
    : "";

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Profile Image */}
      <div className="flex justify-center">
        <ImageUpload currentImage={student?.imageUrl} onUpload={setImageUrl} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            name="name"
            defaultValue={student?.name}
            required
            placeholder="John Doe"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            name="email"
            type="email"
            defaultValue={student?.email}
            required
            placeholder="john@example.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            name="phone"
            defaultValue={student?.phone ?? ""}
            placeholder="+1 234 567 8900"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            name="dob"
            type="date"
            defaultValue={dobValue}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            defaultValue={student?.gender ?? ""}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
          <input
            name="course"
            defaultValue={student?.course}
            required
            placeholder="Computer Science"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            name="address"
            defaultValue={student?.address ?? ""}
            rows={3}
            placeholder="123 Main St, City, Country"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {loading ? "Saving..." : student ? "Update Student" : "Add Student"}
        </button>
      </div>
    </form>
  );
}
