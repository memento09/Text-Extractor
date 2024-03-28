document.addEventListener("DOMContentLoaded", function () {
  const textArea = document.getElementById("textArea");
  const selectorInput = document.getElementById("selectorInput");

  chrome.storage.sync.get("selector", function (data) {
    const defaultSelector =
      'span[class^="TranscriptCue_lazy_module_cueText__"]';
    selectorInput.value = data.selector || defaultSelector;
    startExtraction();
  });

  function startExtraction() {
    const selector = selectorInput.value;
    chrome.storage.sync.set({ selector: selector }, function () {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            files: ["content.js"],
          },
          () => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "startExtraction" });
          }
        );
      });
    });
  }

  chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === "updateText") {
      textArea.value = request.texts.join("\n");
    }
  });
});
