import * as alt from "alt-client"
import * as native from "natives"

import {GetDirectionFromRotation, rotate} from "../utils/vector.js"
import {Vector3} from "alt-client"
import { pushToast } from '../ui/hud/toasts';

export class HelicopterFunctions {
    private readonly _fovMax = 80;
    private readonly _fovMin = 20;

    private readonly _zoomSpeed = 3;

    private readonly _speedLeftAndRight: number = 4;
    private readonly _speedUpAndDown: number = 4;

    private _vision: number = 0;
    private _vehicleInformation: VehicleInformation = VehicleInformation.Full;
    private _fov: number = 42;

    private _targetVehicle: alt.Vehicle|null = null;

    private _manualSpotlight: boolean = false;
    private _trackingSpotlight: boolean = false;

    private _helicopterTick: number|null = null;

    private _cam: number|null = null;
    private _scaleForm: number|null = null;
    private _lastCamPosition: alt.Vector3|null;

    private _brightness = 1.0;
    private _radius = 4;

    public openHelicopterCamera = (): boolean => {
        if (this._helicopterTick != null) {
            return false;
        }

        if (this.locked.size) {
            return false;
        }

        this.clearHelicopterCamTick();

        const player = alt.Player.local;
        const helicopter = player.vehicle;

        if (!this.isInHelicopterWithCamera()) {
            return false;
        }

        // if (!this.isHelicopterHighEnough(helicopter)) {
        //     pushToast("error","Der Helikopter fliegt nicht hoch genug.");
        //     return false;
        // }

        if (player.seat != 2) {
            pushToast("error", "Nur der Beifahrer darf die Kamera bedienen.");
            return false;
        }
        

        alt.logError("Open helicopter camera");

        native.playSoundFrontend(0, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);

        native.setTimecycleModifier("heliGunCam");
        native.setTimecycleModifierStrength(0.3);

        alt.emit('ui:lock', 'helicopter:cam', true);
        alt.emit('ui:hide:component', 'voice-range', false);
        this._lastCamPosition = null;

        alt.logError("Request scaleForm");
        requestScaleForm("HELI_CAM").then((scaleForm) => {
            const cam = native.createCam("DEFAULT_SCRIPTED_FLY_CAMERA", true);

            alt.logError("Loading camera - " + cam);

            native.attachCamToEntity(cam, helicopter, 0.0, 2.5, -1.5, true);

            native.setCamRot(cam, 0.0, 0.0, native.getEntityHeading(helicopter), 2);
            native.setCamFov(cam, this._fov);

            native.renderScriptCams(true, false, 0, true, false, 1);

            native.beginScaleformMovieMethod(scaleForm, "SET_CAM_LOGO");
            native.scaleformMovieMethodAddParamInt(0);
            native.endScaleformMovieMethod();

            this._cam = cam;
            this._scaleForm = scaleForm;

            alt.logError("Starting cam tick");
            this._helicopterTick = alt.everyTick(this.helicopterCamTick);
        }).catch((reason) => {
            alt.logError(reason);
        });

        return true;
    }

    public startRappel = (): boolean  => {
        const player = alt.Player.local;
        const helicopter = player.vehicle;

        if (!this.isInHelicopterWithCamera()) {
            return false;
        }

        if (!this.isHelicopterHighEnough(helicopter)) {
            pushToast("error", "Der Helikopter ist nicht hoch genug.");
            return false;
        }

        if (player.seat != 3 && player.seat != 4) {
            pushToast("error", "Du kannst dich nicht von diesen Platz aus abseilen.");
            native.playSoundFrontend(-1, "5_Second_Timer", "DLC_HEISTS_GENERAL_FRONTEND_SOUNDS", false);
            return false;
        }

        native.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
        native.taskRappelFromHeli(player, 1);

        return true;
    }

