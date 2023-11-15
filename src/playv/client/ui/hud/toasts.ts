import { webView } from '../view/webView';
import { NotificationType } from '../../../shared/types/types';
import alt from 'alt-client';

export function pushToast(variant: NotificationType, content: string) {
  if (!alt.getMeta('introCompleted')) return;
  webView.emit('toast:add', variant, content);
}
