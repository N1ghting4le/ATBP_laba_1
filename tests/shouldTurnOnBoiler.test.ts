import { shouldTurnOnBoiler } from "../src/shouldTurnOnBoiler";
import { WorkMode, SensorService } from "../src/types";
import {
  TEMP_LOWER_THAN_ABSOLUTE_ZERO,
  TEMP_IS_NOT_NUMBER,
  SENSOR_ERROR,
} from "../src/constants";

describe("shouldTurnOnBoiler (Async with Mocks)", () => {
  let sensorServiceMock: SensorService;

  beforeEach(() => {
    sensorServiceMock = {
      getInteriorTemperature: jest.fn(),
    };
  });

  describe("Эко режим", () => {
    test("включает котел при температуре ниже целевой более чем на 3 градуса", async () => {
      (sensorServiceMock.getInteriorTemperature as jest.Mock).mockResolvedValue(17);

      await expect(shouldTurnOnBoiler(21, WorkMode.Eco, sensorServiceMock)).resolves.toBe(true);
      
      expect(sensorServiceMock.getInteriorTemperature).toHaveBeenCalledTimes(1);
    });

    test("не включает котел при разнице менее 3 градусов", async () => {
      (sensorServiceMock.getInteriorTemperature as jest.Mock).mockResolvedValue(19);
      await expect(shouldTurnOnBoiler(21, WorkMode.Eco, sensorServiceMock)).resolves.toBe(false);
    });
  });

  describe("Комфорт режим", () => {
    test("включает котел при температуре ниже целевой более чем на 0.5 градуса", async () => {
      (sensorServiceMock.getInteriorTemperature as jest.Mock).mockResolvedValue(19.4);
      await expect(shouldTurnOnBoiler(20, WorkMode.Comfort, sensorServiceMock)).resolves.toBe(true);
    });

    test("не включает котел при температуре выше целевой", async () => {
      (sensorServiceMock.getInteriorTemperature as jest.Mock).mockResolvedValue(21);
      await expect(shouldTurnOnBoiler(20, WorkMode.Comfort, sensorServiceMock)).resolves.toBe(false);
    });
  });

  describe("Безопасность и ошибки датчика", () => {
    test("Должен выбросить ошибку безопасности, если датчик вернул null (дребезг)", async () => {
      (sensorServiceMock.getInteriorTemperature as jest.Mock).mockResolvedValue(null);

      await expect(shouldTurnOnBoiler(20, WorkMode.Comfort, sensorServiceMock))
        .rejects.toThrow(SENSOR_ERROR);
    });

    test("Должен выбросить ошибку безопасности, если датчик вернул undefined", async () => {
      (sensorServiceMock.getInteriorTemperature as jest.Mock).mockResolvedValue(undefined);

      await expect(shouldTurnOnBoiler(20, WorkMode.Comfort, sensorServiceMock))
        .rejects.toThrow(SENSOR_ERROR);
    });
  });

  describe("Валидация температур", () => {
    test("выбрасывает ошибку при температуре датчика ниже абсолютного нуля", async () => {
      (sensorServiceMock.getInteriorTemperature as jest.Mock).mockResolvedValue(-300);

      await expect(shouldTurnOnBoiler(20, WorkMode.Comfort, sensorServiceMock))
        .rejects.toThrow(TEMP_LOWER_THAN_ABSOLUTE_ZERO);
    });

    test("выбрасывает ошибку, если датчик вернул NaN", async () => {
      (sensorServiceMock.getInteriorTemperature as jest.Mock).mockResolvedValue(NaN);

      await expect(shouldTurnOnBoiler(20, WorkMode.Comfort, sensorServiceMock))
        .rejects.toThrow(TEMP_IS_NOT_NUMBER);
    });
    
    test("пробрасывает ошибку, если сервис датчиков упал с ошибкой соединения", async () => {
       const connectionError = new Error("Connection failed");
       (sensorServiceMock.getInteriorTemperature as jest.Mock).mockRejectedValue(connectionError);

       await expect(shouldTurnOnBoiler(20, WorkMode.Comfort, sensorServiceMock))
        .rejects.toThrow("Connection failed");
    });
  });
});
