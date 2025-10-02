import { BrandLogo } from "./brand-logo";
import { NavigationMenu } from "./navigation-menu";
import { LanguageToggle } from "./language-toggle";
import { MobileMenuButton } from "./mobile-menu";
import { Button } from "../button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 w-full items-center gap-4 px-4">
        <BrandLogo />
        <NavigationMenu />
        <Button variant="highlight" size="xs">
          Create Match
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <LanguageToggle />
          <MobileMenuButton />
        </div>
      </div>
    </header>
  );
}
