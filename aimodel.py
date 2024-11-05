import time
import random
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from random_word import RandomWords

r = RandomWords()

# Return a single random word




# Initialize the WebDriver (make sure you have the correct path to your driver)
driver = webdriver.Chrome()  # Or use another driver like Firefox

# Data storage
data = []

# Function to get a random video from YouTube
def fetch_random_video():
    # Generate a random number to fetch a random page
    random_page_number = random.randint(1, 50)  # Adjust this range as needed
    url = f"https://www.youtube.com/results?search_query={r.get_random_word()}"
    
    driver.get(url)
    time.sleep(1)  # Reduced sleep time to speed up the process
    
    # Find video elements
    videos = driver.find_elements(By.XPATH, '//*[@id="video-title"]')
    
    if videos:
        # Pick a random video
        video = random.choice(videos)
        video_title = video.text
        
        print(f"Video Title: {video_title}")  # Only print the title
        
        return video_title
    else:
        print("No videos found!")
        return None

# Main loop for classification
try:
    while True:
        title = fetch_random_video()
        if title:
            # Ask for user input
            is_productive = input("Is this video productive? (yes/no): ").strip().lower()
            data.append({'title': title, 'is_productive': is_productive})

            # Save data immediately after each entry
            df = pd.DataFrame(data)
            df.to_csv('youtube_video_classification.csv', index=False)
            print("Data saved to youtube_video_classification.csv")

finally:
    driver.quit()  # Close the browser

# Final save when you stop the script
df = pd.DataFrame(data)
df.to_csv('youtube_video_classification.csv', index=False)
print("Final data saved to youtube_video_classification.csv")