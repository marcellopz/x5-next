import type { Player } from "@/lib/types";
import { memo, useEffect, useRef, useState } from "react";
import { PlayerCardSkeleton } from "./player-card-skeleton";

const paletaDestaque = [
  "F0A060", // Laranja Suave/Pêssego
  "6EC1E4", // Azul Céu/Azul Claro
  "B3D9DA", // Verde Água Claro
  "A0522D", // Sienna (Marrom Terroso Claro)
  "4682B4", // Azul Aço
];

interface PlayerCardProps {
  player: Player | null;
  onClick?: () => void;
}

function PlayerCardComponent({ player, onClick }: PlayerCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const goldColor = "#cab47d";
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!player) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const fetchPhoto = async () => {
      const res = await fetch(`/api/player-photo/${player.name_id}`);
      const photo = await res.json();
      if (photo) {
        setPhotoSrc(photo);
      } else {
        setPhotoSrc(
          `https://api.dicebear.com/9.x/croodles-neutral/svg?seed=${
            player.name_id
          }&scale=70&backgroundColor=${paletaDestaque.join(",")}`
        );
      }
    };
    fetchPhoto();
  }, [player]);

  useEffect(() => {
    if (!player) return;

    const canvas = canvasRef.current;
    if (!canvas || !photoSrc) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 250;
    const height = 340;
    const dpr = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
      3
    );
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Load both images
    const templateImg = new Image();
    templateImg.src = "/template_card.png";
    templateImg.crossOrigin = "anonymous";

    const photoImg = new Image();
    photoImg.src = photoSrc;
    photoImg.crossOrigin = "anonymous";

    // Track when both images are loaded
    let templateLoaded = false;
    let photoLoaded = false;

    const drawCanvas = () => {
      if (!templateLoaded || !photoLoaded) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw the photo first (behind the template)
      // Photo dimensions: 250x180, width: 210 (from x=20 to x=230), maintaining aspect ratio
      const photoWidth = 220;
      const photoHeight = 140; // photoWidth * (180 / 250);
      ctx.drawImage(photoImg, 15, 40, photoWidth, photoHeight);

      // Draw the template on top
      ctx.drawImage(templateImg, 0, 0, width, height);

      // Configure text styling — Arial first so glyph metrics match across mobile/desktop
      ctx.fillStyle = goldColor;
      ctx.font = 'bold 18px Arial, "Helvetica Neue", Helvetica, sans-serif';

      if (!player) return;

      /**
       * Align glyph tops to template slots. Prefer actualBoundingBoxAscent — fontBoundingBoxAscent
       * (em box) is often taller on desktop and pushes text down vs the artwork.
       */
      const fillTextFromSlotTop = (text: string, x: number, slotTop: number) => {
        ctx.textBaseline = "alphabetic";
        const m = ctx.measureText(text);
        const a = m.actualBoundingBoxAscent ?? 0;
        const f = m.fontBoundingBoxAscent ?? 0;
        const ascent = a > 0 ? a : f > 0 ? f : 14;
        ctx.fillText(text, x, slotTop + ascent);
      };

      // Draw player name (centered)
      ctx.textAlign = "center";
      fillTextFromSlotTop(player.name.toUpperCase(), width / 2, 24);

      // Draw rank numbers - right aligned
      ctx.textAlign = "right";
      const rightOffset = 34;
      const x = width - rightOffset;
      fillTextFromSlotTop(player.top.toString(), x, 181);
      fillTextFromSlotTop(player.jungle.toString(), x, 210);
      fillTextFromSlotTop(player.mid.toString(), x, 239);
      fillTextFromSlotTop(player.adc.toString(), x, 268);
      fillTextFromSlotTop(player.support.toString(), x, 298);

      // Mark as loaded
      setIsLoading(false);
    };

    templateImg.onload = () => {
      templateLoaded = true;
      drawCanvas();
    };

    photoImg.onload = () => {
      photoLoaded = true;
      drawCanvas();
    };

    templateImg.onerror = () => {
      console.error("Failed to load template image");
      setIsLoading(false);
    };

    photoImg.onerror = () => {
      console.error("Failed to load photo image");
      setIsLoading(false);
    };
  }, [player, goldColor, photoSrc]);

  if (!player) {
    return null;
  }

  return (
    <div
      className="relative w-[250px] h-[340px]"
      style={{
        cursor: onClick ? "pointer" : "unset",
      }}
    >
      {isLoading && <PlayerCardSkeleton />}
      <canvas
        onClick={() => onClick?.()}
        ref={canvasRef}
        className={`w-[250px] h-[340px] rounded-lg ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        style={{ display: "block" }}
      />
    </div>
  );
}

export const PlayerCard = memo(PlayerCardComponent, (prevProps, nextProps) => {
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
});
