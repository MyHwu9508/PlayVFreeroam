import alt from 'alt-server';
import _ from 'lodash';
import type { PromiseClientServerEvent, PromiseServerClientEvent, ServerPromiseEmitEvent } from '../../shared/types/events';

const promiseHandlers = new Map<string, (...args: unknown[]) => unknown>();

alt.on('promise:resolve', (id: string, ...args: unknown[]) => {
  if (promiseHandlers.has(id)) {
    promiseHandlers.get(id)(...args);
    promiseHandlers.delete(id);
  } else {
    logError('default', 'Promise resolve event called for unknown id', id);
  }
});

alt.onClient('promise:resolve', (player: alt.Player, id: string, ...args: unknown[]) => {
  if (promiseHandlers.has(id)) {
    promiseHandlers.get(id)(player, ...args);
    promiseHandlers.delete(id);
  } else {
    logError('default', 'Promise resolve event called for unknown id', id);
  }
});

function createPromiseEventHandler(eventName: string, id: string, handler: (...args: unknown[]) => unknown) {
  const eventHandler = (...args: unknown[]) => {
    handler(...args);
    promiseHandlers.delete(id);
  };
  promiseHandlers.set(id, eventHandler);
}

function createPlayerPromiseEventHandler(eventName: string, id: string, handler: (...args: unknown[]) => unknown) {
  const eventHandler = (player: alt.Player, ...args: unknown[]) => {
    handler(player, ...args);
    promiseHandlers.delete(id);
  };
  promiseHandlers.set(id, eventHandler);
}

export function emitPromise<T extends keyof ServerPromiseEmitEvent>(eventName: T, ...args: Parameters<ServerPromiseEmitEvent[T]>): Promise<ReturnType<ServerPromiseEmitEvent[T]>> {
  return new Promise(resolve => {
    const id = _.uniqueId('sProm');
    alt.emit(eventName as never, id, ...args);
    createPromiseEventHandler(eventName as never, id, resolve);
  });
}

export function emitPromiseTimeout<T extends keyof ServerPromiseEmitEvent>(
  eventName: T,
  timeout: number,
  ...args: Parameters<ServerPromiseEmitEvent[T]>
): Promise<ReturnType<ServerPromiseEmitEvent[T]>> {
  return new Promise((resolve, reject) => {
    const id = _.uniqueId('sProm');
    alt.emit(eventName as never, id, ...args);
    createPromiseEventHandler(eventName as never, id, resolve);
    setTimeout(() => {
      promiseHandlers.delete(id);
      reject(new Error(`Promise Event timed out after ${timeout / 1000}s: ${eventName}`));
    }, timeout);
  });
}

export function onPromise<T extends keyof ServerPromiseEmitEvent>(
  eventName: T,
  listener: (...args: Parameters<ServerPromiseEmitEvent[T]>) => Promise<ReturnType<ServerPromiseEmitEvent[T]>>
) {
  alt.on(eventName as never, async (id: string, ...args: Parameters<ServerPromiseEmitEvent[T]>) => {
    const result = await listener(...args);
    alt.emit('promise:resolve', id, result);
  });
}

export function emitPromiseClient<T extends keyof PromiseServerClientEvent>(
  player: alt.Player,
  eventName: T,
  ...args: Parameters<PromiseServerClientEvent[T]>
): Promise<ReturnType<PromiseServerClientEvent[T]>> {
  return new Promise(resolve => {
    const id = _.uniqueId('cProm');
    player.emit(eventName as never, id, ...args);
    createPromiseEventHandler(eventName as never, id, resolve);
  });
}

export function emitPromiseClientTimeout<T extends keyof PromiseServerClientEvent>(
  player: alt.Player,
  eventName: T,
  timeout: number,
  ...args: Parameters<PromiseServerClientEvent[T]>
): Promise<ReturnType<PromiseServerClientEvent[T]>> {
  return new Promise((resolve, reject) => {
    const id = _.uniqueId('cProm');
    player.emit(eventName as never, id, ...args);
    createPlayerPromiseEventHandler(eventName as never, id, resolve);
    setTimeout(() => {
      promiseHandlers.delete(id);
      reject(new Error(`Promise Event timed out after ${timeout / 1000}s: ${eventName}`));
    }, timeout);
  });
}

export function onPromiseClient<T extends keyof PromiseClientServerEvent>(
  eventName: T,
  listener: (player: alt.Player, ...args: Parameters<PromiseClientServerEvent[T]>) => ReturnType<PromiseClientServerEvent[T]>
) {
  alt.onClient(eventName as never, async (player: alt.Player, id: string, ...args: Parameters<PromiseClientServerEvent[T]>) => {
    const result = await listener(player, ...args);
    player.emit('promise:resolve', id, result);
  });
}
