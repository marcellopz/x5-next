import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHAMPIONICONURL } from "@/lib/resources";
import Image from "next/image";

interface ChampionCardProps {
  championId: number;
  championName: string;
  stat: string;
  value: string;
  gamesPlayed: number;
  winRate: string;
}

export function ChampionCard({
  championId,
  championName,
  stat,
  value,
  gamesPlayed,
  winRate,
}: ChampionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {stat}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted border-2 border-border">
            <Image
              src={`${CHAMPIONICONURL}${championId}.png`}
              alt={championName}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-baseline gap-2 justify-between">
              <span className="text-md font-bold truncate">{championName}</span>
              <span className="text-lg font-semibold text-primary flex-shrink-0">
                {value}
              </span>
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{gamesPlayed} games</span>
              <span>•</span>
              <span>{winRate} WR</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
