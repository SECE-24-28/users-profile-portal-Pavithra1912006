import type { Metadata } from "next";
import "./globals.css";
import ApolloProviderWrapper from "@/components/ApolloProvider";

export const metadata: Metadata = {
  title: "MFI Student Management",
  description: "Student Profile Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
      </body>
    </html>
  );
}
