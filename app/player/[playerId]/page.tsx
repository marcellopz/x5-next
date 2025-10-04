import { getPlayer } from "@/lib/endpoints";

export default async function PlayerPage({
  params,
}: {
  params: { playerId: string };
}) {
  const player = await getPlayer(params.playerId);
  console.log(player);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">PlayerPage</h1>
          <p className="text-sm text-muted-foreground">
            PlayerPage {params.playerId} {player?.name}
          </p>
        </div>
      </div>
    </div>
  );
}
