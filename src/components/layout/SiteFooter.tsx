import Link from "next/link";
import { getTenant } from "@/lib/tenant";
import { Logo } from "./Logo";

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X / Twitter",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
};

export function SiteFooter() {
  const { brand, copy, footerGroups, social } = getTenant();
  const socialEntries = Object.entries(social).filter(([, url]) => Boolean(url));
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Logo />
            <p className="site-footer__tagline">{copy.footerTagline}</p>
            {socialEntries.length ? (
              <ul className="site-footer__social">
                {socialEntries.map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url as string}
                      target="_blank"
                      rel="noreferrer"
                      className="site-footer__social-link"
                    >
                      {SOCIAL_LABELS[key] || key}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {footerGroups.length ? (
            <div className="site-footer__groups">
              {footerGroups.map((group) => (
                <div key={group.title} className="site-footer__group">
                  <p className="site-footer__group-title">{group.title}</p>
                  <ul className="site-footer__group-links">
                    {group.links.map((link) => (
                      <li key={`${link.label}:${link.href}`}>
                        <Link href={link.href} className="site-footer__link">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="site-footer__bottom">
          <p>
            © {year} {brand.name}
          </p>
          <p>{brand.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
