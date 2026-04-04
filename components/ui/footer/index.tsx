"use client";

import Link from "next/link";
import { Mail, MessageCircleMore } from "lucide-react";
import { useTranslations } from "@/lib/i18n/locale-context";

const contactLinks = [
  {
    href: "https://discord.com/users/173620782092517376",
    labelKey: "footer.discord",
    icon: MessageCircleMore,
    external: true,
  },
  {
    href: "mailto:marcellopz8@gmail.com",
    labelKey: "footer.email",
    icon: Mail,
    external: false,
  },
] as const;

const quickLinks = [
  { href: "/history", labelKey: "nav.history" },
  { href: "/player-list", labelKey: "nav.players" },
  { href: "/patch-notes", labelKey: "nav.patchNotes" },
] as const;

export function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/95">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 text-xs text-muted-foreground sm:gap-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <Link
              href="/"
              className="text-sm font-medium text-foreground transition-colors hover:text-foreground/80"
            >
              {t("footer.brand")}
            </Link>
            <p className="max-w-md leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <div className="space-y-1 sm:text-right">
              <p className="text-[11px] font-medium uppercase tracking-wide text-foreground/80">
                {t("footer.contact")}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-end">
                {contactLinks.map(({ href, labelKey, icon: Icon, external }) => (
                  <Link
                    key={labelKey}
                    href={href}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                    {...(external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{t(labelKey)}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-1 sm:text-right">
              <p className="text-[11px] font-medium uppercase tracking-wide text-foreground/80">
                {t("footer.explore")}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-end">
                {quickLinks.map(({ href, labelKey }) => (
                  <Link
                    key={href}
                    href={href}
                    className="transition-colors hover:text-foreground"
                  >
                    {t(labelKey)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-border/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p>{currentYear} {t("footer.copyright")}</p>
          <p>{t("footer.builtFor")}</p>
        </div>
      </div>
    </footer>
  );
}
