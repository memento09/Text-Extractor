document.addEventListener("DOMContentLoaded", function () {
  const textArea = document.getElementById("textArea");

  chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === "updateText") {
      textArea.value = request.texts.join("\n");
    }
  });
});