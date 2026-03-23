const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');

const app = require('../dist/server').default;

let response;
let temperature;

Given('сервис доступен по адресу {string}', async function (path) {
  const res = await request(app).get(path);

  if (res.status !== 200) {
    throw new Error("Сервис недоступен");
  }
});

When('я получаю температуру из {string}', async function (path) {
  const res = await request(app).get(path);

  temperature = res.body.temperature;
});

When('я отправляю команду котлу {string} с желаемой температурой {int}', async function (mode, desired) {
  response = await request(app)
    .post("/api/heating/control")
    .send({
      desiredTemp: desired,
      mode: mode
    });
});

Then('API возвращает статус-код {int}', function (status) {
  if (response.status !== status) {
    throw new Error(
      `Ожидался статус ${status}, получен ${response.status}`
    );
  }
});
