import type { ReactNode } from "react";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="bg-black-950 min-h-screen">{children}</div>;
}
