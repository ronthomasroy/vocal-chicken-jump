import { useEffect, useRef } from "react";
import { useVoiceGame } from "../lib/stores/useVoiceGame";
import GameCanvas from "./GameCanvas";
import GameUI from "./UI/GameUI";
import VoiceInput from "./VoiceInput";

export default function Game() {
  const { initializeGame, startGame, gameState } = useVoiceGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initializeGame(canvasRef.current);
      // Start the game after a brief delay
      setTimeout(() => {
        startGame();
      }, 500);
    }
  }, [initializeGame, startGame]);

  return (
    <div className="w-full h-screen relative">
      {/* Game Canvas */}
      <GameCanvas ref={canvasRef} />
      
      {/* Voice Input Controller */}
      <VoiceInput />
      
      {/* Game UI Overlay */}
      <GameUI />
      
      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-sm">
        <h3 className="font-bold text-lg mb-2">Voice Controls</h3>
        <ul className="text-sm space-y-1">
          <li>🔇 <strong>Whisper/Hum:</strong> Slow walk</li>
          <li>🗣️ <strong>Normal talk:</strong> Fast walk</li>
          <li>📢 <strong>Shout/Yell:</strong> Variable jump!</li>
        </ul>
        <p className="text-xs mt-2 opacity-80">Louder shouts = higher jumps! Navigate the longer course!</p>
      </div>
    </div>
  );
}
