chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blockerEnabled: true });
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes('youtube.com/watch')) {
      chrome.scripting.executeScript({
        target: {tabId: tabId},
        files: ['content.js']
      });
    }
  });