    private helicopterCamTick = () => {
        const player = alt.Player.local;
        const helicopter = player.vehicle;

        native.disableAllControlActions(0);

        if (native.isDisabledControlJustPressed(0, 200)) {
            alt.toggleGameControls(false);
            alt.logError("Escaping cam");
            this.clearHelicopterCamTick();

            alt.setTimeout(() => {
                alt.toggleGameControls(true);
            }, 100);
            return;
        }

        if (!helicopter) {
            alt.logError("Not in a helicopter");
            this.clearHelicopterCamTick();
            return;
        }

        if (player.seat != 2) {
            alt.logError("Player is not passanger");
            this.clearHelicopterCamTick();
            return;
        }

        if (native.isEntityDead(player, false)) {
            alt.logError("Player is dead");
            this.clearHelicopterCamTick();
            return;
        }

        // if (!this.isHelicopterHighEnough(helicopter)) {
        //     alt.logError("Helicopter isn't high egnough");
        //     this.clearHelicopterCamTick();
        //     pushToast("error", "Der Helikopter fliegt zu niedrig.");
        //     return;
        // }

        if (native.isDisabledControlJustPressed(0, 183)) {
            native.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
            this._manualSpotlight = !this._manualSpotlight;

            if (!this._manualSpotlight) {
                alt.emitServer("vehicle:spotlight:remove", alt.Player.local.vehicle);
            }
        }

        if (native.isDisabledControlJustPressed(0, 25)) {
            native.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
            this.toggleNightVision();
        }

        const zoomValue = (1 / (this._fovMax - this._fovMin)) * (this._fov - this._fovMin);
        this.checkInputRotation(this._cam, zoomValue);

        this.handleZoom(this._cam);
        this.disableGtaHudComponentsThisFrame();
        native.beginScaleformMovieMethod(this._scaleForm, "SET_ALT_FOV_HEADING");
        native.scaleformMovieMethodAddParamFloat(helicopter.pos.z);
        native.scaleformMovieMethodAddParamFloat(zoomValue);
        native.scaleformMovieMethodAddParamFloat(native.getCamRot(this._cam, 2).z);
        native.endScaleformMovieMethod();
        native.drawScaleformMovieFullscreen(this._scaleForm, 255, 255, 255, 255, 255);

        if (this._manualSpotlight) {
            const updated = this.handleBrightnessAndRadius();

            const rotation = native.getCamRot(this._cam, 2);
            const dirVector = GetDirectionFromRotation(rotation);
            const camCoords = native.getCamCoord(this._cam);

            const {x, y, z} = dirVector;

            if (!this._lastCamPosition || this._lastCamPosition.distanceTo(dirVector) >= 0.01 || updated) {
                this._lastCamPosition = dirVector;
                alt.emitServer("vehicle:spotlight", helicopter, x, y, z, this._brightness, this._radius);
            }

            native.drawSpotLight(
                camCoords.x,
                camCoords.y,
                camCoords.z,
                x,
                y,
                z,
                255,
                255,
                255,
                800,
                this._brightness,
                1,
                this._radius,
                1
            );
        }
    }

    private clearHelicopterCamTick = () => {
        alt.logError("Clear helicopter cam tick");
        if (this._manualSpotlight) {
            alt.emitServer("vehicle:spotlight:remove", alt.Player.local.vehicle);
            this._manualSpotlight = false;
            alt.logError(`Remove spotlight`);
        }

        if (this._helicopterTick != null) {
            alt.emit('ui:hide:component', 'voice-range', true);
            alt.emit('ui:lock', 'helicopter:cam', false);
            alt.clearEveryTick(this._helicopterTick);
            this._helicopterTick = null;
        }

        if (this._cam) {
            native.renderScriptCams(false, false, 0, true, false, 0);
            native.destroyCam(this._cam, false);
            this._cam = null;
        }

        this._fov = (this._fovMax + this._fovMin) * 0.5;
        native.clearTimecycleModifier();
        native.setNightvision(false);
        native.setSeethrough(false);
    }

    private isInHelicopterWithCamera = (): boolean => {
        const {vehicle} = alt.Player.local;

        if (vehicle == null) {
            return false;
        }

        if ([alt.hash("polmav")].includes(vehicle.model)) {
            return true;
        }

        return [alt.hash("maverick")].includes(vehicle.model);
    }

    private isHelicopterHighEnough = (helicopter: alt.Vehicle) => {
        return native.getEntityHeightAboveGround(helicopter) > 3;
    }

    private toggleNightVision = () => {
        this._vision = ++this._vision % 2;

        native.setNightvision(this._vision === 1);
        native.setSeethrough(this._vision === 2);
        native.seethroughSetMaxThickness(0);
    }

    private nextVehicleInformation = () => {
        switch (this._vehicleInformation) {
            case VehicleInformation.Full:
                this._vehicleInformation = VehicleInformation.Minimized;
                return;
            case VehicleInformation.Minimized:
                this._vehicleInformation = VehicleInformation.None;
                return;
            default:
                this._vehicleInformation = VehicleInformation.Full;
                return;
        }
    }

