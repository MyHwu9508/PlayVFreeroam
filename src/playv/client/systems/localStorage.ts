import _ from 'lodash';
import { StorageKeys, defaultConfig } from '../../shared/conf/StorageKeys';
import alt from 'alt-client';

export const LocalStorage = {
  delete(key: keyof StorageKeys): void {
    alt.LocalStorage.delete(key);
    this.save();
  },

  get<K extends keyof StorageKeys>(key: K): StorageKeys[K] {
    if (!this.has(key)) return defaultConfig[key] ?? undefined;
    return alt.LocalStorage.get(key);
  },

  set<K extends keyof StorageKeys>(key: K, value: StorageKeys[K] | unknown): void {
    alt.LocalStorage.set(key, value);
    this.save();
  },

  save: _.throttle(() => {
    alt.LocalStorage.save();
  }, 1000),

  has(key: keyof StorageKeys): boolean {
    return alt.LocalStorage.has(key);
  },
};
