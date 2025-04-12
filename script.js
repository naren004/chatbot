const inputBox = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const API_KEY = "AIzaSyBr1H8M5hQ5rIW4qetO6s4IYeozO2TSWzI";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

inputBox.addEventListener("keydown", async function (e) {
  if (e.key === "Enter" && inputBox.value.trim() !== "") {
    const userText = inputBox.value.trim();
    inputBox.value = "";
    addMessage("user", userText);

    const thinkingElement = addThinking();
    const botReply = await getGeminiReply(userText);
    removeThinking(thinkingElement);
    addMessage("bot", botReply);
  }
});

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
  thinking.innerHTML = `<span class="typing">Thinking...</span>`;
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
        contents: [{ parts: [{ text: userText }] }]
      }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
  } catch (error) {
    console.error("API Error:", error);
    return "Error fetching response.";
  }
}
