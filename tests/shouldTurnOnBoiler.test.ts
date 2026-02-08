import { shouldTurnOnBoiler } from "../src/shouldTurnOnBoiler";
import { WorkMode } from "../src/types";
import {
  TEMP_LOWER_THAN_ABSOLUTE_ZERO,
  TEMP_IS_NOT_NUMBER,
} from "../src/constants";

describe("shouldTurnOnBoiler", () => {
  describe("Эко режим", () => {
    test("включает котел при температуре ниже целевой более чем на 3 градуса", () => {
      expect(shouldTurnOnBoiler(17, 21, WorkMode.Eco)).toBe(true);
      expect(shouldTurnOnBoiler(10, 20, WorkMode.Eco)).toBe(true);
    });

    test("не включает котел при температуре ниже целевой менее чем на 3 градуса", () => {
      expect(shouldTurnOnBoiler(20, 21, WorkMode.Eco)).toBe(false);
      expect(shouldTurnOnBoiler(19, 21, WorkMode.Eco)).toBe(false);
    });

    test("не включает котел при температуре выше целевой", () => {
      expect(shouldTurnOnBoiler(22, 21, WorkMode.Eco)).toBe(false);
      expect(shouldTurnOnBoiler(25, 21, WorkMode.Eco)).toBe(false);
    });

    test("включает котел при разнице ровно 3 градуса (граничное значение)", () => {
      expect(shouldTurnOnBoiler(18, 21, WorkMode.Eco)).toBe(true);
    });
  });

  describe("Комфорт режим", () => {
    test("включает котел при температуре ниже целевой более чем на 0.5 градуса", () => {
      expect(shouldTurnOnBoiler(19.4, 20, WorkMode.Comfort)).toBe(true);
      expect(shouldTurnOnBoiler(15, 20, WorkMode.Comfort)).toBe(true);
    });

    test("не включает котел при температуре ниже целевой менее чем на 0.5 градуса", () => {
      expect(shouldTurnOnBoiler(19.6, 20, WorkMode.Comfort)).toBe(false);
      expect(shouldTurnOnBoiler(19.9, 20, WorkMode.Comfort)).toBe(false);
    });

    test("не включает котел при температуре выше целевой", () => {
      expect(shouldTurnOnBoiler(20.1, 20, WorkMode.Comfort)).toBe(false);
      expect(shouldTurnOnBoiler(21, 20, WorkMode.Comfort)).toBe(false);
    });

    test("включает котел при разнице ровно 0.5 градуса (граничное значение)", () => {
      expect(shouldTurnOnBoiler(19.5, 20, WorkMode.Comfort)).toBe(true);
    });
  });

  describe("Обработка ошибок", () => {
    test("выбрасывает ошибку при температуре ниже абсолютного нуля (-273.15)", () => {
      expect(() => shouldTurnOnBoiler(-274, 20, WorkMode.Eco)).toThrow(
        TEMP_LOWER_THAN_ABSOLUTE_ZERO,
      );
      expect(() => shouldTurnOnBoiler(20, -300, WorkMode.Comfort)).toThrow(
        TEMP_LOWER_THAN_ABSOLUTE_ZERO,
      );
      expect(() => shouldTurnOnBoiler(-300, -400, WorkMode.Eco)).toThrow(
        TEMP_LOWER_THAN_ABSOLUTE_ZERO,
      );
    });

    test("не выбрасывает ошибку при температуре равной абсолютному нулю", () => {
      expect(() => shouldTurnOnBoiler(-273.15, 20, WorkMode.Eco)).not.toThrow();
      expect(() =>
        shouldTurnOnBoiler(20, -273.15, WorkMode.Comfort),
      ).not.toThrow();
    });

    test("выбрасывает ошибку при нечисловых температурах", () => {
      expect(() => shouldTurnOnBoiler(NaN, 22, WorkMode.Eco)).toThrow(
        TEMP_IS_NOT_NUMBER,
      );
      expect(() => shouldTurnOnBoiler(22, NaN, WorkMode.Comfort)).toThrow(
        TEMP_IS_NOT_NUMBER,
      );
    });
  });

  describe("Дополнительные случаи", () => {
    test("работает с дробными температурами", () => {
      expect(shouldTurnOnBoiler(19.9, 20, WorkMode.Comfort)).toBe(false);
      expect(shouldTurnOnBoiler(19.49, 20, WorkMode.Comfort)).toBe(true);
      expect(shouldTurnOnBoiler(17.9, 21, WorkMode.Eco)).toBe(true);
      expect(shouldTurnOnBoiler(18.1, 21, WorkMode.Eco)).toBe(false);
    });

    test("работает с одинаковыми температурами", () => {
      expect(shouldTurnOnBoiler(20, 20, WorkMode.Eco)).toBe(false);
      expect(shouldTurnOnBoiler(20, 20, WorkMode.Comfort)).toBe(false);
    });

    test("работает с отрицательными температурами выше абсолютного нуля", () => {
      expect(shouldTurnOnBoiler(-10, -5, WorkMode.Eco)).toBe(true);
      expect(shouldTurnOnBoiler(-5, -5, WorkMode.Comfort)).toBe(false);
      expect(shouldTurnOnBoiler(-5.6, -5, WorkMode.Comfort)).toBe(true);
    });
  });
});
