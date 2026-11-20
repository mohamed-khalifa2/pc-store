import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="bg-accent/10 pointer-events-none absolute -top-48 right-0 h-96 w-96 rounded-full blur-3xl" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="text-accent text-xs font-black tracking-[0.35em] uppercase">{eyebrow}</p>
          <h1 className="text-5xl leading-[0.95] font-black tracking-tight text-white sm:text-7xl">
            {title}
          </h1>
          <p className="text-surface-400 max-w-md text-base leading-relaxed">{description}</p>
          <div className="border-accent-strong text-surface-400 max-w-md border-l-2 pl-4 text-sm">
            {footer}
          </div>
        </div>

        <div className="border-surface-800 bg-surface-900/60 w-full max-w-md justify-self-end rounded-[var(--radius-card)] border p-6 sm:p-8">
          {children}
        </div>
      </div>
    </section>
  );
}
