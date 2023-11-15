import alt from 'alt-client';
import native from 'natives';
import { ConVar } from '../../../shared/conf/ConVars';
import { getLobbySetting } from '../../systems/lobby';
import { LocalStorage } from '../../systems/localStorage';

class TimeSyncController {
  constructor() {
    this.startSync();
  }

  private startSync() {
    alt.setInterval(() => {
      if (getLobbySetting('syncTimeOption') !== 'Server') return;
      const gameMinutes = Math.floor((alt.getNetTime() + ConVar.TIME.START_OFFSET) / ConVar.TIME.MS_PER_MINUTE);
      this.setGameTime(gameMinutes);
    }, 5000); // Sync every 5 seconds because of time drift in code and GTA
  }

  private setGameTime(gameMinutes: number) {
    const hours = Math.floor(gameMinutes / 60) % 24;
    const minutes = gameMinutes % 60;

    // Handle the case where hours reach 24
    const correctedHours = hours >= 24 ? 0 : hours;

    //logDebug(`Setting game time to ${correctedHours}:${minutes}`);
    native.setClockTime(correctedHours, minutes, 0);
    alt.setMsPerGameMinute;
  }

  refreshTime() {
    if (getLobbySetting('syncTimeOption') === 'Lobby') {
      native.pauseClock(true);
      native.setClockTime(getLobbySetting('timeHours'), getLobbySetting('timeMinutes'), 0);
    } else if (getLobbySetting('syncTimeOption') === 'Off') {
      native.pauseClock(true);
      native.setClockTime(LocalStorage.get('timeHours'), LocalStorage.get('timeMinutes'), 0);
    } else {
      //Server
      native.pauseClock(false);
    }
  }
}

export default new TimeSyncController();
