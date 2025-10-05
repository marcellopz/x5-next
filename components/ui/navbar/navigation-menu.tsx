import { NavLink } from "./nav-link";

export function NavigationMenu() {
  return (
    <nav className="hidden items-center gap-1 xs:flex">
      <NavLink href="/history" label="History" />
      <NavLink href="/player-list" label="Player List" />
      <NavLink href="/patch-notes" label="Patch Notes" />
      <NavLink href="/stats" label="Statistics" />
    </nav>
  );
}
