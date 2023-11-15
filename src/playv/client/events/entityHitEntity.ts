import alt from 'alt-client';

alt.on('entityHitEntity', (entity: any, targetEntity: any, weaponHash: number) => {
  if (targetEntity === localPlayer || entity === localPlayer) alt.setMeta('lastCombat', Date.now());
});
