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
    this.load.image('background', 'assets/sprites/background.jpg');
    this.load.spritesheet('player1', 'assets/sprites/player1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player2', 'assets/sprites/player2.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('ground', 'assets/sprites/ground.png');
    this.load.image('pack-a-punch', 'assets/sprites/pack-a-punch.png'); // 1.5x damage multiplier
    this.load.image('touch-of-death', 'assets/sprites/touch-of-death.png'); // 2.5x damage multiplier
    this.load.image('speed-boost', 'assets/sprites/speed-boost.png'); // 2x speed multiplier
    this.load.image('super-jump', 'assets/sprites/super-jump.png'); // 3x jump height
    this.load.image('extra-mana', 'assets/sprites/extra-mana.png'); // Mana item
    this.load.image('health-potion', 'assets/sprites/health-potion.png'); // Health potion
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
    player1.damageMultiplier = 1;
    player1.jumpHeight = 150;
    player1.speedMultiplier = 1; // Initialize speedMultiplier
    player1.setGravityY(-300); // Standard gravity

    player2 = this.physics.add.sprite(200, 200, 'player2');
    player2.setBounce(0.2);
    player2.setCollideWorldBounds(true);
    player2.damageMultiplier = 1;
    player2.jumpHeight = 150;
    player2.speedMultiplier = 1; // Initialize speedMultiplier
    player2.setGravityY(-300); // Standard gravity
    
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

    this.time.addEvent({
        delay: 12000,
        callback: function () {
            const items = {
                'pack-a-punch': 0xff0000,
                'touch-of-death': 0x00ff00,
                'speed-boost': 0x0000ff,
                'super-jump': 0xffff00,
                'extra-mana': 0xff00ff,
                'health-potion': 0x00ffff
            };
            const selectedItemKey = Phaser.Math.RND.pick(Object.keys(items));
            console.log("Spawning item: " + selectedItemKey);
            const item = this.physics.add.sprite(Phaser.Math.Between(0, config.width), 0, selectedItemKey);
            item.setTint(items[selectedItemKey]);
            item.setVelocityY(50);
            item.body.gravity.y = 20;
            item.setData('key', selectedItemKey);

            this.physics.add.collider(item, ground);
            this.physics.add.overlap(player1, item, collectItem, null, this);
            this.physics.add.overlap(player2, item, collectItem, null, this);
        },
        callbackScope: this,
        loop: true
    });

    // Zoom effect
    this.cameras.main.setZoom(1); // Increase zoom level to make the arena appear larger
}


function update() {
    if (gameOver) return;
    // Debug player status

    // Validate players before trying to update their positions
    handlePlayerMovement(player1, keys.A, keys.D, keys.W);
    handlePlayerMovement(player2, cursors.left, cursors.right, cursors.up);

    // Manage attacks for both players
    manageAttacks.call(this);


}

function collectItem(player, item) {
    if (!item || !item.getData('key')) {
        console.error("Item collection failed: item data is missing.");
        return; // Early exit if no item or key data found.
    }

    const itemKey = item.getData('key');
    console.log("Item collected: " + itemKey); // Confirm item collection.

    // Apply effects and start a timer to reset them
    switch (itemKey) {
        case 'pack-a-punch':
            player.damageMultiplier *= 1.5;
            console.log(`Damage Multiplier Updated to: ${player.damageMultiplier}`);
            this.time.delayedCall(15000, () => resetEffect(player, 'damageMultiplier', 1), [], this);
            break;
        case 'touch-of-death':
            player.damageMultiplier *= 2.5;
            console.log(`Damage Multiplier Updated to: ${player.damageMultiplier}`);
            this.time.delayedCall(15000, () => resetEffect(player, 'damageMultiplier', 1), [], this);
            break;
        case 'speed-boost':
            player.speedMultiplier = (player.speedMultiplier || 1) * 2; // Ensure multiplier exists.
            console.log(`Speed Multiplier Updated to: ${player.speedMultiplier}`);
            this.time.delayedCall(15000, () => resetEffect(player, 'speedMultiplier', 1), [], this);
            break;
        case 'super-jump':
            player.jumpHeight *= 3;
            console.log(`Jump Height Updated to: ${player.jumpHeight}`);
            this.time.delayedCall(15000, () => resetEffect(player, 'jumpHeight', 300), [], this);
            break;
        case 'extra-mana':
            player.mana = Math.min(player.mana + 50, 150);
            console.log(`Mana Updated to: ${player.mana}`);
            // No need to reset mana after 15 seconds
            break;
        case 'health-potion':
            player.health = Math.min(player.health + 50, player.maxHealth || 100); // Assume maxHealth if not set.
            console.log(`Health Updated to: ${player.health}`);
            // No need to reset health after 15 seconds
            break;
        default:
            console.warn(`No known effect for item: ${itemKey}`);
    }

    item.destroy(); // Always destroy the item after processing.
}


function resetEffect(player, property, defaultValue) {
    if (player && player[property] !== undefined) {
        player[property] = defaultValue;
        console.log(`${property} reset to ${defaultValue}`);
    } else {
        console.error(`Failed to reset property: ${property}`);
    }
}


// Function to handle player movement
// Function to handle player movement
function handlePlayerMovement(player, leftKey, rightKey, jumpKey) {
    if (player && player.active) {
        player.setVelocityX(0);

        if (leftKey.isDown) {
            player.setVelocityX(-100 * player.speedMultiplier); // Use speedMultiplier
        } else if (rightKey.isDown) {
            player.setVelocityX(100 * player.speedMultiplier); // Use speedMultiplier
        }
        if (jumpKey.isDown && player.body.blocked.down) {
            player.setVelocityY(-player.jumpHeight); // Use modified jumpHeight
        }

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
// Function to activate hitbox for regular and super punch attacks
function activateHitbox(attacker, target, baseDamage) {
    if (!attacker || !attacker.active) return;

    const hitbox = this.physics.add.sprite(attacker.x + (attacker.flipX ? -20 : 20), attacker.y, null).setSize(40, 40).setVisible(false).setActive(true);
    console.log(`Activating hitbox for ${attacker === player1 ? 'Player 1' : 'Player 2'}`);

    this.physics.add.overlap(hitbox, target, () => {
        const damage = baseDamage * attacker.damageMultiplier; // Apply damage multiplier
        handlePlayerHit(attacker, target, hitbox, damage);

        // Apply a small upward knockback for regular attacks
        const direction = attacker.x < target.x ? 1 : -1;
        target.setVelocityX(200 * direction); // Small horizontal pushback
        target.setVelocityY(-100); // Moderate vertical lift to knock them upwards
    }, null, this);

    this.time.delayedCall(100, () => {
        deactivateHitbox(hitbox);
    }, [], this);
}


function activateSuperPunch(attacker, target) {
    console.log(`Activating super punch for ${attacker === player1 ? 'Player 1' : 'Player 2'}`);
    activateHitbox.call(this, attacker, target, 25);

    // Apply a strong horizontal force with little to no vertical movement
    if (target.active) {
        const direction = attacker.x < target.x ? 1 : -1;
        target.setVelocityX(2000 * direction); // Very strong horizontal pushback
        target.setVelocityY(0); // Slight vertical lift to give a feeling of impact
        console.log(`${target === player1 ? 'Player 1' : 'Player 2'} is hit and sent flying across the screen!`);
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
