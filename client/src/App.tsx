import { useEffect, useState } from "react";
import { useAudio } from "./lib/stores/useAudio";
import { useVoiceGame } from "./lib/stores/useVoiceGame";
import Game from "./components/Game";
import MainMenu from "./components/UI/MainMenu";
import GameOverScreen from "./components/UI/GameOverScreen";
import "@fontsource/inter";

function App() {
  const { gamePhase } = useVoiceGame();
  const { setHitSound, setSuccessSound } = useAudio();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize audio assets
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        // Load sound effects
        const hitAudio = new Audio('/sounds/hit.mp3');
        const successAudio = new Audio('/sounds/success.mp3');
        
        // Set volumes
        hitAudio.volume = 0.3;
        successAudio.volume = 0.5;
        
        // Store in audio state
        setHitSound(hitAudio);
        setSuccessSound(successAudio);
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to load audio assets:', error);
        setIsInitialized(true); // Still allow game to start without audio
      }
    };

    initializeAudio();
  }, [setHitSound, setSuccessSound]);

  if (!isInitialized) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-blue-400 to-green-400">
        <div className="text-white text-2xl font-bold">Loading Clucky Voice...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {gamePhase === 'menu' && <MainMenu />}
      {gamePhase === 'playing' && <Game />}
      {gamePhase === 'gameOver' && <GameOverScreen />}
    </div>
  );
}

export default App;
