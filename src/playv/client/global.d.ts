import type { flog, flog2D, flogDebug, flogError } from './utils/logger';
import type { Player } from 'alt-client';

declare global {
  const localPlayer: Player;
  const log: typeof flog;
  const logDebug: typeof flogDebug;
  const logError: typeof flogError;
  const log2D: typeof flog2D;
}
export {};
