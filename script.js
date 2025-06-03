document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    const promptInput = document.getElementById('promptInput');
    const chatBox = document.getElementById('responseArea'); // Renamed for clarity
    const loadingIndicator = document.getElementById('loadingIndicator');

    // -------------------------------------------------------------------------
    // !!! IMPORTANT: REPLACE WITH YOUR ACTUAL GOOGLE AI STUDIO API KEY !!!
    // !!! THIS IS NOT SECURE FOR PRODUCTION. DO NOT DEPLOY THIS PUBLICLY. !!!
    // -------------------------------------------------------------------------
    const API_KEY = 'AIzaSyA0UeZW-tlZv3FyjS3JZ_NuA-YgyXiR6ZI'; // Replaced with the key you provided
    const MODEL_NAME = 'gemini-1.5-flash-latest'; // Changed from 'gemini-pro'
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    if (API_KEY === 'YOUR_GOOGLE_AI_STUDIO_API_KEY') {
        appendMessage('ERROR: Please replace \'YOUR_GOOGLE_AI_STUDIO_API_KEY\' in script.js with your actual API key.', 'received');
        submitBtn.disabled = true;
    }

    // Function to append messages to the chat box
    function appendMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.innerHTML = `<p>${text}</p>`; // Use innerHTML to allow for basic formatting if needed
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
    }

    submitBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            // appendMessage('Please enter a prompt.', 'received'); // Optional: give feedback for empty input
            return;
        }

        if (API_KEY === 'YOUR_GOOGLE_AI_STUDIO_API_KEY') {
             appendMessage("ERROR: API Key not configured in script.js.", 'received');
            return;
        }

        // Append user message
        appendMessage(prompt, 'sent');
        promptInput.value = ''; // Clear input field

        loadingIndicator.style.display = 'block';
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
                // For simple text models like gemini-pro or gemini-1.5-flash-latest
                if (data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                    appendMessage(data.candidates[0].content.parts[0].text, 'received');
                } else {
                    appendMessage("Received a response, but couldn't find the text part.", 'received');
                }
            } else if (data.promptFeedback) {
                 appendMessage(`Blocked due to: ${data.promptFeedback.blockReason}. Check safety ratings.`, 'received');
                 console.warn("Prompt Feedback:", data.promptFeedback);
            }
            else {
                appendMessage('No content received from API.', 'received');
                console.warn("Unexpected API response structure:", data);
            }

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            appendMessage(`Error: ${error.message}`, 'received');
        } finally {
            loadingIndicator.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
});