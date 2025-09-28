import { BrandLogo } from "./brand-logo";
import { NavigationMenu } from "./navigation-menu";
import { LanguageToggle } from "./language-toggle";
import { MobileMenuButton } from "./mobile-menu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4">
        <BrandLogo />
        <NavigationMenu />
        <div className="ml-auto flex items-center gap-2">
          <LanguageToggle />
          <MobileMenuButton />
        </div>
      </div>
    </header>
  );
}
