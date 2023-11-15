import { ExecuteablePermissions } from '../../../shared/conf/access/Permissions';
import { permissionStates } from '../../../shared/conf/access/States';
import { ExecuteablePermArgs, ExecuteablePermission, ExecutionRegistration } from '../../../shared/types/permissions';
import { logError } from '../../utils/logger';
import { ClientPermissionsManager, permissions } from './permissions';

class ClientExecutionManager {
  private executions: Record<string, ExecutionRegistration> = {};
  constructor(private permissionsManager: ClientPermissionsManager) {}

  /**
   * Registers a script that can be executed with do()
   * @param permission Name of the permission to trigger the script on
   * @param stateToSet The state that will be set when the script is triggered
   * @param usePermissionWhenTrue Will check if the user has the Permission when the state is true
   * @param usePermissionWhenFalse Will check if the user has the Permission when the state is false
   * @param callback The callback that will be triggered when the script is triggered
   */
  registerScript<Name extends keyof ExecuteablePermissions['script']>(
    permission: Name,
    stateToSet: keyof typeof permissionStates | null,
    usePermissionWhenTrue: boolean,
    usePermissionWhenFalse: boolean,
    callback: (active: boolean, ...args: ExecuteablePermissions['script'][Name]) => void
  ) {
    if (this.executions[permission]) {
      throw new Error(`[Access] Execution for ${permission} already registered`);
    }
    this.executions[permission] = {
      stateToSet,
      usePermissionWhenTrue,
      usePermissionWhenFalse,
      callback,
    };
  }

  /**
   * Register a WebView event that can be triggered with do()
   * @param permission Name of the permission to trigger the UI on
   * @param stateToSet The state that will be set when the UI is triggered
   * @param usePermissionWhenTrue Will check if the user has the Permission when the state is true
   * @param usePermissionWhenFalse Will check if the user has the Permission when the state is false
   * @param eventName The name of the event sent to the WebView
   * @param focus If the WebView should be focused
   * @param showCursor If the cursor should be shown and where it should be positioned
   */
  registerUI(
    permission: keyof ExecuteablePermissions['ui'],
    stateToSet: keyof typeof permissionStates | null,
    usePermissionWhenTrue: boolean,
    usePermissionWhenFalse: boolean,
    eventName: string,
    focus: boolean,
    showCursor: false | 'lastPos' | 'center'
  ) {
    this.registerScript(permission as never, stateToSet, usePermissionWhenTrue, usePermissionWhenFalse, (active, ...args) => {
      console.error('UI execution not implemented');
    });
  }

  do<Perm extends string>(permission: ExecuteablePermission<Perm>, state: boolean, ...args: ExecuteablePermArgs<Perm>): boolean {
    const execution = this.executions[permission];
    if (!execution) {
      logError('access', `No executions found for permission ${permission}`);
      return false;
    }

    const { stateToSet, usePermissionWhenTrue, usePermissionWhenFalse, callback } = execution;
    if (state) {
      if (usePermissionWhenTrue) {
        const hasPermission = this.permissionsManager.can(permission as string);
        if (hasPermission) {
          callback(state, ...args);
          if (stateToSet) this.permissionsManager.setStateActive(stateToSet, true);
          return true;
        }
      } else {
        callback(state, ...args);
        if (stateToSet) this.permissionsManager.setStateActive(stateToSet, true);
        return true;
      }
    } else {
      if (usePermissionWhenFalse) {
        const hasPermission = this.permissionsManager.can(permission as string);
        if (hasPermission) {
          callback(state, ...args);
          if (stateToSet) this.permissionsManager.setStateActive(stateToSet, false);
          return true;
        }
      } else {
        callback(state, ...args);
        if (stateToSet) this.permissionsManager.setStateActive(stateToSet, false);
        return true;
      }
    }
    return false;
  }
}

export const executor = new ClientExecutionManager(permissions);
