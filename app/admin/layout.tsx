import { isAdminEnabled } from "@/lib/admin-auth";
import { AdminEnabledProvider } from "./admin-enabled-context";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminEnabledProvider enabled={isAdminEnabled()}>
      {children}
    </AdminEnabledProvider>
  );
}
