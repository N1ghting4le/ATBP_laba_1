import { Given, When, Then } from "@cucumber/cucumber";
import request from "supertest";
import app from "../src/server";
import type { Response } from "supertest";

let response: Response;
let temperature: number;

Given("сервис доступен по адресу {string}", async function (path: string) {
  const res = await request(app).get(path);

  if (res.status !== 200) {
    throw new Error("Сервис недоступен");
  }
});

When("я получаю температуру из {string}", async function (path: string) {
  const res = await request(app).get(path);

  temperature = res.body.temperature;
});

When(
  "я отправляю команду котлу {string} с желаемой температурой {int}",
  async function (mode: string, desired: number) {
    response = await request(app).post("/api/heating/control").send({
      desiredTemp: desired,
      mode: mode,
    });
  },
);

Then("API возвращает статус-код {int}", function (status: number) {
  if (response.status !== status) {
    throw new Error(`Ожидался статус ${status}, получен ${response.status}`);
  }
});
