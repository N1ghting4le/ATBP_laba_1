import { WorkMode, SensorService } from "./types";
import {
  ABSOLUTE_ZERO,
  ECO_MODE_TEMP_DIFFERENCE,
  COMFORT_MODE_TEMP_DIFFERENCE,
  TEMP_LOWER_THAN_ABSOLUTE_ZERO,
  TEMP_IS_NOT_NUMBER,
  SENSOR_ERROR,
} from "./constants";

export async function shouldTurnOnBoiler(
  desiredTemp: number,
  workMode: WorkMode,
  sensorService: SensorService
): Promise<boolean> {
  const currentTemp = await sensorService.getInteriorTemperature();

  if (currentTemp === null || currentTemp === undefined) {
    throw new Error(SENSOR_ERROR);
  }

  if (Number.isNaN(currentTemp) || Number.isNaN(desiredTemp)) {
    throw new Error(TEMP_IS_NOT_NUMBER);
  }

  if (currentTemp < ABSOLUTE_ZERO || desiredTemp < ABSOLUTE_ZERO) {
    throw new Error(TEMP_LOWER_THAN_ABSOLUTE_ZERO);
  }

  if (workMode === WorkMode.Eco) {
    return desiredTemp - currentTemp >= ECO_MODE_TEMP_DIFFERENCE;
  }

  return desiredTemp - currentTemp >= COMFORT_MODE_TEMP_DIFFERENCE;
}
