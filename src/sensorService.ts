import { SensorService } from "./types";

export class MockSensorService implements SensorService {
  private temperature: number = 20;

  setTemperature(temp: number) {
    this.temperature = temp;
  }

  async getInteriorTemperature(): Promise<number> {
    return this.temperature;
  }
}

export const sensorService = new MockSensorService();