    private disableGtaHudComponentsThisFrame = () => {
        native.hideHelpTextThisFrame();
        native.hideHudAndRadarThisFrame();
        native.hideHudComponentThisFrame(19);
        native.hideHudComponentThisFrame(2);
        native.hideHudComponentThisFrame(11);
        native.hideHudComponentThisFrame(12);
        native.hideHudComponentThisFrame(15);
        native.hideHudComponentThisFrame(18);
    }

    private checkInputRotation = (cam: number, zoomValue: number) => {
        const x = native.getDisabledControlNormal(0, 220);
        const y = native.getDisabledControlNormal(0, 221);

        const rotation = native.getCamRot(cam, 2);

        if (x !== 0 || y !== 0) {
            const newZ = rotation.z + x * -1 * this._speedUpAndDown * (zoomValue + 0.1);
            const newX = Math.max(Math.min(20, rotation.x + y * -1 * this._speedLeftAndRight * (zoomValue + 0.1)), -89.5);

            native.setCamRot(cam, newX, 0, newZ, 2);
        }
    }

    private handleZoom = (cam: number) => {
        if (native.isDisabledControlJustPressed(0, 241)) {
            this._fov = Math.max(this._fov - this._zoomSpeed, this._fovMin);
        }

        if (native.isDisabledControlJustPressed(0, 242)) {
            this._fov = Math.min(this._fov + this._zoomSpeed, this._fovMax);
        }

        const currentFov = native.getCamFov(cam);

        if (Math.abs(this._fov - currentFov) < 0.1) {
            this._fov = currentFov;
        }

        native.setCamFov(cam, currentFov + (this._fov - currentFov) * 0.05);
    }

    private handleBrightnessAndRadius = (): boolean => {
        let updated = false;

        if (native.isDisabledControlJustPressed(0, 172)) {
            updated = true;
            this._brightness = Math.min(Math.max(++this._brightness, 1), 10);
            native.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
        }

        if (native.isDisabledControlJustPressed(0, 173)) {
            updated = true;
            this._brightness = Math.min(Math.max(--this._brightness, 1), 10);
            native.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
        }

        if (native.isDisabledControlJustPressed(0, 175)) {
            updated = true;
            this._radius = Math.min(Math.max(++this._radius, 1), 10);
            native.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
        }

        if (native.isDisabledControlJustPressed(0, 174)) {
            updated = true;
            this._radius = Math.min(Math.max(--this._radius, 1), 10);
            native.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
        }

        return updated;
    }

    private getVehicleInView = (cam: number): alt.Vehicle|null => {
        const coords = native.getCamCoord(cam);
        const forwardVector = GetDirectionFromRotation(native.getCamRot(cam, 2));

        const searchVector = coords.add((forwardVector.mul(200)));
        const rayHandle = native.startShapeTestLosProbe(
            coords.x, coords.y, coords.z,
            searchVector.x, searchVector.y, searchVector.z,
            10,
            alt.Player.local.vehicle,
            0
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, _hit, _endCoords, _surfaceNormal, _entity] = native.getShapeTestResult(rayHandle);

        if (_entity > 0) {
            const vehicle = alt.Vehicle.getByID(_entity);

            if (vehicle.valid) {
                return vehicle;
            }
        }

        return null;
    }

    private locked: Set<string> = new Set<string>();

    private onClientLock = (ui: string, locked: boolean) => {
        if (ui === 'helicopter:cam') {
            return;
        }

        if (locked) {
            this.locked.add(ui);
        } else {
            this.locked.delete(ui);
        }
    }

    /** Syncing stuff **/
    constructor() {
        alt.on("gameEntityCreate", this.gameEntityCreate);
        alt.on("gameEntityDestroy", this.gameEntityDestroy);
        alt.on("streamSyncedMetaChange", this.streamSyncedMetaChange);
        alt.on('ui:lock', this.onClientLock);
    }

    private _helicoptersWithSpotlight: alt.Vehicle[] = [];
    private _syncTick: number|null = null;
    private _helicopterSpotlightMap: {[key: number]: SpotlightSync} = {};

