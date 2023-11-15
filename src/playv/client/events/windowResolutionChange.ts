import alt from 'alt-client';
import { updateKillFeedAnchors } from '../ui/hud/killfeed';

alt.on('windowResolutionChange', () => {
  updateKillFeedAnchors();
});

alt.on('windowFocusChange', () => {
  updateKillFeedAnchors();
});
