document.addEventListener("DOMContentLoaded", function () {
  const textArea = document.getElementById("textArea");
  const selectorInput = document.getElementById("selectorInput");
  const saveButton = document.getElementById("saveButton");

  chrome.storage.sync.get("selector", function (data) {
    const defaultSelector =
      'span[class^="TranscriptCue_lazy_module_cueText__"]';
    selectorInput.value = defaultSelector;
  });

  chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === "updateText") {
      textArea.value = request.texts.join("\n");
    }
  });
});
