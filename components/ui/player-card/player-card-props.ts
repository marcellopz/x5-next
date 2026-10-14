import type { Player } from "@/lib/types";

export interface PlayerCardProps {
  player: Player | null;
  onClick?: () => void;
  showCopyButton?: boolean;
}

export function arePlayerCardPropsEqual(
  prevProps: PlayerCardProps,
  nextProps: PlayerCardProps
) {
  if (prevProps.showCopyButton !== nextProps.showCopyButton) {
    return false;
  }
  if (!prevProps.player || !nextProps.player) {
    return prevProps.player === nextProps.player;
  }
  return (
    prevProps.player.account_id === nextProps.player.account_id &&
    prevProps.player.top === nextProps.player.top &&
    prevProps.player.jungle === nextProps.player.jungle &&
    prevProps.player.mid === nextProps.player.mid &&
    prevProps.player.adc === nextProps.player.adc &&
    prevProps.player.support === nextProps.player.support &&
    prevProps.player.name === nextProps.player.name
  );
}
