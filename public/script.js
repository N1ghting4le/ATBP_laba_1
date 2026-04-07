document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("send-btn");
  const tempInput = document.getElementById("temperature");
  const outputContainer = document.getElementById("output-container");
  const resultText = document.getElementById("result-text");
  const errorContainer = document.getElementById("error-container");
  const errorText = document.getElementById("error-text");

  btn.addEventListener("click", async () => {
    outputContainer.classList.add("hidden");
    errorContainer.classList.add("hidden");

    const desiredTemp = tempInput.value.trim();
    const mode = document.querySelector('input[name="mode"]:checked').value;

    try {
      const response = await fetch(
        "/api/heating/control",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ desiredTemp, mode }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || "Неизвестная ошибка сервера");
      } else {
        showResult(`Отопление: ${data.boilerOn ? "Вкл" : "Выкл"}`);
      }
    } catch (error) {
      showError("Ошибка: Не удалось подключиться к серверу");
      console.error(error);
    }
  });

  function showError(message) {
    errorText.textContent = message;
    errorContainer.classList.remove("hidden");
  }

  function showResult(message) {
    resultText.textContent = message;
    outputContainer.classList.remove("hidden");
  }
});
