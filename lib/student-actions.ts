"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export type StudentFormData = {
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  course: string;
  address?: string;
  imageUrl?: string;
};

export async function addStudent(formData: FormData) {
  const data = extractStudentData(formData);
  const imageUrl = formData.get("imageUrl") as string | null;

  try {
    await prisma.student.create({
      data: {
        ...data,
        dob: data.dob ? new Date(data.dob) : null,
        imageUrl: imageUrl || null,
      },
    });
  } catch (e: unknown) {
    const error = e as { code?: string };
    if (error.code === "P2002") return { error: "Email already exists" };
    return { error: "Failed to add student" };
  }

  revalidatePath("/students");
  redirect("/students");
}

export async function updateStudent(id: number, formData: FormData) {
  const data = extractStudentData(formData);
  const imageUrl = formData.get("imageUrl") as string | null;

  try {
    await prisma.student.update({
      where: { id },
      data: {
        ...data,
        dob: data.dob ? new Date(data.dob) : null,
        ...(imageUrl && { imageUrl }),
      },
    });
  } catch (e: unknown) {
    const error = e as { code?: string };
    if (error.code === "P2002") return { error: "Email already exists" };
    return { error: "Failed to update student" };
  }

  revalidatePath("/students");
  revalidatePath(`/students/${id}`);
  redirect(`/students/${id}`);
}

export async function deleteStudent(id: number) {
  await prisma.student.delete({ where: { id } });
  revalidatePath("/students");
  redirect("/students");
}

export async function getStudents(search?: string) {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { course: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  return prisma.student.findMany({ where, orderBy: { createdAt: "desc" } });
}

export async function getStudent(id: number) {
  return prisma.student.findUnique({ where: { id } });
}

export async function getDashboardStats() {
  const [total, recent] = await Promise.all([
    prisma.student.count(),
    prisma.student.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  return { total, recent };
}

function extractStudentData(formData: FormData): StudentFormData {
  return {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || undefined,
    dob: (formData.get("dob") as string) || undefined,
    gender: (formData.get("gender") as string) || undefined,
    course: formData.get("course") as string,
    address: (formData.get("address") as string) || undefined,
  };
}
