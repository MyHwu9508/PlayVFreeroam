import alt from 'alt-client';

let fpsHistory: number[] = [];
export let currentAverageFPS = 100;

export function calculateAverageFPS() {
  const currentFPS = alt.getFps();
  fpsHistory.push(currentFPS);

  // Keep only the last 30 FPS values
  if (fpsHistory.length > 30) {
    fpsHistory.shift(); // Remove the oldest value
  }

  // Calculate the average FPS
  const totalFPS = fpsHistory.reduce((sum, fps) => sum + fps, 0);
  const averageFPS = totalFPS / fpsHistory.length;
  currentAverageFPS = averageFPS;
}
