# Clucky Voice - Voice-Controlled 2D Platformer Game

## Overview

Clucky Voice is a charming 2D platformer game where players control a chicken character using voice input. The game features a minimalist design with canvas-based rendering, voice-level detection for movement and jumping, and a progressive level system. Players navigate through obstacle courses using different voice intensities: whispers for slow movement, normal speech for fast movement, and shouting for jumping.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern client-server architecture with a React frontend and Express backend, designed specifically for a voice-controlled gaming experience.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system using CSS variables
- **UI Components**: Radix UI primitives for accessible, composable components
- **State Management**: Zustand for lightweight, type-safe state management
- **Game Engine**: Custom 2D canvas-based game engine with modular components
- **Voice Processing**: Web Audio API for real-time microphone input and audio analysis

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Development**: Vite for hot module replacement and development server
- **Build System**: esbuild for production bundling
- **Module System**: ES modules throughout the stack

## Key Components

### Game Engine Architecture
The game uses a custom 2D game engine built around HTML5 Canvas with the following components:

1. **GameEngine**: Central coordinator managing game loop, state, and component communication
2. **Chicken**: Player character with physics properties (position, velocity, collision bounds)
3. **Level**: Platform generation and level layout management
4. **Physics**: Gravity simulation, collision detection, and movement calculations
5. **Renderer**: Canvas drawing operations for game objects, backgrounds, and UI elements
6. **VoiceController**: Audio input processing with real-time voice level analysis

### Voice Input System
- **Web Audio API**: Captures microphone input with noise suppression and echo cancellation
- **Real-time Analysis**: Frequency domain analysis for voice level detection
- **Calibration**: Dynamic range adjustment for different microphone sensitivities
- **Smoothing**: Audio level smoothing to prevent jittery character movement

### UI Component System
- **Radix UI**: Provides accessible base components (dialogs, buttons, tooltips)
- **Custom Game UI**: Canvas-based game interface overlaid with HTML elements
- **Responsive Design**: Mobile-first approach with touch-action handling

### State Management
- **Game State**: Zustand stores for game phase, player stats, and voice levels
- **Audio State**: Centralized audio management for sound effects and music
- **Component State**: Local React state for UI interactions and form data

## Data Flow

### Game Loop
1. **Input Processing**: Voice controller analyzes microphone input and calculates voice level
2. **Physics Update**: Game engine applies gravity, movement, and collision detection
3. **State Update**: Game state updates trigger UI re-renders through Zustand subscriptions
4. **Rendering**: Canvas renderer draws game objects based on current state
5. **Audio Feedback**: Sound effects triggered by game events (collisions, victories)

### Voice Control Flow
1. **Microphone Capture**: Web Audio API accesses user microphone with permissions
2. **Signal Analysis**: Real-time frequency analysis converts audio to normalized levels
3. **Movement Translation**: Voice levels mapped to character actions:
   - Silent (0-10%): No movement
   - Whisper (10-30%): Slow walking
   - Normal (30-70%): Fast walking  
   - Shout (70-100%): Jumping
4. **Game Response**: Character movement updates trigger physics and rendering cycles

### State Synchronization
- **Unidirectional Flow**: Voice input → Game engine → State updates → UI rendering
- **Event-driven Updates**: Game events (collisions, level completion) trigger state changes
- **Reactive UI**: React components subscribe to Zustand state changes for automatic updates

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, Vite, TypeScript for modern development experience
- **UI Framework**: Radix UI, Tailwind CSS for consistent, accessible design system
- **State Management**: Zustand for lightweight state management
- **Audio Processing**: Web Audio API (browser native) for voice input processing

### Database Integration
- **ORM**: Drizzle ORM with PostgreSQL support for potential user data storage
- **Database Provider**: Neon Database (serverless PostgreSQL) for cloud deployment
- **Schema Management**: Type-safe database schemas with automatic TypeScript generation

### Development Tools
- **Build Tools**: Vite for development, esbuild for production builds
- **Code Quality**: TypeScript for type safety, ESLint configuration
- **Font System**: Fontsource for web font optimization
- **Asset Pipeline**: Vite asset handling for audio files and game resources

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with React Fast Refresh
- **Error Handling**: Runtime error overlay for development debugging
- **Asset Serving**: Vite handles static assets and font loading
- **Database**: Development uses local PostgreSQL with Drizzle migrations

### Production Build
- **Client Build**: Vite builds React app to static assets in `dist/public`
- **Server Build**: esbuild bundles Express server to `dist/index.js`
- **Asset Optimization**: Automatic code splitting, tree shaking, and minification
- **Font Optimization**: Preloaded web fonts for performance

### Database Deployment
- **Migration System**: Drizzle Kit handles database schema migrations
- **Connection Management**: Environment-based database URL configuration
- **Schema Validation**: Type-safe database operations with runtime validation

### Audio Asset Handling
- **File Support**: MP3, OGG, WAV audio files supported through Vite asset pipeline
- **Loading Strategy**: Lazy loading of audio assets to improve initial load time
- **Fallback Handling**: Graceful degradation when audio features are unavailable

The architecture prioritizes real-time performance for voice input processing while maintaining a smooth 60fps game experience through efficient Canvas rendering and optimized state updates.