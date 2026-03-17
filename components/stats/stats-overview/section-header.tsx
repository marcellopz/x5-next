import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  link: string;
  linkText?: string;
}

export function SectionHeader({ title, link, linkText = "View all" }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Link href={link} className="text-xs text-primary">
        {linkText}
      </Link>
    </div>
  );
}
