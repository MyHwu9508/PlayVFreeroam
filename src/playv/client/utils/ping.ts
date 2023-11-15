import alt from 'alt-client';

let pingHistory: number[] = [];
export let currentAveragePing = 1;

export function calculateAveragePing() {
  const currentPing = alt.getPing();
  pingHistory.push(currentPing);

  // Keep only the last 30 FPS values
  if (pingHistory.length > 20) {
    pingHistory.shift(); // Remove the oldest value
  }

  // Calculate the average FPS
  const totalPing = pingHistory.reduce((sum, fps) => sum + fps, 0);
  const averagePing = totalPing / pingHistory.length;
  currentAveragePing = averagePing;
}
