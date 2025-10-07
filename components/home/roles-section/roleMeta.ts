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
      { title: "Best KDA", value: "TioZed", description: "5.1 avg KDA" },
      {
        title: "Highest CS",
        value: "TeemoGod",
        description: "9.2 CS per minute",
      },
      {
        title: "Winrate",
        value: "DariusMain",
        description: "71% over 28 games",
      },
      {
        title: "Damage Share",
        value: "GarenCarry",
        description: "28% team damage",
      },
      {
        title: "Solo Kills",
        value: "FioraQueen",
        description: "3.1 per game avg",
      },
      { title: "Gold@15", value: "ShenEnjoyer", description: "+820 gold lead" },
      { title: "XP@15", value: "NasusStack", description: "+540 XP lead" },
      { title: "Turret Dmg", value: "JaxJump", description: "5.4k per game" },
      {
        title: "Dmg Taken",
        value: "SionBus",
        description: "34k absorbed/game",
      },
      {
        title: "KP",
        value: "CamilleBlade",
        description: "58% kill participation",
      },
      {
        title: "Kill Diff@15",
        value: "RivenMech",
        description: "+2.1 early advantage",
      },
      {
        title: "Vision",
        value: "MalphStone",
        description: "14 wards per game",
      },
    ],
  },
  jungle: {
    label: "Jungle",
    icon: "/jungle.png",
    position: { top: "40%", left: "28%" },
    stats: [
      { title: "Best KDA", value: "LeeSinOTP", description: "6.0 avg KDA" },
      {
        title: "Winrate",
        value: "KindredMain",
        description: "69% over 32 games",
      },
      { title: "CS/min", value: "FarmKing", description: "6.8 CS per minute" },
      {
        title: "Obj Cntrl",
        value: "SmiteLord",
        description: "78% objective secure",
      },
      { title: "KP", value: "JarvanIV", description: "73% kill participation" },
      { title: "Gold@15", value: "NoctNight", description: "+650 gold lead" },
      { title: "XP@15", value: "KaynBlue", description: "+580 XP lead" },
      {
        title: "Vis Score",
        value: "EveSpy",
        description: "22 vision per game",
      },
      {
        title: "CounterJgl",
        value: "UdyrRun",
        description: "1.2k enemy jgl gold",
      },
      {
        title: "Ganks/gm",
        value: "ZacJump",
        description: "6.1 ganks per game",
      },
      { title: "Dmg Share", value: "KhaZix", description: "24% team damage" },
      {
        title: "Dmg Taken",
        value: "AmumuSad",
        description: "31k absorbed/game",
      },
    ],
  },
  mid: {
    label: "Mid",
    icon: "/mid.png",
    position: { top: "52%", left: "48%" },
    stats: [
      { title: "Best KDA", value: "AnnieBot", description: "5.8 avg KDA" },
      { title: "Winrate", value: "AhriFox", description: "67% over 30 games" },
      {
        title: "CS/min",
        value: "ViktorMain",
        description: "8.9 CS per minute",
      },
      { title: "Dpm", value: "SyndraOrbs", description: "720 damage/minute" },
      {
        title: "KP",
        value: "TwistedFate",
        description: "71% kill participation",
      },
      { title: "Gold@15", value: "YasuoWind", description: "+740 gold lead" },
      { title: "XP@15", value: "ZedShadow", description: "+560 XP lead" },
      {
        title: "Solo Kills",
        value: "FizzSplash",
        description: "2.4 per game avg",
      },
      { title: "Roams", value: "Taliyah", description: "3.2 roams per game" },
      { title: "Vision", value: "LissIce", description: "12 wards per game" },
      {
        title: "Kill Diff@15",
        value: "Qiyana",
        description: "+1.9 early advantage",
      },
      { title: "DMG Share", value: "Orianna", description: "30% team damage" },
    ],
  },
  adc: {
    label: "ADC",
    icon: "/bot.png",
    position: { top: "88%", left: "80%" },
    stats: [
      { title: "Best KDA", value: "JinxCarry", description: "5.6 avg KDA" },
      {
        title: "Winrate",
        value: "CaitSharp",
        description: "68% over 34 games",
      },
      { title: "CS/min", value: "AsheHawk", description: "9.4 CS per minute" },
      { title: "Dpm", value: "Xayah", description: "760 damage/minute" },
      { title: "Gold@15", value: "DravenAxe", description: "+900 gold lead" },
      { title: "XP@15", value: "Ezreal", description: "+520 XP lead" },
      { title: "KP", value: "Varus", description: "63% kill participation" },
      { title: "DMG Share", value: "KogMaw", description: "34% team damage" },
      { title: "Turret Dmg", value: "Trist", description: "6.2k per game" },
      {
        title: "Kill Diff@15",
        value: "Samira",
        description: "+2.4 early advantage",
      },
      {
        title: "Vis Score",
        value: "Aphelios",
        description: "10 wards per game",
      },
      {
        title: "Longest Killstreak",
        value: "Sivir",
        description: "9 kills in a row",
      },
    ],
  },
  support: {
    label: "Support",
    icon: "/supp.png",
    position: { top: "92%", left: "50%" },
    stats: [
      { title: "Best KDA", value: "LuluPix", description: "6.9 avg KDA" },
      {
        title: "Winrate",
        value: "ThreshHook",
        description: "70% over 40 games",
      },
      {
        title: "Vis Score",
        value: "NamiTide",
        description: "68 vision per game",
      },
      {
        title: "Wards Cleared",
        value: "Pyke",
        description: "16 cleared per game",
      },
      { title: "KP", value: "Rakan", description: "78% kill participation" },
      { title: "Gold@15", value: "BardRoam", description: "+260 gold lead" },
      { title: "XP@15", value: "Sona", description: "+310 XP lead" },
      {
        title: "Heals/Shield",
        value: "Janna",
        description: "12k shielded/game",
      },
      { title: "Engages", value: "Leona", description: "3.6 engages per game" },
      {
        title: "Peel Saves",
        value: "Milio",
        description: "2.8 saves per game",
      },
      { title: "DMG Share", value: "Zyra", description: "18% team damage" },
      { title: "Roams", value: "Alistar", description: "2.9 roams per game" },
    ],
  },
};
