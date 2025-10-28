"use client";
import { useRouter } from "next/navigation";
import { Button } from "../button";

export default function CreateMatchButton() {
  const router = useRouter();
  return (
    <Button
      variant="highlight"
      size="xs"
      onClick={() => router.push("/matchmaking")}
    >
      Create Match
    </Button>
  );
}
