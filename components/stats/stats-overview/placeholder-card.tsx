export function PlaceholderCard({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border/60 bg-card/40 p-4">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
