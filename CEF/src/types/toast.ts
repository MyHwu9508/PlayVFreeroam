import type { NotificationType } from '../../../src/playv/shared/types/types';

export type Toast = {
  variant: NotificationType;
  text: string;
  title?: string;
};
