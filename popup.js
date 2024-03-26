document.addEventListener("DOMContentLoaded", function () {
  const textArea = document.getElementById("textArea");
  const selectorInput = document.getElementById("selectorInput");
  const saveButton = document.getElementById("saveButton");

  chrome.storage.sync.get("selector", function (data) {
    const defaultSelector =
      'span[class^="TranscriptCue_lazy_module_cueText__"]';
    selectorInput.value = data.selector || defaultSelector;
  });

  saveButton.addEventListener("click", function () {
    const selector = selectorInput.value;
    chrome.storage.sync.set({ selector: selector }, function () {
      console.log(`Selector saved: ${selector}`);
    });
  });

  chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === "updateText") {
      textArea.value = request.texts.join("\n");
    }
  });
});
