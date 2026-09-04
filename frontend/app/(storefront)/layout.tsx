import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { Footer } from "@/components/storefront/footer";
import { Navbar } from "@/components/storefront/navbar";

export default function StorefrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
