import alt from 'alt-server';

class AltvVoiceServerModule {
  voiceChannels: { [key: number]: alt.VoiceChannel } = {};

  constructor(channelRanges: number[]) {
    channelRanges.forEach(range => {
      this.voiceChannels[range] = new alt.VoiceChannel(true, range);
    });

    this.registerEvents();
  }

  registerEvents() {
    alt.onClient('changeVoiceRange', this.changeVoiceRange.bind(this));
    alt.onClient('setIsTalkingMeta', this.setIsTalkingMeta.bind(this));
  }

  setIsTalkingMeta(player: alt.Player, state: boolean) {
    player.setStreamSyncedMeta('isTalking', state);
  }

  removePlayerFromChannels(player: alt.Player) {
    Object.values(this.voiceChannels).forEach(channel => {
      if (channel.isPlayerInChannel(player)) {
        channel.removePlayer(player);
      }
    });
  }

  addPlayerToAllChannels(player: alt.Player) {
    Object.values(this.voiceChannels).forEach(channel => {
      channel.addPlayer(player);
    });
  }

  mutePlayerInAllChannels(player: alt.Player) {
    Object.values(this.voiceChannels).forEach(channel => {
      channel.mutePlayer(player);
    });
  }

  playerConnected(player: alt.Player) {
    this.addPlayerToAllChannels(player);
    this.mutePlayerInAllChannels(player);
    player.emitRaw('client:UpdateCurrentAltVoiceRange', player.voiceRange);
  }

  changeVoiceRange(player: alt.Player) {
    const channelRanges = Object.keys(this.voiceChannels).map(range => parseInt(range));
    const currentRangeIndex = channelRanges.indexOf(player.voiceRange);

    if (currentRangeIndex === -1) return;

    const nextRangeIndex = (currentRangeIndex + 1) % channelRanges.length;
    const newVoiceRange = channelRanges[nextRangeIndex];

    const newRangeInfo = {
      range: newVoiceRange,
      channel: this.voiceChannels[newVoiceRange],
    };

    this.mutePlayerInAllChannels(player);
    if (newRangeInfo.channel && newRangeInfo.range !== 0) {
      newRangeInfo.channel.unmutePlayer(player);
    }

    player.voiceRange = newRangeInfo.range;
    alt.emitClientUnreliable(player, 'voiceRangeChanged', newRangeInfo.range);
    if (player.voiceRange === 0) {
      player.pushToast('success', 'Your voice chat has been turned off.');
    } else {
      player.pushToast('success', `Voice Range changed to ${player.voiceRange}meters.`);
    }
  }
}

const channelRanges = [0, 5, 25, 50, 100];
export const altvVoiceServerModuleInstance = new AltvVoiceServerModule(channelRanges);
