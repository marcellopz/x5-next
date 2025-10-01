interface GraphCardProps {
  title: string;
  description?: string;
}

export function GraphCard({ title, description }: GraphCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm h-64">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm">Graph placeholder</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
