import { DefaultThemes } from '../../../../../shared/conf/ThemePresets';
import { Theme, borderSizes, radiusSizes, supportedFonts } from '../../../../systems/themeChanger';
import { webView } from '../../../view/webView';
import { Page } from '../../framework/Page';

const page = new Page('Theme');

page.addOverlay('Presets', Object.keys(DefaultThemes)).onInput(comp => {
  Theme.applyPreset(comp.value as keyof typeof DefaultThemes);
  updateColors();
});

let primaryColor = Theme.primary;
const primaryPicker = page
  .addColorPicker('Primary', primaryColor)
  .onInput(comp => {
    Theme.setThemeColor('primary', comp.hex);
  })
  .onFinished((comp, confirm) => {
    if (confirm) {
      primaryColor = comp.hex;
      Theme.setThemeColor('primary', comp.hex);
    } else {
      Theme.setThemeColor('primary', primaryColor);
    }
  });

let secondaryColor = Theme.secondary;
const secondaryPicker = page
  .addColorPicker('Secondary', secondaryColor)
  .onInput(comp => {
    Theme.setThemeColor('secondary', comp.hex);
  })
  .onFinished((comp, confirm) => {
    if (confirm) {
      secondaryColor = comp.hex;
      Theme.setThemeColor('secondary', comp.hex);
    } else {
      Theme.setThemeColor('secondary', secondaryColor);
    }
  });

let tertiaryColor = Theme.tertiary;
const tertiaryPicker = page
  .addColorPicker('Tertiary', tertiaryColor)
  .onInput(comp => {
    Theme.setThemeColor('tertiary', comp.hex);
  })
  .onFinished((comp, confirm) => {
    if (confirm) {
      tertiaryColor = comp.hex;
      Theme.setThemeColor('tertiary', comp.hex);
    } else {
      Theme.setThemeColor('tertiary', tertiaryColor);
    }
  });

let successColor = Theme.success;
const successPicker = page
  .addColorPicker('Success', successColor)
  .onInput(comp => {
    Theme.setThemeColor('success', comp.hex);
  })
  .onFinished((comp, confirm) => {
    if (confirm) {
      successColor = comp.hex;
      Theme.setThemeColor('success', comp.hex);
    } else {
      Theme.setThemeColor('success', successColor);
    }
  });

let warningColor = Theme.warning;
const warningPicker = page
  .addColorPicker('Warning', warningColor)
  .onInput(comp => {
    Theme.setThemeColor('warning', comp.hex);
  })
  .onFinished((comp, confirm) => {
    if (confirm) {
      warningColor = comp.hex;
      Theme.setThemeColor('warning', comp.hex);
    } else {
      Theme.setThemeColor('warning', warningColor);
    }
  });

let errorColor = Theme.error;
const errorPicker = page
  .addColorPicker('Error', errorColor)
  .onInput(comp => {
    Theme.setThemeColor('error', comp.hex);
  })
  .onFinished((comp, confirm) => {
    if (confirm) {
      errorColor = comp.hex;
      Theme.setThemeColor('error', comp.hex);
    } else {
      Theme.setThemeColor('error', errorColor);
    }
  });

let surfaceColor = Theme.surface;
const surfacePicker = page
  .addColorPicker('Surface', surfaceColor)
  .onInput(comp => {
    Theme.setThemeColor('surface', comp.hex);
  })
  .onFinished((comp, confirm) => {
    if (confirm) {
      surfaceColor = comp.hex;
      Theme.setThemeColor('surface', comp.hex);
    } else {
      Theme.setThemeColor('surface', surfaceColor);
    }
  });

let fontColor = Theme.fontColor;
const fontPicker = page
  .addColorPicker('Font', fontColor)
  .onInput(comp => {
    Theme.setMiscValue('fontColor', comp.hex);
  })
  .onFinished((comp, confirm) => {
    if (confirm) {
      fontColor = comp.hex;
      Theme.setMiscValue('fontColor', comp.hex);
    } else {
      Theme.setMiscValue('fontColor', fontColor);
    }
  });

const roundingSelect = page.addNumberSelect('Rounding', 0, radiusSizes.length - 1, 1, radiusSizes.indexOf(Theme.rounded)).onInput(comp => {
  Theme.setMiscValue('rounded', radiusSizes[comp.value]);
});

const containerRoundingSelect = page.addNumberSelect('Container Rounding', 0, radiusSizes.length - 2, 1, radiusSizes.indexOf(Theme.roundedContainer)).onInput(comp => {
  Theme.setMiscValue('roundedContainer', radiusSizes[comp.value]);
});

const borderSelect = page.addNumberSelect('Border', 0, borderSizes.length - 1, 1, borderSizes.indexOf(Theme.border)).onInput(comp => {
  Theme.setMiscValue('border', borderSizes[comp.value]);
});

page.addOverlay('Font', [...supportedFonts]).onInput(comp => {
  Theme.setMiscValue('fontFamily', comp.value as string);
  internetFont.value = comp.value as string;
});

const activateInternetFonts = page
  .addToggle('Activate Internet Fonts', Theme.activateInternetFonts)
  .addContext(
    'Activating internet fonts will allow you to manually enter fonts and fetch fonts from the Internet. Either with an name from Google Fonts, CDNFonts or with an link to an font Stylesheet or Fontfile. Using this option will have you make requests to these 3rd Parties und thus send them metadata like your IP adress. Make sure the licensing allows the use of the font.'
  )
  .onInput(comp => {
    internetFont.disabled = !comp.value;
    Theme.setMiscValue('activateInternetFonts', comp.value);
  });

const internetFont = page.addInput('Internet Font', Theme.fontFamily).onFinished((comp, confirm) => {
  if (confirm) Theme.setMiscValue('fontFamily', comp.value);
});
internetFont.disabled = !Theme.activateInternetFonts;

page.addToggle('Secret Gaming Mode', false).onInput(comp => {
  webView.emit('theme:rgbMode', comp.value);
  if (!comp.value) {
    Theme.updateTheme();
  }
});

function updateColors() {
  primaryPicker.value = Theme.primary;
  primaryColor = Theme.primary;
  secondaryPicker.value = Theme.secondary;
  secondaryColor = Theme.secondary;
  tertiaryPicker.value = Theme.tertiary;
  tertiaryColor = Theme.tertiary;
  successPicker.value = Theme.success;
  successColor = Theme.success;
  warningPicker.value = Theme.warning;
  warningColor = Theme.warning;
  errorPicker.value = Theme.error;
  errorColor = Theme.error;
  surfacePicker.value = Theme.surface;
  surfaceColor = Theme.surface;
  fontPicker.value = Theme.fontColor;
  fontColor = Theme.fontColor;
  roundingSelect.value = radiusSizes.indexOf(Theme.rounded);
  containerRoundingSelect.value = radiusSizes.indexOf(Theme.roundedContainer);
  borderSelect.value = borderSizes.indexOf(Theme.border);
  internetFont.value = Theme.fontFamily;
  internetFont.disabled = !Theme.activateInternetFonts;
  activateInternetFonts.value = Theme.activateInternetFonts;
}

export default page;
