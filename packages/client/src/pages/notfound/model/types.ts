export type GameState = 'idle' | 'playing' | 'gameOver';

export type ObstacleType = 'cactus-large' | 'cactus-small' | 'cactus-cluster';

export type Obstacle = {
  id: number;
  type: ObstacleType;
  x: number;
  width: number;
  height: number;
};

export type Cloud = { id: number; x: number; y: number };
