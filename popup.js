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
            // iframeのドキュメントオブジェクトを取得
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: function () {
                const iframeDocument = Array.from(
                  document.querySelectorAll("iframe")
                ).find((iframe) => iframe.src.includes("vimeo.com"))
                  .contentWindow.document;
                chrome.runtime.sendMessage({
                  action: "startExtraction",
                  iframeDocument,
                });
              },
            });
          }
        );
      });
    });
  }

  chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
      if (message.action === "getIframeDoc") {
        const { selector } = await getSettings();
        const iframeDoc = message.iframeDoc;
        const texts = extractTexts(selector, iframeDoc);
        chrome.runtime.sendMessage({ action: "updateText", texts });

        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          func: watchForUpdates,
          args: [selector, iframeDoc],
        });
      } else if (message.action === "updateText") {
        textArea.value = message.texts.join("\n");
      }
    }
  );

});
