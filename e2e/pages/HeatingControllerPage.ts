import { Locator, Page } from "@playwright/test";

export class HeatingControllerPage {
  readonly page: Page;
  readonly temperatureInput: Locator;
  readonly sendButton: Locator;
  readonly outputContainer: Locator;
  readonly resultText: Locator;
  readonly errorContainer: Locator;
  readonly errorText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.temperatureInput = page.locator("#temperature");
    this.sendButton = page.locator("#send-btn");
    this.outputContainer = page.locator("#output-container");
    this.resultText = page.locator("#result-text");
    this.errorContainer = page.locator("#error-container");
    this.errorText = page.locator("#error-text");
  }

  async goto() {
    await this.page.goto("");
  }

  async fillTemperature(temp: string) {
    await this.temperatureInput.fill(temp);
  }

  async selectMode(mode: 'Комфорт' | 'Эко') {
    await this.page.check(`input[name="mode"][value="${mode}"]`);
  }

  async submit() {
    await this.sendButton.click();
  }
}
