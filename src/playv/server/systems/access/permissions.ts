import alt from 'alt-server';
import { BasePermissionsManager } from '../../../shared/systems/access/BasePermissionsManager';
import type { Permission } from '../../../shared/types/permissions';
import { permissionStates } from '../../../shared/conf/access/States';

class PermissionsManager extends BasePermissionsManager {
  constructor() {
    super();
    alt.onClient('requestState', (player, state, active) => {
      //Stuff todo when client requests state change
      this.setStateActive(player, state, active);
    });
  }
  getStates(player: alt.Player) {
    return player.getLocalMeta('states');
  }
  setStateActive(player: alt.Player, state: keyof typeof permissionStates, active: boolean) {
    const res = permissionStates[state];
    if ('clientOnly' in res && res.clientOnly) {
      throw new Error('Cannot set client only state on server');
    } else {
      const states = this.getStates(player);
      if (active) {
        states.push(state);
      } else {
        states.splice(states.indexOf(state), 1);
      }
      const perms = this.constructNewPermissionsFromStates(states);
      player.setLocalMeta('permissions', perms);
      player.setLocalMeta('states', states);
    }
  }

  resetPermissions(player: alt.Player) {
    player.setLocalMeta('permissions', { allowed: [], denied: [] });
  }

  setPermissions(player: alt.Player, permissions: Permission<string>[]) {
    this.resetPermissions(player);
    const statePerms = this.constructNewPermissionsFromStates(this.getStates(player));
    player.setLocalMeta('permissions', { allowed: [...statePerms.allowed, ...permissions], denied: statePerms.denied });
  }

  can<Perm extends string>(player: alt.Player, permission: Permission<Perm>) {
    const perms = player.getLocalMeta('permissions');
    for (const perm of perms.denied) {
      if (this.isInPermission(permission, perm)) {
        return false;
      }
    }
    for (const perm of perms.allowed) {
      if (this.isInPermission(permission, perm)) {
        return true;
      }
    }
    return false;
  }
}

export const permissions = new PermissionsManager();
