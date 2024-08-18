// Create a new Audio object for the sound effect
const clickSound = new Audio('assets/music/click.mp3');


// Function to play sound
function playSound(sound) {
    sound.currentTime = 0; // Reset the sound to the beginning
    sound.play();
}

// Get references to the buttons
const startButton = document.getElementById('startButton');
const howToPlayButton = document.getElementById('howToPlayButton');
const aboutButton = document.getElementById('aboutButton');

// Function to handle button clicks
function handleButtonClick(url) {
    return function() {
        playSound(clickSound);
        window.location.href = url;
    };
}

// Add event listeners to the buttons
startButton.addEventListener('click', handleButtonClick('index.html'));
howToPlayButton.addEventListener('click', handleButtonClick('how-to-play.html'));
aboutButton.addEventListener('click', handleButtonClick('about.html'));
