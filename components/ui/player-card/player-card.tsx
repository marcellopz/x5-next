import { Card } from "@/components/ui/card";
import type { Player } from "@/lib/types";

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Card className="w-[216px] h-[300px] flex flex-col overflow-hidden">
      {/* Image placeholder */}
      <div className="w-full h-[140px] bg-muted flex items-center justify-center">
        <span className="text-xs text-muted-foreground">Player Image</span>
      </div>

      {/* Player info */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Player name */}
        <h3 className="font-semibold text-base mb-3 truncate">{player.name}</h3>

        {/* Ranks */}
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Top:</span>
            <span className="font-medium">{player.top}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Jungle:</span>
            <span className="font-medium">{player.jungle}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Mid:</span>
            <span className="font-medium">{player.mid}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">ADC:</span>
            <span className="font-medium">{player.adc}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Support:</span>
            <span className="font-medium">{player.support}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
