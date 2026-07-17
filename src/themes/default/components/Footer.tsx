import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { siteHref } from "@/lib/paths";
import { getTenant } from "@/lib/tenant";

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X / Twitter",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
};

async function resolveFooterHref(href: string): Promise<string> {
  const raw = String(href || "").trim();
  if (!raw) return "/";
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("mailto:") || raw.startsWith("tel:")) {
    return raw;
  }
  return siteHref(raw);
}

/** Shared footer — contact + link columns; colors from theme.tokens. */
export default async function Footer() {
  const { brand, copy, footerGroups, footerContact, social } = await getTenant();
  const socialEntries = Object.entries(social).filter(([, url]) => Boolean(url));
  const year = new Date().getFullYear();

  const addressLines = (footerContact?.addressLines || [])
    .map((l) => String(l || "").trim())
    .filter(Boolean);
  const hours = (footerContact?.hours || [])
    .map((l) => String(l || "").trim())
    .filter(Boolean);
  const email = String(footerContact?.email || "").trim();
  const phone = String(footerContact?.phone || "").trim();
  const hasContact =
    addressLines.length > 0 || Boolean(email) || Boolean(phone) || hours.length > 0;

  const resolvedGroups = await Promise.all(
    (footerGroups || []).map(async (group) => ({
      title: group.title,
      links: await Promise.all(
        (group.links || []).map(async (link) => ({
          ...link,
          href: await resolveFooterHref(link.href),
        }))
      ),
    }))
  );

  return (
    <footer className="site-footer theme-footer">
      <div className="site-footer__inner mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Logo />
            {copy.footerTagline ? (
              <p className="site-footer__tagline">{copy.footerTagline}</p>
            ) : null}

            {hasContact ? (
              <div className="site-footer__contact">
                {addressLines.length ? (
                  <p className="site-footer__contact-block">
                    {addressLines.map((line) => (
                      <span key={line} className="site-footer__contact-line">
                        {line}
                      </span>
                    ))}
                  </p>
                ) : null}
                {email ? (
                  <p className="site-footer__contact-line">
                    Email:{" "}
                    <a href={`mailto:${email}`} className="site-footer__link">
                      {email}
                    </a>
                  </p>
                ) : null}
                {phone ? (
                  <p className="site-footer__contact-line">
                    Phone:{" "}
                    <a
                      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                      className="site-footer__link"
                    >
                      {phone}
                    </a>
                  </p>
                ) : null}
                {hours.map((line) => (
                  <p key={line} className="site-footer__contact-line">
                    {line}
                  </p>
                ))}
              </div>
            ) : null}

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

          {resolvedGroups.length ? (
            <div className="site-footer__groups">
              {resolvedGroups.map((group, groupIndex) => (
                <div
                  key={group.title || `footer-group-${groupIndex}`}
                  className="site-footer__group"
                >
                  {group.title ? (
                    <p className="site-footer__group-title">{group.title}</p>
                  ) : null}
                  <ul className="site-footer__group-links">
                    {group.links.map((link) => (
                      <li key={`${link.label}:${link.href}`}>
                        {link.href.startsWith("http") ||
                        link.href.startsWith("mailto:") ||
                        link.href.startsWith("tel:") ? (
                          <a href={link.href} className="site-footer__link">
                            {link.label}
                          </a>
                        ) : (
                          <Link href={link.href} className="site-footer__link">
                            {link.label}
                          </Link>
                        )}
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
            {brand.alternateName ? ` · ${brand.alternateName}` : ""}
          </p>
          <p>{brand.tagline || "Powered By OneChannelAdmin"}</p>
        </div>
      </div>
    </footer>
  );
}
