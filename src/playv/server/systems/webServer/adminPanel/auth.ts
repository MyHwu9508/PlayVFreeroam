import { PUser } from '../../../entities/puser';
import { AppDataSource } from '../../db/TypeORM';

export async function getAuthLevelFromDiscordID(id: string, cb: (authlevel: number) => void) {
  const user = await AppDataSource.manager.findOneBy(PUser, { discordID: id });
  if (!user) return cb(0);
  return cb(user.authlevel);
}
