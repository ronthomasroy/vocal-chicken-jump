import { useVoiceGame } from "../../lib/stores/useVoiceGame";

export default function GameUI() {
  const { gameState, voiceLevel, pauseGame, resumeGame } = useVoiceGame();

  const voicePercentage = Math.min(voiceLevel * 100, 100);
  
  // Determine voice state based on level
  const getVoiceState = () => {
    if (voiceLevel < 0.05) return 'Silent';
    if (voiceLevel < 0.15) return 'Whisper (Slow Walk)';
    if (voiceLevel < 0.35) return 'Talk (Fast Walk)';
    return `Shout (${Math.round(voiceLevel * 180)}% Jump!)`;
  };

  const getVoiceColor = () => {
    if (voiceLevel < 0.05) return 'bg-gray-400';
    if (voiceLevel < 0.15) return 'bg-blue-400';
    if (voiceLevel < 0.35) return 'bg-green-400';
    return 'bg-red-400';
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Voice Level Indicator */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg pointer-events-auto">
        <div className="text-sm font-bold mb-2">Voice Level</div>
        <div className="w-32 h-4 bg-gray-700 rounded-full overflow-hidden mb-2">
          <div 
            className={`h-full transition-all duration-100 ${getVoiceColor()}`}
            style={{ width: `${voicePercentage}%` }}
          />
        </div>
        <div className="text-xs text-center">{getVoiceState()}</div>
      </div>

      {/* Score Display */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-6 py-2 rounded-lg">
        <div className="text-center">
          <div className="text-sm opacity-80">Distance</div>
          <div className="text-xl font-bold">{Math.floor(gameState.score)}m</div>
        </div>
      </div>

      {/* Lives Display */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Lives:</span>
          {Array.from({ length: gameState.lives }, (_, i) => (
            <span key={i} className="text-red-400">❤️</span>
          ))}
        </div>
      </div>

      {/* Pause Button */}
      <button
        onClick={gameState.isPaused ? resumeGame : pauseGame}
        className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg pointer-events-auto hover:bg-opacity-90 transition-all"
      >
        {gameState.isPaused ? '▶️ Resume' : '⏸️ Pause'}
      </button>

      {/* Pause Overlay */}
      {gameState.isPaused && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-auto">
          <div className="bg-white rounded-lg p-8 text-center max-w-sm">
            <h2 className="text-2xl font-bold mb-4">Game Paused</h2>
            <p className="text-gray-600 mb-6">Take a breath and get ready to continue!</p>
            <button
              onClick={resumeGame}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Resume Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
