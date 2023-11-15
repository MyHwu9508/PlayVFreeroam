import alt from 'alt-client';
import native from 'natives';

export async function spawnSpawnFlag() {
  const pole = new alt.LocalObject('prop_flagpole_1a', new alt.Vector3(-834.90155, -1328.806, 4.08162975), new alt.Vector3(0, 0, 0), true, false, true, 200);
  const flag = new alt.LocalObject('prop_flag_eu', new alt.Vector3(-834.911255, -1328.81482, 10.5232944), new alt.Vector3(0, 0, 0.5877853), true, false, true, 200);

  await pole.waitForSpawn(60000);
  await flag.waitForSpawn(60000);

  flag.frozen = true;
  pole.frozen = true;
  flag.dimension = -2147483648;
  pole.dimension = -2147483648;
  //used for restream > need to freeze objects again lol
  pole.setMeta('spawnFlag', true);
  flag.setMeta('spawnFlag', true);
}
