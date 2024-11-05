// Function to classify video as "learning" or "entertainment"
async function classifyVideo() {
    const videoTitle = document.querySelector('h1.title').innerText;
    const videoDescription = document.querySelector('#description').innerText;
  
    const response = await fetch('https://api.example.com/classify', {
      method: 'POST',
      body: JSON.stringify({ title: videoTitle, description: videoDescription }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    return data.category; // "learning" or "entertainment"
  }
  
  // Block the video if it's for entertainment
  chrome.storage.sync.get(['blockerEnabled'], function (result) {
    if (result.blockerEnabled) {
      classifyVideo().then(category => {
        if (category === 'entertainment') {
          document.body.innerHTML = `<div style="color: red; font-size: 24px; text-align: center;">
            This video has been blocked as entertainment content.
          </div>`;
        }
      });
    }
  });