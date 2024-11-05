import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.metrics import classification_report

# Load productive video titles
with open('productive_videos_cleaned.csv', 'r') as f:
    productive_titles = f.readlines()

# Load unproductive video titles
with open('unproductive_videos_cleaned.csv', 'r') as f:
    unproductive_titles = f.readlines()

# Create a DataFrame
data = pd.DataFrame({
    'title': productive_titles + unproductive_titles,
    'label': ['productive'] * len(productive_titles) + ['unproductive'] * len(unproductive_titles)
})

# Split the data into training and testing sets
X = data['title']
y = data['label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create a pipeline that combines a CountVectorizer and a Naive Bayes classifier
model = make_pipeline(CountVectorizer(), MultinomialNB())

# Train the model
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# Function to classify a new video title
def classify_title(title):
    prediction = model.predict([title])
    return prediction[0]

# Main loop for user input
def main():
    while True:
        new_title = input("Enter a video title to classify (or type 'exit' to quit): ")
        if new_title.lower() == 'exit':
            break
        result = classify_title(new_title)
        print(f"The title '{new_title}' is classified as: {result}")

if __name__ == "__main__":
    main()