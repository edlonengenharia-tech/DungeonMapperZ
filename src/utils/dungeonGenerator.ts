import { TileType } from '../types';

interface DungeonConfig {
  width: number;
  height: number;
  roomMinSize: number;
  roomMaxSize: number;
  roomCount: number;
  corridorWidth: number;
  wallType: string;
  floorType: string;
}

interface Room {
  x: number;
  y: number;
  w: number;
  h: number;
  centerX: number;
  centerY: number;
}

const DEFAULT_CONFIG: DungeonConfig = {
  width: 40,
  height: 40,
  roomMinSize: 4,
  roomMaxSize: 10,
  roomCount: 8,
  corridorWidth: 1,
  wallType: 'wall',
  floorType: 'floor',
};

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roomsOverlap(a: Room, b: Room, padding: number = 1): boolean {
  return !(
    a.x + a.w + padding <= b.x ||
    b.x + b.w + padding <= a.x ||
    a.y + a.h + padding <= b.y ||
    b.y + b.h + padding <= a.y
  );
}

function generateRooms(config: DungeonConfig): Room[] {
  const rooms: Room[] = [];
  let attempts = 0;
  const maxAttempts = 200;

  while (rooms.length < config.roomCount && attempts < maxAttempts) {
    attempts++;
    const w = rand(config.roomMinSize, config.roomMaxSize);
    const h = rand(config.roomMinSize, config.roomMaxSize);
    const x = rand(1, config.width - w - 1);
    const y = rand(1, config.height - h - 1);

    const newRoom: Room = { x, y, w, h, centerX: Math.floor(x + w / 2), centerY: Math.floor(y + h / 2) };

    const overlaps = rooms.some(r => roomsOverlap(r, newRoom, 2));
    if (!overlaps) {
      rooms.push(newRoom);
    }
  }

  return rooms;
}

function carveRoom(grid: (string | null)[][], room: Room, floorType: string, wallType: string) {
  // Carve floor
  for (let y = room.y; y < room.y + room.h; y++) {
    for (let x = room.x; x < room.x + room.w; x++) {
      if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
        grid[y][x] = floorType;
      }
    }
  }

  // Add walls around room
  for (let y = room.y - 1; y <= room.y + room.h; y++) {
    for (let x = room.x - 1; x <= room.x + room.w; x++) {
      if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
        if (grid[y][x] === null) {
          grid[y][x] = wallType;
        }
      }
    }
  }
}

function carveCorridor(
  grid: (string | null)[][],
  x1: number, y1: number,
  x2: number, y2: number,
  floorType: string, wallType: string,
  width: number
) {
  const halfW = Math.floor(width / 2);

  // Horizontal segment
  const startX = Math.min(x1, x2);
  const endX = Math.max(x1, x2);
  for (let x = startX; x <= endX; x++) {
    for (let w = -halfW; w <= halfW; w++) {
      const y = y1 + w;
      if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
        grid[y][x] = floorType;
      }
    }
  }

  // Vertical segment
  const startY = Math.min(y1, y2);
  const endY = Math.max(y1, y2);
  for (let y = startY; y <= endY; y++) {
    for (let w = -halfW; w <= halfW; w++) {
      const x = x2 + w;
      if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
        grid[y][x] = floorType;
      }
    }
  }

  // Add walls around corridor
  for (let x = startX - 1; x <= endX + 1; x++) {
    for (let w = -halfW - 1; w <= halfW + 1; w++) {
      const y = y1 + w;
      if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
        if (grid[y][x] === null) grid[y][x] = wallType;
      }
    }
  }
  for (let y = startY - 1; y <= endY + 1; y++) {
    for (let w = -halfW - 1; w <= halfW + 1; w++) {
      const x = x2 + w;
      if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
        if (grid[y][x] === null) grid[y][x] = wallType;
      }
    }
  }
}

function connectRooms(
  grid: (string | null)[][],
  rooms: Room[],
  floorType: string,
  wallType: string,
  corridorWidth: number
) {
  for (let i = 1; i < rooms.length; i++) {
    const prev = rooms[i - 1];
    const curr = rooms[i];

    if (Math.random() > 0.5) {
      carveCorridor(grid, prev.centerX, prev.centerY, curr.centerX, prev.centerY, floorType, wallType, corridorWidth);
      carveCorridor(grid, curr.centerX, prev.centerY, curr.centerX, curr.centerY, floorType, wallType, corridorWidth);
    } else {
      carveCorridor(grid, prev.centerX, prev.centerY, prev.centerX, curr.centerY, floorType, wallType, corridorWidth);
      carveCorridor(grid, prev.centerX, curr.centerY, curr.centerX, curr.centerY, floorType, wallType, corridorWidth);
    }
  }
}

