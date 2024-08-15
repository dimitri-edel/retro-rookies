const config = {
    type: Phaser.AUTO,
    width: 256,
    height: 240,
    parent: 'game-container',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
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
let player1Mana = 100, player2Mana = 100;
let player1HealthText, player2HealthText, player1ManaText, player2ManaText;
let gameOver = false;
let lastPlayer1AttackTime = 0, lastPlayer2AttackTime = 0;
let attackDelay = 500; // Delay in milliseconds
let bgMusic; // Variable to hold the background music

function preload() {
    // Load assets for the game
    this.load.image('background', 'assets/sprites/background.jpg');
    this.load.spritesheet('player1', 'assets/sprites/player1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player2', 'assets/sprites/player2.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('ground', 'assets/sprites/ground.png');
    this.load.audio('bgMusic', 'assets/music/background.mp3'); // Load the background music
}

function create() {
    // Set up the game scene and physics
    this.add.image(128, 120, 'background');

    const ground = this.physics.add.staticGroup();
    ground.create(128, 230, 'ground').setScale(1).refreshBody();

    // Initialize health and mana text for both players
    player1HealthText = createText(this, 10, 10, 'Health: ' + player1Health);
    player2HealthText = createText(this, 160, 10, 'Health: ' + player2Health);
    player1ManaText = createText(this, 10, 30, 'Mana: ' + player1Mana);
    player2ManaText = createText(this, 160, 30, 'Mana: ' + player2Mana);

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
    keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,ONE');

    // Set up mana regeneration loop every 5 seconds
    this.time.addEvent({
        delay: 5000,
        callback: rechargeMana,
        callbackScope: this,
        loop: true
    });

    // Add and play background music
    bgMusic = this.sound.add('bgMusic'); // Add the background music to the scene
    bgMusic.setLoop(true); // Set the music to loop
    bgMusic.play(); // Play the background music
}

function update() {
    if (gameOver) return;

    // Validate players before trying to update their positions
    handlePlayerMovement(player1, keys.A, keys.D, keys.W);
    handlePlayerMovement(player2, cursors.left, cursors.right, cursors.up);

    // Manage attacks for both players
    manageAttacks.call(this);

    // Check if either player has died
    checkForDeath();
}

// Function to handle player movement
function handlePlayerMovement(player, leftKey, rightKey, jumpKey) {
    if (player && player.active) {
        player.setVelocityX(0);

        if (leftKey.isDown) {
            player.setVelocityX(-120); // Slightly increased speed
        } else if (rightKey.isDown) {
            player.setVelocityX(120);
        }

        // Make the jump height relative to how long the jump button is held down
        if (jumpKey.isDown && player.body.blocked.down) {
            player.setVelocityY(-300);
        }

        ensureSpriteVisibility(player);
    }
}

function manageAttacks() {
    // Regular attack for Player 1 (SPACE key)
    if (Phaser.Input.Keyboard.JustDown(keys.SPACE) && this.time.now > lastPlayer1AttackTime + attackDelay) {
        lastPlayer1AttackTime = this.time.now;
        if (player1Mana >= 20) {
            player1Mana -= 20;
            updateManaText(player1ManaText, player1Mana);
            activateHitbox.call(this, player1, player2, 10);
        }
    }

    // Regular attack for Player 2 (Down arrow key)
    if (Phaser.Input.Keyboard.JustDown(cursors.down) && this.time.now > lastPlayer2AttackTime + attackDelay) {
        lastPlayer2AttackTime = this.time.now;
        if (player2Mana >= 20) {
            player2Mana -= 20;
            updateManaText(player2ManaText, player2Mana);
            activateHitbox.call(this, player2, player1, 10);
        }
    }

    // Super punch attack for Player 1 (S key)
    if (Phaser.Input.Keyboard.JustDown(keys.S) && this.time.now > lastPlayer1AttackTime + attackDelay) {
        lastPlayer1AttackTime = this.time.now;
        if (player1Mana >= 50) {
            player1Mana -= 50;
            updateManaText(player1ManaText, player1Mana);
            activateSuperPunch.call(this, player1, player2);
        }
    }

    // Super punch attack for Player 2 (1 key)
    if (Phaser.Input.Keyboard.JustDown(keys.ONE) && this.time.now > lastPlayer2AttackTime + attackDelay) {
        lastPlayer2AttackTime = this.time.now;
        if (player2Mana >= 50) {
            player2Mana -= 50;
            updateManaText(player2ManaText, player2Mana);
            activateSuperPunch.call(this, player2, player1);
        }
    }
}

function activateHitbox(attacker, target, damage) {
    if (!attacker || !attacker.active) return;

    const hitbox = this.physics.add.sprite(attacker.x + (attacker.flipX ? -20 : 20), attacker.y, null).setSize(40, 40).setVisible(false).setActive(true);

    this.physics.add.overlap(hitbox, target, () => {
        handlePlayerHit(attacker, target, hitbox, damage);
    }, null, this);

    this.time.delayedCall(100, () => {
        deactivateHitbox(hitbox);
    }, [], this);
}

function activateSuperPunch(attacker, target) {
    activateHitbox.call(this, attacker, target, 25);

    // Push the target to the edge of the screen
    if (target.active) {
        const direction = attacker.x < target.x ? 1 : -1;
        target.setVelocityX(300 * direction);
        target.setVelocityY(-150);
    }
}

function handlePlayerHit(attacker, target, hitbox, damage) {
    if (hitbox.active && target.active && !target.body.immovable) {
        if (target === player1) {
            player1Health -= damage;
            updateHealthText(player1HealthText, player1Health);
        } else if (target === player2) {
            player2Health -= damage;
            updateHealthText(player2HealthText, player2Health);
        }

        deactivateHitbox(hitbox);

        if (player1Health <= 0) {
            triggerDeath(player1);
        } else if (player2Health <= 0) {
            triggerDeath(player2);
        }
    }
}

function deactivateHitbox(hitbox) {
    if (hitbox && hitbox.active) {
        hitbox.setVisible(false).setActive(false);
        hitbox.destroy();
    }
}

// Function to ensure sprite stays within bounds and is visible
function ensureSpriteVisibility(player) {
    if (player.x < 0 || player.x > config.width || player.y < 0 || player.y > config.height) {
        player.setPosition(128, 200);
    }

    player.setVisible(true);
    player.setActive(true);
    player.body.enable = true;
}

// Create a text display for health and mana
function createText(scene, x, y, text) {
    return scene.add.text(x, y, text, { fontFamily: 'Arial', fontSize: '16px', fill: 'black' });
}

// Update the health text display when a player's health changes
function updateHealthText(healthText, health) {
    healthText.setText('Health: ' + health);
}

// Update the mana text display when a player's mana changes
function updateManaText(manaText, mana) {
    manaText.setText('Mana: ' + mana);
}

// Recharge mana over time
function rechargeMana() {
    if (!gameOver) {
        if (player1Mana < 100) player1Mana += 10;
        if (player2Mana < 100) player2Mana += 10;
        updateManaText(player1ManaText, player1Mana);
        updateManaText(player2ManaText, player2Mana);
    }
}

// Trigger the death of a character
function triggerDeath(player) {
    if (player && player.active) {
        player.setVelocity(0);
        player.body.enable = false;
        player.setVisible(false);
        player.setActive(false);

        // Display a game over message
        const winningText = player === player1 ? "Player 2 Wins!" : "Player 1 Wins!";
        const gameOverText = this.add.text(config.width / 2 - 60, config.height / 2, winningText, { fontFamily: 'Arial', fontSize: '24px', fill: 'red' });
        gameOverText.setScrollFactor(0);

        gameOver = true;

        // Stop the background music
        if (bgMusic) {
            bgMusic.stop();
        }
    }
}

// Check if either player has died
function checkForDeath() {
    if (player1Health <= 0) {
        triggerDeath.call(this, player1);
    }
    if (player2Health <= 0) {
        triggerDeath.call(this, player2);
    }
}
