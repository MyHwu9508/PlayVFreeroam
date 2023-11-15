import { PUser } from '../../entities/puser';
import log from '../../utils/logger';
import { AppDataSource } from '../../systems/db/TypeORM';

export async function adminActionLog(executor: number | PUser | 'SYSTEM', str: string) {
  if (typeof executor === 'number') {
    executor = await AppDataSource.manager.findOne(PUser, { where: { userID: executor } });
  } else if (executor === 'SYSTEM') {
    executor = {
      userID: -1,
      username: 'SYSTEM',
      authlevel: 99,
    } as PUser;
  }
  log('admin', `[ADMIN] {${executor.userID}|${executor.username}|${executor.authlevel}} ${str}`);
}
