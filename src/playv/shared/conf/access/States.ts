export const permissionStates = {
  uiActive: {
    denied: ['ui.*', 'healkeys.use'],
  },
  freecam: {
    denied: ['vehicle.nitro', 'noclip'],
  },
  noclip: {
    denied: ['vehicle.nitro', 'freecam'],
  },
  healing: {
    denied: ['ui.*', 'freecam', 'noclip', 'healkeys.use'],
  },
};
