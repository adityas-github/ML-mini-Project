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
        emoji = '🙂';
        message = 'I think you are feeling positive and happy.';
    } else if (sentiment === 'NEGATIVE') {
        if (score >= 0.7) {
            emoji = '😠';
            message = 'I think you are not satisfied, and your current mood is angry.';
        } else {
            emoji = '😔';
            message = 'I think you are feeling a bit down and sad.';
        }
    } else {
        emoji = '😐';
        message = 'I think your mood is neutral.';
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