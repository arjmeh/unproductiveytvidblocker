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
  
  // Get the video title from the YouTube page
let videoTitle = document.querySelector('h1.title').innerText;

// Send the title to the Flask server
fetch('http://127.0.0.1:5000/classify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ title: videoTitle })
})
  .then(response => response.json())
  .then(data => {
    if (data.result === 'unproductive') {
      alert('This video is unproductive! Consider doing something more productive.');
    }
  })
  .catch(error => console.error('Error:', error));