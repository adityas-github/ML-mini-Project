const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');

sendButton.addEventListener('click', () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        displayMessage('user', userMessage);
        userInput.value = '';

        getPredictedSentiment(userMessage)
            .then(sentiment => {
                displayMessage('bot', sentiment);
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

async function getPredictedSentiment(text) {
    const response = await fetch('/sentiment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    });

    if (response.ok) {
        const sentiment = await response.json();
        return `The predicted sentiment is ${sentiment.label} with a score of ${sentiment.score}.`;
    } else {
        throw new Error('Failed to predict sentiment');
    }
}