import Link from "next/link";

import { ROUTES, SITE_NAME } from "@/lib/constants";

const MARK = SITE_NAME.slice(0, 2);
const WORDMARK = SITE_NAME.slice(2);

export function Logo() {
  return (
    <Link
      href={ROUTES.home}
      aria-label={`${SITE_NAME} home`}
      className="group inline-flex items-center gap-3"
    >
      <span
        aria-hidden="true"
        className="bg-accent text-black-950 grid size-9 place-items-center rounded-lg text-xs font-black transition-transform duration-[var(--duration-normal)] group-hover:-rotate-6"
      >
        {MARK}
      </span>
      <span className="group-hover:text-accent text-lg font-black tracking-[0.18em] text-white uppercase transition-colors">
        {WORDMARK}
      </span>
    </Link>
  );
}
