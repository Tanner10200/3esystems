// ============================================================
// 3E Systems AI — Live Chatbot Frontend Logic
// ============================================================
// This file connects the chat widget on demo.html to the real
// backend server. It reuses the exact same CSS classes (.msg,
// .msg.user, .msg.ai, .typing-ind) that already exist in styles.css,
// so every message looks and animates exactly like the original
// design -- nothing about the visual system changes.
// ============================================================

(function () {
  // ----------------------------------------------------------
  // CONFIG
  // ----------------------------------------------------------
  // This points at the live, permanently-deployed backend on Render.
  // Since Render URLs don't expire or change (unlike Codespaces test
  // URLs), this should not need to be updated again going forward.
  const API_URL = "https://threee-backend-0oxg.onrender.com/api/chat";

  // Limits how many messages a single visitor can send in one session,
  // as a friendly frontend-level safeguard (the backend also enforces
  // its own limit -- this just gives a nicer, instant message before
  // that point is ever reached).
  const MAX_USER_MESSAGES = 12;

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
  // Conversation history lives only in this browser tab's memory.
  // It disappears on page refresh -- that's intentional for now;
  // no data is stored anywhere yet.
  let conversationHistory = [];
  let userMessageCount = 0;
  let isWaitingForReply = false;

  // ----------------------------------------------------------
  // DOM ELEMENTS
  // ----------------------------------------------------------
  const chatBody = document.getElementById("chatBody");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSendBtn");
  const typingIndicator = document.getElementById("typingIndicator");

  // If this page doesn't have the chat widget, do nothing.
  // (Keeps this script safe to include on any page.)
  if (!chatBody || !chatInput || !sendBtn) return;

  // ----------------------------------------------------------
  // Adds a message bubble to the chat, reusing existing CSS classes
  // ----------------------------------------------------------
  function appendMessage(role, text) {
    const bubble = document.createElement("div");
    // role is either "user" or "ai" -- matches the classes already
    // defined and animated in styles.css (.msg.user / .msg.ai)
    bubble.className = `msg ${role}`;
    bubble.textContent = text;
    chatBody.appendChild(bubble);

    // Keep the newest message in view
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // ----------------------------------------------------------
  // Shows/hides the typing indicator.
  // The original CSS animation (typingShow) is designed to loop
  // automatically for the old animated demo. Since we want to show
  // it only while genuinely waiting on a real reply, we cancel that
  // auto-loop with inline styles and just keep the bouncing dots
  // (typingDot animation on the spans) which are unaffected.
  // ----------------------------------------------------------
  function showTyping() {
    if (!typingIndicator) return;
    typingIndicator.style.display = "flex";
    typingIndicator.style.animation = "none";
    typingIndicator.style.opacity = "1";
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function hideTyping() {
    if (!typingIndicator) return;
    typingIndicator.style.display = "none";
  }

  // ----------------------------------------------------------
  // Sends the visitor's message to the backend and displays the reply
  // ----------------------------------------------------------
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || isWaitingForReply) return;

    if (userMessageCount >= MAX_USER_MESSAGES) {
      appendMessage(
        "ai",
        "We've covered a lot here! For anything else, let's continue on a live demo call — book one using the button below."
      );
      return;
    }

    // Show the visitor's own message immediately
    appendMessage("user", text);
    conversationHistory.push({ role: "user", content: text });
    userMessageCount += 1;

    chatInput.value = "";
    chatInput.disabled = true;
    isWaitingForReply = true;
    showTyping();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: conversationHistory.slice(0, -1), // history BEFORE this message
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Request failed");
      }

      const data = await response.json();
      appendMessage("ai", data.reply);
      conversationHistory.push({ role: "assistant", content: data.reply });
    } catch (err) {
      // Friendly, on-brand fallback message -- never show raw error text
      // or technical details to the visitor.
      appendMessage(
        "ai",
        "Sorry, I'm having trouble connecting right now. Please try again in a moment, or book a demo call directly using the button below."
      );
      console.error("Chat request failed:", err);
    } finally {
      hideTyping();
      chatInput.disabled = false;
      isWaitingForReply = false;
      chatInput.focus();
    }
  }

  // ----------------------------------------------------------
  // Event listeners
  // ----------------------------------------------------------
  sendBtn.addEventListener("click", sendMessage);

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
})();
