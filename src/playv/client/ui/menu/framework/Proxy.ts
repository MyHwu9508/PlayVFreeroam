const DEBUG = false;

export type ObserverPath = { target: object; property: string }[];
export type ObserverCallback = (path: string[], change: 'SET' | 'ARRAY_DELETE' | 'DELETE' | 'CREATE', value?: unknown) => void;

export function createObserverProxy<T extends object>(target: T, callback: ObserverCallback, path: ObserverPath = []): T {
  const proxy = new Proxy(target, {
    get(target, property, reciver) {
      if (String(property) === '__isProxy') return true;
      if ('__isProxy' in target && target.__isProxy) return Reflect.get(target, property, reciver);
      if (String(property) === '__bypass') return target;
      if (DEBUG && path.length > 0) log('menu', `[PROXY GET]|Only when nested|(${path.map(v => v.property)}) ${String(property)}`);
      const accessed = Reflect.get(target, property, reciver);
      if (
        typeof accessed === 'object' &&
        typeof property === 'string' &&
        (path?.length > 0 || ('proxiedKeys' in target && Array.isArray(target.proxiedKeys) && target.proxiedKeys.includes(property)))
      ) {
        const newPath = path.slice(0);
        newPath.push({ target, property });
        if (DEBUG) log('menu', `[PROXY CREATE PROXY FOR](${path.map(v => v.property)}) ${String(property)}`);
        return createObserverProxy(accessed, callback, newPath);
      }
      return accessed;
    },
    set(target, property, value) {
      if (DEBUG) log('menu', `[PROXY SET](${path.map(v => v.property)}) ${String(property)} = ${JSON.stringify(value).substring(0, 150)}...`);
      const result = Reflect.set(target, property, value);
      if (typeof property === 'string' && (path?.length > 0 || ('proxiedKeys' in target && Array.isArray(target.proxiedKeys) && target.proxiedKeys.includes(property)))) {
        if (path === undefined) path = [];
        const newPath = path.slice(0);
        newPath.push({ target, property });
        callback(
          newPath.map(p => p.property),
          'SET',
          value
        );
      }
      return result;
    },
    defineProperty(target, property, descriptor) {
      if (DEBUG) log('menu', `[PROXY DEFINE](${path.map(v => v.property)}) ${String(property)} = ${String(JSON.stringify(descriptor).substring(0, 150))}...`);
      const result = Reflect.defineProperty(target, property, descriptor);
      if (typeof property === 'string' && (path?.length > 0 || ('proxiedKeys' in target && Array.isArray(target.proxiedKeys) && target.proxiedKeys.includes(property)))) {
        if (path === undefined) path = [];
        const newPath = path.slice(0);
        newPath.push({ target, property });
        callback(
          newPath.map(p => p.property),
          'CREATE',
          descriptor.value
        );
      }
      return result;
    },
    deleteProperty(target, property) {
      if (DEBUG) log('menu', `[PROXY DELETE](${path.map(v => v.property)}) ${String(property)}`);
      const result = Reflect.deleteProperty(target, property);
      if (typeof property === 'string' && (path?.length > 0 || ('proxiedKeys' in target && Array.isArray(target.proxiedKeys) && target.proxiedKeys.includes(property)))) {
        if (path === undefined) path = [];
        const newPath = path.slice(0);
        newPath.push({ target, property });
        callback(
          newPath.map(p => p.property),
          'DELETE'
        );
      }
      return result;
    },
  });
  return proxy;
}
