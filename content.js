async function getSettings() {
  const result = await chrome.storage.sync.get(["selector"]);
  return {
    selector:
      result.selector || 'span[class^="TranscriptCue_lazy_module_cueText__"]',
  };
}

// iframeのドキュメントオブジェクトを取得してメッセージを送信
const iframeDoc = Array.from(document.querySelectorAll('iframe'))
                       .find(iframe => iframe.src.includes('vimeo.com'))
                       .contentWindow.document;
chrome.runtime.sendMessage({ action: 'getIframeDoc', iframeDoc });

function watchForUpdates(selector, iframeDocument) {
  const observer = new MutationObserver(function (mutations) {
    const targetTexts = extractTexts(selector, iframeDocument);
    chrome.runtime.sendMessage({ action: "updateText", texts: targetTexts });
  });

  observer.observe(iframeDocument.body, {
    childList: true,
    subtree: true,
  });
}

function extractTexts(selector, iframeDocument) {
  const texts = [];
  const elements = iframeDocument.querySelectorAll(selector);

  elements.forEach((el) => {
    texts.push(el.textContent.trim());
  });

  return texts;
}