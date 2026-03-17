"use client";
import { useRouter } from "next/navigation";
import { Button } from "../button";
import { useTranslations } from "@/lib/i18n/locale-context";

export default function CreateMatchButton() {
  const router = useRouter();
  const t = useTranslations();
  return (
    <Button
      variant="highlight"
      size="xs"
      onClick={() => router.push("/matchmaking")}
    >
      {t("nav.createMatch")}
    </Button>
  );
}
