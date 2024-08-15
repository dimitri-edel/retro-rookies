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
let player1Mana = 100, player2Mana = 100;
let player1HealthText, player2HealthText, player1ManaText, player2ManaText;
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
}

function update() {
    if (gameOver) return;

    // Validate players before trying to update their positions
    handlePlayerMovement(player1, keys.A, keys.D, keys.W);
    handlePlayerMovement(player2, cursors.left, cursors.right, cursors.up);

    // Manage attacks for both players
    manageAttacks.call(this);
}

// Function to handle player movement
function handlePlayerMovement(player, leftKey, rightKey, jumpKey) {
    if (player && player.active) {
        player.setVelocityX(0);

        if (leftKey.isDown) {
            player.setVelocityX(-100);
        } else if (rightKey.isDown) {
            player.setVelocityX(100);
        }
        if (jumpKey.isDown && player.body.blocked.down) {
            player.setVelocityY(-300);
        }

        // Ensure player stays within the screen bounds and is visible
        ensureSpriteVisibility(player);
    }
}

function manageAttacks() {
    // Regular attack for Player 1 (SPACE key)
    if (Phaser.Input.Keyboard.JustDown(keys.SPACE) && this.time.now > lastPlayer1AttackTime + attackDelay) {
        lastPlayer1AttackTime = this.time.now;
        console.log("Player 1 pressed 'SPACE' for regular attack!");
        if (player1Mana >= 20) {
            player1Mana -= 20;
            updateManaText(player1ManaText, player1Mana);
            console.log("Player 1 activating regular attack!");
            activateHitbox.call(this, player1, player2, 10);
        } else {
            console.log("Player 1 doesn't have enough mana for regular attack!");
        }
    }

    // Regular attack for Player 2 (Down arrow key)
    if (Phaser.Input.Keyboard.JustDown(cursors.down) && this.time.now > lastPlayer2AttackTime + attackDelay) {
        lastPlayer2AttackTime = this.time.now;
        console.log("Player 2 pressed 'DOWN' for regular attack!");
        if (player2Mana >= 20) {
            player2Mana -= 20;
            updateManaText(player2ManaText, player2Mana);
            console.log("Player 2 activating regular attack!");
            activateHitbox.call(this, player2, player1, 10);
        } else {
            console.log("Player 2 doesn't have enough mana for regular attack!");
        }
    }

    // Super punch attack for Player 1 (S key)
    if (Phaser.Input.Keyboard.JustDown(keys.S) && this.time.now > lastPlayer1AttackTime + attackDelay) {
        lastPlayer1AttackTime = this.time.now;
        console.log("Player 1 pressed 'S' for super punch!");
        if (player1Mana >= 50) {
            player1Mana -= 50;
            updateManaText(player1ManaText, player1Mana);
            console.log("Player 1 activating super punch!");
            activateSuperPunch.call(this, player1, player2);
        } else {
            console.log("Player 1 doesn't have enough mana for super punch!");
        }
    }

    // Super punch attack for Player 2 (1 key)
    if (Phaser.Input.Keyboard.JustDown(keys.ONE) && this.time.now > lastPlayer2AttackTime + attackDelay) {
        lastPlayer2AttackTime = this.time.now;
        console.log("Player 2 pressed '1' for super punch!");
        if (player2Mana >= 50) {
            player2Mana -= 50;
            updateManaText(player2ManaText, player2Mana);
            console.log("Player 2 activating super punch!");
            activateSuperPunch.call(this, player2, player1);
        } else {
            console.log("Player 2 doesn't have enough mana for super punch!");
        }
    }
}

// Function to activate hitbox for regular and super punch attacks
function activateHitbox(attacker, target, damage) {
    if (!attacker || !attacker.active) return;

    const hitbox = this.physics.add.sprite(attacker.x + (attacker.flipX ? -20 : 20), attacker.y, null).setSize(40, 40).setVisible(false).setActive(true);
    console.log(`Activating hitbox for ${attacker === player1 ? 'Player 1' : 'Player 2'}`);

    this.physics.add.overlap(hitbox, target, () => {
        handlePlayerHit(attacker, target, hitbox, damage);
    }, null, this);

    this.time.delayedCall(100, () => {
        deactivateHitbox(hitbox);
    }, [], this);
}

function activateSuperPunch(attacker, target) {
    console.log(`Activating super punch for ${attacker === player1 ? 'Player 1' : 'Player 2'}`);
    activateHitbox.call(this, attacker, target, 25);

    // Push the target to the edge of the screen
    if (target.active) {
        const direction = attacker.x < target.x ? 1 : -1;
        target.setVelocityX(300 * direction);
        target.setVelocityY(-150);
        console.log(`${target === player1 ? 'Player 1' : 'Player 2'} is hit and flying towards the edge of the screen!`);
    }
}

function handlePlayerHit(attacker, target, hitbox, damage) {
    if (hitbox.active && target.active && !target.body.immovable) {
        if (target === player1) {
            player1Health -= damage;
            console.log(`Player 1 hit! Health reduced by ${damage}. Current Health: ${player1Health}`);
            updateHealthText(player1HealthText, player1Health);
        } else if (target === player2) {
            player2Health -= damage;
            console.log(`Player 2 hit! Health reduced by ${damage}. Current Health: ${player2Health}`);
            updateHealthText(player2HealthText, player2Health);
        }

        // Deactivate the hitbox after a successful hit
        deactivateHitbox(hitbox);

        // Restart the target character to ensure they remain visible and active
        restartCharacter(target);

        // Check if the target's health has reached 0 and end the game if so
        if (player1Health <= 0) {
            endGame('Player 2');
        } else if (player2Health <= 0) {
            endGame('Player 1');
        }
    }
}

function deactivateHitbox(hitbox) {
    if (hitbox && hitbox.active) {
        hitbox.setVisible(false).setActive(false);
        hitbox.destroy(); // Remove the hitbox completely to prevent it from being reused
        console.log('Hitbox deactivated');
    }
}

// Function to ensure sprite stays within bounds and is visible
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

    console.log(`${player === player1 ? 'Player 1' : 'Player 2'} has been reset and is active again.`);
}

// Create a text display for health and mana
function createText(scene, x, y, text) {
    return scene.add.text(x, y, text, { fontFamily: 'Arial', fontSize: '16px', fill: 'black' });
}

// Update the health text display when a player's health changes
function updateHealthText(healthText, health) {
    healthText.setText('Health: ' + health);
    console.log(`Health updated: ${healthText.text}`);
}

// Update the mana text display when a player's mana changes
function updateManaText(manaText, mana) {
    manaText.setText('Mana: ' + mana);
    console.log(`Mana updated: ${manaText.text}`);
}

// Recharge mana for both players every 5 seconds
function rechargeMana() {
    if (player1Mana < 100) {
        player1Mana = Math.min(player1Mana + 20, 100);
        updateManaText(player1ManaText, player1Mana);
        console.log(`Player 1 Mana recharged. Current Mana: ${player1Mana}`);
    }
    if (player2Mana < 100) {
        player2Mana = Math.min(player2Mana + 20, 100);
        updateManaText(player2ManaText, player2Mana);
        console.log(`Player 2 Mana recharged. Current Mana: ${player2Mana}`);
    }
}

// End the game and declare a winner
function endGame(winner) {
    console.log(`${winner} wins!`);
    gameOver = true;
    player1.setActive(false).setVisible(false);
    player2.setActive(false).setVisible(false);

    // Display a victory message
    createText(this.scene, 80, 120, `${winner} Wins!`);
}
