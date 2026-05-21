"use client";

import { useRef, useEffect } from "react";

interface SquaresProps {
  direction?: "diagonal" | "up" | "right" | "down" | "left";
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
}

export default function Squares({
  direction = "diagonal",
  speed = 0.5,
  borderColor = "rgba(197, 160, 89, 0.1)", // premium-gold with low opacity
  squareSize = 40,
  hoverFillColor = "rgba(197, 160, 89, 0.05)",
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const draw = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate offset based on speed and direction
      const moveAmount = speed;
      switch (direction) {
        case "diagonal":
          gridOffset.current.x =
            (gridOffset.current.x - moveAmount) % squareSize;
          gridOffset.current.y =
            (gridOffset.current.y - moveAmount) % squareSize;
          break;
        case "up":
          gridOffset.current.y =
            (gridOffset.current.y - moveAmount) % squareSize;
          break;
        case "down":
          gridOffset.current.y =
            (gridOffset.current.y + moveAmount) % squareSize;
          break;
        case "left":
          gridOffset.current.x =
            (gridOffset.current.x - moveAmount) % squareSize;
          break;
        case "right":
          gridOffset.current.x =
            (gridOffset.current.x + moveAmount) % squareSize;
          break;
      }

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 0.5;

      const numCols = Math.ceil(canvas.width / squareSize) + 2;
      const numRows = Math.ceil(canvas.height / squareSize) + 2;

      for (let i = -1; i < numCols; i++) {
        for (let j = -1; j < numRows; j++) {
          const x = i * squareSize + gridOffset.current.x;
          const y = j * squareSize + gridOffset.current.y;
          ctx.strokeRect(x, y, squareSize, squareSize);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [direction, speed, borderColor, squareSize, hoverFillColor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