function addDoors(grid: (string | null)[][], rooms: Room[]) {
  for (const room of rooms) {
    // Try to place a door on each wall
    const sides = [
      { x: room.x + Math.floor(room.w / 2), y: room.y - 1, dx: 0, dy: -1 },
      { x: room.x + Math.floor(room.w / 2), y: room.y + room.h, dx: 0, dy: 1 },
      { x: room.x - 1, y: room.y + Math.floor(room.h / 2), dx: -1, dy: 0 },
      { x: room.x + room.w, y: room.y + Math.floor(room.h / 2), dx: 1, dy: 0 },
    ];

    for (const side of sides) {
      if (side.y >= 0 && side.y < grid.length && side.x >= 0 && side.x < grid[0].length) {
        // Check if this wall connects to a corridor
        const outsideX = side.x + side.dx;
        const outsideY = side.y + side.dy;
        if (
          outsideY >= 0 && outsideY < grid.length &&
          outsideX >= 0 && outsideX < grid[0].length &&
          grid[outsideY][outsideX] === 'floor' &&
          grid[side.y][side.x] === 'wall'
        ) {
          if (Math.random() > 0.5) {
            grid[side.y][side.x] = 'door';
          }
        }
      }
    }
  }
}

function addFeatures(grid: (string | null)[][], rooms: Room[]) {
  for (const room of rooms) {
    const featureRoll = Math.random();

    if (featureRoll < 0.1 && room.w >= 5 && room.h >= 5) {
      // Add pillars
      const pillarPositions = [
        { x: room.x + 1, y: room.y + 1 },
        { x: room.x + room.w - 2, y: room.y + 1 },
        { x: room.x + 1, y: room.y + room.h - 2 },
        { x: room.x + room.w - 2, y: room.y + room.h - 2 },
      ];
      for (const pos of pillarPositions) {
        if (pos.y >= 0 && pos.y < grid.length && pos.x >= 0 && pos.x < grid[0].length) {
          grid[pos.y][pos.x] = 'stone';
        }
      }
    } else if (featureRoll < 0.15 && room.w >= 4 && room.h >= 4) {
      // Add water pool
      const poolW = rand(2, Math.min(3, room.w - 2));
      const poolH = rand(2, Math.min(3, room.h - 2));
      const poolX = room.x + rand(1, room.w - poolW - 1);
      const poolY = room.y + rand(1, room.h - poolH - 1);
      for (let y = poolY; y < poolY + poolH; y++) {
        for (let x = poolX; x < poolX + poolW; x++) {
          if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
            grid[y][x] = 'water';
          }
        }
      }
    } else if (featureRoll < 0.2) {
      // Add altar in center
      const cx = room.centerX;
      const cy = room.centerY;
      if (cy >= 0 && cy < grid.length && cx >= 0 && cx < grid[0].length) {
        grid[cy][cx] = 'altar';
      }
    } else if (featureRoll < 0.25) {
      // Add rubble
      const rubbleCount = rand(1, 3);
      for (let i = 0; i < rubbleCount; i++) {
        const rx = room.x + rand(0, room.w - 1);
        const ry = room.y + rand(0, room.h - 1);
        if (ry >= 0 && ry < grid.length && rx >= 0 && rx < grid[0].length) {
          grid[ry][rx] = 'rubble';
        }
      }
    }
  }
}

export function generateRandomDungeon(partialConfig?: Partial<DungeonConfig>): (string | null)[][] {
  const config = { ...DEFAULT_CONFIG, ...partialConfig };
  const grid: (string | null)[][] = Array.from({ length: config.height }, () =>
    Array(config.width).fill(null)
  );

  const rooms = generateRooms(config);

  // Carve rooms
  for (const room of rooms) {
    carveRoom(grid, room, config.floorType, config.wallType);
  }

  // Connect rooms with corridors
  connectRooms(grid, rooms, config.floorType, config.wallType, config.corridorWidth);

  // Add doors
  addDoors(grid, rooms);

  // Add features
  addFeatures(grid, rooms);

  return grid;
}

export type { DungeonConfig };
export { DEFAULT_CONFIG };
