import alt from 'alt-server';
import { WeathersWithProbabilities } from '../../shared/conf/Weathers';

class Weather {
  oldWeather: string;
  newWeather: string;
  percentWeather2: number; //used for transition
  weatherChangeInterval: number;
  transitionDuration: number;
  timeoutWeatherChange: number;

  constructor() {
    this.oldWeather = 'CLEAR';
    this.newWeather = 'CLEAR';
    this.percentWeather2 = 1;
    this.weatherChangeInterval = 30 * 60 * 1000; // Change weather every x minutes (in milliseconds)
    this.transitionDuration = Math.random() * (2 * 60 * 1000 - 15 * 1000) + 15 * 1000; // Transition duration between 15 seconds and 2 minutes (in milliseconds)
    this.registerEvents();
    this.scheduleWeatherChange();
  }

  forceChange() {
    this.changeWeather();
  }

  private registerEvents() {
    alt.on('playerConnect', player => this.handlePlayerConnect(player));
  }

  private scheduleWeatherChange() {
    if (this.timeoutWeatherChange) alt.clearTimeout(this.timeoutWeatherChange);
    this.timeoutWeatherChange = alt.setTimeout(() => {
      this.changeWeather();
      this.timeoutWeatherChange = undefined;
    }, this.weatherChangeInterval);
  }

  private changeWeather() {
    this.randomizeWeather();
    this.transitionDuration = Math.random() * (3 * 60 * 1000 - 1 * 60 * 1000) + 1 * 60 * 1000; // Recalculate transition duration
    alt.logDebug(`Changing weather to: ${this.newWeather} (Transition duration: ${this.transitionDuration / 1000} seconds)`);
    this.updateWeather();
    this.scheduleWeatherChange();
  }

  private updateWeather() {
    this.percentWeather2 += 1000 / this.transitionDuration; // Increase percent by 1 every second
    if (this.percentWeather2 >= 1) {
      this.percentWeather2 = 1; // Ensure it doesn't go beyond 1
    }
    alt.logDebug(`syncWeather ${this.oldWeather} ${this.newWeather} ${this.percentWeather2}`);
    alt.emitAllClientsUnreliable('syncWeather', this.oldWeather, this.newWeather, this.percentWeather2);

    if (this.percentWeather2 < 1) {
      // Schedule the next update if transition is ongoing
      alt.setTimeout(() => this.updateWeather(), 1000); // Send updates every second
    }
  }

  private handlePlayerConnect(player: alt.Player) {
    player.emitRaw('syncWeather', this.oldWeather, this.newWeather, this.percentWeather2);
  }

  private randomizeWeather() {
    const totalProbability = WeathersWithProbabilities.reduce((sum, item) => sum + item.probability, 0);
    const random = Math.random() * totalProbability;
    let cumulativeProbability = 0;

    for (const item of WeathersWithProbabilities) {
      cumulativeProbability += item.probability;
      if (random < cumulativeProbability) {
        this.oldWeather = this.newWeather;
        this.newWeather = item.weather;
        break;
      }
    }
    this.percentWeather2 = 0;
  }
}

export default new Weather();
