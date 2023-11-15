import { PUser } from '../../../entities/puser';
import alt from 'alt-server';
import { AppDataSource } from '../../db/TypeORM';

type PlayerSearchData = {
  userID: string;
  discordID: string;
  username: string;
  online: boolean;
  isBannedUntil: number | null;
  lastUsernames: string[];
  firstSeen: number;
  playtimeMinutes: number;
  lastSeen: number;
};
/*
 What query can be:
  - User ID
  - Discord ID
  - Username
  - Social ID
  - Social Club Name
  - AltV Username
  - IP
  - last usernames
*/

export async function playerSearchFromAP(query: string, mode: number, cb: (data: PlayerSearchData[], count: number) => void) {
  let builder = AppDataSource.createQueryBuilder()
    .select(['user.userID', 'user.discordID', 'user.username', 'user.lastUsernames', 'user.isBannedUntil', 'user.firstSeen', 'user.lastSeen', 'user.playtimeMinutes'])
    .from(PUser, 'user');
  switch (mode) {
    case 0:
      builder = builder.where(
        'LOWER(cast(user.userID as text)) LIKE :query OR LOWER(user.discordID) LIKE :query OR LOWER(user.username) LIKE :query OR LOWER(user.socialID)' +
          ' LIKE :query OR LOWER(user.socialClubName) LIKE :query OR LOWER(user.altVUsername) LIKE :query OR LOWER(user.lastIP) LIKE :query' +
          ' OR EXISTS (SELECT FROM unnest(user.lastUsernames) AS lastUsernames WHERE LOWER(lastUsernames) LIKE :query)',
        {
          query: `%${query.toLowerCase()}%`,
        }
      );
      break;
    case 1:
      builder = builder.where(
        'LOWER(cast(user.userID as text)) = :query OR LOWER(user.discordID) = :query OR LOWER(user.username) = :query OR LOWER(user.socialID)' +
          ' = :query OR LOWER(user.socialClubName) = :query OR LOWER(user.altVUsername) = :query OR LOWER(user.lastIP) = :query' +
          ' OR EXISTS (SELECT FROM unnest(user.lastUsernames) AS lastUsernames WHERE LOWER(lastUsernames) = :query)',
        {
          query: `${query.toLowerCase()}`,
        }
      );
      break;
    default:
      return cb([], 0);
  }
  const count = await builder.getCount();
  const dbResult = await builder.limit(50).getRawMany();
  const players = alt.Player.all;
  const mapped: PlayerSearchData[] = dbResult.map(p => {
    const player = players.find(pl => pl && pl.valid && pl.userData && pl.userData.userID === p.user_userID);
    const isOnline = player !== undefined;
    return {
      userID: p.user_userID,
      discordID: p.user_discordID,
      username: p.user_username,
      online: isOnline,
      isBannedUntil: p.user_isBannedUntil,
      lastUsernames: p.user_lastUsernames,
      firstSeen: p.user_firstSeen,
      playtimeMinutes: p.user_playtimeMinutes,
      lastSeen: p.user_lastSeen,
    };
  });
  cb(mapped, count);
}
