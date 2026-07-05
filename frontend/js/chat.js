const welcomeMessage = {
  role: 'ai',
  text: 'I can help you understand eligibility, required documents, fees, timelines, and where to apply. Ask me anything about a process.',
};

const chatHistory = [];

function renderMessages() {
  const area = document.getElementById('messageArea');
  if (!area) return;
  area.innerHTML = chatHistory
    .map((message) => `<div class="message ${message.role}">${message.text}</div>`)
    .join('');
  area.scrollTop = area.scrollHeight;
}

function pushMessage(role, text) {
  chatHistory.push({ role, text });
  renderMessages();
}

function setTypingState(isTyping) {
  const area = document.getElementById('messageArea');
  if (!area) return;
  if (isTyping) {
    const typing = document.createElement('div');
    typing.className = 'message ai typing';
    typing.innerHTML = '<span>Thinking</span>';
    area.appendChild(typing);
    area.scrollTop = area.scrollHeight;
  } else {
    area.querySelector('.typing')?.remove();
  }
}

async function sendChat(prompt) {
  if (!prompt.trim()) return;
  pushMessage('user', prompt);
  setTypingState(true);
  try {
    const response = await apiRequest('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: prompt }),
    });
    pushMessage('ai', response.reply || 'Here is a concise response based on the available guidance.');
  } catch (error) {
    pushMessage('ai', error.message || 'I could not respond right now.');
  } finally {
    setTypingState(false);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!chatHistory.length) {
    pushMessage('ai', welcomeMessage.text);
  }

  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    sendChat(input.value);
    input.value = '';
  });

  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      sendChat(chip.dataset.prompt);
    });
  });

  document.getElementById('clearChat')?.addEventListener('click', () => {
    chatHistory.length = 0;
    pushMessage('ai', welcomeMessage.text);
  });

  const prompt = localStorage.getItem('chatPrompt');
  if (prompt) {
    localStorage.removeItem('chatPrompt');
    sendChat(prompt);
  }
});
