async function getSettings() {
  const result = await chrome.storage.sync.get(["selector"]);
  return {
    selector:
      result.selector || 'span[class^="TranscriptCue_lazy_module_cueText__"]',
  };
}

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === "FETCH_CONTENT") {
    const { selector } = await getSettings();
    const texts = extractTexts(selector);
    chrome.runtime.sendMessage({ action: "updateText", texts });
  }
});

async function start() {
  const { selector } = await getSettings();
  watchForUpdates(selector);
}

function extractTexts(selector) {
  const texts = [];
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    texts.push(el.textContent.trim());
  });

  return texts;
}

function watchForUpdates(selector) {
  const observer = new MutationObserver(function (mutations) {
    const targetTexts = extractTexts(selector);
    chrome.runtime.sendMessage({ action: "updateText", texts: targetTexts });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

start();
