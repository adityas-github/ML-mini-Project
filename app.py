from flask import Flask, render_template, request, jsonify
from transformers import pipeline

app = Flask(__name__)

sent_pipeline = pipeline("sentiment-analysis")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sentiment', methods=['POST'])
def predict_sentiment():
    text = request.get_json()['text']
    sentiment = sent_pipeline(text)[0]
    return jsonify(sentiment)

if __name__ == '__main__':
    app.run(debug=True)