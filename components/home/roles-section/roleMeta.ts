export type RoleKey = "top" | "jungle" | "mid" | "adc" | "support";

export type RoleStat = {
  title: string;
  value: string; // player name or label
  description?: string; // metric value or context
};

export const ROLE_META: Record<
  RoleKey,
  {
    label: string;
    icon: string;
    position: { top: string; left: string };
    stats: RoleStat[];
  }
> = {
  top: {
    label: "Top",
    icon: "/top.png",
    position: { top: "15%", left: "15%" },
    stats: [
      {
        title: "Most Wins",
        value: "Mesquita",
        description: "85% winrate (last 10)",
      },
      { title: "Best KDA", value: "Bigode", description: "5.1 avg KDA ratio" },
      {
        title: "Team Player",
        value: "Grilha",
        description: "58% kill participation",
      },
      {
        title: "Farm Master",
        value: "Pedro Ruim",
        description: "9.2 CS per minute",
      },
      {
        title: "Highest Damage",
        value: "Marcello",
        description: "720 damage per minute",
      },
      {
        title: "Gold Leader",
        value: "Valbim",
        description: "450 gold per minute",
      },
      {
        title: "Vision King",
        value: "Zé",
        description: "1.2 vision score/min",
      },
      {
        title: "Early Advantage",
        value: "Dudu",
        description: "+820 gold diff @15",
      },
      {
        title: "Objective Crusher",
        value: "Vinicim",
        description: "5.4k damage to objectives",
      },
      {
        title: "Solo Kill Artist*",
        value: "Cain",
        description: "3.1 solo kills per game",
      },
      {
        title: "Tank Supreme*",
        value: "Danilo",
        description: "34k damage absorbed/game",
      },
      {
        title: "Turret Destroyer*",
        value: "Markin",
        description: "8.2k turret damage/game",
      },
    ],
  },
  jungle: {
    label: "Jungle",
    icon: "/jungle.png",
    position: { top: "40%", left: "28%" },
    stats: [
      {
        title: "Most Wins",
        value: "Bigode",
        description: "80% winrate (last 10)",
      },
      {
        title: "Best KDA",
        value: "Markin",
        description: "6.0 avg KDA ratio",
      },
      {
        title: "Team Player",
        value: "Grilha",
        description: "73% kill participation",
      },
      {
        title: "Farm Master",
        value: "Cain",
        description: "6.8 CS per minute",
      },
      {
        title: "Highest Damage",
        value: "Zé",
        description: "680 damage per minute",
      },
      {
        title: "Gold Leader",
        value: "Pedro Ruim",
        description: "420 gold per minute",
      },
      {
        title: "Vision King",
        value: "Dudu",
        description: "1.8 vision score/min",
      },
      {
        title: "Early Advantage",
        value: "Danilo",
        description: "+650 gold diff @15",
      },
      {
        title: "Objective Crusher",
        value: "Valbim",
        description: "7.2k damage to objectives",
      },
      {
        title: "Objective Control*",
        value: "Mesquita",
        description: "78% control rate",
      },
      {
        title: "Early Game Playmaker*",
        value: "Marcello",
        description: "82% KP pre-15min",
      },
      {
        title: "Jungle Diff King*",
        value: "Tonho",
        description: "+680 XP vs enemy @15",
      },
    ],
  },
  mid: {
    label: "Mid",
    icon: "/mid.png",
    position: { top: "52%", left: "48%" },
    stats: [
      {
        title: "Most Wins",
        value: "Dudu",
        description: "78% winrate (last 10)",
      },
      {
        title: "Best KDA",
        value: "Cain",
        description: "5.8 avg KDA ratio",
      },
      {
        title: "Team Player",
        value: "Bigode",
        description: "71% kill participation",
      },
      {
        title: "Farm Master",
        value: "Pedro Ruim",
        description: "8.9 CS per minute",
      },
      {
        title: "Highest Damage",
        value: "Markin",
        description: "760 damage per minute",
      },
      {
        title: "Gold Leader",
        value: "Grilha",
        description: "480 gold per minute",
      },
      {
        title: "Vision King",
        value: "Danilo",
        description: "1.0 vision score/min",
      },
      {
        title: "Early Advantage",
        value: "Vinicim",
        description: "+740 gold diff @15",
      },
      {
        title: "Objective Crusher",
        value: "Carioca",
        description: "4.8k damage to objectives",
      },
      {
        title: "Solo Kill Artist*",
        value: "Rafinsk",
        description: "2.4 solo kills per game",
      },
      {
        title: "Roam Master*",
        value: "Zé",
        description: "3.2 successful roams/game",
      },
      {
        title: "First Blood Hunter*",
        value: "Lyra",
        description: "28% first blood rate",
      },
    ],
  },
  adc: {
    label: "ADC",
    icon: "/bot.png",
    position: { top: "88%", left: "80%" },
    stats: [
      {
        title: "Most Wins",
        value: "Loves",
        description: "82% winrate (last 10)",
      },
      {
        title: "Best KDA",
        value: "Marcello",
        description: "5.6 avg KDA ratio",
      },
      {
        title: "Team Player",
        value: "Pedro Ruim",
        description: "63% kill participation",
      },
      {
        title: "Farm Master",
        value: "Dudu",
        description: "9.4 CS per minute",
      },
      {
        title: "Highest Damage",
        value: "Markin",
        description: "820 damage per minute",
      },
      {
        title: "Gold Leader",
        value: "Bigode",
        description: "510 gold per minute",
      },
      {
        title: "Vision King",
        value: "Zé",
        description: "0.8 vision score/min",
      },
      {
        title: "Early Advantage",
        value: "Grilha",
        description: "+900 gold diff @15",
      },
      {
        title: "Objective Crusher",
        value: "Vinicim",
        description: "6.2k damage to objectives",
      },
      {
        title: "Damage Carry*",
        value: "Lyra",
        description: "34% of team damage",
      },
      {
        title: "Gold Efficiency*",
        value: "Cain",
        description: "2.8 damage per gold",
      },
      {
        title: "Death Efficiency*",
        value: "Valbim",
        description: "3.2k damage per death",
      },
    ],
  },
  support: {
    label: "Support",
    icon: "/supp.png",
    position: { top: "92%", left: "50%" },
    stats: [
      {
        title: "Most Wins",
        value: "Valbim",
        description: "88% winrate (last 10)",
      },
      { title: "Best KDA", value: "Lyra", description: "6.9 avg KDA ratio" },
      {
        title: "Team Player",
        value: "Zé",
        description: "78% kill participation",
      },
      {
        title: "Vision King",
        value: "Markin",
        description: "5.2 vision score/min",
      },
      {
        title: "Ward Placer*",
        value: "Danilo",
        description: "52 wards placed/game",
      },
      {
        title: "Roam Master*",
        value: "Cain",
        description: "3.8 successful roams/game",
      },
      {
        title: "Assist King*",
        value: "Pedro Ruim",
        description: "18.2 assists per game",
      },
      {
        title: "Healing Hero*",
        value: "Tonho",
        description: "14k healing done/game",
      },
      {
        title: "Vision Denier*",
        value: "Vinicim",
        description: "16 wards cleared/game",
      },
      {
        title: "CC Master*",
        value: "Carioca",
        description: "68 crowd control score",
      },
      {
        title: "Damage Absorbed*",
        value: "Dudu",
        description: "28k damage absorbed/game",
      },
      {
        title: "Damage Dealer*",
        value: "Bigode",
        description: "520 damage per minute",
      },
    ],
  },
};
