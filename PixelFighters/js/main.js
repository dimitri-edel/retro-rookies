const config = {
    type: Phaser.AUTO,
    width: 256,
    height: 240,
    parent: 'game-container',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true // Enable debug mode
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player1, player2;
let cursors, keys;
let player1Health = 100, player2Health = 100;
let player1HealthText, player2HealthText;
let gameOver = false;
let lastPlayer1AttackTime = 0, lastPlayer2AttackTime = 0;
let attackDelay = 500; // Delay in milliseconds

function preload() {
    // Load assets for the game
    this.load.image('background', 'assets/sprites/background.png');
    this.load.spritesheet('player1', 'assets/sprites/player1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player2', 'assets/sprites/player2.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('ground', 'assets/sprites/ground.png');
}

function create() {
    // Set up the game scene and physics
    this.add.image(128, 120, 'background');

    const ground = this.physics.add.staticGroup();
    ground.create(128, 230, 'ground').setScale(1).refreshBody();

    // Initialize health text for both players
    player1HealthText = createHealthText(this, 10, 10, 'Health: ' + player1Health);
    player2HealthText = createHealthText(this, 160, 10, 'Health: ' + player2Health);

    // Create player sprites with physics
    player1 = this.physics.add.sprite(50, 200, 'player1');
    player1.setBounce(0.2);
    player1.setCollideWorldBounds(true);

    player2 = this.physics.add.sprite(200, 200, 'player2');
    player2.setBounce(0.2);
    player2.setCollideWorldBounds(true);

    // Set collision with the ground
    this.physics.add.collider(player1, ground);
    this.physics.add.collider(player2, ground);

    // Set up control inputs
    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys('W,A,S,D,SPACE');
}

function update() {
    if (gameOver) return;

    // Validate players before trying to update their positions
    if (player1 && player1.active) {
        player1.setVelocityX(0);

        // Handle movement for player 1 (WASD keys)
        if (keys.A.isDown) {
            player1.setVelocityX(-100);
        } else if (keys.D.isDown) {
            player1.setVelocityX(100);
        }
        if (keys.W.isDown && player1.body.blocked.down) {
            player1.setVelocityY(-300);
        }

        // Ensure player 1 stays within the screen bounds and is visible
        ensureSpriteVisibility(player1);
    }

    if (player2 && player2.active) {
        player2.setVelocityX(0);

        // Handle movement for player 2 (Arrow keys)
        if (cursors.left.isDown) {
            player2.setVelocityX(-100);
        } else if (cursors.right.isDown) {
            player2.setVelocityX(100);
        }
        if (cursors.up.isDown && player2.body.blocked.down) {
            player2.setVelocityY(-300);
        }

        // Ensure player 2 stays within the screen bounds and is visible
        ensureSpriteVisibility(player2);
    }

    // Manage attacks for both players
    manageAttacks.call(this); 
}

function manageAttacks() {
    // Player 1 attack (SPACE key)
    if (Phaser.Input.Keyboard.JustDown(keys.SPACE) && this.time.now > lastPlayer1AttackTime + attackDelay) {
        lastPlayer1AttackTime = this.time.now;
        console.log("Player 1 attacking");
        activateHitbox.call(this, player1);
    }

    // Player 2 attack (Down arrow key)
    if (Phaser.Input.Keyboard.JustDown(cursors.down) && this.time.now > lastPlayer2AttackTime + attackDelay) {
        lastPlayer2AttackTime = this.time.now;
        console.log("Player 2 attacking");
        activateHitbox.call(this, player2);
    }
}

// Activate a new hitbox for a player when they attack
function activateHitbox(player) {
    // Validate player before creating a hitbox
    if (!player || !player.active) return;

    // Create a new hitbox for the attack
    const hitbox = this.physics.add.sprite(player.x + (player.flipX ? -20 : 20), player.y, null).setSize(40, 40).setVisible(false).setActive(true);

    console.log(`Activating hitbox for ${player === player1 ? 'Player 1' : 'Player 2'}`);

    // Set up overlap detection for the new hitbox
    if (player === player1) {
        this.physics.add.overlap(hitbox, player2, (hitbox, target) => {
            handlePlayerHit(player2, hitbox);
        }, null, this);
    } else {
        this.physics.add.overlap(hitbox, player1, (hitbox, target) => {
            handlePlayerHit(player1, hitbox);
        }, null, this);
    }

    // Deactivate and destroy the hitbox after a short delay to ensure it only registers one hit
    this.time.delayedCall(100, () => {
        console.log(`Deactivating hitbox for ${player === player1 ? 'Player 1' : 'Player 2'}`);
        deactivateHitbox(hitbox); // Only deactivate the hitbox, not the player
    }, [], this);
}

// Deactivate and destroy the hitbox to clean up after an attack
function deactivateHitbox(hitbox) {
    if (hitbox && hitbox.active) {
        hitbox.setVisible(false).setActive(false);
        hitbox.destroy(); // Remove the hitbox completely to prevent it from being reused
        console.log('Hitbox deactivated');
    }
}

// Handle when a player is hit by the other player
function handlePlayerHit(player, hitbox) {
    if (hitbox.active && player.active) {
        if (player === player1) {
            player1Health -= 10;
            console.log("Player 1 hit!");
            updateHealthText(player1HealthText, player1Health);
        } else {
            player2Health -= 10;
            console.log("Player 2 hit!");
            updateHealthText(player2HealthText, player2Health);
        }

        deactivateHitbox(hitbox); // Deactivate the hitbox on successful hit

        // Restart the player to ensure they remain visible and active
        restartCharacter(player);
    }
}

// Ensure sprite stays within bounds and is visible
function ensureSpriteVisibility(player) {
    if (player.x < 0 || player.x > config.width || player.y < 0 || player.y > config.height) {
        console.warn(`${player === player1 ? 'Player 1' : 'Player 2'} out of bounds, resetting position.`);
        player.setPosition(128, 200);
    }

    // Ensure the player remains visible and active
    player.setVisible(true);
    player.setActive(true);
    player.body.enable = true; // Ensure the physics body is enabled
}

// Restart character at its current position
function restartCharacter(player) {
    const currentPosition = { x: player.x, y: player.y };
    console.log(`Restarting ${player === player1 ? 'Player 1' : 'Player 2'} at position: x=${currentPosition.x}, y=${currentPosition.y}`);
    
    // Restart the player to ensure they remain visible and active
    player.body.enable = false; // Temporarily disable physics to reset safely
    player.setPosition(currentPosition.x, currentPosition.y);
    player.setVisible(true);
    player.setActive(true);
    player.body.enable = true; // Re-enable physics
}

// Create a health text display for each player
function createHealthText(scene, x, y, text) {
    return scene.add.text(x, y, text, { fontFamily: 'Arial', fontSize: '16px', fill: 'black' });
}

// Update the health text display when a player is hit
function updateHealthText(healthText, health) {
    healthText.setText('Health: ' + health);
    console.log(`Updated Health: Player1: ${player1Health}, Player2: ${player2Health}`);
}
