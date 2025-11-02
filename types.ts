export type Role = 'user' | 'model';

export interface Turn {
  role: Role;
  parts: { text: string }[];
}

export interface DisplayMessage {
  id: string;
  role: Role;
  naturalReply: string;
  isLoading?: boolean;
  file?: {
    name: string;
    type: string;
    url: string; // A data URL for preview
  };
}

export enum DocStatus {
  RED = 'RED',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  UNKNOWN = 'UNKNOWN',
}

export interface Source {
  web: {
    uri: string;
    title: string;
  };
}
