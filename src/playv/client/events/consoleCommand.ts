import alt from 'alt-client';
import native from 'natives';

alt.on('consoleCommand', async (command, ...args) => {
  if (!alt.debug) return;
  if (localPlayer.getStreamSyncedMeta('authlevel') < 1) return;
  switch (command) {
    case 'pos':
      alt.log(`${localPlayer.pos.x}, ${localPlayer.pos.y}, ${localPlayer.pos.z}`);
      break;
    case 'rot':
      alt.log(`${0}, ${0}, ${native.getEntityHeading(localPlayer)}`);
      break;
    case 'mapClothes':
      alt.log('Sending mapClothes to server');
      alt.emitServer('mapClothes');
      return;
    case 'cloth':
      alt.emitServer('testDLCCloth', args[0], args[1], args[2], args[3], args[4]);
      return;
    case 'native': {
      // native.setPedComponentVariation(localPlayer, Number(args[0]), Number(args[1]), Number(args[2]), Number(args[3] ?? 0));
      native.setPedComponentVariation(localPlayer, Number(args[0]), Number(args[1]), 0, 0);
      break;
    }
    case 'tp':
      native.setEntityCoords(localPlayer, Number(args[0]), Number(args[1]), Number(args[2]), false, false, false, false);
      break;
    case 'music':
      {
        const entity = alt.Utils.getClosestWorldObject({ pos: new alt.Vector3(-820.2012, -1309.564, 3.934444), range: 1 });
        if (!entity) return logDebug('No entity found');
        const audio = new alt.Audio('http://127.0.0.1:8000/song.mp3', 30, true, true);
        const output = new alt.AudioOutputAttached(entity);
        audio.addOutput(output);
        audio.play();
      }
      break;

    case 'getcloseAmbientZone': {
      const ambientZones = JSON.parse(alt.File.read('@assets/dump/ambientZones.json'));
      const foundZones = [];
      for (const zone of ambientZones) {
        const dist = localPlayer.pos.distanceTo(new alt.Vector3(zone.InnerPosition.X, zone.InnerPosition.Y, zone.InnerPosition.Z));
        if (dist < 200) {
          foundZones.push(zone);
        }
      }
      alt.log(JSON.stringify(foundZones));
      break;
    }

    case 'getcloseAmbientEmitters': {
      const ambientZones = JSON.parse(alt.File.read('@assets/dump/staticEmitters.json'));
      const foundZones = [];
      for (const zone of ambientZones) {
        const dist = localPlayer.pos.distanceTo(new alt.Vector3(zone.Position.X, zone.Position.Y, zone.Position.Z));
        if (dist < 200) {
          foundZones.push(zone);
        }
      }
      alt.log(JSON.stringify(foundZones));
      break;
    }

    case 't':
      alt.log(localPlayer.currentWeapon); //fist 2725352035
      break;

    case 'load':
      native.requestIpl(args[0]);
      break;

    case 'unload':
      native.removeIpl(args[0]);
      break;
  }
});
