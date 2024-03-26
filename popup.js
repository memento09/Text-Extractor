document.addEventListener("DOMContentLoaded", function () {
  const textArea = document.getElementById("textArea");
  const selectorInput = document.getElementById("selectorInput");
  const saveButton = document.getElementById("saveButton");

  // Load saved selector from storage
  chrome.storage.sync.get("selector", function (data) {
    const defaultSelector =
      'span[class^="TranscriptCue_lazy_module_cueText__"]';
    selectorInput.value = data.selector || defaultSelector;
  });

  // Save selector to storage
  saveButton.addEventListener("click", function () {
    const selector = selectorInput.value;
    chrome.storage.sync.set({ selector: selector }, function () {
      console.log(`Selector saved: ${selector}`);
    });
  });

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === "updateText") {
      textArea.value = request.texts.join("\n");
    }
  });
});
