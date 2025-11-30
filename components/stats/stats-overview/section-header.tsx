import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  link: string;
}

export function SectionHeader({ title, link }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Link href={link} className="text-xs text-primary">
        View all
      </Link>
    </div>
  );
}
