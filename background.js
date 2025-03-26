// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the tab is fully loaded and is a YouTube video page
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com/watch')) {
      // Execute the content script
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      });
    }
  });