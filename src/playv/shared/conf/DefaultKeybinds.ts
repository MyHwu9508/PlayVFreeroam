const defaultKeys = {
  'keybind.vehicleNitro': 16, //lshift
  'keybind.mainMenu': 77, //m
  'keybind.changeVoiceRange': 79, //O
  'keybind.reconnect': 80, //P
  'keybind.openChat': 84, //t
  // 'keybind.wheelmenu': 88, //x
  'keybind.noclip': 113, //F2
  'keybind.freecam': 114, //F3
  'keybind.toggleHUD': 118, //F7
  'keybind.test': 189, //
  'keybind.forceParachute': 32, //Space
  'keybind.interaction': 69, //E
  'keybind.healHealth': 188, //,
  'keybind.healArmor': 190, //.
  'keybind.toggleVehicleSiren': 116, //F5
  'keybind.RStarRecording': 117, //alt
} as const;
export default defaultKeys;

export const keyNames: Record<keyof typeof defaultKeys, string> = {
  'keybind.vehicleNitro': 'Vehicle nitro', //lshift
  'keybind.mainMenu': 'Open menu', //m
  // 'keybind.wheelmenu': 'Open wheel menu',
  'keybind.changeVoiceRange': 'Change voice range', //O
  'keybind.reconnect': 'Reconnect', //P
  'keybind.openChat': 'Open chat', //t
  'keybind.noclip': 'Toggle noclip', //F2
  'keybind.freecam': 'Toggle freecam', //F3
  'keybind.toggleHUD': 'Toggle HUD', //F7
  'keybind.test': 'Test', //,
  'keybind.forceParachute': 'Open Parachute', //Space
  'keybind.interaction': 'Interaction', //E
  'keybind.healHealth': 'Heal Health', //,
  'keybind.healArmor': 'Heal Armor', //.
  'keybind.toggleVehicleSiren': 'Toggle Vehicle Siren', //F5
  'keybind.RStarRecording': 'Toggle Recording', //F6
} as const;

export const debugKeys = ['keybind.test', 'keybind.reconnect'];
