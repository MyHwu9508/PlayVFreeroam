import { permissionStates } from '../../conf/access/States';
import { ActivePermissions } from '../../types/permissions';

export abstract class BasePermissionsManager {
  protected isInPermission(toCheck: string, isInside: string) {
    if (!isInside.endsWith('*')) return toCheck === isInside;
    const toCheckSplit = toCheck.split('.');
    const isInsideSplit = isInside.split('.');
    if (toCheckSplit.length < isInsideSplit.length) return false;
    for (let i = 0; i < isInsideSplit.length; i++) {
      if (isInsideSplit[i] === '*') return true;
      if (toCheckSplit[i] !== isInsideSplit[i]) return false;
    }
    return true;
  }

  protected constructNewPermissionsFromStates(states: Array<keyof typeof permissionStates>): ActivePermissions {
    const permissionsToActivate: Set<string> = new Set();
    const permissionsToDeactivate: Set<string> = new Set();
    for (const state of states) {
      const { active, denied } = permissionStates[state] as { active: string[] | undefined; denied: string[] | undefined };
      if (active !== undefined) {
        for (const permission of active) {
          permissionsToActivate.add(permission);
        }
      }
      if (denied !== undefined) {
        for (const permission of denied) {
          permissionsToDeactivate.add(permission);
        }
      }
    }

    const finalPermissions: string[] = [];

    for (const permission of permissionsToActivate) {
      if (!permissionsToDeactivate.has(permission)) {
        finalPermissions.push(permission);
      }
    }
    for (const permission of finalPermissions) {
      const isInWildcard = finalPermissions.some(p => {
        if (p === permission) return false;
        return this.isInPermission(permission, p);
      });
      if (isInWildcard) {
        finalPermissions.splice(finalPermissions.indexOf(permission), 1);
      }
    }

    const finalDeactivated: string[] = [];
    for (const permission of permissionsToDeactivate) {
      if (finalPermissions.includes(permission)) {
        finalPermissions.splice(finalPermissions.indexOf(permission), 1);
      } else if (finalPermissions.some(p => this.isInPermission(permission, p))) {
        finalDeactivated.push(permission);
      }
    }

    return {
      allowed: finalPermissions,
      denied: finalDeactivated,
    };
  }
}
