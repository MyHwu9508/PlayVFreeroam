
import * as alt from "alt-client"

// Get the distance between two vectors.
export function distance(vector1: alt.Vector3, vector2: alt.Vector3): number {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return Math.sqrt(
        Math.pow(vector1.x - vector2.x, 2) +
        Math.pow(vector1.y - vector2.y, 2) +
        Math.pow(vector1.z - vector2.z, 2)
    );
}

export function getClosestVehicle(maxRange: number): alt.Vehicle|null {
    const {pos, vehicle} = alt.Player.local;

    if (vehicle) {
        return vehicle;
    }

    let veh = null;

    const possibleVeh = getClosestVectorByPos<alt.Vehicle>(pos, [...alt.Vehicle.streamedIn]);

    if (possibleVeh && possibleVeh.pos.distanceTo(pos) <= maxRange) {
        veh = possibleVeh;
    }

    return veh;
}

export function getSortedVectorsByPos<T>(pos: alt.Vector3, positions: T[], posVariable: string = 'pos'): T[] {
    return positions.sort((a, b) => {
        return pos.distanceTo(a[posVariable]) - pos.distanceTo(b[posVariable]);
    });
}

export function getClosestVectorByPos<T>(pos: alt.Vector3, positions: T[], posVariable: string = 'pos'): T {
    return getSortedVectorsByPos(pos, positions, posVariable)[0];
}

export function forwardVector(length: number, rot: alt.Vector3): alt.Vector3 {
    return new alt.Vector3(
        length * Math.cos( Math.PI / 2 + ( rot.z * Math.PI / 180 ) ),
        length * Math.sin( Math.PI / 2 + ( rot.z * Math.PI / 180 ) ),
        length * Math.sin( rot.x * Math.PI / 180 )
    );
}

export function GetDirectionFromRotation(rotation: alt.Vector3): alt.Vector3 {
    const z = rotation.z * (Math.PI / 180.0);
    const x = rotation.x * (Math.PI / 180.0);
    const num = Math.abs(Math.cos(x));

    return new alt.Vector3(
        (-Math.sin(z) * num),
        (Math.cos(z) * num),
        Math.sin(x)
    );
}

export function rotate(vector: alt.Vector3, yaw: number, pitch: number, roll: number) {
    return rotateZ(rotateY(rotateX(vector, roll), pitch), yaw);
}

export function rotateX(vector: alt.Vector3, angle: number) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    return new alt.Vector3(vector.x, vector.y * cos - vector.z * sin, vector.z * cos + vector.y * sin);
}

export function rotateY(vector: alt.Vector3, angle: number) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    return new alt.Vector3(vector.x * cos - vector.z * sin, vector.y, vector.z * cos + vector.x * sin);
}

export function rotateZ(vector: alt.Vector3, angle: number) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    return new alt.Vector3(vector.x * cos - vector.y * sin, vector.y * cos + vector.x * sin, vector.z);
}