import Link from "next/link";

import { ROUTES, SITE_NAME } from "@/lib/constants";

export function Logo() {
  return (
    <Link
      href={ROUTES.home}
      aria-label={`${SITE_NAME} home`}
      className="hover:text-accent focus-visible:text-accent text-xl font-black tracking-[0.18em] text-white uppercase transition-colors"
    >
      PC<span className="text-accent">{"//"}</span>STORE
    </Link>
  );
}
