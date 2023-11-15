import * as alt from 'alt-server';
import chalk from 'chalk';

/**
 * Logs content into the console
 *
 * @param colorMode
 * @param content
 * @param debugOnly Show log only when server is in debug mode
 */
export default function log(
  colorMode: 'success' | 'warning' | 'error' | 'fatal' | 'information' | 'anticheat' | 'pink' | 'debug' | 'admin',
  content: string,
  debugOnly: boolean = false,
  background: string = undefined,
  hex: string = undefined
) {
  if (debugOnly && !alt.debug) return;

  let color = 'grey';
  switch (colorMode) {
    case 'success':
      color = 'greenBright';
      break;
    case 'warning':
      color = 'yellowBright';
      break;
    case 'error':
      color = 'redBright';
      break;
    case 'fatal':
      color = 'black';
      background = 'bgRedBright';
      break;
    case 'information':
      color = 'blue';
      break;
    case 'anticheat':
      hex = '#00cdcd';
      break;
    case 'pink':
      hex = '#D885A9';
      break;
    case 'debug':
      hex = '#FF8000';
      break;
    case 'admin':
      hex = '#FF3366';
      break;
    default:
      return alt.log('bad color mode!' + content);
  }

  if (!color || !content) return alt.log(chalk.redBright('ERROR logging without provided color or content!'));

  let res = '';
  if (color) res = chalk[color](content);
  if (hex) res = chalk.hex(hex)(content);
  if (background && color) res = chalk[color][background](res);

  alt.log(res);
}
