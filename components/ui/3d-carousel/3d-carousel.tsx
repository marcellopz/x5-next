"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export interface CarouselItem {
  id: string | number;
  content: React.ReactNode;
}

interface Carousel3DProps {
  items: CarouselItem[];
  autoRotate?: boolean;
  autoRotateDelay?: number;
  className?: string;
  initialIndex?: number;
}

export function Carousel3D({
  items,
  autoRotate = true,
  autoRotateDelay = 3000,
  className,
  initialIndex = 0,
}: Carousel3DProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const totalItems = items.length;

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate && !isHovered && !isPaused && totalItems > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalItems);
      }, autoRotateDelay);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRotate, autoRotateDelay, totalItems, isHovered, isPaused]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const getItemStyle = useCallback(
    (index: number) => {
      // Calculate the shortest distance considering wraparound
      const directDistance = index - currentIndex;
      const wraparoundDistance = totalItems - Math.abs(directDistance);
      const shortestDistance =
        Math.abs(directDistance) <= wraparoundDistance
          ? directDistance
          : directDistance > 0
          ? directDistance - totalItems
          : directDistance + totalItems;

      // Show cards within the visible range (3 on each side + 1 main = 7 total)
      // But preload the 4th item on each side for smooth animations
      if (Math.abs(shortestDistance) > 4) {
        return {
          opacity: 0,
          zIndex: -1,
          display: "none",
        };
      }

      // Calculate spacing as percentage of container width
      // This ensures cards get farther apart on larger containers
      const spacingPercent = 12; // Base spacing percentage

      const x =
        shortestDistance > 0
          ? Math.pow(Math.abs(shortestDistance), 0.9) * spacingPercent
          : -Math.pow(Math.abs(shortestDistance), 0.9) * spacingPercent;
      const isActive = shortestDistance === 0;

      // Calculate scale and opacity based on distance from center
      const distanceFromCenter = Math.abs(shortestDistance);
      const maxDistance = 4; // 4 positions away (including preloaded)
      const scale = Math.max(0.4, 1 - (distanceFromCenter / maxDistance) * 0.5);

      // Cards at position 3 get lower opacity, position 4 is hidden but preloaded
      const opacity =
        distanceFromCenter === 3 ? 0.4 : distanceFromCenter === 4 ? 0 : 1;

      return {
        left: `${50 + x}%`, // 50% centers the card, then add the offset
        transform: `translateX(-50%) scale(${scale})`, // Center the card on its left position
        opacity: opacity,
        zIndex: isActive ? 10 : Math.floor(scale * 10),
      };
    },
    [currentIndex, totalItems]
  );

  const goToPrevious = useCallback(() => {
    setCurrentIndex((currentIndex - 1 + totalItems) % totalItems);
  }, [currentIndex, totalItems]);

  const goToNext = useCallback(() => {
    setCurrentIndex((currentIndex + 1) % totalItems);
  }, [currentIndex, totalItems]);

  // Memoize the visible items to prevent unnecessary re-renders
  const visibleItems = useMemo(() => {
    return items
      .map((item, index) => {
        // Calculate the shortest distance considering wraparound
        const directDistance = index - currentIndex;
        const wraparoundDistance = totalItems - Math.abs(directDistance);
        const shortestDistance =
          Math.abs(directDistance) <= wraparoundDistance
            ? directDistance
            : directDistance > 0
            ? directDistance - totalItems
            : directDistance + totalItems;

        // Only render cards within the visible range (3 on each side + 1 main)
        // Plus preload the 4th item on each side for smooth animations
        if (Math.abs(shortestDistance) > 4) {
          return null;
        }

        return {
          item,
          index,
          style: getItemStyle(index),
        };
      })
      .filter(Boolean);
  }, [items, currentIndex, totalItems, getItemStyle]);

  if (totalItems === 0) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <p className="text-muted-foreground">No items to display</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full flex items-center justify-center",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* 3D Container */}
        <div
          className="relative"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {visibleItems.map((visibleItem) => {
            if (!visibleItem) return null;
            const { item, style } = visibleItem;
            return (
              <div
                key={item.id}
                className="absolute transition-all duration-500 ease-in-out"
                style={{
                  ...style,
                  transformOrigin: "center center",
                }}
              >
                {item.content}
              </div>
            );
          })}
        </div>

        {/* Pause/Resume button */}
        {totalItems > 1 && autoRotate && (
          <button
            className="cursor-pointer absolute top-2 right-2 z-20 bg-background/80 hover:bg-background rounded-full p-2 transition-all duration-200 hover:scale-110"
            onClick={togglePause}
            title={isPaused ? "Resume rotation" : "Pause rotation"}
          >
            {isPaused ? (
              <Play className="w-5 h-5" />
            ) : (
              <Pause className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Navigation arrows */}
        {totalItems > 1 && (
          <>
            <button
              className="cursor-pointer absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-background/80 hover:bg-background rounded-full p-2 transition-all duration-200 hover:scale-110"
              onClick={goToPrevious}
              title="Previous item"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-background/80 hover:bg-background rounded-full p-2 transition-all duration-200 hover:scale-110"
              onClick={goToNext}
              title="Next item"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
