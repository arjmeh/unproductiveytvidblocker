import time
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
import os  # Import to check if file exists

# Initialize the WebDriver (make sure you have the correct path to your driver)
driver = webdriver.Chrome()  # Or use another driver like Firefox

# File paths for productive and unproductive video lists
productive_file = 'productive_videos.csv'
unproductive_file = 'unproductive_videos.csv'

# Maximum number of videos to fetch
MAX_VIDEOS = 6000

# Function to fetch all video titles from a YouTube channel
def fetch_video_titles(channel_url, is_productive):
    driver.get(channel_url)
    time.sleep(3)  # Wait for the page to load

    # Scroll down to load more videos
    last_height = driver.execute_script("return document.documentElement.scrollHeight")
    
    video_data = []
    video_count = 0

    while video_count < MAX_VIDEOS:
        # Scroll down to the bottom
        driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
        time.sleep(2)  # Wait for new videos to load

        # Find all video elements
        videos = driver.find_elements(By.XPATH, '//*[@id="video-title"]')

        # Stop fetching if no new videos are found or limit is reached
        if len(videos) == video_count:
            print("No more new videos found or limit reached!")
            break

        # Process each video title (up to the maximum limit)
        for video in videos[video_count:]:
            if video_count >= MAX_VIDEOS:
                break
            video_title = video.text
            video_data.append({'title': video_title})
            video_count += 1
            print(f"Video added: {video_title} ({video_count}/{MAX_VIDEOS})")  # Notify about added video

        # Calculate new scroll height and compare with last height
        new_height = driver.execute_script("return document.documentElement.scrollHeight")
        if new_height == last_height:  # If the height hasn't changed, we've reached the end
            break
        last_height = new_height

    # Append the new video data to the correct file
    if is_productive == 'yes':
        append_to_csv(productive_file, video_data)
    else:
        append_to_csv(unproductive_file, video_data)

# Function to append new video data to the CSV file
def append_to_csv(file_path, video_data):
    # Check if the file exists to determine if we need to write headers
    file_exists = os.path.isfile(file_path)
    
    # Convert the video data to a DataFrame
    df = pd.DataFrame(video_data)

    # Append data to the file, avoiding overwriting by using mode='a'
    df.to_csv(file_path, mode='a', header=not file_exists, index=False)
    print(f"Data appended to {file_path}")

# Main function
def main():
    # Ask for the channel link and productivity status
    channel_url = input("Enter the YouTube channel URL: ").strip()
    is_productive = input("Is this channel productive? (yes/no): ").strip().lower()

    if is_productive not in ['yes', 'no']:
        print("Invalid input! Please enter 'yes' or 'no'.")
        return
    
    # Fetch video titles and categorize them
    fetch_video_titles(channel_url, is_productive)

    print(f"All videos processed (up to {MAX_VIDEOS}) and appended to the appropriate file.")

# Run the main function
if __name__ == "__main__":
    try:
        main()
    finally:
        driver.quit()  # Close the browser