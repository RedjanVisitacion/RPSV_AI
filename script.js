document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    const promptInput = document.getElementById('user-input');
    const chatBox = document.getElementById('responseArea');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Store the original placeholder text
    const originalPlaceholder = promptInput.placeholder;

    // -------------------------------------------------------------------------
    // !!! IMPORTANT: REPLACE WITH YOUR ACTUAL GOOGLE AI STUDIO API KEY !!!
    // !!! THIS IS NOT SECURE FOR PRODUCTION. DO NOT DEPLOY THIS PUBLICLY. !!!
    // -------------------------------------------------------------------------
    const API_KEY = 'AIzaSyA0UeZW-tlZv3FyjS3JZ_NuA-YgyXiR6ZI'; // Replaced with the key you provided
    const MODEL_NAME = 'gemini-1.5-flash-latest'; // Changed from 'gemini-pro'
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    // Initially hide the separate loading indicator element
    loadingIndicator.style.display = 'none';

    if (API_KEY === 'YOUR_GOOGLE_AI_STUDIO_API_KEY') {
        appendMessage('ERROR: Please replace \'YOUR_GOOGLE_AI_STUDIO_API_KEY\' in script.js with your actual API key.', 'bot-message');
        submitBtn.disabled = true;
        promptInput.disabled = true; // Disable input if API key is not set
    }

    // Function to append messages to the chat box
    function appendMessage(text, senderClass) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', senderClass);
        messageElement.innerHTML = `<p>${text}</p>`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to send message and get AI response
    async function sendMessage() {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            return;
        }

        if (API_KEY === 'YOUR_GOOGLE_AI_STUDIO_API_KEY') {
             appendMessage("ERROR: API Key not configured in script.js.", 'bot-message');
            return;
        }

        // Append user message
        appendMessage(prompt, 'user-message');
        promptInput.value = ''; // Clear input field

        // Show thinking state in input
        promptInput.placeholder = 'Thinking...';
        promptInput.disabled = true;
        submitBtn.disabled = true;

        try {
            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                // Optional: Add generationConfig if needed
                // generationConfig: {
                //   temperature: 0.7,
                //   maxOutputTokens: 256,
                // }
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Response:', errorData);
                throw new Error(`API Error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0) {
                if (data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                    appendMessage(data.candidates[0].content.parts[0].text, 'bot-message');
                } else {
                    appendMessage("Received a response, but couldn't find the text part.", 'bot-message');
                }
            } else if (data.promptFeedback) {
                 appendMessage(`Blocked due to: ${data.promptFeedback.blockReason}. Check safety ratings.`, 'bot-message');
                 console.warn("Prompt Feedback:", data.promptFeedback);
            }
            else {
                appendMessage('No content received from API.', 'bot-message');
                console.warn("Unexpected API response structure:", data);
            }

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            appendMessage(`Error: ${error.message}`, 'bot-message');
        } finally {
            // Revert thinking state
            promptInput.placeholder = originalPlaceholder;
            promptInput.disabled = false;
            submitBtn.disabled = false;
        }
    }

    // Event listener for button click
    submitBtn.addEventListener('click', sendMessage);

    // Event listener for Enter key press in input field
    promptInput.addEventListener('keydown', (event) => {
        // Check if the key pressed was Enter (key code 13)
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission
            sendMessage(); // Call the send message function
        }
    });
});