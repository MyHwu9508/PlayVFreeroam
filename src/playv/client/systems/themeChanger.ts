import { colord } from 'colord';
import _ from 'lodash';
import alt from 'alt-client';
import { webView } from '../ui/view/webView';
import native from 'natives';
import { LocalStorage } from './localStorage';
import { DefaultThemes } from '../../shared/conf/ThemePresets';

export const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'surface'] as const;
export const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'on'] as const;
export type ColorShades = {
  [key in (typeof colors)[number]]: string;
};
export type MiscThemeProps = {
  activateInternetFonts: boolean;
  fontFamily: string;
  fontColor: string;
  rounded: number;
  roundedContainer: number;
  border: number;
};
export type ThemeProps = ColorShades & MiscThemeProps;
export type ExportTheme = { [key in (typeof colors)[number]]: string } & MiscThemeProps;

export const radiusSizes = [0, 2 / 16, 4 / 16, 6 / 16, 8 / 16, 10 / 16, 12 / 16, 1, 9999];
export const borderSizes = [0, 1 / 16, 2 / 16, 3 / 16, 4 / 16, 6 / 16, 8 / 16, 10 / 16, 12 / 16, 1];

export const supportedFonts = ['RobotoMono', 'Epilogue', 'Comic Sans MS', 'Quicksand', 'Rubik', 'system-ui'] as const;

class ThemeManager implements ThemeProps {
  updateTheme = _.throttle(() => {
    //Insert theme change code here
    // console.log('Theme updated!');
    const pickedTheme = _.pick(this, colors, ['darkMode', 'activateInternetFonts', 'fontFamily', 'fontColor', 'rounded', 'roundedContainer', 'border']);
    webView.emit('theme:change', pickedTheme); //TODO implement in UI?
    const rgb = colord(this.primary).toRgb();
    native.replaceHudColourWithRgba(143, rgb.r, rgb.g, rgb.b, 255);
    native.replaceHudColourWithRgba(116, rgb.r, rgb.g, rgb.b, 255);
    native.replaceHudColourWithRgba(142, rgb.r, rgb.g, rgb.b, 255);
  }, 100);
  primary: string;
  secondary: string;
  tertiary: string;
  success: string;
  warning: string;
  error: string;
  surface: string;

  activateInternetFonts: boolean;
  fontFamily: string;
  fontColor: string;
  rounded: number;
  roundedContainer: number;
  border: number;

  constructor() {
    for (const prop of Object.keys(DefaultThemes.PlayV)) {
      if (colors.includes(prop as (typeof colors)[number])) {
        const themeColor = LocalStorage.get(`ui.theme.${prop}` as never) ?? DefaultThemes.PlayV[prop];
        this[prop] = themeColor;
      } else {
        this[prop] = LocalStorage.get(`ui.theme.${prop}` as never) ?? DefaultThemes.PlayV[prop];
      }
    }
  }

  setFromJSON(json: string): void | string {
    try {
      if (!json.startsWith('{')) json = '{' + json;
      if (!json.endsWith('}')) json += '}';
      const parsed = JSON.parse(json);
      const [failedProps, parsedTheme] = this.validateThemeObject(parsed);
      if (failedProps.length === Object.keys(DefaultThemes.PlayV).length) {
        return 'Invalid JSON!';
      }
      this.setTheme(parsedTheme);
      if (failedProps.length > 0) return 'Missing Properties: ' + ' ' + failedProps.join(', ') + '.';
    } catch (err) {
      alt.logError('Error while parsing theme JSON.');
      alt.logError(err);
      return 'Invalid JSON! Error while parsing theme!';
    }
  }

  private validateThemeObject(theme: ExportTheme): [failedProps: string[], theme: ExportTheme] {
    const failedProps = [];
    const parsedTheme: ExportTheme = {} as never;
    for (const color of colors) {
      if (theme[color] && typeof theme[color] === 'string' && colord(theme[color]).isValid()) {
        parsedTheme[color] = theme[color];
      } else {
        parsedTheme[color] = this[color][500];
        failedProps.push(color);
      }
    }

    if (theme.fontFamily && typeof theme.fontFamily === 'string') {
      parsedTheme.fontFamily = theme.fontFamily;
    } else {
      parsedTheme.fontFamily = this.fontFamily;
      failedProps.push('fontFamily');
    }

    if (theme.fontColor && typeof theme.fontColor === 'string' && colord(theme.fontColor).isValid()) {
      parsedTheme.fontColor = theme.fontColor;
    } else {
      parsedTheme.fontColor = this.fontColor;
      failedProps.push('fontColor');
    }

    if (theme.rounded !== undefined && typeof theme.rounded === 'number') {
      parsedTheme.rounded = theme.rounded;
    } else {
      parsedTheme.rounded = this.rounded;
      failedProps.push('rounded');
    }

    if (theme.roundedContainer !== undefined && typeof theme.roundedContainer === 'number') {
      parsedTheme.roundedContainer = theme.roundedContainer;
    } else {
      parsedTheme.roundedContainer = this.roundedContainer;
      failedProps.push('roundedContainer');
    }

    if (theme.border !== undefined && typeof theme.border === 'number') {
      parsedTheme.border = theme.border;
    } else {
      parsedTheme.border = this.border;
      failedProps.push('border');
    }

    return [failedProps, parsedTheme];
  }

  private getPickedJSON() {
    const json = {};
    for (const prop of Object.keys(DefaultThemes.PlayV)) {
      if (colors.includes(prop as (typeof colors)[number])) {
        json[prop] = this[prop];
      } else {
        json[prop] = this[prop];
      }
    }
    return JSON.stringify(json, null, 2);
  }

  getMenuThemeText() {
    const text = this.getPickedJSON();
    return text.replace(/({\s)|(\s})|((?<=\s)\s)/g, '');
  }

  setThemeColor(color: (typeof colors)[number], hex: string) {
    this[color] = hex;
    LocalStorage.set(`ui.theme.${color}` as never, hex);
    this.updateTheme();
  }

  setMiscValue(misc: keyof MiscThemeProps, value: string | number | boolean) {
    this[misc] = value as never;
    LocalStorage.set(`ui.theme.${misc}` as never, value);
    this.updateTheme();
  }

  setTheme(theme: ExportTheme) {
    for (const prop of Object.keys(theme)) {
      if (colors.includes(prop as (typeof colors)[number])) {
        this[prop] = theme[prop];
      } else {
        this[prop] = theme[prop];
      }
      LocalStorage.set(`ui.theme.${prop}` as never, theme[prop]);
    }
    this.updateTheme();
  }

  applyPreset(preset: keyof typeof DefaultThemes) {
    this.setTheme(DefaultThemes[preset]);
  }
}

export const Theme = new ThemeManager();
