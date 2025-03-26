// Function to store the productivity result for the current video
function storeProductivityResult(result, title, length) {
  chrome.storage.local.set({
    'currentVideoStatus': {
      url: window.location.href,
      result: result,
      title: title,
      length: length, // video length in seconds
      timestamp: Date.now()
    }
  });
}

// Function to update the overall total time saved (in seconds)
function updateTotalTimeSaved(additionalSeconds) {
chrome.storage.local.get('totalTimeSaved', function(data) {
  let currentTotal = data.totalTimeSaved || 0;
  const newTotal = currentTotal + additionalSeconds;
  chrome.storage.local.set({ totalTimeSaved: newTotal });
});
}

// Function to check if a video is productive
async function checkVideoProductivity() {
  try {
    const currentUrl = window.location.href;
    
    const response = await fetch('https://unproductiveytvideobackend.onrender.com/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: currentUrl }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Error:', data.error);
      storeProductivityResult('error', data.error, 0);
      return;
    }
    
    console.log('API Response:', data);
    
    // Store the result (including the video length) for the popup
    storeProductivityResult(data.result, data.title, data.length);
    
    // If the video is classified as unproductive, update the total time saved
    if (data.result === 'unproductive') {
      if (data.length) {
        updateTotalTimeSaved(data.length);
      }
      // Replace the entire page with our blocked content
      const blockedHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f9f9f9; font-family: Arial, sans-serif;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; text-align: center;">
            <h1 style="color: #cc0000;">Unproductive Video Blocked</h1>
            <p style="font-size: 18px; margin: 20px 0;">The video "<strong>${data.title}</strong>" has been classified as unproductive.</p>
            <p style="margin-bottom: 30px;">Your time is valuable. Consider watching something more productive instead.</p>
            <a href="https://www.youtube.com/" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Return to YouTube Home</a>
          </div>
        </div>
      `;
      
      document.body.innerHTML = blockedHTML;
      document.title = "Video Blocked - Unproductive Content";
    }
  } catch (error) {
    console.error('Error checking video productivity:', error);
    storeProductivityResult('error', 'Connection error', 0);
  }
}

// Main function to run when page loads
function main() {
  if (window.location.href.includes('youtube.com/watch')) {
    checkVideoProductivity();
    
    let lastUrl = location.href;
    new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        if (window.location.href.includes('youtube.com/watch')) {
          setTimeout(() => {
            checkVideoProductivity();
          }, 1000);
        }
      }
    }).observe(document, { subtree: true, childList: true });
  }
}

main();



