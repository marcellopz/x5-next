import { unstable_cache } from "next/cache";
import {
  _getPlayerList,
  _getRankChangeLog,
  _getPlayer,
  _getPlayerRankChanges,
  _getSummarizedOverallData,
  _getInitialRankChangeLog,
  _getPlayerSummary,
  _getAllReducedData,
} from "./internal";

// Fetches all players from the "players" collection with stale-while-revalidate
export const getPlayerList = unstable_cache(_getPlayerList, ["player-list"], {
  revalidate: 60, // Cache for 60 seconds, then revalidate in background
  tags: ["players"],
});

// Fetches all rank change history from "player-rank-change-log" collection with stale-while-revalidate
export const getRankChangeLog = unstable_cache(
  _getRankChangeLog,
  ["rank-change-log"],
  {
    revalidate: 300, // Cache for 5 minutes, then revalidate in background
    tags: ["rank-changes"],
  }
);

// Fetches a single player by their name_id (e.g., "grilha", "pedro") with stale-while-revalidate
export const getPlayer = (nameId: string) =>
  unstable_cache(() => _getPlayer(nameId), [`player-${nameId}`], {
    revalidate: 60, // Cache for 60 seconds, then revalidate in background
    tags: ["players", `player-${nameId}`],
  })();

// Fetches rank change history for a specific player by their name_id with stale-while-revalidate
export const getPlayerRankChanges = (nameId: string) =>
  unstable_cache(
    () => _getPlayerRankChanges(nameId),
    [`player-rank-changes-${nameId}`],
    {
      revalidate: 300, // Cache for 5 minutes, then revalidate in background
      tags: ["rank-changes", `player-rank-changes-${nameId}`],
    }
  )();

// Fetches pre-processed overall statistics and analytics data with stale-while-revalidate
export const getSummarizedOverallData = unstable_cache(
  _getSummarizedOverallData,
  ["summarized-overall-data"],
  {
    revalidate: 600, // Cache for 10 minutes, then revalidate in background
    tags: ["overall-stats"],
  }
);

// Fetches initial rank change log with stale-while-revalidate
export const getInitialRankChangeLog = unstable_cache(
  _getInitialRankChangeLog,
  ["initial-rank-change-log"],
  {
    revalidate: 3600, // Cache for 1 hour, then revalidate in background
    tags: ["initial-ranks"],
  }
);

// Fetches player summary data from pre-processed-data/player-summary with stale-while-revalidate
export const getPlayerSummary = unstable_cache(
  _getPlayerSummary,
  ["player-summary"],
  {
    revalidate: 120, // Cache for 2 minutes, then revalidate in background
    tags: ["player-summary"],
  }
);

// Fetches all reduced data from pre-processed-data/all-reduced with stale-while-revalidate
export const getAllReducedData = unstable_cache(
  _getAllReducedData,
  ["all-reduced-data"],
  {
    revalidate: 30, // Cache for 30 seconds, then revalidate in background
    tags: ["all-reduced"],
  }
);
