import { memo } from "react";
import { getSeasonKey } from "@/lib/season";
import { PlayerCardLegacy } from "./player-card-legacy";
import { PlayerCardS4 } from "./player-card-s4";
import { arePlayerCardPropsEqual, type PlayerCardProps } from "./player-card-props";

function PlayerCardComponent(props: PlayerCardProps) {
  return getSeasonKey() === "s4" ? (
    <PlayerCardS4 {...props} />
  ) : (
    <PlayerCardLegacy {...props} />
  );
}

export const PlayerCard = memo(PlayerCardComponent, arePlayerCardPropsEqual);
