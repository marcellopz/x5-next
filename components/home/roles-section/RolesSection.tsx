"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RoleKey } from "./roleMeta";
import MapWithRoleTabs from "./MapWithRoleTabs";
import RoleStatsPane from "./RoleStatsPane";
import { CollapsibleSection } from "@/components/ui/collapsible-section";

export interface RolesSectionProps {
  initialRole?: RoleKey;
  miniStats?: Array<{ title: string; value: string | number }>;
}

export function RolesSection({
  initialRole = "mid",
  miniStats,
}: RolesSectionProps) {
  const [activeRole, setActiveRole] = useState<RoleKey>(initialRole);
  const [userSelected, setUserSelected] = useState<boolean>(false);

  // Cycle roles every 10 seconds in a fixed order
  useEffect(() => {
    if (userSelected) return;
    const roleOrder: RoleKey[] = ["top", "jungle", "mid", "adc", "support"];
    const intervalId = setInterval(() => {
      setActiveRole((prev) => {
        const currentIndex = roleOrder.indexOf(prev);
        const nextIndex = (currentIndex + 1) % roleOrder.length;
        return roleOrder[nextIndex];
      });
    }, 6000);
    return () => clearInterval(intervalId);
  }, [userSelected]);

  const handleSelect = (role: RoleKey) => {
    setActiveRole(role);
    setUserSelected(true);
  };

  return (
    <CollapsibleSection title="Role Specific Stats">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6 lg:[grid-template-columns:minmax(450px,auto)_1fr_1fr] items-stretch">
            <MapWithRoleTabs activeRole={activeRole} onSelect={handleSelect} />

            <div className="lg:col-span-2 h-full">
              <RoleStatsPane activeRole={activeRole} miniStats={miniStats} />
            </div>
          </div>
        </CardContent>
      </Card>
    </CollapsibleSection>
  );
}

export default RolesSection;
