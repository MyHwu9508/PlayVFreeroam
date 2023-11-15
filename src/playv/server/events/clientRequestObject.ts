import alt from 'alt-server';

alt.onClient('clientRequestObject', (player: alt.Player, object: any) => {
    return true;
});