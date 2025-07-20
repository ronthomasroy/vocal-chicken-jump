import { useEffect, useRef } from "react";
import { useVoiceGame } from "../lib/stores/useVoiceGame";
import { VoiceController } from "../lib/game/VoiceController";

export default function VoiceInput() {
  const { setVoiceLevel } = useVoiceGame();
  const voiceControllerRef = useRef<VoiceController | null>(null);

  useEffect(() => {
    const initVoiceInput = async () => {
      try {
        const voiceController = new VoiceController();
        await voiceController.initialize();
        
        voiceController.onVoiceLevelChange = (level: number) => {
          setVoiceLevel(level);
        };
        
        voiceControllerRef.current = voiceController;
        voiceController.start();
      } catch (error) {
        console.error('Failed to initialize voice input:', error);
        // Fallback to keyboard controls
        console.log('Voice input failed, using keyboard fallback');
      }
    };

    initVoiceInput();

    return () => {
      if (voiceControllerRef.current) {
        voiceControllerRef.current.stop();
      }
    };
  }, [setVoiceLevel]);

  return null; // This component only handles voice input, no UI
}
