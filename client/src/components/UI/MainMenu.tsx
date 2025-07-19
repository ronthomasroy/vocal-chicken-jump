import { useState } from "react";
import { useVoiceGame } from "../../lib/stores/useVoiceGame";

export default function MainMenu() {
  const { startGamePhase } = useVoiceGame();
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-green-400 flex items-center justify-center relative overflow-hidden">
      {/* Animated clouds */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-12 bg-white rounded-full opacity-80 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-10 bg-white rounded-full opacity-60 animate-pulse delay-1000"></div>
        <div className="absolute top-48 left-1/3 w-24 h-14 bg-white rounded-full opacity-70 animate-pulse delay-500"></div>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-32 bg-green-500"></div>

      {/* Main Menu Card */}
      <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center relative z-10">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🐔 Clucky Voice</h1>
          <p className="text-gray-600">The Voice-Controlled Chicken Adventure!</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => startGamePhase()}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg"
          >
            🎮 Start Game
          </button>

          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg"
          >
            📖 How to Play
          </button>
        </div>

        {showInstructions && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
            <h3 className="font-bold text-lg mb-3">Voice Controls:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-6">🔇</span>
                <span><strong>Whisper/Hum:</strong> Clucky walks slowly</span>
              </li>
              <li className="flex items-center">
                <span className="w-6">🗣️</span>
                <span><strong>Normal Talk:</strong> Clucky walks faster</span>
              </li>
              <li className="flex items-center">
                <span className="w-6">📢</span>
                <span><strong>Shout/Yell:</strong> Clucky jumps!</span>
              </li>
            </ul>
            <p className="text-xs text-gray-600 mt-3">
              <strong>Warning:</strong> Don't touch the lava! You have 3 lives - respawn at checkpoints when you fall.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Note: You'll need to allow microphone access when prompted.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
