import alt from 'alt-shared';
export type NotificationType = 'success' | 'error' | 'information' | 'warning';
export type NoteType = 'AdminAction' | 'Kicked' | 'Banned' | 'Warned' | 'Other' | 'Anticheat' | 'Vehicle' | 'Character' | 'Login';
export type WheelStanceData = [number[], number[], number[]];
export type ChatRanges = 'Near' | 'Lobby' | 'Global' | 'Team';
export type ChatMessage = {
  username: string;
  text: string;
  tagColor: string;
  range: string;
  iconURL?: string;
  tag?: string;
  longTag?: string;
};
export type CommunityVehicle = [number, string, string, string];
export type SavedVehicle = [number, string, string, boolean];
export type ModdedVehicle = [string, string, string, string];
export interface AdminListData {
  userID: number; // Assuming userID is a number, change the type accordingly
  gameID: number;
  name: string;
  authlevel: number; // Assuming authlevel is a number, change the type accordingly
  position: alt.Vector3; // Assuming position is of type Vector3, change the type accordingly
  dimension: number; // Assuming dimension is a number, change the type accordingly
  isMuted: boolean;
  warns: number; // Assuming warns is a number, change the type accordingly
  spawnedVehicles: number; // Assuming spawnedVehicles is a number, change the type accordingly
  ping: number;
  playtime: number; // Assuming playtime is a number, change the type accordingly
}
export type KillFeedEntry = {
  killerName: string;
  victimName: string;
  imageName: string;
  id?: number;
};

export type KillFeedAnchors = {
  left: number;
  top: number;
  width: number;
};
