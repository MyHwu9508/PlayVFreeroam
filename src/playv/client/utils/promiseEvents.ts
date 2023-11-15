import alt from 'alt-client';
import _ from 'lodash';
import { ClientPromiseEmitEvent, PromiseClientServerEvent, PromiseServerClientEvent } from '../../shared/types/events';

const promiseHandlers = new Map<string, (...args: unknown[]) => unknown>();

function handlePromiseEvent(id: string, ...args: unknown[]) {
  if (promiseHandlers.has(id)) {
    promiseHandlers.get(id)(...args);
    promiseHandlers.delete(id);
  } else {
    logError('access', 'Promise resolve event called for unknown id', id);
  }
}

alt.on('promise:resolve', handlePromiseEvent);
alt.onServer('promise:resolve', handlePromiseEvent);

function createPromiseEventHandler(eventName: string, id: string, handler: (...args: unknown[]) => unknown) {
  const eventHandler = (...args: unknown[]) => {
    handler(...args);
    promiseHandlers.delete(id);
  };
  promiseHandlers.set(id, eventHandler);
}

export function emitPromise<T extends keyof ClientPromiseEmitEvent>(eventName: T, ...args: Parameters<ClientPromiseEmitEvent[T]>): Promise<ReturnType<ClientPromiseEmitEvent[T]>> {
  return new Promise(resolve => {
    const id = _.uniqueId('sProm');
    alt.emit(eventName as never, id, ...args);
    createPromiseEventHandler(eventName as never, id, resolve);
  });
}

export function emitPromiseTimeout<T extends keyof ClientPromiseEmitEvent>(
  eventName: T,
  timeout: number,
  ...args: Parameters<ClientPromiseEmitEvent[T]>
): Promise<ReturnType<ClientPromiseEmitEvent[T]>> {
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

export function onPromise<T extends keyof ClientPromiseEmitEvent>(
  eventName: T,
  listener: (...args: Parameters<ClientPromiseEmitEvent[T]>) => Promise<ReturnType<ClientPromiseEmitEvent[T]>>
) {
  alt.on(eventName as never, async (id: string, ...args: Parameters<ClientPromiseEmitEvent[T]>) => {
    const result = await listener(...args);
    alt.emit('promise:resolve', id, result);
  });
}

export function emitPromiseServer<T extends keyof PromiseClientServerEvent>(
  eventName: T,
  ...args: Parameters<PromiseClientServerEvent[T]>
): Promise<ReturnType<PromiseClientServerEvent[T]>> {
  return new Promise(resolve => {
    const id = _.uniqueId('cProm');
    alt.emitServer(eventName as never, id, ...args);
    createPromiseEventHandler(eventName as never, id, resolve);
  });
}

export function emitPromiseServerTimeout<T extends keyof PromiseClientServerEvent>(
  eventName: T,
  timeout: number,
  ...args: Parameters<PromiseClientServerEvent[T]>
): Promise<ReturnType<PromiseClientServerEvent[T]>> {
  return new Promise((resolve, reject) => {
    const id = _.uniqueId('cProm');
    alt.emitServer(eventName as never, id, ...args);
    createPromiseEventHandler(eventName as never, id, resolve);
    setTimeout(() => {
      promiseHandlers.delete(id);
      reject(new Error(`Promise Event timed out after ${timeout / 1000}s: ${eventName}`));
    }, timeout);
  });
}

export function onPromiseServer<T extends keyof PromiseServerClientEvent>(
  eventName: T,
  listener: (...args: Parameters<PromiseServerClientEvent[T]>) => Promise<ReturnType<PromiseServerClientEvent[T]>>
) {
  alt.onServer(eventName as never, async (id: string, ...args: Parameters<PromiseServerClientEvent[T]>) => {
    const result = await listener(...args);
    alt.emitServer('promise:resolve', id, result);
  });
}
