import { Room } from '../sockets/room';

export interface Boards {
  [roomId: string]: Room;
}

export interface MapData {
  stratName: string;
  stratId?: string;
  data: DrawBoardState;
}

export interface Client {
  userName: string;
  color: string;
  position: {
    x: number;
    y: number;
  };
}

export interface DrawBoardState {
  images: unknown[];
  lines: unknown[];
  texts: unknown[];
  players: unknown[];
}

export interface PlayerItem {
  id: string;
  playerId?: string;
  x: number;
  y: number;
  name?: string;
  color: string;
}
