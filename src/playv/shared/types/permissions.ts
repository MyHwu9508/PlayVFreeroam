import type { ExecuteablePermissions } from '../conf/access/Permissions';
import type { permissionStates } from '../conf/access/States';
import type { AlphaNumericStringReplacer } from './typeHelpers';
/**
 * Defines the player's permissions.
 * denied defines permissions that are disabled afterwards if a wildcard is used.
 */
export type ActivePermissions = {
  allowed: string[];
  denied: string[];
};

export type Permission<Perm extends string> = AlphaNumericStringReplacer<Perm> extends `${infer P}!!`
  ? `${P}.*`
  : AlphaNumericStringReplacer<Perm> extends `${infer A}!${infer B}`
  ? `${A}.${B}`
  : AlphaNumericStringReplacer<Perm> extends Perm
  ? Perm
  : 'Not a valid Permission';

export type ExecuteablePermission<S extends string> = S extends `${infer A extends keyof ExecuteablePermissions}.${string}`
  ? `${keyof ExecuteablePermissions}.${Exclude<keyof ExecuteablePermissions[A], symbol>}`
  : 'Not a valid Permission';

export type ExecutionRegistration = {
  stateToSet: keyof typeof permissionStates | null;
  usePermissionWhenTrue: boolean;
  usePermissionWhenFalse: boolean;
  callback: (...args: unknown[]) => void;
};

export type ExecuteablePermArgs<Perm extends string> = Perm extends `${infer A extends keyof ExecuteablePermissions}.${infer B extends string}`
  ? B extends keyof ExecuteablePermissions[A]
    ? ExecuteablePermissions[A][B]
    : [void]
  : Perm extends keyof ExecuteablePermissions
  ? ExecuteablePermissions[Perm]
  : [void];
