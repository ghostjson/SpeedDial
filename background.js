chrome.action.onClicked.addListener(function (tab) {
  chrome.tabs.create({
    url: chrome.runtime.getURL("pages/index.html"),
  });
});

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("pages/index.html"),
  });
});
