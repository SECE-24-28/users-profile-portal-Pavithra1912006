"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION } from "@/lib/graphql/queries";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await login({ variables: { email: fd.get("email"), password: fd.get("password") } }) as { data: any };
      document.cookie = `auth-token=${data.login.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message ?? "Login failed");
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>🎓 MFI Students</h1>
        <p>Sign in to your account</p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" required defaultValue="admin@mfi.com" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" required placeholder="Enter password" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

      
      </div>
    </div>
  );
}
