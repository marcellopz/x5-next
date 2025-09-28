import { NavLink } from "./nav-link";

export function NavigationMenu() {
  return (
    <nav className="hidden items-center gap-1 xs:flex">
      <NavLink href="/history" label="History" />
      <NavLink href="/matchmaking" label="Matchmaking" />
      <NavLink href="/player-list" label="Player List" />
    </nav>
  );
}
