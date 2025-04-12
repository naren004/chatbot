const inputBox = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');
const chatBox = document.getElementById('chat-box');
const API_KEY = "AIzaSyBr1H8M5hQ5rIW4qetO6s4IYeozO2TSWzI";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// Hospital-specific prompt context to guide the AI responses
const HOSPITAL_CONTEXT = `You are MedAssist, a virtual assistant for a hospital. 
Provide helpful, accurate, and compassionate responses about healthcare topics, 
hospital services, medical information, appointment scheduling, and general patient support. 
Keep responses brief and professional. For medical emergencies, always advise patients to call emergency services.`;

// Function to handle sending messages (both click and Enter key)
function handleSendMessage() {
  const userText = inputBox.value.trim();
  if (userText !== "") {
    inputBox.value = "";
    addMessage("user", userText);

    const thinkingElement = addThinking();
    getGeminiReply(userText)
      .then(botReply => {
        removeThinking(thinkingElement);
        addMessage("bot", botReply);
      })
      .catch(error => {
        removeThinking(thinkingElement);
        addMessage("bot", "I'm sorry, I couldn't process your request at the moment. Please try again later.");
        console.error("API Error:", error);
      });
  }
}

// Event listeners
inputBox.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    handleSendMessage();
  }
});

sendButton.addEventListener("click", handleSendMessage);

function addMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addThinking() {
  const thinking = document.createElement("div");
  thinking.classList.add("message", "bot");
  thinking.innerHTML = `<span class="typing">Thinking</span>`;
  chatBox.appendChild(thinking);
  chatBox.scrollTop = chatBox.scrollHeight;
  return thinking;
}

function removeThinking(thinkingElement) {
  chatBox.removeChild(thinkingElement);
}

async function getGeminiReply(userText) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `${HOSPITAL_CONTEXT}\n\nUser: ${userText}\n\nAssistant:` 
          }] 
        }]
      }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
document.getElementById("refresh-btn").addEventListener("click", function () {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = '';
  
    // Optional: Add a new welcome message after refresh
    const welcomeMsg = document.createElement("div");
    welcomeMsg.className = "message bot";
    welcomeMsg.textContent = "Hello! I'm your virtual assistant. How can I help you today?";
    chatBox.appendChild(welcomeMsg);
  });
  