import { useVoiceGame } from "../../lib/stores/useVoiceGame";

export default function GameOverScreen() {
  const { gameState, restartGame, goToMenu } = useVoiceGame();

  const isVictory = gameState.hasWon;
  const finalDistance = Math.floor(gameState.score);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-purple-600 to-blue-600 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {isVictory && (
          <>
            <div className="absolute top-10 left-10 text-6xl animate-bounce">🎉</div>
            <div className="absolute top-20 right-20 text-6xl animate-bounce delay-300">✨</div>
            <div className="absolute bottom-20 left-20 text-6xl animate-bounce delay-600">🏆</div>
            <div className="absolute bottom-10 right-10 text-6xl animate-bounce delay-900">🎊</div>
          </>
        )}
      </div>

      {/* Game Over Card */}
      <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center relative z-10">
        <div className="mb-6">
          <div className="text-6xl mb-4">
            {isVictory ? '🏆' : '💔'}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isVictory ? 'Victory!' : 'Game Over'}
          </h1>
          <p className="text-gray-600">
            {isVictory 
              ? 'Clucky made it to the end!' 
              : 'Clucky fell off the path!'
            }
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {finalDistance}m
          </div>
          <div className="text-sm text-gray-600">Distance Traveled</div>
          
          {isVictory && (
            <div className="mt-3 text-lg text-green-600 font-semibold">
              🎯 Level Complete!
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={restartGame}
            className="w-full bg-green-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors shadow-lg"
          >
            🔄 Play Again
          </button>
          
          <button
            onClick={goToMenu}
            className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-colors shadow-lg"
          >
            🏠 Main Menu
          </button>
        </div>

        {/* Encouragement Message */}
        <div className="mt-4 text-sm text-gray-500">
          {isVictory 
            ? "Amazing voice control! You're a natural!" 
            : "Keep practicing your voice control!"
          }
        </div>
      </div>
    </div>
  );
}
