import { test, expect } from "@playwright/test";
import { HeatingControllerPage } from "./pages/HeatingControllerPage";

test.describe("E2E Тесты: Контроллер умного отопления (Вариант 6)", () => {
  let heatingPage: HeatingControllerPage;

  test.beforeEach(async ({ page }) => {
    heatingPage = new HeatingControllerPage(page);
    await heatingPage.goto();
  });

  test('Температура 15°, режим Комфорт → команда "Выкл"', async () => {
    await heatingPage.fillTemperature("15");
    await heatingPage.selectMode("Комфорт");
    await heatingPage.submit();

    await expect(heatingPage.outputContainer).not.toHaveClass(/hidden/);
    await expect(heatingPage.resultText).toHaveText("Отопление: Выкл");
  });

  test('Температура 25°, режим Эко → команда "Вкл"', async () => {
    await heatingPage.fillTemperature("25");
    await heatingPage.selectMode("Эко");
    await heatingPage.submit();

    await expect(heatingPage.resultText).toBeVisible();
    await expect(heatingPage.resultText).toHaveText("Отопление: Вкл");
  });

  test("Ввести -300° → ошибка ниже абсолютного нуля", async () => {
    await heatingPage.fillTemperature("-300");
    await heatingPage.submit();

    await expect(heatingPage.errorContainer).not.toHaveClass(/hidden/);
    await expect(heatingPage.errorText).toContainText(
      "Температура не может быть ниже абсолютного нуля (-273.15°C)"
    );
  });

  test("Ввод нечислового значения (буквы) → ошибка", async () => {
    await heatingPage.fillTemperature("abc");
    await heatingPage.submit();

    await expect(heatingPage.errorText).toBeVisible();
    await expect(heatingPage.errorText).toHaveText("Температуры должны быть числами");
  });

  test("Пустой ввод → ошибка", async () => {
    await heatingPage.fillTemperature("");
    await heatingPage.submit();

    await expect(heatingPage.errorText).toBeVisible();
    await expect(heatingPage.errorText).toHaveText("Температуры должны быть числами");
  });
});
