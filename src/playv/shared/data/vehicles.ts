import alt from 'alt-shared';
const vehicleAllData = JSON.parse(alt.File.read('@assets/dump/vehicles.json'));

const vehicles: { [hash: string]: vehicleData } = {};

vehicleAllData.forEach(veh => {
  vehicles[veh.Hash] = veh as vehicleData;
  vehicles[veh.Hash].Name = vehicles[veh.Hash].Name.toLowerCase(); //lowercase all fkin vehicle spawn names
});

export default vehicles;

export interface vehicleData {
  Name: string;
  DisplayName: DisplayName;
  Hash: number;
  SignedHash: number;
  HexHash: string;
  DlcName: string;
  HandlingId: string;
  LayoutId: string;
  Manufacturer: string;
  ManufacturerDisplayName: DisplayName;
  Class: string;
  ClassId: number;
  Type: string;
  PlateType: string;
  DashboardType: string;
  WheelType: string;
  Flags: string[];
  Seats: number;
  Price: number;
  MonetaryValue: number;
  HasConvertibleRoof: boolean;
  HasSirens: boolean;
  Weapons: any[];
  ModKits: string[];
  DimensionsMin: BoundingCenter;
  DimensionsMax: BoundingCenter;
  BoundingCenter: BoundingCenter;
  BoundingSphereRadius: number;
  Rewards: null;
  MaxBraking: number;
  MaxBrakingMods: number;
  MaxSpeed: number;
  MaxTraction: number;
  Acceleration: number;
  Agility: number;
  MaxKnots: number;
  MoveResistance: number;
  HasArmoredWindows: boolean;
  DefaultColors: DefaultColor[];
  DefaultBodyHealth: number;
  DirtLevelMin: number;
  DirtLevelMax: number;
  Trailers: any[];
  AdditionalTrailers: any[];
  Extras: number[];
  RequiredExtras: number[];
  SpawnFrequency: number;
  WheelsCount: number;
  HasParachute: boolean;
  HasKers: boolean;
  DefaultHorn: number;
  DefaultHornVariation: number;
  Bones: Bone[];
}

export interface Bone {
  BoneIndex: number;
  BoneId: number;
  BoneName: string;
}

export interface BoundingCenter {
  X: number;
  Y: number;
  Z: number;
}

export interface DefaultColor {
  DefaultPrimaryColor: number;
  DefaultSecondaryColor: number;
  DefaultPearlColor: number;
  DefaultWheelsColor: number;
  DefaultInteriorColor: number;
  DefaultDashboardColor: number;
}

export interface DisplayName {
  Hash: number;
  English: string;
  German: string;
  French: string;
  Italian: string;
  Russian: string;
  Polish: string;
  Name: string;
  TraditionalChinese: string;
  SimplifiedChinese: string;
  Spanish: string;
  Japanese: string;
  Korean: string;
  Portuguese: string;
  Mexican: string;
}
