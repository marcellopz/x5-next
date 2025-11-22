// Admin layout - protection is handled by middleware
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

  if (projectId !== "x5-season-3") {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg border border-destructive bg-destructive/5 p-6">
            <h1 className="text-2xl font-bold text-destructive mb-2">
              Configuration Error
            </h1>
            <p className="text-destructive">
              Invalid project configuration. NEXT_PUBLIC_PROJECT_ID must be set
              to &quot;x5-season-3&quot;. Current value:{" "}
              {projectId || "not set"}
            </p>
          </div>
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
}
