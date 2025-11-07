import { PlayerPageContent } from "@/components/player/player-page-content";

interface PlayerTabPageProps {
  params: Promise<{ slug: string; tab?: string[] }>;
}

export default async function PlayerTabPage({ params }: PlayerTabPageProps) {
  const { tab } = await params;
  const tabPath = tab?.[0] || "";

  return <PlayerPageContent tab={tabPath} />;
}
