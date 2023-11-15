import alt from 'alt-client';
import { BasePermissionsManager } from '../../../shared/systems/access/BasePermissionsManager';
import type { Permission } from '../../../shared/types/permissions';
import { permissionStates } from '../../../shared/conf/access/States';

class PermissionsManager extends BasePermissionsManager {
  private clientDeniedPermissions: string[] = [];
  private clientStates: Array<keyof typeof permissionStates> = [];
  private permissionChangeCallbacks: Record<string, Array<(allowed: boolean) => void>> = {}; //Todo
  getPermissions() {
    const permissions = alt.getLocalMeta('permissions');
    return permissions;
  }

  setStateActive(state: keyof typeof permissionStates, active: boolean) {
    if (active) {
      this.clientStates.push(state);
    } else {
      this.clientStates.splice(this.clientStates.indexOf(state), 1);
    }
    const perms = this.deniedFromStates(this.clientStates);
    this.clientDeniedPermissions = perms;
  }

  getStateActive(state: keyof typeof permissionStates) {
    return this.clientStates.includes(state);
  }

  protected deniedFromStates(states: ('noclip' | 'freecam' | 'uiActive')[]): string[] {
    const perms = new Set<string>();
    for (const state of states) {
      const { denied } = permissionStates[state] as { denied: string[] | undefined };
      if (denied !== undefined) {
        for (const permission of denied) {
          perms.add(permission);
        }
      }
    }
    return [...perms];
  }

  can<Perm extends string>(permission: Permission<Perm>) {
    const res = this.getPermissions();
    for (const perm of this.clientDeniedPermissions) {
      if (this.isInPermission(permission, perm)) {
        return false;
      }
    }
    for (const perm of res.denied) {
      if (this.isInPermission(permission, perm)) {
        return false;
      }
    }
    for (const perm of res.allowed) {
      if (this.isInPermission(permission, perm)) {
        return true;
      }
    }
    return false;
  }
}

export type ClientPermissionsManager = PermissionsManager;
export const permissions = new PermissionsManager();
