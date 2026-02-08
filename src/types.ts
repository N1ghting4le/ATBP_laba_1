export enum WorkMode {
  Eco = "Эко",
  Comfort = "Комфорт",
}

export interface SensorService {
  getInteriorTemperature(): Promise<number | null | undefined>;
}
