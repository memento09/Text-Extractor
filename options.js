document.addEventListener("DOMContentLoaded", function () {
  const selectorInput = document.getElementById("selectorInput");
  const hostInput = document.getElementById("hostInput");
  const saveButton = document.getElementById("saveButton");

  chrome.storage.sync.get("selector", function (data) {
    const defaultSelector =
      'span[class^="TranscriptCue_lazy_module_cueText__"]';
    selectorInput.value = data.selector || defaultSelector;
  });

  chrome.storage.sync.get("hostPermissions", function (data) {
    hostInput.value = data.hostPermissions || "";
  });

  saveButton.addEventListener("click", function () {
    const selector = selectorInput.value;
    const hostPermissions = hostInput.value;
    chrome.storage.sync.set(
      {
        selector: selector,
        hostPermissions: hostPermissions,
      },
      function () {
        console.log(
          `Settings saved: selector=${selector}, hostPermissions=${hostPermissions}`
        );
      }
    );
  });
});
