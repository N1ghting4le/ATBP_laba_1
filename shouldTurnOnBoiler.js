function shouldTurnOnBoiler(currentTemp, desiredTemp, workMode) {
  if (
    typeof currentTemp !== "number" ||
    typeof desiredTemp !== "number" ||
    Number.isNaN(currentTemp) ||
    Number.isNaN(desiredTemp)
  ) {
    throw new Error("Температуры должны быть числами");
  }

  if (currentTemp < -273.15 || desiredTemp < -273.15) {
    throw new Error(
      "Температура не может быть ниже абсолютного нуля (-273.15°C)",
    );
  }

  if (workMode === "Эко") {
    return desiredTemp - currentTemp >= 3;
  }

  if (workMode === "Комфорт") {
    return desiredTemp - currentTemp >= 0.5;
  }

  throw new Error('Режим должен быть "Эко" или "Комфорт"');
}

module.exports = shouldTurnOnBoiler;
