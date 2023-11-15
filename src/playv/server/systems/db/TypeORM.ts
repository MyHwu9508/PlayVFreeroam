/* eslint-disable import/exports-last */
import 'reflect-metadata';
import alt from 'alt-server';
import { DataSource } from 'typeorm';
import { PUser } from '../../entities/puser';
import { ModdedVehicle } from '../../entities/moddedVehicle';
import { VehicleData } from '../../entities/vehicleData';
import { CharacterData } from '../../entities/characterData';
import { OutfitData } from '../../entities/outfitData';
import { VehicleLog } from '../../entities/vehicleLog';
import { PlayerLog } from '../../entities/playerLog';
import { ChatLog } from '../../entities/chatLog';
import { LobbyPreset } from '../../entities/lobbyPreset';

export const AppDataSource = await new DataSource({
  type: 'postgres',
  host: alt.getServerConfig().database.host,
  port: alt.getServerConfig().database.port,
  username: alt.getServerConfig().database.username,
  password: alt.getServerConfig().database.password,
  database: alt.getServerConfig().database.database,
  entities: [PUser, ModdedVehicle, VehicleData, CharacterData, OutfitData, VehicleLog, PlayerLog, ChatLog, LobbyPreset],
  synchronize: alt.getServerConfig().database.refreshScheme, //run schema sync on debug mode
  logging: false,
  cache: false,
})
  .initialize()
  .catch(err => {
    throw err;
  });
