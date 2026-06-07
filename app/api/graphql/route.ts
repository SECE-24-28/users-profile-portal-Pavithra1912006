import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/lib/graphql/typeDefs";
import { resolvers, GQLContext } from "@/lib/graphql/resolvers";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const server = new ApolloServer<GQLContext>({ typeDefs, resolvers });

const apolloHandler = startServerAndCreateNextHandler<NextRequest, GQLContext>(server, {
  context: async (req) => {
    const authHeader = req.headers.get("authorization") ?? "";
    const cookieHeader = req.headers.get("cookie") ?? "";

    let token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      const match = cookieHeader.match(/auth-token=([^;]+)/);
      token = match?.[1] ?? null;
    }
    if (!token) return {};
    const payload = await verifyToken(token);
    return payload ? { userId: payload.userId, role: payload.role } : {};
  },
});

async function handler(req: NextRequest): Promise<NextResponse> {
  return apolloHandler(req) as Promise<NextResponse>;
}

export { handler as GET, handler as POST };