    private addOrUpdateHelicopterSpotlight = (helicopter: alt.Vehicle, syncData: SpotlightSync) => {
        if (alt.Player.local.vehicle && alt.Player.local.vehicle === alt.Player.local.vehicle && this._helicopterTick !== null) {
            alt.logError(`[vehicle:spotlight] Own helicopter - ${helicopter.id}`);
            return;
        }

        if (!this._helicoptersWithSpotlight.includes(helicopter)) {
            alt.logError(`[vehicle:spotlight] Added new helicopter - ${helicopter.id}`);
            this._helicoptersWithSpotlight.push(helicopter);
        }

        this._helicopterSpotlightMap[helicopter.id] = syncData;
    }

    private removeHelicopterSpotlight = (helicopter: alt.Vehicle) => {
        alt.logError(`[vehicle:spotlight] Remove helicopter - ${helicopter.id}`);
        this._helicoptersWithSpotlight.splice(
            this._helicoptersWithSpotlight.findIndex(v => v.id === helicopter.id),
            1
        );
        delete this._helicoptersWithSpotlight[helicopter.id];
    }

    private gameEntityCreate = (entity: alt.Entity) => {
        if (entity instanceof alt.Vehicle && entity.valid) {
            if (entity.hasStreamSyncedMeta("vehicle:spotlight")) {
                this.startSyncTick();
                alt.logError(`[vehicle:spotlight] gameEntityCreate - ${entity.id} ${JSON.stringify(entity.getStreamSyncedMeta("vehicle:spotlight"))}`)
                this.addOrUpdateHelicopterSpotlight(entity, entity.getStreamSyncedMeta<SpotlightSync>("vehicle:spotlight"));
            }
        }
    }

    private gameEntityDestroy = (entity: alt.Entity) => {
        if (entity instanceof alt.Vehicle && entity.valid) {
            if (this._helicoptersWithSpotlight.includes(entity)) {
                alt.logError(`[vehicle:spotlight] gameEntityDestroy- ${entity.id}`);
                this.removeHelicopterSpotlight(entity);
            }
        }
    }

    private streamSyncedMetaChange = (entity: alt.Entity, key: string, value: never) => {
        if (entity instanceof alt.Vehicle && entity.valid) {
            switch (key) {
                case "vehicle:spotlight":
                    alt.logError(value);
                    if (!value) {
                        this.removeHelicopterSpotlight(entity);
                        return;
                    }

                    this.startSyncTick();

                    this.addOrUpdateHelicopterSpotlight(entity, value);
                    return;
            }
        }
    }

    private syncTick = () => {
        if (this._helicoptersWithSpotlight.length <= 0) {
            this.removeSyncTick();
            return;
        }

        this._helicoptersWithSpotlight.forEach(helicopter => {
            const {x, y, z, brightness, radius} = this._helicopterSpotlightMap[helicopter.id];

            const rotatedVec = rotate(new Vector3(0, 2.5, -1.5), helicopter.rot.z, helicopter.rot.y, helicopter.rot.x);

            native.drawSpotLight(
                helicopter.pos.x + rotatedVec.x,
                helicopter.pos.y + rotatedVec.y,
                helicopter.pos.z + rotatedVec.z,
                x,
                y,
                z,
                255,
                255,
                255,
                800,
                brightness,
                1,
                radius,
                1
            );
        });
    }

    private startSyncTick = () => {
        if (this._syncTick != null) {
            return;
        }

        alt.logError("[vehicle:spotlight] New sync tick");
        this._syncTick = alt.everyTick(this.syncTick);
    }

    private removeSyncTick = () => {
        if (this._syncTick != null) {
            alt.logError("[vehicle:spotlight] Remove sync tick");
            alt.clearEveryTick(this._syncTick);
            this._syncTick = null;
        }
    }
}

enum VehicleInformation {
    Full,
    Minimized,
    None
}

interface SpotlightSync {
    x: number;
    y: number;
    z: number;
    brightness: number;
    radius: number;
}

export function requestScaleForm(scaleForm: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const scaleFormId = native.requestScaleformMovie(scaleForm);

        let count = 0;
        const inter = alt.setInterval(() => {
            if (count > 255) {
                alt.clearInterval(inter);
                return reject("Extended limit");
            }

            if (native.hasScaleformMovieLoaded(scaleFormId)) {
                alt.clearTimeout(inter);
                return resolve(scaleFormId);
            }

            count++;
        }, 5);
    });
}
