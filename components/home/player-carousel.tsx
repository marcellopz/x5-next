import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PlayerCarousel() {
  return (
    <Card className="h-[450px]">
      <CardHeader>
        <CardTitle className="text-lg">Player Carousel</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          Player carousel component placeholder
        </p>
      </CardContent>
    </Card>
  );
}
