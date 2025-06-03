const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const container = document.querySelector('.container');
const heartsContainer = document.querySelector('.hearts');

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
    container.innerHTML = `
        <h1>Yay! 💖</h1>
        <div class="message">
            You've made me the happiest person! Let's make some beautiful memories together! 💑
        </div>
    `;
    // Create more hearts
    setInterval(createHeart, 100);
}); 