async function getSettings() {
  const result = await chrome.storage.sync.get(["selector", "hostPermissions"]);
  return {
    selector:
      result.selector || 'span[class^="TranscriptCue_lazy_module_cueText__"]',
    hostPermissions: result.hostPermissions || ["<all_urls>"],
  };
}

async function requestPermissions(hostPermissions) {
  if (chrome.permissions && chrome.permissions.request) {
    try {
      await chrome.permissions.request({ origins: hostPermissions });
    } catch (e) {
      console.error("Error requesting permissions:", e);
    }
  } else {
    console.warn("chrome.permissions.request API is not available");
  }
}

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === "FETCH_CONTENT") {
    const { selector, hostPermissions } = await getSettings();
    chrome.permissions.request({ origins: hostPermissions });
    const texts = extractTexts(selector);
    chrome.runtime.sendMessage({ action: "updateText", texts });
  }
});

async function start() {
  const { selector, hostPermissions } = await getSettings();
  await requestPermissions(hostPermissions);
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