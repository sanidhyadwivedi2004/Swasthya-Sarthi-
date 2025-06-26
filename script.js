const chatArea = document.getElementById('chat-area');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');
const chatContainer = document.getElementById('chat-container');
// languageToggle is removed since the button is gone
const chatbotName = document.getElementById('chatbot-name');
const initialBotMessageDiv = document.getElementById('initial-bot-message');
const typingText = document.getElementById('typing-text');
const appTitle = document.getElementById('app-title');
const downloadButton = document.getElementById('download-chat');
const clearChatButton = document.getElementById('clear-chat');
const contextMenu = document.getElementById('context-menu');
const copyMessageBtn = document.getElementById('copy-message-btn');

// Set the fixed language to English
let currentLanguage = 'english';
let currentMessageToCopy = '';

// LANGUAGE CONTENT - Only English content is needed now
const languageContent = {
  english: {
    title: 'Swasthya Sarthi - Your Health Companion',
    chatbotName: 'Swasthya Sarthi',
    initialBotMessage: 'Hello! I\'m Swasthya Sarthi, your health companion. How can I assist you today?',
    typingText: 'Swasthya Sarthi is typing...',
    inputPlaceholder: 'Type your health question here...',
    connectionError: 'Sorry, I\'m having trouble connecting to the server. Please try again later.',
    noResponse: 'I\'m not sure how to answer that yet. Please try another question.'
  }
};

// Scroll chat to bottom
function scrollToBottom() {
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Add message to chat
function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('flex', 'message-bubble');
  const messageBubble = document.createElement('div');
  messageBubble.classList.add('p-3', 'rounded-xl', 'max-w-[80%]', 'shadow-md', 'animated-message');

  messageBubble.innerHTML = `<p>${text}</p>`;

  if (sender === 'user') {
    messageDiv.classList.add('justify-end');
    messageBubble.classList.add('rounded-br-none', 'bg-blue-600', 'text-white');
  } else {
    messageDiv.classList.add('justify-start');
    messageBubble.classList.add('rounded-bl-none', 'bg-blue-100', 'text-gray-800');
  }

  messageDiv.appendChild(messageBubble);
  chatArea.appendChild(messageDiv);
  scrollToBottom();
}

// Get bot response from backend
async function getBotResponse(message) {
  typingIndicator.classList.remove('hidden');
  sendButton.disabled = true;
  userInput.disabled = true;
  scrollToBottom();

  try {
    const response = await fetch('http://127.0.0.1:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language: currentLanguage }) // Still sending 'english' as the language
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    addMessage(data.response || languageContent[currentLanguage].noResponse, 'bot');
  } catch (error) {
    console.error('Error:', error);
    addMessage(languageContent[currentLanguage].connectionError, 'bot');
  } finally {
    typingIndicator.classList.add('hidden');
    sendButton.disabled = false;
    userInput.disabled = false;
    userInput.focus();
  }
}

// Update language UI - simplified as it's always English now
function updateLanguageUI() {
  const content = languageContent.english; // Always use English content
  appTitle.textContent = content.title;
  chatbotName.textContent = content.chatbotName;
  initialBotMessageDiv.querySelector('p').textContent = content.initialBotMessage;
  typingText.textContent = content.typingText;
  userInput.placeholder = content.inputPlaceholder;
}

// Send message from input
function handleSendMessage() {
  const message = userInput.value.trim();
  if (message) {
    addMessage(message, 'user');
    userInput.value = '';
    getBotResponse(message);
  }
}

// Clear chat history
function clearChat() {
    while (chatArea.children.length > 1) {
        chatArea.removeChild(chatArea.lastChild);
    }
    scrollToBottom();
}

// Quick reply click handler
document.querySelectorAll('.quick-reply').forEach(button => {
  button.addEventListener('click', () => {
    const text = button.textContent;
    addMessage(text, 'user');
    getBotResponse(text);
  });
});

// Download chat as styled HTML
function downloadChatAsHTML() {
  const messages = chatArea.querySelectorAll('.message-bubble');
  let htmlContent = `
    <html>
      <head>
        <title>${languageContent.english.chatbotName} Chat Export</title>
        <style>
          body { font-family: 'Inter', sans-serif; margin: 2rem; background-color: #f8f8f8; color: #333;}
          h1 { text-align: center; color: #2563eb; margin-bottom: 0.5rem; }
          h2 { text-align: center; color: #444; margin-top: 0; margin-bottom: 1.5rem; font-weight: normal; }
          .message-container { margin: 1em 0; display: flex; }
          .user-message .message-bubble { background-color: #2563eb; color: white; border-radius: 12px 12px 0 12px; margin-left: auto; }
          .bot-message .message-bubble { background-color: #e0f2f7; color: #333; border-radius: 12px 12px 12px 0; margin-right: auto; }
          .message-bubble { padding: 0.75rem 1rem; max-width: 70%; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .user-message { justify-content: flex-end; }
          .bot-message { justify-content: flex-start; }
          strong { font-weight: 600; }
        </style>
      </head>
      <body>
        <h1>${languageContent.english.chatbotName}</h1>
        <h2>XYZ Hospital, XYZ Area, India</h2>
        <hr style="border: 0; height: 1px; background-color: #eee; margin: 2rem 0;" />
  `;

  messages.forEach(msgDiv => {
    const messageBubble = msgDiv.querySelector('p');
    if (!messageBubble) return;

    const text = messageBubble.textContent;
    const isUser = msgDiv.classList.contains('justify-end');
    const senderName = isUser ? 'You' : languageContent.english.chatbotName;
    const messageClass = isUser ? 'user-message' : 'bot-message';

    htmlContent += `
      <div class="message-container ${messageClass}">
        <div class="message-bubble">
          <strong>${senderName}:</strong> ${text}
        </div>
      </div>
    `;
  });

  htmlContent += `</body></html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `SwasthyaSarthi_Chat_${new Date().toISOString().slice(0,10)}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log("Text copied to clipboard!");
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Context menu display handler
chatArea.addEventListener('contextmenu', (event) => {
    event.preventDefault();

    let targetBubble = event.target.closest('.message-bubble');
    if (targetBubble && !targetBubble.classList.contains('animated-message')) {
        const messageTextElement = targetBubble.querySelector('p');
        if (messageTextElement) {
            currentMessageToCopy = messageTextElement.textContent;
            
            contextMenu.style.left = `${event.clientX}px`;
            contextMenu.style.top = `${event.clientY}px`;
            contextMenu.classList.add('show');
        }
    }
});

// Hide context menu when clicking elsewhere
document.addEventListener('click', (event) => {
    if (!contextMenu.contains(event.target) && event.button !== 2) {
        contextMenu.classList.remove('show');
    }
});

// Handle copy button click in context menu
copyMessageBtn.addEventListener('click', () => {
    if (currentMessageToCopy) {
        copyToClipboard(currentMessageToCopy);
    }
    contextMenu.classList.remove('show');
});


// Event Listeners
sendButton.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') handleSendMessage();
});
// languageToggle.addEventListener('click', toggleLanguage); // This line is now removed
downloadButton.addEventListener('click', downloadChatAsHTML);
clearChatButton.addEventListener('click', clearChat);

// Initial setup
window.onload = () => {
  scrollToBottom();
  updateLanguageUI(); // Will now always set English content
};