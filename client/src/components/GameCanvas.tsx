import { forwardRef, useEffect, useRef } from "react";

interface GameCanvasProps {
  className?: string;
}

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  ({ className = "" }, ref) => {
    const internalRef = useRef<HTMLCanvasElement>(null);
    
    // Use the forwarded ref or fall back to internal ref
    const canvasRef = ref || internalRef;

    useEffect(() => {
      const canvas = typeof canvasRef === 'function' ? null : canvasRef.current;
      if (!canvas) return;

      // Set canvas size to fill the screen
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }, [canvasRef]);

    return (
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${className}`}
        style={{ imageRendering: 'pixelated' }}
      />
    );
  }
);

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
