"use client";

import { createContext, useContext } from "react";

const AdminEnabledContext = createContext(false);

export function AdminEnabledProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <AdminEnabledContext.Provider value={enabled}>
      {children}
    </AdminEnabledContext.Provider>
  );
}

export function useAdminEnabled() {
  return useContext(AdminEnabledContext);
}
