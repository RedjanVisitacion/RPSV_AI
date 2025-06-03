const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const messageBox = document.querySelector('.message-box');
const ringtone = document.getElementById('ringtone');
const heartsContainer = document.querySelector('.hearts');
const answerTextarea = document.getElementById('answer');

// Function to save response to localStorage
function saveResponseToLocalStorage(type, answer = '') {
    const timestamp = new Date().toLocaleString();
    const responseData = {
        timestamp: timestamp,
        type: type,
        answer: answer
    };
    
    // Get existing responses or initialize an empty array
    const existingResponses = JSON.parse(localStorage.getItem('loveConfessionResponses')) || [];
    
    // Add the new response
    existingResponses.push(responseData);
    
    // Save the updated array back to localStorage
    localStorage.setItem('loveConfessionResponses', JSON.stringify(existingResponses));
    
    console.log(`Response saved to localStorage: ${type}`);
}

// Function to play audio
function playAudio() {
    ringtone.loop = true;
    let playPromise = ringtone.play();
    
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Audio is playing
            console.log('Audio started playing');
        })
        .catch(error => {
            // Auto-play was prevented
            console.log('Auto-play prevented:', error);
            // Show a play button or handle the error
            document.body.addEventListener('click', function initAudio() {
                ringtone.play();
                document.body.removeEventListener('click', initAudio);
            }, { once: true });
        });
    }
}

// Create floating hearts
function createHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';
    heartsContainer.appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// Create hearts periodically
setInterval(createHeart, 300);

// Start playing romantic music when page loads
window.addEventListener('load', () => {
    playAudio();
    // Save page load event to localStorage
    saveResponseToLocalStorage('Page Loaded');
});

// Make the "No" button run away
noBtn.addEventListener('mouseover', () => {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
});

// When "No" is clicked
noBtn.addEventListener('click', () => {
    // Save the rejection to localStorage
    saveResponseToLocalStorage('Rejected');
    
    messageBox.innerHTML = `
        <div class="message-content">
            <div class="avatar">
                <i class="fas fa-heart-broken"></i>
            </div>
            <h1>Oh no! 💔</h1>
            <p class="message-text">That's okay, I understand. Maybe another time? 🥺</p>
        </div>
    `;
});

// When "Yes" is clicked
yesBtn.addEventListener('click', () => {
    // Stop the music
    ringtone.pause();
    ringtone.currentTime = 0;
    
    const answer = answerTextarea.value.trim();
    const answerMessage = answer ? 
        `<p class="answer-text">"${answer}" - That's so sweet! 💝</p>` : 
        '';
    
    // Save the acceptance and answer to localStorage
    saveResponseToLocalStorage('Accepted', answer);
    
    messageBox.innerHTML = `
        <div class="message-content">
            <div class="avatar">
                <i class="fas fa-heart"></i>
            </div>
            <h1>Yay! 💖</h1>
            <p class="message-text">You've made me so happy! I can't wait to spend time with you! 💑</p>
            ${answerMessage}
        </div>
    `;
    
    // Create more hearts when accepted
    setInterval(createHeart, 100);
}); 