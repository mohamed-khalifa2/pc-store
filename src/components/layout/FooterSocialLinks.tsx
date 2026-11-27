import { SocialIcon, type SocialIconName } from "@/components/ui/icons/SocialIcon";
import { FOOTER_LABELS } from "@/lib/constants";

type FooterSocial = {
  label: string;
  href: string;
  icon: SocialIconName;
};

export function FooterSocialLinks({ socials }: { socials: readonly FooterSocial[] }) {
  if (socials.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${FOOTER_LABELS.visit} ${social.label}`}
          className="border-surface-700 bg-surface-900/60 text-surface-300 hover:border-accent hover:text-accent inline-flex size-10 items-center justify-center rounded-full border transition-colors duration-[var(--duration-normal)]"
        >
          <SocialIcon name={social.icon} />
        </a>
      ))}
    </div>
  );
}
