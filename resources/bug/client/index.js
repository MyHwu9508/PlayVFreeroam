import alt from 'alt-client';

// Register events due to a bug with alt:V breaking our gamemode on reconnect
alt.on('gameEntityCreate', () => {});
alt.on('connectionComplete', () => {});
alt.on('metaChange', () => {});
alt.on('streamSyncedMetaChange', () => {});
alt.on('syncedMetaChange', () => {});
alt.on('globalMetaChange', () => {});
alt.on('globalSyncedMetaChange', () => {});
alt.on('netOwnerChange', () => {});
alt.on('disconnect', () => {});
alt.on('gameEntityDestroy', () => {});
alt.on('baseObjectCreated', () => {});
