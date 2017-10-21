import { dataBaseSettings, tableSettings } from "./common/online.service";

export const API_URL = 'https://teacher-api.herokuapp.com';

export const DB_SETTINGS: dataBaseSettings = {
  name: 'store',
  version: 1,
};

export const TABLE_SETTINGS: tableSettings[] = [
  {
    name: 'state',
  },
  {
    name: 'syncQueue',
    keyPath: 'time',
    autoIncrement: false,
  },
];
