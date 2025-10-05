import { getPlayer } from "@/lib/endpoints";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const player = await getPlayer(playerId);
  console.log(player);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">PlayerPage</h1>
          <p className="text-sm text-muted-foreground">
            PlayerPage {playerId} {player?.name}
          </p>
        </div>
      </div>
    </div>
  );
}
