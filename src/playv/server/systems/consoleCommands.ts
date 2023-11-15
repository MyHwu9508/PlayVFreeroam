import weather from '../scripts/weather';
import alt from 'alt-server';

alt.on('consoleCommand', (command, ...args) => {
  switch (command) {
    case 'changeweather':
      alt.log('forceChange');
      weather.forceChange();
      break;
  }
});
