export const ConVar = {
  ANTICHEAT: {
    SKIP_DEFAULT_WEAPON_STATS_APPLY: false,
  },
  LOGIN: {
    CURRENT_TOS_VERSION: 1,
    DISCORD_APP_ID: '1105903105134039123', //used in ConVar to give client also info about the discord app id for login
    STARTUP_DELAY: 10000, //10 seconds delay before players can join the server to prevent networking issues
  },
  DEBUG: {
    FAST_LOGIN: false,
    SKIP_COOLDOWNS: false,
    FORCE_SHOW_DISCORD_BUTTON: false,
  },
  USERNAME: {
    USERNAME_LEVINSTEIN_THRESHOLD: 2,
    BLOCKED_USERNAMES: ['admin', 'administrator', 'moderator', 'playv', 'nigger', 'hitler'],
    MIN_LENGTH: 4,
    MAX_LENGTH: 20,
  },
  SPAWN: {
    PROTECT_RADIUS: 150,
    PLAYER_RADIUS: 10,
    PED_MAXRADIUS: 20,
    PED_WALKING_RADIUS: 15,
  },
  TIME: {
    MS_PER_MINUTE: 2500,
    START_OFFSET: 15 * 60 * 1000,
  },
  ALL: {
    MAX_SAVENAME_LENGTH: 20,
  },
  VEHICLE: {
    MAX_PUBLIC: 2,
    MAX_PRIVATE: 30,
    MAX_SPAWNED: 30,
  },
  CHAT: {
    MAX_TEXT_LENGTH: 300,
    LEVINSTEIN_THRESHOLD: 2,
    NEAR_CHAT_RANGE: 20,
  },
  CHARACTER: {
    MAX_SAVED: 20,
  },
  OUTFITS: {
    MAX_SAVED: 20,
  },
  PEDSYNC: {
    TICK_INTERVAL: 250, //ms //TODO trying 250 instead of 100
    VEHICLE_SPAWN_RADIUS: 160, //Distance from player in wich to look for node
    VEHICLE_STREAM_IN_TARGET: 40, // 40 Target vehicles in rage to send spawn pos to server > When more vehicles in streaming range stop generating spawn nodes
    VEHICLE_MAX_SPAWN_DISTANCE: 280, // max distance away to spawn vehicle
    VEHICLE_MAX_DISTANCE: 200, //max distance to any valid player before deleting
    VEHICLE_SPAWN_MINDIST_TO_PLAYER: 120, //min distance to ANY player > prevent annoying crashes? (radius)
    VEHICLE_SPAWN_MINNODES_PER_TICK: 10, //generate at least this amount of possible spawn locations > More means way more traffic
    DELETE_INVALID_BROKEN: 45000, //delete invalid vehicles after this time
    NETOWNER_BLOCKING_TIME: 10000, //ms to block netowner after change
    PED_WEAPONS: [0x440e4788, 0xd205520e, 0xfad1f1c9, 0x24b17070, 0xe284c527, 0x5ef9fec4, 0x1b06d571],
    MAX_SPEED_FOR_ANGLE: 40,
    MIN_ANGLE_FULL_SPEED: 50,
    MAX_ANGLE_STANDING_STILL: 360,
  },
  LOBBY: {
    MAX_NAME_LENGTH: 15,
    MAX_DESCRIPTION_LENGTH: 150,
    DIM_MIN: 3000,
    DIM_MAX: 5000,
    MAX_PRESETS: 3,
  },
  GHOSTMODE: {
    RESPAWN_TIMEOUT: 100,
    TEMP_DIM: 5001,
  },
  BLIPS: {
    DEFAULT_SCALE: 0.7,
    TICKRATE: 1000,
  },
  RESTRICTIONS: {
    LAST_COMBAT: 30000,
  },
};
