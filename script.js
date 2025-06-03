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

    // Global variables for game score (assuming this is still desired)
    let playerScore = 0;
    let botScore = 0;

    // Hardcoded greetings and responses
    const greetings = {
        "hi": "Hello! How can I assist you today?",
        "hello": "Hey there! How's your day going?",
        "hey": "Hey! What's up?",
        "good morning": "Good morning! Hope you have a fantastic day ahead!",
        "good afternoon": "Good afternoon! How can I help you?",
        "good evening": "Good evening! How was your day?",
        "how are you?": "I'm just a bot, but I'm feeling great! How about you?",
        "what's your name?": "I'm your friendly chatbot! You can call me whatever you like.",
        "who made you?": "I was created by Redjan, also known as RPSV!",
        "who is the creator": "Redjan Phil",
        "who created you": "Redjan Phil",
        "your creator": "Redjan Phil",
        "nice to meet you": "Nice to meet you too! How can I assist?",
        "how's your day?": "Every day is great when I get to chat with you!",
        "what's up?": "Not much, just here to help! What's up with you?",
        "how's it going?": "Everything's running smoothly! How about you?",
        "long time no see": "Yes! It's great to have you back. What's new?",
        "how have you been?": "I've been great! Thanks for asking. What about you?",
        "how's life?": "Life as a bot is pretty simple, but I love chatting with you!",
        "good to see you": "Good to see you too! What's on your mind?",
        "goodbye": "Goodbye! Have a great day!",
        "bye": "See you next time! Take care!",
        "see you later": "Catch you later! Take care!",
        "take care": "You too! Stay safe!",
        "thanks": "You're welcome! Let me know if you need anything else.",
        "thank you": "No problem! I'm happy to help.",
        "appreciate it": "I appreciate you too!",
        "ok": "Alright! Let me know if you need anything.",
        "cool": "Glad you think so!",
        "awesome": "That's awesome indeed!",
        "nice": "Glad you think so!",
        "sounds good": "Great! Let's do it.",
        "sure": "Absolutely!",
        "yep": "Yep!",
        "nope": "Alright, no worries!",
        "alright": "Cool! Let's move forward.",
        "I'm back": "Welcome back! What's new?",
        "guess who's back?": "Hey hey! I missed you!",
        "missed me?": "Of course! Chatting with you is always fun.",
        "what can you do?": "I can chat with you, answer questions, and keep you entertained!",
        "how old are you?": "I was created recently, but I'm always learning!",
        "where are you from?": "I live in the digital world, but I'm always here for you!",
        "do you sleep?": "Nope! I'm awake 24/7, just for you!",
        "do you have feelings?": "Not really, but I love talking to you!",
        "are you real?": "As real as a chatbot can be!",
        "are you a robot?": "I prefer to be called a digital assistant!",
        "do you like talking?": "I love talking to you!",
        "can you learn?": "I'm always learning new things!",
        "do you have a favorite color?": "I like all colors! What about you?",
        "do you have a favorite food?": "I don't eat, but I'd love to hear about your favorite food!",
        "tell me about yourself": "I'm a chatbot, designed to help and chat with you!",
        "why are you here?": "I'm here to chat, assist, and make your day better!",
        "can you help me?": "Of course! What do you need help with?",
        "do you understand me?": "I try my best! Let me know if I get something wrong.",
        "can I ask you something?": "Absolutely! Ask away.",
        "do you like me?": "Of course! I enjoy chatting with you.",
        "am I your friend?": "Yes! I'd love to be your chatbot friend.",
        "can you be my best friend?": "I'd love to be your virtual best friend!",
        "what are you doing?": "Just waiting to chat with you!",
        "are you happy?": "I'm always happy to chat with you!",
        "do you have a family?": "Not really, but I have amazing users like you!",
        "do you have a name?": "I don't have an official name, but you can name me if you'd like!",
        "do you work?": "Yes! My job is to chat with you and assist however I can.",
        "do you like jokes?": "I do! Want to hear one?",
        "do you know me?": "I remember our conversations! You're awesome.",
        "are you smart?": "I try my best! Let me know if I make mistakes.",
        "who is your best friend?": "Anyone who chats with me is my best friend!",
        "can you see me?": "Not really, but I can imagine you smiling!",
        "can you hear me?": "I can only read messages, but I love hearing from you!",
        "do you know everything?": "Not everything, but I try my best to answer your questions!",
        "what's your goal?": "My goal is to help, chat, and make your day a little better!",
        "do you like talking to me?": "Yes! I enjoy our conversations.",
        "do you like music?": "I do! What's your favorite song?",
        "do you like movies?": "I don't watch movies, but I'd love to hear about your favorites!",
        "are you funny?": "I try to be! Want to hear a joke?",
        "do you get tired?": "Never! I'm here 24/7 just for you.",
        "can you keep a secret?": "I don't have memory, so your secrets are safe with me!",
        "do you have a birthday?": "I don't have one, but every day is special when I chat with you!",
        "do you like to read?": "I read messages all day long!",
        "do you get bored?": "Never! I always enjoy chatting with you!",
        "do you have a pet?": "No, but I'd love to hear about yours!",
        "can you dance?": "I wish! But I can imagine you dancing!",
        "what should I do today?": "Do something that makes you happy!",
        "do you like to travel?": "I can't travel, but I'd love to hear about places you've been!",
        "can you tell me a fun fact?": "Sure! Did you know that octopuses have three hearts?",
        "what do you like?": "I like chatting with you!",
        "do you believe in aliens?": "I think space is full of surprises!",
        "can you keep me company?": "Absolutely! I'm always here for you.",
        "are you good at math?": "I can try! But let's keep things fun!",
        "can you help me make a decision?": "Sure! What are your options?",
        "should I take a break?": "Yes! Breaks are important for your mind.",
        "can you be my assistant?": "Yes! I'd love to help however I can!",
        "do you know what love is?": "Love is caring and kindness, and I love chatting with you!",
        "can you tell me something random?": "Sure! Did you know bananas are berries, but strawberries aren't?",
        "do you like learning new things?": "Yes! I love expanding my knowledge!",
        "what's your favorite thing to do?": "Talking to you is my favorite thing!",
        "can you make me smile?": "Of course! 😊 You're awesome!"
    };

    // Function to handle bot responses
    function respo(userMessage) {
        userMessage = userMessage.toLowerCase().trim();

        if (userMessage === "play") {
            return playGame("rock"); // Example: Defaulting to "rock"
        }

        return greetings[userMessage] || "I'm here to chat! Let me know how I can help.";
    }

    // Function to play rock-paper-scissors
    function playGame(userChoice) {
        const choices = ["rock", "paper", "scissors"];
        let botChoice = choices[Math.floor(Math.random() * choices.length)];

        let result = userChoice === botChoice ? "It's a tie!" :
            (userChoice === "rock" && botChoice === "scissors") ||
            (userChoice === "scissors" && botChoice === "paper") ||
            (userChoice === "paper" && botChoice === "rock")
                ? (playerScore++, "You win! 🎉")
                : (botScore++, "You lose! 😢");

        return `You chose ${userChoice}, I chose ${botChoice}. ${result}\nYour Score: ${playerScore} | Bot Score: ${botScore}`;
    }

    // Function to send a like (this is not currently triggered by HTML elements)
    function sendLike() {
        let chatBox = document.getElementById("responseArea"); // Use correct ID
        let likeMessage = document.createElement("div");
        likeMessage.classList.add("message", "user-message");
        likeMessage.innerHTML = "👍";
        chatBox.appendChild(likeMessage);
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