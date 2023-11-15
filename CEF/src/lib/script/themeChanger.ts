import { colord, type RgbaColor } from 'colord';

const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'surface'] as const;
const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const;
type ColorShades = {
  [key in (typeof colors)[number]]: string;
};
type MiscThemeProps = {
  activateInternetFonts: boolean;
  fontFamily: string;
  fontColor: string;
  rounded: number;
  roundedContainer: number;
  border: number;
};

export function registerThemeChanger() {
  alt.on('theme:change', applyTheme);
  alt.on('theme:rgbMode', setRGBMode);
}

let rgbModeColor = colord({ h: 0, s: 100, l: 50 });
const rgbModeSpeed = 1.4;
let rgbModeTimer: NodeJS.Timeout;
function setRGBMode(state: boolean) {
  if (rgbModeTimer) clearInterval(rgbModeTimer);
  if (state) {
    rgbModeTimer = setInterval(() => {
      rgbModeColor = rgbModeColor.rotate(rgbModeSpeed);
      applyShades(rgbModeColor.toRgb(), 'primary');
      applyShades(rgbModeColor.rotate(30).toRgb(), 'secondary');
      applyShades(rgbModeColor.rotate(60).toRgb(), 'tertiary');
    }, 50);
  }
}

function applyShades(color: RgbaColor, colorName: (typeof colors)[number]) {
  const shadeColors = generateColorShades(color);
  for (const shade of shades) {
    const c = shadeColors[shade];
    document.body.style.setProperty(`--color-${colorName}-${shade}`, `${c.r} ${c.g} ${c.b}`);
  }
}

function applyTheme(theme: ColorShades & MiscThemeProps) {
  for (const color of colors) {
    applyShades(colord(theme[color]).toRgb(), color);
  }

  // Font Loading
  if (theme.activateInternetFonts) {
    if (!checkIfFontIsLoaded(theme.fontFamily)) {
      loadedFonts[theme.fontFamily] = 'Comic Sans MS';
      const foundUrls = loadFontFromURL(theme.fontFamily);
      if (!foundUrls) {
        // console.log("No urls searching CDN's");
        requestFontStylesheet('https://fonts.cdnfonts.com/css/' + theme.fontFamily.replaceAll(' ', '-'), theme.fontFamily);
        requestFontStylesheet('https://fonts.googleapis.com/css?family=' + theme.fontFamily.replaceAll(' ', '+'), theme.fontFamily);
      }
    }
  } else {
    document.body.style.setProperty(`--theme-font-family-base`, theme.fontFamily);
  }

  document.body.style.setProperty(`--theme-font-family-heading`, theme.fontFamily);
  const fc = colord(theme.fontColor).toRgb();
  document.body.style.setProperty(`--theme-font-color-base`, `${fc.r} ${fc.g} ${fc.b}`);
  const fcd = colord(theme.fontColor).toRgb();
  document.body.style.setProperty(`--theme-font-color-dark`, `${fcd.r} ${fcd.g} ${fcd.b}`);
  document.body.style.setProperty(`--theme-rounded-base`, String(theme.rounded) + 'rem');
  document.body.style.setProperty(`--theme-rounded-container`, String(theme.roundedContainer) + 'rem');
  document.body.style.setProperty(`--theme-border-base`, String(theme.border) + 'rem');
}

let count = 0;
const loadedFonts: { [url: string]: string } = {};

function checkIfFontIsLoaded(font: string) {
  try {
    if (Object.keys(loadedFonts).includes(font)) {
      document.body.style.setProperty(`--theme-font-family-base`, loadedFonts[font]);
      return true;
    } else if (document.fonts.check(`12px ${font}`)) {
      document.body.style.setProperty(`--theme-font-family-base`, font);
      return true;
    }
    return false;
  } catch (e) {
    console.warn(e);
    return false;
  }
}

function loadFontFromURL(font: string): boolean {
  // console.info('MAKING REQUEST FOR FONT: ' + font);
  let urls =
    font.match(
      /(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()[\]{};:'".,<>?«»“”‘’]))?/gi
    ) || ([] as string[]);
  urls = urls.filter(url => url.split('/').length > 2);
  if (urls.length === 0) return false;

  if (urls.length > 1)
    // console.warn(
    // 	'Multiple font urls found, later ones may override earlier ones.' + urls.join(', ')
    // );
    for (const url of urls) {
      // console.log('Trying parsed URL: ' + url);
      if (url.endsWith('.ttf') || url.endsWith('.otf') || url.endsWith('.woff') || url.endsWith('.woff2')) {
        loadFromFile(url, font);
      } else {
        requestFontStylesheet(url, font);
      }
    }
  return true;
}

function loadFromFile(href: string, fontName: string) {
  const customFont = new FontFace('Custom Font' + String(count++), 'url(' + href + ')');
  document.fonts.add(customFont);
  customFont.load().then(font => {
    document.body.style.setProperty(`--theme-font-family-base`, font.family);
    loadedFonts[fontName] = font.family;
    // console.log('Loaded font: ' + font.family);
  });
}

function requestFontStylesheet(href: string, font: string) {
  const link = document.createElement('link');
  link.href = href;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
  link.onload = () => {
    setThemeFontFamilyFromStylesheet(href, font);
  };
}

function setThemeFontFamilyFromStylesheet(href: string, font: string) {
  for (const sheet of document.styleSheets) {
    if (sheet.href === href) {
      const fontFamilys: string[] = [];
      for (const rule of sheet.cssRules) {
        if (rule instanceof CSSFontFaceRule) {
          const fontFamily = rule.style.getPropertyValue('font-family');
          if (!fontFamilys.includes(fontFamily)) fontFamilys.push(fontFamily);
        }
      }
      document.body.style.setProperty(`--theme-font-family-base`, fontFamilys.join(', '));
      loadedFonts[font] = fontFamilys.join(', ');
      // console.log('Found fonts: ' + fontFamilys.join(', '));
      return;
    }
  }
}

const intensityMap: { [key: number]: number } = {
  50: 0.85,
  100: 0.8,
  200: 0.75,
  300: 0.6,
  400: 0.3,
  600: 0.9,
  700: 0.75,
  800: 0.6,
  900: 0.49,
};

function generateColorShades(color: RgbaColor) {
  const response: { [key: number]: RgbaColor } = {
    500: color,
  };

  [50, 100, 200, 300, 400].forEach(level => {
    const hex = lighten(color, intensityMap[level]);
    response[level] = hex;
  });

  [600, 700, 800, 900].forEach(level => {
    const hex = darken(color, intensityMap[level]);
    response[level] = hex;
  });

  return response;
}

function lighten(color: RgbaColor, intensity: number): RgbaColor {
  const r = Math.round(color.r + (255 - color.r) * intensity);
  const g = Math.round(color.g + (255 - color.g) * intensity);
  const b = Math.round(color.b + (255 - color.b) * intensity);

  return { r, b, g, a: 1 };
}

function darken(color: RgbaColor, intensity: number): RgbaColor {
  const r = Math.round(color.r * intensity);
  const g = Math.round(color.g * intensity);
  const b = Math.round(color.b * intensity);

  return { r, g, b, a: 1 };
}
