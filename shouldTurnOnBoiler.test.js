const shouldTurnOnBoiler = require("./shouldTurnOnBoiler");

describe("shouldTurnOnBoiler", () => {
  describe("Эко режим", () => {
    test("включает котел при температуре ниже целевой более чем на 3 градуса", () => {
      expect(shouldTurnOnBoiler(17, 21, "Эко")).toBe(true);
      expect(shouldTurnOnBoiler(10, 20, "Эко")).toBe(true);
    });

    test("не включает котел при температуре ниже целевой менее чем на 3 градуса", () => {
      expect(shouldTurnOnBoiler(20, 21, "Эко")).toBe(false);
      expect(shouldTurnOnBoiler(19, 21, "Эко")).toBe(false);
    });

    test("не включает котел при температуре выше целевой", () => {
      expect(shouldTurnOnBoiler(22, 21, "Эко")).toBe(false);
      expect(shouldTurnOnBoiler(25, 21, "Эко")).toBe(false);
    });

    test("включает котел при разнице ровно 3 градуса (граничное значение)", () => {
      expect(shouldTurnOnBoiler(18, 21, "Эко")).toBe(true);
    });
  });

  describe("Комфорт режим", () => {
    test("включает котел при температуре ниже целевой более чем на 0.5 градуса", () => {
      expect(shouldTurnOnBoiler(19.4, 20, "Комфорт")).toBe(true);
      expect(shouldTurnOnBoiler(15, 20, "Комфорт")).toBe(true);
    });

    test("не включает котел при температуре ниже целевой менее чем на 0.5 градуса", () => {
      expect(shouldTurnOnBoiler(19.6, 20, "Комфорт")).toBe(false);
      expect(shouldTurnOnBoiler(19.9, 20, "Комфорт")).toBe(false);
    });

    test("не включает котел при температуре выше целевой", () => {
      expect(shouldTurnOnBoiler(20.1, 20, "Комфорт")).toBe(false);
      expect(shouldTurnOnBoiler(21, 20, "Комфорт")).toBe(false);
    });

    test("включает котел при разнице ровно 0.5 градуса (граничное значение)", () => {
      expect(shouldTurnOnBoiler(19.5, 20, "Комфорт")).toBe(true);
    });
  });

  describe("Обработка ошибок", () => {
    test("выбрасывает ошибку при температуре ниже абсолютного нуля (-273.15)", () => {
      expect(() => shouldTurnOnBoiler(-274, 20, "Эко")).toThrow(
        "Температура не может быть ниже абсолютного нуля (-273.15°C)",
      );
      expect(() => shouldTurnOnBoiler(20, -300, "Комфорт")).toThrow(
        "Температура не может быть ниже абсолютного нуля (-273.15°C)",
      );
      expect(() => shouldTurnOnBoiler(-300, -400, "Эко")).toThrow(
        "Температура не может быть ниже абсолютного нуля (-273.15°C)",
      );
    });

    test("не выбрасывает ошибку при температуре равной абсолютному нулю", () => {
      expect(() => shouldTurnOnBoiler(-273.15, 20, "Эко")).not.toThrow();
      expect(() => shouldTurnOnBoiler(20, -273.15, "Комфорт")).not.toThrow();
    });

    test("выбрасывает ошибку при невалидном режиме работы", () => {
      expect(() => shouldTurnOnBoiler(20, 22, "Неизвестный")).toThrow(
        'Режим должен быть "Эко" или "Комфорт"',
      );
      expect(() => shouldTurnOnBoiler(20, 22, "")).toThrow(
        'Режим должен быть "Эко" или "Комфорт"',
      );
      expect(() => shouldTurnOnBoiler(20, 22, null)).toThrow(
        'Режим должен быть "Эко" или "Комфорт"',
      );
    });

    test("выбрасывает ошибку при нечисловых температурах", () => {
      expect(() => shouldTurnOnBoiler("20", 22, "Эко")).toThrow(
        "Температуры должны быть числами",
      );
      expect(() => shouldTurnOnBoiler(20, "22", "Комфорт")).toThrow(
        "Температуры должны быть числами",
      );
      expect(() => shouldTurnOnBoiler(null, 22, "Эко")).toThrow(
        "Температуры должны быть числами",
      );
      expect(() => shouldTurnOnBoiler(20, undefined, "Комфорт")).toThrow(
        "Температуры должны быть числами",
      );
      expect(() => shouldTurnOnBoiler(NaN, 22, "Эко")).toThrow(
        "Температуры должны быть числами",
      );
    });
  });

  describe("Дополнительные случаи", () => {
    test("работает с дробными температурами", () => {
      expect(shouldTurnOnBoiler(19.9, 20, "Комфорт")).toBe(false);
      expect(shouldTurnOnBoiler(19.49, 20, "Комфорт")).toBe(true);
      expect(shouldTurnOnBoiler(17.9, 21, "Эко")).toBe(true);
      expect(shouldTurnOnBoiler(18.1, 21, "Эко")).toBe(false);
    });

    test("работает с одинаковыми температурами", () => {
      expect(shouldTurnOnBoiler(20, 20, "Эко")).toBe(false);
      expect(shouldTurnOnBoiler(20, 20, "Комфорт")).toBe(false);
    });

    test("работает с отрицательными температурами выше абсолютного нуля", () => {
      expect(shouldTurnOnBoiler(-10, -5, "Эко")).toBe(true);
      expect(shouldTurnOnBoiler(-5, -5, "Комфорт")).toBe(false);
      expect(shouldTurnOnBoiler(-5.6, -5, "Комфорт")).toBe(true);
    });
  });
});
