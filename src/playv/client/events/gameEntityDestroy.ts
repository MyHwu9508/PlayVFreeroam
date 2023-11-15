import alt from 'alt-client';
import native from 'natives';

alt.on('gameEntityDestroy', (entity: alt.Entity) => {
  native.setModelAsNoLongerNeeded(entity.model); //TODO maybe not even needed, because alt:V handles that internally?
});
