"use client";

import { useEffect, useState, type RefObject } from "react";
import { Check, Copy, X } from "lucide-react";
import { copyNodeAsImage } from "@/lib/copy-node-as-image";
import { useTranslations } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

type CopyStatus = "idle" | "copying" | "copied" | "error";

interface CopyCardButtonProps {
  targetRef: RefObject<HTMLElement | null>;
}

export function CopyCardButton({ targetRef }: CopyCardButtonProps) {
  const t = useTranslations();
  const [status, setStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (status !== "copied" && status !== "error") return;
    const timer = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const node = targetRef.current;
    if (!node || status === "copying") return;

    setStatus("copying");
    try {
      await copyNodeAsImage(node);
      setStatus("copied");
    } catch (error) {
      console.error("Failed to copy player card", error);
      setStatus("error");
    }
  };

  const label =
    status === "copied"
      ? t("playerCard.copied")
      : status === "error"
        ? t("playerCard.copyFailed")
        : t("playerCard.copyImage");

  const Icon = status === "copied" ? Check : status === "error" ? X : Copy;

  return (
    <button
      type="button"
      onClick={handleClick}
      onPointerDown={(e) => e.stopPropagation()}
      aria-label={label}
      title={label}
      disabled={status === "copying"}
      className={cn(
        "absolute top-3 right-3 z-10 flex size-7 items-center justify-center rounded-md",
        "border border-[#C9A24A]/70 bg-[#050E20]/80 text-[#F0D78C] backdrop-blur-sm",
        "transition-opacity hover:bg-[#143466] disabled:cursor-wait",
        "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100",
        status !== "idle" && "opacity-100"
      )}
    >
      <Icon className={cn("size-3.5", status === "copying" && "animate-pulse")} />
    </button>
  );
}
