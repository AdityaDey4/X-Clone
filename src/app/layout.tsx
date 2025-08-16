import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/providers/QueryProvider";
import { FollowProvider } from "./context/FollowContext";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <FollowProvider>
          <html lang="en">
            <body>{children}</body>
          </html>
        </FollowProvider>
      </QueryProvider>
    </ClerkProvider>
  );
}
