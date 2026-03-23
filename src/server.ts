import express from "express";
import { shouldTurnOnBoiler } from "./shouldTurnOnBoiler";
import { WorkMode } from "./types";
import { sensorService } from "./sensorService";
import { INVALID_MODE, TEMP_IS_NOT_NUMBER } from "./constants";

const app = express();
app.use(express.json());

const PORT = 3000;

/**
 * GET /api/sensors/room-temp
 * Получить текущую температуру
 */
app.get("/api/sensors/room-temp", async (req, res) => {
  try {
    const temp = await sensorService.getInteriorTemperature();

    res.status(200).json({
      temperature: temp,
      unit: "C",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/**
 * POST /api/heating/control
 * Управление котлом
 */
app.post("/api/heating/control", async (req, res) => {
  try {
    const { desiredTemp, mode } = req.body;

    if (mode !== WorkMode.Eco && mode !== WorkMode.Comfort) {
      throw new Error(INVALID_MODE);
    }

    if (typeof desiredTemp !== "number") {
      throw new Error(TEMP_IS_NOT_NUMBER);
    }

    const shouldTurnOn = await shouldTurnOnBoiler(
      desiredTemp,
      mode,
      sensorService,
    );

    res.status(200).json({
      boilerOn: shouldTurnOn,
      desiredTemp,
      mode,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
});

/**
 * GET /api/status
 * Проверка доступности сервера
 */
app.get("/api/status", (req, res) => {
  res.status(200).json({
    status: "online",
    timestamp: new Date(),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
