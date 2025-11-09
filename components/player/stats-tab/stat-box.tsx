interface StatBoxProps {
  title: string;
  value: string;
  numberOfGames?: number;
}

export function StatBox({ title, value, numberOfGames }: StatBoxProps) {
  return (
    <div className="bg-background/30 border border-border rounded-lg p-4 min-w-[120px] flex-1">
      <div className="mb-2">
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-4xl font-semibold text-foreground">{value}</p>
        {numberOfGames !== undefined && (
          <p className="text-sm text-muted-foreground/50 mb-1">
            {numberOfGames} games
          </p>
        )}
      </div>
    </div>
  );
}
