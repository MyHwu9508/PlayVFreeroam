import alt from 'alt-server';


alt.onClient('requestSyncedScene', (player: alt.Player, scene: any) => {
    return true;
});