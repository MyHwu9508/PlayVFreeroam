export const DefaultSpeedometerConfig: SpeedometerConfig = {
  mode: 0,
  width: 15,
  fps: 25,
  bottom: 2.5,
  right: 0.2,
  speedoMeterType: 0,
};

export type SpeedometerConfig = {
  mode: number;
  width: number;
  fps: number;
  bottom: number;
  right: number;
  speedoMeterType: number;
};
