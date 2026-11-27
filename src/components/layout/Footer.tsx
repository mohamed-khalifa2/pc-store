import Link from "next/link";

import { FooterSocialLinks } from "@/components/layout/FooterSocialLinks";
import { FOOTER_NAV_ITEMS } from "@/components/layout/nav-items";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { FOOTER_LABELS, NAV_LABELS } from "@/lib/constants";
import { safeHref } from "@/lib/format/safe-href";
import { SITE_CONTENT_KEYS } from "@/features/site-content/config/keys";
import { SOCIAL_LINKS } from "@/features/site-content/config/socials";
import { getSiteText } from "@/features/site-content/lib/get-site-text";
import { getSiteContent } from "@/features/site-content/queries/get-site-content";

const FALLBACK_HREF = "#";

export async function Footer() {
  const content = await getSiteContent();
  const socials = SOCIAL_LINKS.flatMap((social) => {
    const value = getSiteText(content, social.key, "");
    const href = safeHref(value, FALLBACK_HREF);
    return href === FALLBACK_HREF ? [] : [{ label: social.label, icon: social.icon, href }];
  });
  const email = getSiteText(content, SITE_CONTENT_KEYS.email, "");
  const phone = getSiteText(content, SITE_CONTENT_KEYS.phone, "");
  const address = getSiteText(content, SITE_CONTENT_KEYS.address, "");
  const shippingNote = getSiteText(content, SITE_CONTENT_KEYS.shippingNote, "");

  return (
    <footer className="border-surface-800 bg-black-950 relative border-t py-16">
      <div className="from-accent/40 via-accent/5 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent" />
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-5">
            <Logo />
            <p className="text-surface-400 max-w-sm text-sm leading-relaxed">
              {getSiteText(content, SITE_CONTENT_KEYS.footerText, "")}
            </p>
            {socials.length > 0 && (
              <div className="space-y-3">
                <p className="text-surface-400 text-xs font-black tracking-[0.2em] uppercase">
                  {FOOTER_LABELS.follow}
                </p>
                <FooterSocialLinks socials={socials} />
              </div>
            )}
          </div>

          <nav aria-label={NAV_LABELS.footer}>
            <p className="text-surface-400 mb-5 text-xs font-black tracking-[0.2em] uppercase">
              {FOOTER_LABELS.explore}
            </p>
            <ul className="space-y-3">
              {FOOTER_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group text-surface-300 hover:text-accent inline-flex items-center gap-3 text-sm font-bold tracking-[0.08em] uppercase transition-colors"
                  >
                    <span
                      aria-hidden="true"
                      className="bg-surface-700 group-hover:bg-accent size-1.5 rounded-full transition-colors"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-surface-400 mb-5 text-xs font-black tracking-[0.2em] uppercase">
              {FOOTER_LABELS.contact}
            </p>
            <div className="text-surface-400 space-y-2 text-sm">
              {email ? (
                <a href={`mailto:${email}`} className="hover:text-accent block transition-colors">
                  {email}
                </a>
              ) : null}
              {phone ? (
                <a
                  href={`tel:${phone.replaceAll(" ", "")}`}
                  className="hover:text-accent block transition-colors"
                >
                  {phone}
                </a>
              ) : null}
              {address ? <p>{address}</p> : null}
              {shippingNote ? (
                <p className="border-accent/40 bg-accent/5 text-accent mt-4 rounded-lg border p-3 text-xs leading-relaxed">
                  {shippingNote}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
