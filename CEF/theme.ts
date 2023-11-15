import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const playv: CustomThemeConfig = {
  name: 'playv',
  properties: {
    // =~= Theme Properties =~=
    '--theme-font-family-base':
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    '--theme-font-family-heading':
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    '--theme-font-color-base': '0 0 0',
    '--theme-font-color-dark': '255 255 255',
    '--theme-rounded-base': '8px',
    '--theme-rounded-container': '4px',
    '--theme-border-base': '2px',
    // =~= Theme On-X Colors =~=
    '--on-primary': '255 255 255',
    '--on-secondary': '255 255 255',
    '--on-tertiary': '255 255 255',
    '--on-success': '0 0 0',
    '--on-warning': '0 0 0',
    '--on-error': '255 255 255',
    '--on-surface': '255 255 255',
    // =~= Theme Colors  =~=
    // primary | #c81976
    '--color-primary-50': '247 221 234', // #f7ddea
    '--color-primary-100': '244 209 228', // #f4d1e4
    '--color-primary-200': '241 198 221', // #f1c6dd
    '--color-primary-300': '233 163 200', // #e9a3c8
    '--color-primary-400': '217 94 159', // #d95e9f
    '--color-primary-500': '200 25 118', // #c81976
    '--color-primary-600': '180 23 106', // #b4176a
    '--color-primary-700': '150 19 89', // #961359
    '--color-primary-800': '120 15 71', // #780f47
    '--color-primary-900': '98 12 58', // #620c3a
    // secondary | #1579c6
    '--color-secondary-50': '220 235 246', // #dcebf6
    '--color-secondary-100': '208 228 244', // #d0e4f4
    '--color-secondary-200': '197 222 241', // #c5def1
    '--color-secondary-300': '161 201 232', // #a1c9e8
    '--color-secondary-400': '91 161 215', // #5ba1d7
    '--color-secondary-500': '21 121 198', // #1579c6
    '--color-secondary-600': '19 109 178', // #136db2
    '--color-secondary-700': '16 91 149', // #105b95
    '--color-secondary-800': '13 73 119', // #0d4977
    '--color-secondary-900': '10 59 97', // #0a3b61
    // tertiary | #0f855d
    '--color-tertiary-50': '219 237 231', // #dbede7
    '--color-tertiary-100': '207 231 223', // #cfe7df
    '--color-tertiary-200': '195 225 215', // #c3e1d7
    '--color-tertiary-300': '159 206 190', // #9fcebe
    '--color-tertiary-400': '87 170 142', // #57aa8e
    '--color-tertiary-500': '15 133 93', // #0f855d
    '--color-tertiary-600': '14 120 84', // #0e7854
    '--color-tertiary-700': '11 100 70', // #0b6446
    '--color-tertiary-800': '9 80 56', // #095038
    '--color-tertiary-900': '7 65 46', // #07412e
    // success | #50b50d
    '--color-success-50': '229 244 219', // #e5f4db
    '--color-success-100': '220 240 207', // #dcf0cf
    '--color-success-200': '211 237 195', // #d3edc3
    '--color-success-300': '185 225 158', // #b9e19e
    '--color-success-400': '133 203 86', // #85cb56
    '--color-success-500': '80 181 13', // #50b50d
    '--color-success-600': '72 163 12', // #48a30c
    '--color-success-700': '60 136 10', // #3c880a
    '--color-success-800': '48 109 8', // #306d08
    '--color-success-900': '39 89 6', // #275906
    // warning | #d48516
    '--color-warning-50': '249 237 220', // #f9eddc
    '--color-warning-100': '246 231 208', // #f6e7d0
    '--color-warning-200': '244 225 197', // #f4e1c5
    '--color-warning-300': '238 206 162', // #eecea2
    '--color-warning-400': '225 170 92', // #e1aa5c
    '--color-warning-500': '212 133 22', // #d48516
    '--color-warning-600': '191 120 20', // #bf7814
    '--color-warning-700': '159 100 17', // #9f6411
    '--color-warning-800': '127 80 13', // #7f500d
    '--color-warning-900': '104 65 11', // #68410b
    // error | #b61b1b
    '--color-error-50': '244 221 221', // #f4dddd
    '--color-error-100': '240 209 209', // #f0d1d1
    '--color-error-200': '237 198 198', // #edc6c6
    '--color-error-300': '226 164 164', // #e2a4a4
    '--color-error-400': '204 95 95', // #cc5f5f
    '--color-error-500': '182 27 27', // #b61b1b
    '--color-error-600': '164 24 24', // #a41818
    '--color-error-700': '137 20 20', // #891414
    '--color-error-800': '109 16 16', // #6d1010
    '--color-error-900': '89 13 13', // #590d0d
    // surface | #2b2a2d
    '--color-surface-50': '223 223 224', // #dfdfe0
    '--color-surface-100': '213 212 213', // #d5d4d5
    '--color-surface-200': '202 202 203', // #cacacb
    '--color-surface-300': '170 170 171', // #aaaaab
    '--color-surface-400': '107 106 108', // #6b6a6c
    '--color-surface-500': '43 42 45', // #2b2a2d
    '--color-surface-600': '39 38 41', // #272629
    '--color-surface-700': '32 32 34', // #202022
    '--color-surface-800': '26 25 27', // #1a191b
    '--color-surface-900': '21 21 22', // #151516
  },
};
