import alt from 'alt-server';

alt.onClient('clientDeleteObject', (player: alt.Player, object: any) => {
    return true;
});