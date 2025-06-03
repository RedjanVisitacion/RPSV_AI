const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const callScreen = document.querySelector('.call-screen');
const callStatus = document.querySelector('.call-status');
const ringtone = document.getElementById('ringtone');

// Start ringing when page loads
window.addEventListener('load', () => {
    // Try to play the ringtone
    ringtone.play().catch(error => {
        console.log("Auto-play prevented. User interaction required.");
    });
});

// Make the "Decline" button run away
noBtn.addEventListener('mouseover', () => {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
});

// When "Accept" is clicked
yesBtn.addEventListener('click', () => {
    // Stop the ringtone
    ringtone.pause();
    ringtone.currentTime = 0;
    
    callStatus.textContent = 'Connected';
    callStatus.style.animation = 'none';
    
    setTimeout(() => {
        callScreen.innerHTML = `
            <div class="caller-info">
                <div class="caller-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <h1>Call Connected</h1>
                <p class="caller-name">Your Secret Admirer</p>
                <p class="call-status">I've been wanting to tell you something...</p>
            </div>
            <div class="call-actions">
                <button id="endCall" class="decline-call">
                    <i class="fas fa-phone-slash"></i>
                    <span>End Call</span>
                </button>
            </div>
        `;
        
        // Add end call functionality
        document.getElementById('endCall').addEventListener('click', () => {
            callScreen.innerHTML = `
                <div class="caller-info">
                    <div class="caller-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <h1>Call Ended</h1>
                    <p class="caller-name">Your Secret Admirer</p>
                    <p class="call-status">Thanks for accepting my call! 💖</p>
                </div>
            `;
        });
    }, 1000);
}); 