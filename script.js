document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    const promptInput = document.getElementById('promptInput');
    const responseArea = document.getElementById('responseArea');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // -------------------------------------------------------------------------
    // !!! IMPORTANT: REPLACE WITH YOUR ACTUAL GOOGLE AI STUDIO API KEY !!!
    // !!! THIS IS NOT SECURE FOR PRODUCTION. DO NOT DEPLOY THIS PUBLICLY. !!!
    // -------------------------------------------------------------------------
    const API_KEY = 'AIzaSyA0UeZW-tlZv3FyjS3JZ_NuA-YgyXiR6ZI'; // Replaced with the key you provided
    const MODEL_NAME = 'gemini-1.5-flash-latest'; // Changed from 'gemini-pro'
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    if (API_KEY === 'YOUR_GOOGLE_AI_STUDIO_API_KEY') {
        responseArea.textContent = "ERROR: Please replace 'YOUR_GOOGLE_AI_STUDIO_API_KEY' in script.js with your actual API key.";
        submitBtn.disabled = true;
    }

    submitBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            responseArea.textContent = 'Please enter a prompt.';
            return;
        }

        if (API_KEY === 'YOUR_GOOGLE_AI_STUDIO_API_KEY') {
            responseArea.textContent = "ERROR: API Key not configured in script.js.";
            return;
        }

        responseArea.textContent = ''; // Clear previous response
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
                // For simple text models like gemini-pro
                if (data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                    responseArea.textContent = data.candidates[0].content.parts[0].text;
                } else {
                    responseArea.textContent = "Received a response, but couldn't find the text part.";
                }
            } else if (data.promptFeedback) {
                 responseArea.textContent = `Blocked due to: ${data.promptFeedback.blockReason}. Check safety ratings.`;
                 console.warn("Prompt Feedback:", data.promptFeedback);
            }
            else {
                responseArea.textContent = 'No content received from API.';
                console.warn("Unexpected API response structure:", data);
            }

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            responseArea.textContent = `Error: ${error.message}`;
        } finally {
            loadingIndicator.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
});