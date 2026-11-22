import Link from "next/link";

import { FOOTER_NAV_ITEMS } from "@/components/layout/nav-items";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { NAV_LABELS } from "@/lib/constants";
import { safeHref } from "@/lib/format/safe-href";
import { SITE_CONTENT_KEYS } from "@/features/site-content/config/keys";
import { getSiteText } from "@/features/site-content/lib/get-site-text";
import { getSiteContent } from "@/features/site-content/queries/get-site-content";

export async function Footer() {
  const content = await getSiteContent();
  const socials = [
    { label: "Facebook", value: getSiteText(content, SITE_CONTENT_KEYS.socialFacebook, "") },
    { label: "Instagram", value: getSiteText(content, SITE_CONTENT_KEYS.socialInstagram, "") },
    { label: "X", value: getSiteText(content, SITE_CONTENT_KEYS.socialX, "") },
  ].filter((item) => item.value.length > 0);
  const email = getSiteText(content, SITE_CONTENT_KEYS.email, "");
  const phone = getSiteText(content, SITE_CONTENT_KEYS.phone, "");
  const address = getSiteText(content, SITE_CONTENT_KEYS.address, "");
  const shippingNote = getSiteText(content, SITE_CONTENT_KEYS.shippingNote, "");

  return (
    <footer className="border-surface-800 bg-black-950 border-t py-12">
      <Container className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Logo />
          <p className="text-surface-400 text-sm">
            {getSiteText(content, SITE_CONTENT_KEYS.footerText, "")}
          </p>
          {socials.length ? (
            <div className="flex flex-wrap gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={safeHref(social.value, "#") ?? "#"}
                  className="text-surface-400 hover:text-accent text-xs font-bold tracking-widest uppercase"
                >
                  {social.label}
                </a>
              ))}
            </div>
          ) : null}
          {(email || phone || address || shippingNote) && (
            <div className="text-surface-400 space-y-1 text-xs">
              {email ? <a href={`mailto:${email}`}>{email}</a> : null}
              {phone ? <a href={`tel:${phone.replaceAll(" ", "")}`}>{phone}</a> : null}
              {address ? <p>{address}</p> : null}
              {shippingNote ? <p className="text-accent pt-2">{shippingNote}</p> : null}
            </div>
          )}
        </div>

        <nav aria-label={NAV_LABELS.footer} className="flex flex-wrap gap-x-6 gap-y-3">
          {FOOTER_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-surface-300 hover:text-accent text-sm font-bold tracking-[0.12em] uppercase"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
