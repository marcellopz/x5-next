"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import type { Player } from "@/lib/types";
import { CopyCardButton } from "./copy-card-button";
import type { PlayerCardProps } from "./player-card-props";

const inter = Inter({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const S4_CARD_WIDTH = 500;
const S4_CARD_HEIGHT = 680;
const PANEL_WIDTH = 480;
const PANEL_HEIGHT = 660;
const DISPLAY_SCALE = 0.5;

const ROWS_TOP = 338;
const ROW_HEIGHT = 48;
const ROW_GAP = 8;

const avatarPalette = ["F0A060", "6EC1E4", "B3D9DA", "A0522D", "4682B4"];

const roles: { key: keyof Pick<Player, "top" | "jungle" | "mid" | "adc" | "support">; label: string }[] = [
  { key: "top", label: "TOP" },
  { key: "jungle", label: "JUNGLE" },
  { key: "mid", label: "MID" },
  { key: "adc", label: "ADC" },
  { key: "support", label: "SUPORTE" },
];

const goldTextGradient = "linear-gradient(180deg, #FBEBB8 0%, #EED28C 50%, #CFA650 100%)";
const labelTextGradient = "linear-gradient(180deg, #FFF8E6 0%, #F2E4BE 55%, #DCC283 100%)";

function gradientText(gradient: string): CSSProperties {
  return {
    background: gradient,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
}

const frameStyle: CSSProperties = {
  width: S4_CARD_WIDTH,
  height: S4_CARD_HEIGHT,
  boxSizing: "border-box",
  padding: 10,
  borderRadius: 14,
  background:
    "repeating-linear-gradient(115deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 3px), repeating-linear-gradient(25deg, rgba(60,40,10,0.10) 0 1px, transparent 1px 4px), linear-gradient(145deg, #F3D98B 0%, #B8913F 35%, #7A5A22 55%, #C9A24A 80%, #F0D07A 100%)",
  position: "relative",
};

const panelStyle: CSSProperties = {
  position: "relative",
  width: PANEL_WIDTH,
  height: PANEL_HEIGHT,
  overflow: "hidden",
  borderRadius: 8,
  background:
    "radial-gradient(ellipse at 50% 30%, #143466 0%, #0A1A35 60%, #050E20 100%)",
};

const fullLayer: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  pointerEvents: "none",
};

const grainStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  backgroundImage:
    "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1.2px), radial-gradient(rgba(0,0,0,0.4) 1px, transparent 1.2px), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 3px)",
  backgroundSize: "5px 5px, 3px 3px, auto",
  backgroundPosition: "0 0, 1px 2px, 0 0",
};

const vignetteStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  boxShadow: "inset 0 0 70px rgba(0,0,0,0.75)",
};

const nameStyle: CSSProperties = {
  position: "absolute",
  left: 72,
  top: 26,
  width: 336,
  height: 50,
  margin: 0,
  lineHeight: "52px",
  textAlign: "center",
  fontSize: 32,
  fontWeight: 800,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#F0D78C",
  ...gradientText(goldTextGradient),
  filter: "drop-shadow(0 2px 0 #3A2A0E)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const photoBoxStyle: CSSProperties = {
  position: "absolute",
  left: 30,
  top: 88,
  width: 420,
  height: 236,
  overflow: "hidden",
  background: "#13284A",
  clipPath:
    "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const photoShadeStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  boxShadow: "inset 0 0 18px 4px rgba(5,14,32,0.65)",
};

const rowsStyle: CSSProperties = {
  position: "absolute",
  left: 28,
  top: ROWS_TOP,
  width: 424,
  display: "flex",
  flexDirection: "column",
  gap: ROW_GAP,
};

const roleRowStyle: CSSProperties = {
  height: ROW_HEIGHT,
  boxSizing: "border-box",
  padding: "0 12px 0 16px",
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const roleLabelStyle: CSSProperties = {
  flex: 1,
  fontSize: 19,
  fontWeight: 700,
  letterSpacing: "0.08em",
  lineHeight: 1,
  paddingTop: 2,
  color: "#F3EEDF",
  ...gradientText(labelTextGradient),
};

const roleValueStyle: CSSProperties = {
  width: 40,
  textAlign: "center",
  fontVariantNumeric: "tabular-nums",
  fontSize: 28,
  lineHeight: 1,
  paddingTop: 2,
  fontWeight: 800,
  color: "#F0D78C",
  ...gradientText(goldTextGradient),
  filter: "drop-shadow(0 2px 0 #3A2A0E)",
};

const footerStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 620,
  width: PANEL_WIDTH,
  height: 18,
  lineHeight: "18px",
  textAlign: "center",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: "#A88B4A",
};

const rosetteAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

function BackgroundEngraving({ idPrefix }: { idPrefix: string }) {
  const waveA = `${idPrefix}-wave-a`;
  const waveB = `${idPrefix}-wave-b`;
  return (
    <svg
      width={PANEL_WIDTH}
      height={PANEL_HEIGHT}
      viewBox={`0 0 ${PANEL_WIDTH} ${PANEL_HEIGHT}`}
      aria-hidden="true"
      style={fullLayer}
    >
      <defs>
        <pattern id={waveA} x="0" y="0" width="48" height="9" patternUnits="userSpaceOnUse">
          <path
            d="M0 4.5 Q12 0 24 4.5 T48 4.5"
            fill="none"
            stroke="#E8C878"
            strokeOpacity="0.16"
            strokeWidth="0.8"
          />
        </pattern>
        <pattern
          id={waveB}
          x="0"
          y="0"
          width="60"
          height="9"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-7)"
        >
          <path
            d="M0 4.5 Q15 9 30 4.5 T60 4.5"
            fill="none"
            stroke="#8FB0E8"
            strokeOpacity="0.10"
            strokeWidth="0.7"
          />
        </pattern>
      </defs>
      <rect x="0" y="0" width={PANEL_WIDTH} height={PANEL_HEIGHT} fill={`url(#${waveA})`} />
      <rect x="0" y="0" width={PANEL_WIDTH} height={PANEL_HEIGHT} fill={`url(#${waveB})`} />
    </svg>
  );
}

function RowFrame({ y }: { y: number }) {
  return (
    <g transform={`translate(0,${y})`}>
      <polygon
        points="36,0 444,0 452,8 452,40 444,48 36,48 28,40 28,8"
        fill="#081631"
        fillOpacity="0.45"
        stroke="#D9B45A"
        strokeOpacity="0.88"
        strokeWidth="1.3"
      />
      <polygon
        points="38,3 442,3 449,10 449,38 442,45 38,45 31,38 31,10"
        stroke="#E8C878"
        strokeOpacity="0.33"
        strokeWidth="0.9"
      />
    </g>
  );
}

function Ornaments({ idPrefix }: { idPrefix: string }) {
  const fade = `${idPrefix}-fade`;
  return (
    <svg
      width={PANEL_WIDTH}
      height={PANEL_HEIGHT}
      viewBox={`0 0 ${PANEL_WIDTH} ${PANEL_HEIGHT}`}
      fill="none"
      aria-hidden="true"
      style={fullLayer}
    >
      <defs>
        <linearGradient id={fade} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E8C878" stopOpacity="0" />
          <stop offset="0.18" stopColor="#E8C878" stopOpacity="0.55" />
          <stop offset="0.82" stopColor="#E8C878" stopOpacity="0.55" />
          <stop offset="1" stopColor="#E8C878" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g stroke="#E8C878">
        <circle cx="240" cy="470" r="178" strokeOpacity="0.1" strokeWidth="1" />
        <circle
          cx="240"
          cy="470"
          r="166"
          strokeOpacity="0.16"
          strokeWidth="3"
          strokeDasharray="1 7"
        />
        <circle cx="240" cy="470" r="150" strokeOpacity="0.08" strokeWidth="1" />
        <g strokeOpacity="0.09" strokeWidth="0.8">
          {rosetteAngles.map((angle) => (
            <circle
              key={angle}
              cx="240"
              cy="395"
              r="75"
              transform={angle ? `rotate(${angle} 240 470)` : undefined}
            />
          ))}
        </g>
        <path
          d="M240 280 L240 300 M240 640 L240 660 M50 470 L70 470 M410 470 L430 470"
          strokeOpacity="0.14"
        />
      </g>

      <polygon
        points="70,26 410,26 430,51 410,76 70,76 50,51"
        fill="#081631"
        fillOpacity="0.75"
        stroke="#C9A24A"
        strokeWidth="1.2"
      />
      <polygon
        points="74,30 406,30 425,51 406,72 74,72 55,51"
        stroke="#E8C878"
        strokeOpacity="0.3"
        strokeWidth="0.8"
      />
      <path d="M50 51 H30 M430 51 H450" stroke="#C9A24A" strokeWidth="1" />
      <polygon points="22,51 26,47 30,51 26,55" fill="#E8C878" />
      <polygon points="450,51 454,47 458,51 454,55" fill="#E8C878" />

      {roles.map((role, i) => (
        <RowFrame key={role.key} y={ROWS_TOP + i * (ROW_HEIGHT + ROW_GAP)} />
      ))}

      <path d="M88 629 H178 M302 629 H392" stroke={`url(#${fade})`} strokeWidth="1" />
    </svg>
  );
}

