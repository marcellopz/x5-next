"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Carousel3D, type CarouselItem } from "@/components/ui/3d-carousel";
import { PlayerCard } from "@/components/ui/player-card";
import { Input } from "@/components/ui/input";
import type { Player } from "@/lib/types";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface PlayerCarouselProps {
  playerList: Player[] | null;
  initialIndex: number;
}

export function PlayerCarousel({
  playerList,
  initialIndex,
}: PlayerCarouselProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (searchQuery) {
      setIndex(0);
    } else {
      setIndex(initialIndex);
    }
  }, [searchQuery, initialIndex]);

  // Convert filtered player list to carousel items
  const carouselItems: CarouselItem[] = useMemo(
    () =>
      playerList
        ? playerList
            .filter((player) => {
              if (!searchQuery) return true;
              return player.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            })
            .map((player) => ({
              id: player.account_id,
              content: <PlayerCard player={player} />,
            }))
        : [],
    [playerList, searchQuery]
  );

  return (
    <Card className="min-h-[500px] h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl mb-0">Player Cards</CardTitle>
        <Input
          type="text"
          placeholder="Search players..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startIcon={<Search className="w-4 h-4 text-muted-foreground" />}
          className="max-w-36 md:max-w-56"
          compact
        />
      </CardHeader>
      <CardContent className="flex items-center justify-center p-0! mx-3 flex-1 overflow-hidden">
        {carouselItems.length > 0 ? (
          <Carousel3D
            items={carouselItems}
            autoRotate={!searchQuery}
            autoRotateDelay={6000}
            className="w-full h-full"
            initialIndex={index}
          />
        ) : (
          <p className="text-muted-foreground">
            {searchQuery
              ? "No players match your search"
              : "No players available to display"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
