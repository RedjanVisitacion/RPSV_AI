const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const messageBox = document.querySelector('.message-box');
const ringtone = document.getElementById('ringtone');
const heartsContainer = document.querySelector('.hearts');

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
});

// Make the "No" button run away
noBtn.addEventListener('mouseover', () => {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
});

// When "Yes" is clicked
yesBtn.addEventListener('click', () => {
    // Stop the music
    ringtone.pause();
    ringtone.currentTime = 0;
    
    messageBox.innerHTML = `
        <div class="message-content">
            <div class="avatar">
                <i class="fas fa-heart"></i>
            </div>
            <h1>Yay! 💖</h1>
            <p class="message-text">You've made me so happy! I can't wait to spend time with you! 💑</p>
        </div>
    `;
    
    // Create more hearts when accepted
    setInterval(createHeart, 100);
}); 