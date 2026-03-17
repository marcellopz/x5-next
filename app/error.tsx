"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/locale-context";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations();

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t("error.somethingWentWrong")}
          </h1>
          <p className="text-muted-foreground mb-4">
            {t("error.unexpectedError")}
          </p>

          {process.env.NODE_ENV === "development" && (
            <details className="text-left bg-muted p-4 rounded-md mb-4">
              <summary className="cursor-pointer text-sm font-medium mb-2">
                {t("error.errorDetails")}
              </summary>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
        </div>

        <div className="space-y-4">
          <Button onClick={reset} className="w-full">
            {t("error.tryAgain")}
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full"
          >
            {t("error.goHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
