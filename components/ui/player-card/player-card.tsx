import { getPlayerPhoto } from "@/lib/endpoints";
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
  player: Player;
}

function PlayerCardComponent({ player }: PlayerCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const goldColor = "#cab47d";
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchPhoto = async () => {
      const photo = await getPlayerPhoto(player.name_id);
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
  }, [player.account_id, player.name_id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !photoSrc) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const width = 250;
    const height = 340;
    canvas.width = width;
    canvas.height = height;

    // Load both images
    const templateImg = new Image();
    templateImg.src = "/template_card2.png";
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

      // Configure text styling
      ctx.fillStyle = goldColor;
      ctx.font = "bold 18px sans-serif";

      // Draw player name (centered)
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(player.name.toUpperCase(), width / 2, 24);

      // Draw rank numbers - right aligned
      ctx.textAlign = "right";
      ctx.textBaseline = "top";

      // Position for rank numbers (right side, aligned with role labels)
      const rightOffset = 34;
      ctx.fillText(player.top.toString(), width - rightOffset, 181);
      ctx.fillText(player.jungle.toString(), width - rightOffset, 210);
      ctx.fillText(player.mid.toString(), width - rightOffset, 239);
      ctx.fillText(player.adc.toString(), width - rightOffset, 268);
      ctx.fillText(player.support.toString(), width - rightOffset, 298);

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

  return (
    <div className="relative w-[250px] h-[340px]">
      {isLoading && <PlayerCardSkeleton />}
      <canvas
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
