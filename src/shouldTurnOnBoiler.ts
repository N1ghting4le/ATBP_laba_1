import { WorkMode } from "./types";
import {
  ABSOLUTE_ZERO,
  ECO_MODE_TEMP_DIFFERENCE,
  COMFORT_MODE_TEMP_DIFFERENCE,
  TEMP_LOWER_THAN_ABSOLUTE_ZERO,
  TEMP_IS_NOT_NUMBER,
} from "./constants";

export function shouldTurnOnBoiler(
  currentTemp: number,
  desiredTemp: number,
  workMode: WorkMode,
) {
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
