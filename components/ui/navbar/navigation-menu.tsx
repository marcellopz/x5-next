"use client";

import { NavLink } from "./nav-link";
import { useTranslations } from "@/lib/i18n/locale-context";

export function NavigationMenu() {
  const t = useTranslations();

  return (
    <nav className="hidden items-center gap-1 md:flex">
      <NavLink href="/history" label={t("nav.history")} />
      <NavLink href="/player-list" label={t("nav.players")} />
      <NavLink href="/patch-notes" label={t("nav.patchNotes")} />
      <NavLink href="/stats" label={t("nav.statistics")} />
    </nav>
  );
}
