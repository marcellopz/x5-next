import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocale, getTranslations, t } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getLocale();
  const trans = getTranslations(locale);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">{t(trans, "error.notFoundCode")}</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {t(trans, "error.pageNotFound")}
          </h2>
        </div>

        <div className="space-y-4">
          <Button>
            <Link href="/">{t(trans, "error.returnHome")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
