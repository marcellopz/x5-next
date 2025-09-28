export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-muted rounded-full"></div>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0 z-10"></div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-lg font-medium text-foreground">Loading...</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we load your content
          </p>
        </div>
      </div>
    </div>
  );
}
