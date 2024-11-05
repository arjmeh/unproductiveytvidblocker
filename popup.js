// Set up default state
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(['blockerEnabled'], function (result) {
      const statusText = result.blockerEnabled ? "Blocker is ON" : "Blocker is OFF";
      document.getElementById('status').innerText = statusText;
    });
  
    document.getElementById('toggle').addEventListener('click', function () {
      chrome.storage.sync.get(['blockerEnabled'], function (result) {
        const currentState = result.blockerEnabled || false;
        chrome.storage.sync.set({ blockerEnabled: !currentState }, function () {
          const statusText = !currentState ? "Blocker is ON" : "Blocker is OFF";
          document.getElementById('status').innerText = statusText;
        });
      });
    });
  });