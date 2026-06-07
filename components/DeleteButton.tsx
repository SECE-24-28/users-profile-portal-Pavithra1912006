"use client";

import { deleteStudent } from "@/lib/student-actions";

export default function DeleteButton({ id }: { id: number }) {
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this student? This action cannot be undone.")) return;
    await deleteStudent(id);
  }

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
    >
      🗑 Delete
    </button>
  );
}
