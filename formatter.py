# Open the input and output files
with open('unproductive_videos.csv', 'r') as infile, open('unproductive_videos_cleaned.csv', 'w') as outfile:
    for line in infile:
        # Remove all commas from the line
        line_without_commas = line.replace(',', '')
        # Add a comma at the end of each line
        outfile.write(line_without_commas.strip() + ',\n')

print("All commas removed and added a comma at the end of each line. Saved to 'productive_videos_cleaned.csv'.")