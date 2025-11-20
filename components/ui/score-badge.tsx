import { convertScoreToGrade } from "@/components/match/match-utils";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number | undefined;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";

  if (!score) {
    return (
      <div className={cn(baseClasses, "text-muted-foreground border-border")}>
        N/A
      </div>
    );
  }

  const grade = convertScoreToGrade(score);
  const gradeLetter = grade.charAt(0);

  // Color mapping based on grade
  const getGradeColor = (letter: string) => {
    switch (letter) {
      case "S":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30";
      case "A":
        return "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30";
      case "B":
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "C":
        return "bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30";
      case "D":
        return "bg-orange-600/20 text-orange-700 dark:text-orange-500 border-orange-600/30";
      case "F":
        return "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div
      title={score.toFixed(2)}
      className={cn(baseClasses, getGradeColor(gradeLetter))}
    >
      {grade}
    </div>
  );
}
