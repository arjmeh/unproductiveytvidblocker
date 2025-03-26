document.addEventListener('DOMContentLoaded', function() {
  const statusDiv = document.querySelector('.status');
  const resultDiv = document.querySelector('.result');
  
  // Helper to convert seconds into a formatted string (hours, minutes, seconds)
  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    let formatted = "";
    if (hrs > 0) {
      formatted += `${hrs}h `;
    }
    if (mins > 0 || hrs > 0) {
      formatted += `${mins}m `;
    }
    formatted += `${secs}s`;
    return formatted;
  }
  
  // Get the current active tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentUrl = tabs[0].url || '';
    
    // Check if we are on a YouTube video page
    if (currentUrl.includes('youtube.com/watch')) {
      statusDiv.textContent = 'Currently on a YouTube video';
      statusDiv.style.backgroundColor = '#d1ecf1';
      
      // Retrieve stored productivity results and total time saved
      chrome.storage.local.get(['currentVideoStatus', 'totalTimeSaved'], function(data) {
        const videoStatus = data.currentVideoStatus || {};
        const totalTimeSaved = data.totalTimeSaved || 0;
        
        if (
          videoStatus.url === currentUrl &&
          videoStatus.timestamp &&
          (Date.now() - videoStatus.timestamp < 5 * 60 * 1000)
        ) {
          if (videoStatus.result === 'productive') {
            resultDiv.innerHTML = `
              <div style="background-color: #0066cc; color: white; padding: 12px; border-radius: 4px; margin-top: 15px; text-align: center; font-weight: bold;">
                <span style="font-size: 16px;">This video is productive</span>
                <p style="margin: 8px 0 0; font-size: 13px; opacity: 0.9; font-weight: normal;">Keep up the good work!</p>
              </div>
            `;
          } else if (videoStatus.result === 'unproductive') {
            resultDiv.innerHTML = `
              <div style="background-color: #cc0000; color: white; padding: 12px; border-radius: 4px; margin-top: 15px; text-align: center; font-weight: bold;">
                <span style="font-size: 16px;">&#10060; This video is unproductive</span>
                <p style="margin: 8px 0 0; font-size: 13px; opacity: 0.9; font-weight: normal;">You'll be redirected to a blocking page.</p>
              </div>
            `;
          } else if (videoStatus.result === 'error') {
            resultDiv.innerHTML = `
              <div style="background-color: #ffc107; color: #333; padding: 12px; border-radius: 4px; margin-top: 15px; text-align: center;">
                <span style="font-size: 16px;">! Error analyzing video</span>
                <p style="margin: 8px 0 0; font-size: 13px; font-weight: normal;">${videoStatus.title || 'Could not determine productivity'}</p>
              </div>
            `;
          }
        } else {
          resultDiv.innerHTML = `
            <div style="background-color: #f0f0f0; color: #333; padding: 12px; border-radius: 4px; margin-top: 15px; text-align: center;">
              <span style="font-size: 16px;">Analyzing video...</span>
              <p style="margin: 8px 0 0; font-size: 13px; font-weight: normal;">Please wait while we check this content.</p>
            </div>
          `;
        }
        
        // Append the total time saved at the bottom
        resultDiv.innerHTML += `
          <div style="margin-top: 10px; text-align: center; font-size: 14px;">
            <strong>Total time saved:</strong> ${formatTime(totalTimeSaved)}
          </div>
        `;
      });
      
    } else if (currentUrl.includes('youtube.com')) {
      statusDiv.textContent = 'On YouTube, but not on a video page';
      statusDiv.style.backgroundColor = '#d1ecf1';
      chrome.storage.local.get('totalTimeSaved', function(data) {
        const totalTimeSaved = data.totalTimeSaved || 0;
        resultDiv.innerHTML = `
          <div style="margin-top: 10px; text-align: center; font-size: 14px;">
            <strong>Total time saved:</strong> ${formatTime(totalTimeSaved)}
          </div>
        `;
      });
      
    } else {
      statusDiv.textContent = 'Not currently on YouTube';
      statusDiv.style.backgroundColor = '#d6d8db';
      chrome.storage.local.get('totalTimeSaved', function(data) {
        const totalTimeSaved = data.totalTimeSaved || 0;
        resultDiv.innerHTML = `
          <div style="margin-top: 10px; font-size: 14px;">
            <strong>Total time saved:</strong> ${formatTime(totalTimeSaved)}
          </div>
        `;
      });
    }
  });
});
