const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');

sendButton.addEventListener('click', () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        displayMessage('user', userMessage);
        userInput.value = '';
        getPredictedSentiment(userMessage)
            .then(response => {
                const sentiment = response.sentiment;
                const score = response.score;
                const { emoji, message } = getMessageWithEmoji(sentiment, score);
                displayMessage('bot', `${emoji} ${message}`);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});

function displayMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getMessageWithEmoji(sentiment, score) {
  let emoji, message;
  if (sentiment === 'POSITIVE') {
      if (score >= 0.95) {
          emoji = '😁';
          message = 'You seem absolutely ecstatic!';
      } else if (score >= 0.9) {
          emoji = '😄';
          message = 'I think you are extremely happy!';
      } else if (score >= 0.85) {
          emoji = '😊';
          message = 'You seem very cheerful!';
      } else if (score >= 0.8) {
          emoji = '😃';
          message = 'I sense a lot of happiness in you!';
      } else if (score >= 0.75) {
          emoji = '🙂';
          message = 'You appear quite positive!';
      } else {
          emoji = '😀';
          message = 'You seem happy!';
      }
  } else if (sentiment === 'NEGATIVE') {
      if (score >= 0.7) {
          emoji = '😠';
          message = 'I think you are not satisfied, and your current mood is angry.';
      } else if (score >= 0.5) {
          emoji = '😕';
          message = 'I sense some negativity in your mood.';
      } else {
          emoji = '😞';
          message = 'You seem to be feeling down and sad.';
      }
  } else {
      if (score >= 0.6) {
          emoji = '😐';
          message = 'I think your mood is neutral.';
      } else if (score >= 0.3) {
          emoji = '😶';
          message = 'I sense some neutrality in your mood.';
      } else {
          emoji = '😕';
          message = 'I think you are feeling somewhat indifferent.';
      }
  }
  return { emoji, message };
}

async function getPredictedSentiment(text) {
    const response = await fetch('/sentiment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to predict sentiment');
    }
}
