import { NavLink } from "./nav-link";

export function NavigationMenu() {
  return (
    <nav className="hidden items-center gap-1 md:flex">
      <NavLink href="/history" label="History" />
      <NavLink href="/player-list" label="Players" />
      <NavLink href="/patch-notes" label="Patch Notes" />
      <NavLink href="/stats" label="Statistics" />
    </nav>
  );
}
