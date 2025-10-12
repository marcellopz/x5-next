"use client";
import Image from "next/image";
import React from "react";
import { ROLE_META, RoleKey } from "./roleMeta";

function RoleTabButton({
  label,
  icon,
  active,
  position,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  position: { top: string; left: string };
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex cursor-pointer items-center group absolute -translate-x-1/2 -translate-y-1/2 rounded-md border px-4 py-2 text-base md:px-5 md:py-2.5 md:text-lg transition-colors " +
        (active
          ? "border-primary/80 bg-primary/40 text-foreground ring-2 ring-primary/50 z-2"
          : "border-primary/40 bg-background/80 text-muted-foreground hover:bg-primary/15")
      }
      style={{ top: position.top, left: position.left }}
    >
      <span className="mr-2 inline-flex h-6 w-6 md:h-7 md:w-7 items-center justify-center overflow-hidden rounded">
        <Image src={icon} alt={`${label} icon`} width={28} height={28} />
      </span>
      {label}
    </button>
  );
}

export interface MapWithRoleTabsProps {
  activeRole: RoleKey;
  onSelect: (role: RoleKey) => void;
}

export function MapWithRoleTabs({
  activeRole,
  onSelect,
}: MapWithRoleTabsProps) {
  return (
    <div>
      <div className="relative mr-auto w-full md:min-w-[450px]">
        <Image
          src="/map_summoners_rift.svg"
          alt="Summoner's Rift Map"
          width={500}
          height={500}
          className="h-auto w-full select-none rounded-xl border border-primary/30"
          priority
        />

        {Object.entries(ROLE_META).map(([key, meta]) => {
          const role = key as RoleKey;
          const isActive = activeRole === role;
          return (
            <RoleTabButton
              key={role}
              label={meta.label}
              icon={meta.icon}
              active={isActive}
              position={meta.position}
              onClick={() => onSelect(role)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default MapWithRoleTabs;
