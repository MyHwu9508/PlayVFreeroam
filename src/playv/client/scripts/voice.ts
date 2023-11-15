import * as alt from 'alt-client';
import { colord } from 'colord';
import native from 'natives';
import { keybindManager } from '../systems/keybinds';
import { setShowMicIcon } from '../ui/hud/micIcon';
import { permissions } from '../systems/access/permissions';

const player = alt.Player.local;

class AltvVoiceClientModule {
  declare talkingState: boolean;
  declare currentRange: number;
  declare showVoiceRangeInterval: number;
  declare hideMicIconTimeout: any;
  declare showVoiceRangeTimeout: any;

  constructor() {
    this.talkingState = false;
    this.currentRange = 0;
    this.registerEvents();
    this.hideMicIconTimeout = null; // To hold the timeout reference
    this.showVoiceRangeTimeout = null;
  }

  registerEvents() {
    keybindManager.registerEvent('keybind.changeVoiceRange', () => {
      alt.emitServer('changeVoiceRange');
    });

    alt.onServer('voiceRangeChanged', range => {
      this.currentRange = range;
      this.voiceRangeChanged(range);
    });
  }

  voiceRangeChanged(range: number) {
    this.clearVoiceRangeVisuals();
    if (range === 0) return;

    const themeColor = colord('#00dddd').toRgb();

    this.showVoiceRangeInterval = alt.everyTick(() => {
      native.drawMarker(
        1,
        player.pos.x,
        player.pos.y,
        native.getGroundZFor3dCoord(player.pos.x, player.pos.y, player.pos.z, 500, false, false)[1],
        0,
        0,
        0,
        0,
        0,
        0,
        range,
        range,
        2,
        themeColor.r,
        themeColor.g,
        themeColor.b,
        255,
        false,
        false,
        2,
        false,
        null,
        null,
        false
      );
    });

    this.showVoiceRangeTimeout = alt.setTimeout(this.clearVoiceRangeVisuals.bind(this), 5000); // Timeout nach 5 Sekunden
  }

  clearVoiceRangeVisuals() {
    if (this.showVoiceRangeInterval) {
      alt.clearEveryTick(this.showVoiceRangeInterval);
      this.showVoiceRangeInterval = undefined;
    }

    if (this.showVoiceRangeTimeout) {
      alt.clearTimeout(this.showVoiceRangeTimeout);
      this.showVoiceRangeTimeout = undefined;
    }
  }

  talkingTick() {
    if (this.currentRange !== 0 && player.micLevel > 0.02) {
      if (!this.talkingState) {
        this.talkingState = true;
        alt.emitServerRaw('setIsTalkingMeta', true);
        setShowMicIcon(true);
      }

      // Clear any existing timeout and start a new one
      if (this.hideMicIconTimeout) {
        clearTimeout(this.hideMicIconTimeout);
      }

      this.hideMicIconTimeout = setTimeout(() => {
        this.hideMicIconTimeout = null;
        this.hideMicIcon();
      }, 1000);
    } else {
      if (this.talkingState) {
        this.talkingState = false;
        // If there's no existing timeout, start one to hide the icon
        if (!this.hideMicIconTimeout) {
          this.hideMicIconTimeout = setTimeout(() => {
            this.hideMicIconTimeout = null;
            this.hideMicIcon();
          }, 1000);
        }
      }
    }
  }

  hideMicIcon() {
    alt.emitServerRaw('setIsTalkingMeta', false);
    setShowMicIcon(false);
  }
}

//initilize voice class instance
export const altvVoiceClientModuleInstance = new AltvVoiceClientModule();
