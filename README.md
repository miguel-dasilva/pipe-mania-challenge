# Pipe Mania Challenge

A browser-based puzzle game inspired by the classic Pipe Mania (also known as Pipe Dream). Built with Phaser 3 and JavaScript.

## 🎮 Game Description

Connect pipes to create the longest possible path for water to flow through. The water starts flowing from a designated starting point after a short time delay. The goal is to create a path that meets or exceeds the minimum length requirement before the water reaches a dead end.

## 🛠 Tech Stack
- Node.js `v23.2.0`
- npm `v10.2.3`
- Phaser 3 `v3.87.0` - Game framework
- Parcel`v2.13.0` - Build tool

### Installation

1. Clone the repository:
```bash
git clone https://github.com/miguel-dasilva/pipe-mania-challenge.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start
```

4. Open the game in your browser:
```bash
http://localhost:1234
```


### Build
```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🎯 How to Play

1. Click on empty grid spaces to place pipes
2. Create a continuous path from the starting pipe
3. Connect pipes to reach the required path length
4. Water will start flowing after a few seconds
5. You win if the water can flow through a path that meets or exceeds the minimum length
6. You can substitute pipes that haven't been filled with water by clicking on them
7. Darker tiles are blocked

## 📁 Project Structure

- `src/` - Source code
  - `core/` - Core game mechanics (Grid, Piece, Queue, PieceFactory)
  - `animations/` - Complex animations
  - `managers/` - Game state and water flow management
  - `scenes/` - Phaser scenes
  - `states/` - Game state implementations
  - `types/` - Type definitions and configurations
  - `utils/` - Utility classes

## System Architecture

### Core/
#### 1. Grid (`Grid.js`)
**Responsibility**: Manage the game board and pipe placements.
- Maintains the 2D grid of pipe pieces
- Handles pipe placement and removal
- Manages blocked cells
- Coordinates with WaterFlowManager for water propagation

#### 2. Piece (`Piece.js`)
**Responsibility**: Represents individual pipe pieces
- Stores pipe type and rotation
- Manages pipe connections and water flow directions
- Handles sprite rendering and basic effects
- Tracks wet/dry piece state

#### 3. PieceFactory (`PieceFactory.js`)
**Responsibility**: Encapsulate Piece randomization logic

#### 3. Queue (`Queue.js`)
**Responsibility**: Manages upcoming pipe pieces
- Maintains queue of next pieces
- Handles piece dequeuing and enqueuing
- Renders queue visualization
- Works with PieceFactory for new pieces

### Managers/
#### 1. GameStateManager (`GameStateManager.js`)
**Responsibility**: Manages overall game state and transitions
- Tracks current game state
- Handles state-specific logic
- Manages scene changes

#### 2. Water Flow Manager (`WaterFlowManager.js`)
**Responsibility**: Controls water propagation
- Manages water flow through pipes
- Tracks water path
- Determines if water is flowing or stopped

### Scenes/
#### 1. GameScene (`GameScene.js`)
**Responsibility**: Manages the main gameplay loop
- Initializes game components
- Loads assets
- Sets up game systems
- Manages scene lifecycle

### States/
#### 1. Base State {`GameState.js`}
**Responsability**: Defines state interface
- Define common methods for all states

#### 2. Playing State (`PlayingState.js`)
**Responsability**: Manages gameplay loop
- Generates Grid and Queue
- Handle player click input

#### 3. Game Over State (`GameOverState.js`)
**Responsability**: Manages game over logic
- Displays win/lose
- Restart button

### Types/
#### 1. PipeType (`PipeType.js`)
**Responsability**: Defines pipe types
- Define points of connection for each pipe type and respective rotation

### Utils/
#### 1. PositionCalculator (`PositionCalculator.js`)
**Responsability**: Manages position calculations
- Calculate grid positions
- Scale calculations

### Design Patterns
#### 1. State Pattern
Used in `GameState`, `PlayingState`, and `GameOverState` classes to manage different game states.

**Why?**
- Separate different game state logics.
- Make state transitions explicit and easy to manage.
- Easy to extend to more states.

#### 2. Singleton Pattern
Used in `PositionCalculator` class to manage the game's position calculations.

**Why?**
- Ensure that there is only one instance of `PositionCalculator` throughout the game.
- Centralize the position calculations and make them easily accessible.
- Centralizes scaling and offset calculations.

#### 3. Factory Pattern
Used in `PieceFactory` class to create different types of pipe pieces.

**Why?**
- Abstract the creation logic of different pipe pieces.
- Encapsulate the randomization of pipe types and rotation.
- Easy to extend to more types of pieces.

## 🎨 Assets

All the assets were obtained from [Kenney](https://kenney.nl).

The game uses various pipe and texture assets for:
- Different pipe types (straight, curved, cross, T-shaped)
- Water flow effects
- Background tiles
- UI elements