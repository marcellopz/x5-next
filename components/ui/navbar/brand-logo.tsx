import Link from "next/link";
import Image from "next/image";
// import { Badge } from "../ui/badge";

export function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="size-8 rounded-md overflow-hidden ring-1 ring-border">
        <Image
          src="/grilha_icon.png"
          alt="x5 Logo"
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-sm font-semibold tracking-tight">x5</div>
      {/* <Badge variant="secondary">2.0</Badge> */}
    </Link>
  );
}
