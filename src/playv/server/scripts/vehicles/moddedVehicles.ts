import chalk from 'chalk';
import { ModdedVehicle } from '../../entities/moddedVehicle';
import alt from 'alt-server';
import { AppDataSource } from '../../systems/db/TypeORM';
import { onPromiseClient } from '../../utils/promiseEvents';

// eslint-disable-next-line import/no-mutable-exports
export let cachedFormattedModdedVehicles: [string, string, string, string][] = [];

getAndCacheModdedVehicles().then(() => {
  alt.log(chalk.bold.overline.underline.magentaBright(`${cachedFormattedModdedVehicles.length} modded vehicles cached`));
});

export async function getAndCacheModdedVehicles() {
  const res = await AppDataSource.manager.find(ModdedVehicle);
  const formattedModdedVehicleData = res.map(moddedVeh => {
    return [moddedVeh.name, moddedVeh.spawnName.toLowerCase(), moddedVeh.author, moddedVeh.link];
  });
  cachedFormattedModdedVehicles = formattedModdedVehicleData as [string, string, string, string][];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
onPromiseClient('getModdedVehicles', (player: alt.Player) => {
  return cachedFormattedModdedVehicles;
});
