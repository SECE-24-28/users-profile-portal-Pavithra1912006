import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { GraphQLError } from "graphql";

export interface GQLContext {
  userId?: number;
  role?: string;
}

function requireAuth(ctx: GQLContext) {
  if (!ctx.userId) throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHORIZED" } });
}

export const resolvers = {
  Query: {
    students: async (_: unknown, { search }: { search?: string }, ctx: GQLContext) => {
      requireAuth(ctx);
      const where = search
        ? { OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { course: { contains: search, mode: "insensitive" as const } },
          ]}
        : {};
      return prisma.student.findMany({ where, orderBy: { createdAt: "desc" } });
    },

    student: async (_: unknown, { id }: { id: number }, ctx: GQLContext) => {
      requireAuth(ctx);
      return prisma.student.findUnique({ where: { id } });
    },

    dashboardStats: async (_: unknown, __: unknown, ctx: GQLContext) => {
      requireAuth(ctx);
      const [total, recent] = await Promise.all([
        prisma.student.count(),
        prisma.student.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      ]);
      return { total, recent };
    },

    me: async (_: unknown, __: unknown, ctx: GQLContext) => {
      if (!ctx.userId) return null;
      return prisma.user.findUnique({ where: { id: ctx.userId } });
    },
  },

  Mutation: {
    login: async (_: unknown, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new GraphQLError("Invalid credentials");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new GraphQLError("Invalid credentials");
      const token = await signToken({ userId: user.id, email: user.email, role: user.role });
      return { token, user };
    },

    addStudent: async (
      _: unknown,
      args: { name: string; email: string; phone?: string; dob?: string; gender?: string; course: string; address?: string; imageUrl?: string },
      ctx: GQLContext
    ) => {
      requireAuth(ctx);
      const { dob, ...rest } = args;
      try {
        return await prisma.student.create({
          data: { ...rest, dob: dob ? new Date(dob) : null },
        });
      } catch (e: unknown) {
        const err = e as { code?: string };
        if (err.code === "P2002") throw new GraphQLError("Email already exists");
        throw new GraphQLError("Failed to create student");
      }
    },

    updateStudent: async (
      _: unknown,
      args: { id: number; name?: string; email?: string; phone?: string; dob?: string; gender?: string; course?: string; address?: string; imageUrl?: string },
      ctx: GQLContext
    ) => {
      requireAuth(ctx);
      const { id, dob, ...rest } = args;
      try {
        return await prisma.student.update({
          where: { id },
          data: { ...rest, ...(dob !== undefined ? { dob: dob ? new Date(dob) : null } : {}) },
        });
      } catch (e: unknown) {
        const err = e as { code?: string };
        if (err.code === "P2002") throw new GraphQLError("Email already exists");
        throw new GraphQLError("Failed to update student");
      }
    },

    deleteStudent: async (_: unknown, { id }: { id: number }, ctx: GQLContext) => {
      requireAuth(ctx);
      await prisma.student.delete({ where: { id } });
      return { success: true, id };
    },
  },

  Student: {
    createdAt: (s: { createdAt: Date }) => s.createdAt.toISOString(),
    dob: (s: { dob: Date | null }) => (s.dob ? s.dob.toISOString().split("T")[0] : null),
  },
};
