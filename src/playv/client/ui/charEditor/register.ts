import { charCreatorEdit } from './charCreator';
import alt from 'alt-client';
import { menuState } from '../menu/framework/State';

alt.onServer('startCharEditor', async () => {
  menuState.setVisibility(false);
  const data = alt.getLocalMeta('currentCharacterData');
  if (!data) return;
  if (data.overlays == undefined) data.overlays = [];
  data.overlays = data.overlays.map(overlay => `${overlay[0]},${overlay[1]}`) as never;
  const newData = await charCreatorEdit(data as never, { profileName: data.profileName });
  if (!newData) return alt.emitServer('finishCharEditor', undefined);
  newData.data.overlays = newData.data.overlays.map(overlay => {
    const item = overlay.split(',');
    return [Number(item[0]), Number(item[1])];
  }) as never;
  const newChar = {
    ...newData.data,
    id: newData.newChar ? undefined : data.id,
    userID: data.userID,
    profileName: newData.meta.profileName,
    timestamp: data.timestamp,
  };
  alt.emitServer('finishCharEditor', newChar as never);
});
