function extractTexts(selector) {
  const texts = [];
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    texts.push(el.textContent.trim());
  });

  return texts;
}

// Load saved selector from storage
chrome.storage.sync.get("selector", function (data) {
  const defaultSelector = 'span[class^="TranscriptCue_lazy_module_cueText__"]';
  const selector = data.selector || defaultSelector;

  // Observe mutations on the page
  const observer = new MutationObserver(function (mutations) {
    const targetTexts = extractTexts(selector);
    chrome.runtime.sendMessage({ action: "updateText", texts: targetTexts });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
