import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { GameEngine } from "../game/GameEngine";

export type GamePhase = "menu" | "playing" | "gameOver";

interface GameState {
  score: number;
  lives: number;
  isPaused: boolean;
  hasWon: boolean;
  level: number;
}

interface VoiceGameStore {
  gamePhase: GamePhase;
  gameState: GameState;
  voiceLevel: number;
  gameEngine: GameEngine | null;
  
  // Actions
  startGamePhase: () => void;
  goToMenu: () => void;
  initializeGame: (canvas: HTMLCanvasElement) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  endGame: (hasWon?: boolean) => void;
  setVoiceLevel: (level: number) => void;
  updateGameState: (updates: Partial<GameState>) => void;
}

const initialGameState: GameState = {
  score: 0,
  lives: 3,
  isPaused: false,
  hasWon: false,
  level: 1,
};

export const useVoiceGame = create<VoiceGameStore>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: "menu",
    gameState: initialGameState,
    voiceLevel: 0,
    gameEngine: null,

    startGamePhase: () => {
      set({ gamePhase: "playing" });
    },

    goToMenu: () => {
      const { gameEngine } = get();
      if (gameEngine) {
        gameEngine.stop();
      }
      set({ 
        gamePhase: "menu",
        gameState: initialGameState,
        gameEngine: null 
      });
    },

    initializeGame: (canvas: HTMLCanvasElement) => {
      const { gameEngine: existingEngine } = get();
      if (existingEngine) {
        existingEngine.stop();
      }

      const gameEngine = new GameEngine(canvas);
      
      // Set up game engine callbacks
      gameEngine.onGameStateChange = (updates: Partial<GameState>) => {
        get().updateGameState(updates);
      };

      gameEngine.onGameEnd = (hasWon: boolean) => {
        get().endGame(hasWon);
      };

      set({ gameEngine });
    },

    startGame: () => {
      const { gameEngine } = get();
      if (gameEngine) {
        gameEngine.start();
      }
    },

    pauseGame: () => {
      const { gameEngine } = get();
      if (gameEngine) {
        gameEngine.pause();
      }
      set((state) => ({
        gameState: { ...state.gameState, isPaused: true }
      }));
    },

    resumeGame: () => {
      const { gameEngine } = get();
      if (gameEngine) {
        gameEngine.resume();
      }
      set((state) => ({
        gameState: { ...state.gameState, isPaused: false }
      }));
    },

    restartGame: () => {
      const { gameEngine } = get();
      if (gameEngine) {
        gameEngine.restart();
      }
      set({ 
        gamePhase: "playing",
        gameState: initialGameState 
      });
    },

    endGame: (hasWon = false) => {
      set((state) => ({
        gamePhase: "gameOver",
        gameState: { ...state.gameState, hasWon }
      }));
    },

    setVoiceLevel: (level: number) => {
      const { gameEngine } = get();
      if (gameEngine) {
        gameEngine.setVoiceInput(level);
      }
      set({ voiceLevel: level });
    },

    updateGameState: (updates: Partial<GameState>) => {
      set((state) => ({
        gameState: { ...state.gameState, ...updates }
      }));
    },
  }))
);
