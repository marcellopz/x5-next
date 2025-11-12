import { PlayerPageContent } from "@/components/player/player-page-content";
import { generatePageMetadata } from "@/lib/metadata";
import { getPlayer, getPlayerInfo } from "@/lib/endpoints";

interface PlayerTabPageProps {
  params: Promise<{ slug: string; tab?: string[] }>;
}

export async function generateMetadata({ params }: PlayerTabPageProps) {
  const { slug } = await params;

  // Try to get player name for metadata
  let playerName = slug;
  try {
    const isAccountId = !isNaN(Number(slug));
    if (isAccountId) {
      const playerInfo = await getPlayerInfo(slug);
      playerName = playerInfo?.summonerName || slug;
    } else {
      const player = await getPlayer(slug);
      playerName = player?.name || slug;
    }
  } catch {
    // Fallback to slug if fetch fails
  }

  return generatePageMetadata(
    playerName,
    `${playerName}'s profile, statistics, and match history`
  );
}

export default async function PlayerTabPage({ params }: PlayerTabPageProps) {
  const { tab } = await params;
  const tabPath = tab?.[0] || "";

  return <PlayerPageContent tab={tabPath} />;
}
