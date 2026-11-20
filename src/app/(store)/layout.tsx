import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function StoreLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="min-h-[calc(100vh-8rem)] flex-1">{children}</main>
      <Footer />
    </div>
  );
}
