import { getLocale, getTranslations, t } from "@/lib/i18n";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

  if (projectId !== "x5-season-3") {
    const locale = await getLocale();
    const trans = getTranslations(locale);
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg border border-destructive bg-destructive/5 p-6">
            <h1 className="text-2xl font-bold text-destructive mb-2">
              {t(trans, "admin.configError")}
            </h1>
            <p className="text-destructive">
              {t(trans, "admin.invalidConfig")} {projectId || t(trans, "admin.notSet")}
            </p>
          </div>
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
}
