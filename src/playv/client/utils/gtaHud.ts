import alt from 'alt-client';
import native from 'natives';

export class HUD {
  getMinimapWidth() {
    const aspectRatio = this.getScreenAspectRatio();
    const resolution = this.getScreenResolution();

    return resolution.x / (4 * aspectRatio);
  }

  getMinimapHeight() {
    const resolution = this.getScreenResolution();

    return resolution.y / 5.674;
  }

  getMinimapTopLeft() {
    const resolution = this.getScreenResolution();
    const safeZone = this.getSafeZoneSize();
    const height = this.getMinimapHeight();

    const x = resolution.x * ((1.0 / 20.0) * (Math.abs(safeZone - 1.0) * 10));
    const y = resolution.y - resolution.y * ((1.0 / 20.0) * (Math.abs(safeZone - 1.0) * 10)) - height;

    return { x, y };
  }

  getMinimapTopRight() {
    const { x, y } = this.getMinimapTopLeft();
    return { x: x + this.getMinimapWidth(), y };
  }

  getMinimapBottomLeft() {
    const { x, y } = this.getMinimapTopLeft();
    return { x, y: y + this.getMinimapHeight() };
  }

  getMinimapBottomRight() {
    const { x, y } = this.getMinimapTopLeft();
    return { x: x + this.getMinimapWidth(), y: y + this.getMinimapHeight() };
  }

  getSafeZoneSize() {
    return native.getSafeZoneSize();
  }

  getScreenAspectRatio() {
    return native.getAspectRatio(false);
  }

  getScreenResolution() {
    const [_, x, y] = native.getActualScreenResolution(0, 0);
    return { x, y };
  }
}
export const gtaHud = new HUD();