function BorderFrames() {
  return (
    <svg
      width={PANEL_WIDTH}
      height={PANEL_HEIGHT}
      viewBox={`0 0 ${PANEL_WIDTH} ${PANEL_HEIGHT}`}
      fill="none"
      aria-hidden="true"
      style={fullLayer}
    >
      <polygon
        points="24,8 456,8 472,24 472,636 456,652 24,652 8,636 8,24"
        stroke="#E8C878"
        strokeWidth="1.2"
      />
      <polygon
        points="27,13 453,13 467,27 467,633 453,647 27,647 13,633 13,27"
        stroke="#E8C878"
        strokeOpacity="0.3"
        strokeWidth="0.8"
      />
      <polygon
        points="48,88 432,88 450,106 450,306 432,324 48,324 30,306 30,106"
        stroke="#D9B45A"
        strokeWidth="2"
      />
      <polygon
        points="46,83 434,83 455,104 455,308 434,329 46,329 25,308 25,104"
        stroke="#E8C878"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      <path
        d="M30 106 L48 88 M450 106 L432 88 M30 306 L48 324 M450 306 L432 324"
        stroke="#F3D98B"
        strokeWidth="2"
      />
    </svg>
  );
}

function PhotoPlaceholder() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8FA3C4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

export function PlayerCardS4({
  player,
  onClick,
  showCopyButton = false,
}: PlayerCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const idPrefix = `s4card${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [photoLoaded, setPhotoLoaded] = useState(false);

  useEffect(() => {
    if (!player) return;

    let cancelled = false;
    setPhotoSrc(null);
    setPhotoLoaded(false);

    const fetchPhoto = async () => {
      let photo: string | null = null;
      try {
        const res = await fetch(`/api/player-photo/${player.name_id}`);
        photo = await res.json();
      } catch {
        photo = null;
      }
      if (cancelled) return;
      setPhotoSrc(
        photo ||
          `https://api.dicebear.com/9.x/croodles-neutral/svg?seed=${
            player.name_id
          }&scale=45&backgroundColor=${avatarPalette.join(",")}`
      );
    };
    fetchPhoto();

    return () => {
      cancelled = true;
    };
  }, [player]);

  if (!player) {
    return null;
  }

  return (
    <div
      className="group relative"
      style={{
        width: S4_CARD_WIDTH * DISPLAY_SCALE,
        height: S4_CARD_HEIGHT * DISPLAY_SCALE,
        cursor: onClick ? "pointer" : "unset",
      }}
      onClick={() => onClick?.()}
    >
      <div
        style={{
          transform: `scale(${DISPLAY_SCALE})`,
          transformOrigin: "top left",
        }}
      >
        <div ref={cardRef} className={inter.className} style={frameStyle}>
          <div style={panelStyle}>
            <BackgroundEngraving idPrefix={idPrefix} />
            <div style={grainStyle} />
            <div style={vignetteStyle} />
            <Ornaments idPrefix={idPrefix} />

            <h1 style={nameStyle}>{player.name}</h1>

            <div style={photoBoxStyle}>
              {!photoLoaded && <PhotoPlaceholder />}
              {photoSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoSrc}
                  alt={player.name}
                  crossOrigin="anonymous"
                  onLoad={() => setPhotoLoaded(true)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: photoSrc.startsWith("data:") ? "fill" : "cover",
                    objectPosition: photoSrc.startsWith("data:") ? "0% 0%" : "50% 50%",
                    display: "block",
                    opacity: photoLoaded ? 1 : 0,
                    transition: "opacity 300ms",
                  }}
                />
              )}
              <div style={photoShadeStyle} />
            </div>

            <div style={rowsStyle}>
              {roles.map((role) => (
                <div key={role.key} style={roleRowStyle}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src={`/player-card-s4/${role.key}.png`}
                      alt=""
                      width={72}
                      height={72}
                      loading="eager"
                      style={{ display: "block", width: 36, height: 36 }}
                    />
                  </div>
                  <div style={roleLabelStyle}>{role.label}</div>
                  <div style={roleValueStyle}>{player[role.key]}</div>
                </div>
              ))}
            </div>

            <div style={footerStyle}>X5DOSNERDS</div>

            <BorderFrames />
          </div>
        </div>
      </div>

      {showCopyButton && <CopyCardButton targetRef={cardRef} />}
    </div>
  );
}
