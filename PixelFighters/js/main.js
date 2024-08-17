const config = {
    type: Phaser.AUTO,
    width: 512,  // Double the width
    height: 480, // Double the height
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

let gameOver = false;
let lastPlayer1AttackTime = 0, lastPlayer2AttackTime = 0;
let attackDelay = 500; // Delay in milliseconds

// Declare health and mana bars globally
let player1HealthBar, player2HealthBar;
let player1ManaBar, player2ManaBar;

function preload() {
   
    // Load background image and player sprites
    this.load.image('background', 'assets/sprites/background.png');
    this.load.image('background2', 'assets/sprites/background2.png'); // Load background for second map

    this.load.spritesheet('player1', 'assets/sprites/player1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player2', 'assets/sprites/player2.png', { frameWidth: 32, frameHeight: 32 });

    // Load power-up items
    this.load.image('pack-a-punch', 'assets/sprites/pack-a-punch.png');
    this.load.image('touch-of-death', 'assets/sprites/touch-of-death.png');
    this.load.image('speed-boost', 'assets/sprites/speed-boost.png');
    this.load.image('super-jump', 'assets/sprites/super-jump.png');
    this.load.image('extra-mana', 'assets/sprites/extra-mana.png');
    this.load.image('health-potion', 'assets/sprites/health-potion.png');
    this.load.audio('regular-attack', 'assets/sounds/regular-attack.mp3');
    this.load.audio('super-attack', 'assets/sounds/super-attack.mp3');
    this.load.audio('jump', 'assets/sounds/jump.mp3');

    // Load tiles
    for (let i = 1; i <= 75; i++) {
        const tileId = `tile_${String(i).padStart(4, '0')}`;
        this.load.image(tileId, `assets/${tileId}.png`);
    }

    // Load new assets for lava, falling traps, and set traps
    this.load.image('lava', 'assets/fire.png'); // Lava
    this.load.image('spikes', 'assets/spikes.png'); // Falling traps
    this.load.image('trap', 'assets/trap.png'); // Set traps


}



function create() {
    // Add and scale the background
    const background = this.add.image(256, 240, 'background');
    background.setScale(4);
///// Sounnd effects 

    const regularAttackSound = this.sound.add('regular-attack', { rate: 2 }); // Double the playback rate
    const superAttackSound = this.sound.add('super-attack', { rate: 2 }); // Double the playback rate
    const jumpSound = this.sound.add('jump', { rate: 2 }); // Double the playback rate
    this.gameSounds = {
        regularAttack: regularAttackSound,
        superAttack: superAttackSound,
        jump: jumpSound // Initialize the jump sound
    };
    
// Player 1 Health and Mana Bars
    // Initialize player health and mana bars
    player1HealthBar = this.add.graphics({ x: 10, y: 10 });
    player1ManaBar = this.add.graphics({ x: 10, y: 30 });

    player2HealthBar = this.add.graphics({ x: 400, y: 10 });
    player2ManaBar = this.add.graphics({ x: 400, y: 30 });

    // Draw initial bars
    drawHealthBar(player1HealthBar, player1Health);
    drawManaBar(player1ManaBar, player1Mana);

    drawHealthBar(player2HealthBar, player2Health);
    drawManaBar(player2ManaBar, player2Mana);
/////////////////////////////////////// EDITING THE MAP /////////////////////////////////////////////////
const platforms = this.physics.add.staticGroup();

// Function to get a random tile
function getRandomTile() {
    const randomIndex = Phaser.Math.Between(1, 75); // Random number between 1 and 75
    return `tile_${String(randomIndex).padStart(4, '0')}`;
}

// Base Level - Main Battleground
platforms.create(256, 464, getRandomTile()).setScale(12, 1).refreshBody(); // Central base platform

// Intermediate Platforms (Left and Right Sides)
platforms.create(130, 380, getRandomTile()).setScale(4, 1).refreshBody(); // Left middle platform
platforms.create(380, 380, getRandomTile()).setScale(4, 1).refreshBody(); // Right middle platform

// Smaller Platforms above Intermediate Level
platforms.create(250, 300, getRandomTile()).setScale(10, 1).refreshBody(); // Right upper middle platform

// Upper Platforms - High-Level for Aerial Combat
platforms.create(64, 260, getRandomTile()).setScale(2, 1).refreshBody();  // Upper left platform
platforms.create(448, 260, getRandomTile()).setScale(2, 1).refreshBody(); // Upper right platform
platforms.create(334, 150, getRandomTile()).setScale(2, 1).refreshBody(); // Central high platform
platforms.create(160, 150, getRandomTile()).setScale(2, 1).refreshBody(); // Central high platform

// Super Jump Platforms at the Bottom Left and Right
const leftSuperJump = platforms.create(64, 464, getRandomTile()).setScale(3, 1).refreshBody(); // Left super jump platform
const rightSuperJump = platforms.create(448, 464, getRandomTile()).setScale(4, 1).refreshBody(); // Right super jump platform

// Lava Pit at the Bottom
const lava = this.physics.add.staticGroup();
lava.create(256, 478, 'lava').setScale(32, 0.5).refreshBody(); // Cover the bottom with lava

// Traps Around Platforms
const traps = this.physics.add.group();

traps.create(380, 250, 'trap').setScale(0.25).refreshBody(); // Trap on upper right platform

// Additional Traps on Various Platforms
traps.create(130, 300, 'trap').setScale(0.25).refreshBody(); // Trap on left lower platform


/////////////////////////////////////// END OF  MAP /////////////////////////////////////////////////
    // Initialize player health and mana text displays


    // Create player sprites with physicswd
    player1 = this.physics.add.sprite(50, 400, 'player1');
    player2 = this.physics.add.sprite(450, 400, 'player2');

    player1.setBounce(0.2);
    player1.setCollideWorldBounds(true);
    player1.damageMultiplier = 1;
    player1.jumpHeight = 250;
    player1.speedMultiplier = 1;
    player1.setGravityY(-300);

    player2.setBounce(0.2);
    player2.setCollideWorldBounds(true);
    player2.damageMultiplier = 1;
    player2.jumpHeight = 250;
    player2.speedMultiplier = 1;
    player2.setGravityY(-300);

    // Add collision between players and platforms, traps, and lava
// Add collision between players and platforms, traps, and lava
    this.physics.add.collider(player1, platforms);
    this.physics.add.collider(player2, platforms);
    this.physics.add.collider(traps, platforms); // Make sure traps collide with platforms
    this.physics.add.collider(traps, lava, () => traps.setActive(false)); // Deactivate traps that fall into lava

    // Ensure players are not getting the error by properly initializing the overlap after players are created
    this.physics.add.overlap(player1, lava, hitLava, null, this);
    this.physics.add.overlap(player2, lava, hitLava, null, this);

    this.physics.add.overlap(player1, traps, hitTrap, null, this);
    this.physics.add.overlap(player2, traps, hitTrap, null, this);



    // Set up input controls
cursors = this.input.keyboard.createCursorKeys();
keys = this.input.keyboard.addKeys({
    'W': Phaser.Input.Keyboard.KeyCodes.W,
    'A': Phaser.Input.Keyboard.KeyCodes.A,
    'S': Phaser.Input.Keyboard.KeyCodes.S,
    'D': Phaser.Input.Keyboard.KeyCodes.D,
    'SPACE': Phaser.Input.Keyboard.KeyCodes.SPACE,
    'NUMPAD_ONE': Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE  // Use this key code for Player 2's super punch
});

    // Mana regeneration event
    this.time.addEvent({
        delay: 5000,
        callback: rechargeMana,
        callbackScope: this,
        loop: true
    });

   
// Power-up spawning event
this.time.addEvent({
    delay: 6000,
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
        const item = this.physics.add.sprite(Phaser.Math.Between(0, config.width), 0, selectedItemKey);
        item.setTint(items[selectedItemKey]);
        item.setVelocityY(50);
        item.body.gravity.y = 20;
        item.setData('key', selectedItemKey);
        item.setScale(0.25);

        // Ensure that items collide with platforms and disappear if not collected in 10 seconds
        this.physics.add.collider(item, platforms);
        this.physics.add.overlap(player1, item, collectItem, null, this);
        this.physics.add.overlap(player2, item, collectItem, null, this);

        // Set a timeout to destroy the item if not collected
        this.time.delayedCall(10000, () => {
            if (item && item.active) {
                item.destroy(); // Destroy the item if still present after 10 seconds
            }
        });
    },
    callbackScope: this,
    loop: true
});

    // Adjust camera settings
    this.cameras.main.setBounds(0, 0, 512, 480);
    this.cameras.main.setZoom(1);
    this.cameras.main.startFollow(player1);
}

function hitLava(player, lava) {
    if (!gameOver) {
        console.log(`${player === player1 ? 'Player 1' : 'Player 2'} fell into the lava. Instant Game Over.`);
        endGame.call(this, player === player1 ? 'Player 2' : 'Player 1');
    }
}

function hitTrap(player, trap) {
    if (!player.trapContact) {
        player.trapContact = true;

        // Disable player movement for 1.5 seconds
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.body.moves = false;

        this.time.delayedCall(700, () => {
            player.body.moves = true;
            player.trapContact = false;
            console.log(`${player === player1 ? 'Player 1' : 'Player 2'} can move again after being immobilized by the trap.`);
        }, [], this);

        console.log(`${player === player1 ? 'Player 1' : 'Player 2'} hit a trap and is immobilized.`);

        // Make the trap disappear and respawn after 2 seconds
        trap.setActive(false).setVisible(false);

        this.time.delayedCall(2000, () => {
            respawnTrap(trap, this);
        }, [], this);
    }
}

function respawnTrap(trap, scene) {
    // Randomly select new position for the trap
    const newX = Phaser.Math.Between(50, config.width - 50);
    const newY = Phaser.Math.Between(50, config.height - 150);

    trap.setPosition(newX, newY);
    trap.setActive(true).setVisible(true);
    console.log('Trap has respawned at a new location.');
}


// Function to draw the health bar
function drawHealthBar(graphics, health) {
    graphics.clear();
    graphics.fillStyle(0xff0000, 1); // Red color for health
    graphics.fillRect(0, 0, health, 10); // Draw health bar based on health value
    graphics.lineStyle(2, 0x000000, 1); // Black outline for better visibility
    graphics.strokeRect(0, 0, 100, 10); // Fixed size outline for the health bar
}

// Function to draw the mana bar
function drawManaBar(graphics, mana) {
    graphics.clear();
    graphics.fillStyle(0x0000ff, 1); // Blue color for mana
    graphics.fillRect(0, 0, mana, 10); // Draw mana bar based on mana value
    graphics.lineStyle(2, 0x000000, 1); // Black outline for better visibility
    graphics.strokeRect(0, 0, 100, 10); // Fixed size outline for the mana bar
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
            this.time.delayedCall(20000, () => resetEffect(player, 'damageMultiplier', 1), [], this);
            break;
        case 'speed-boost':
            player.speedMultiplier = (player.speedMultiplier || 1) * 2; // Ensure multiplier exists.
            console.log(`Speed Multiplier Updated to: ${player.speedMultiplier}`);
            this.time.delayedCall(10000, () => resetEffect(player, 'speedMultiplier', 1), [], this);
            break;
        case 'super-jump':
            player.jumpHeight *= 3;
            console.log(`Jump Height Updated to: ${player.jumpHeight}`);
            this.time.delayedCall(10000, () => resetEffect(player, 'jumpHeight', 200), [], this);
            break;
        case 'extra-mana':
            player.mana = Math.min(player.mana + 20, 150);
            console.log(`Mana Updated to: ${player.mana}`);
            // No need to reset mana after 15 seconds
            break;
        case 'health-potion':
            player.health = Math.min(player.health + 20, player.maxHealth || 100); // Assume maxHealth if not set.
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
        // Reset horizontal velocity at the start
        player.setVelocityX(0);

        // Move player left or right based on key presses
        if (leftKey.isDown) {
            player.setVelocityX(-100 * player.speedMultiplier); // Move left with speed multiplier
        }
        if (rightKey.isDown) {
            player.setVelocityX(100 * player.speedMultiplier); // Move right with speed multiplier
        }

        // Allow player to jump if they are on the ground
        if (jumpKey.isDown && player.body.blocked.down) {
            
            player.setVelocityY(-player.jumpHeight); // Jump with modified jump height
             // Play the jump sound effect
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
            drawManaBar(player1ManaBar, player1Mana); // Update mana bar
            this.gameSounds.regularAttack.play(); // Play regular attack sound
            activateHitbox.call(this, player1, player2, 10);
        } else {
            console.log("Player 1 doesn't have enough mana for regular attack!");
        }
    }

    // Super punch attack for Player 1 (S key)
    if (Phaser.Input.Keyboard.JustDown(keys.S) && this.time.now > lastPlayer1AttackTime + attackDelay) {
        lastPlayer1AttackTime = this.time.now;
        if (player1Mana >= 50) {
            player1Mana -= 50;
            drawManaBar(player1ManaBar, player1Mana); // Update mana bar
            this.gameSounds.superAttack.play(); // Play super punch sound
            activateSuperPunch.call(this, player1, player2);
        } else {
            console.log("Player 1 doesn't have enough mana for super punch!");
        }
    }

    // Similar implementation for Player 2
    // Regular attack for Player 2 (Down arrow key)
    if (Phaser.Input.Keyboard.JustDown(cursors.down) && this.time.now > lastPlayer2AttackTime + attackDelay) {
        lastPlayer2AttackTime = this.time.now;
        if (player2Mana >= 20) {
            player2Mana -= 20;
            drawManaBar(player2ManaBar, player2Mana); // Update mana bar
            this.gameSounds.regularAttack.play(); // Play regular attack sound
            activateHitbox.call(this, player2, player1, 10);
        } else {
            console.log("Player 2 doesn't have enough mana for regular attack!");
        }
    }

    // Super punch attack for Player 2 (1 key)
 if (Phaser.Input.Keyboard.JustDown(keys.NUMPAD_ONE) && this.time.now > lastPlayer2AttackTime + attackDelay) {
        lastPlayer2AttackTime = this.time.now;
        if (player2Mana >= 50) {
            player2Mana -= 50;
            drawManaBar(player2ManaBar, player2Mana); // Update mana bar
            this.gameSounds.superAttack.play(); // Play super punch sound
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
    // Calculate the distance between the attacker and the target
    const distance = Phaser.Math.Distance.Between(attacker.x, attacker.y, target.x, target.y);
    const attackRange = 200; // Define the range within which the super punch is effective

    console.log(`Activating super punch for ${attacker === player1 ? 'Player 1' : 'Player 2'}`);

    // Check if the target is within the super punch range
    if (distance <= attackRange) {
        const hitbox = this.physics.add.sprite(attacker.x + (attacker.flipX ? -20 : 20), attacker.y, null).setSize(40, 40).setVisible(false).setActive(true);
        this.physics.add.overlap(hitbox, target, () => {
            const damage = 25 * attacker.damageMultiplier; // Calculate damage with multiplier
            handlePlayerHit(attacker, target, hitbox, damage);
            
            // Apply a strong horizontal force based on the direction the attacker is facing
            const direction = attacker.x < target.x ? 1 : -1;
            target.setVelocityX(-2000 * direction); // Significant horizontal push
            target.setVelocityY(0); // No vertical movement, focusing on horizontal impact

        }, null, this);
        
        // Ensure the hitbox is removed shortly after activation
        this.time.delayedCall(100, () => {
            hitbox.destroy();
        }, [], this);
    } else {
        console.log(`Super punch missed due to distance. Distance was ${distance}, required ${attackRange}.`);
    }
}
function handlePlayerHit(attacker, target, hitbox, damage) {
    if (hitbox.active && target.active && !target.body.immovable) {
        if (target === player1) {
            player1Health -= damage;
            console.log(`Player 1 hit! Health reduced by ${damage}. Current Health: ${player1Health}`);
            drawHealthBar(player1HealthBar, player1Health); // Update health bar
        } else if (target === player2) {
            player2Health -= damage;
            console.log(`Player 2 hit! Health reduced by ${damage}. Current Health: ${player2Health}`);
            drawHealthBar(player2HealthBar, player2Health); // Update health bar
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


// Recharge mana for both players every 5 seconds
function rechargeMana() {
    if (player1Mana < 100) {
        player1Mana = Math.min(player1Mana + 20, 100);
        drawManaBar(player1ManaBar, player1Mana); // Update mana bar
        console.log(`Player 1 Mana recharged. Current Mana: ${player1Mana}`);
    }
    if (player2Mana < 100) {
        player2Mana = Math.min(player2Mana + 20, 100);
        drawManaBar(player2ManaBar, player2Mana); // Update mana bar
        console.log(`Player 2 Mana recharged. Current Mana: ${player2Mana}`);
    }
}

// End the game and declare a winner
function endGame(winner) {
    console.log(`${winner} wins!`);
    gameOver = true;
    
    // Make players inactive and invisible
    player1.setActive(false).setVisible(false);
    player2.setActive(false).setVisible(false);

    // Ensure `this.add.text` is used correctly
    const gameOverText = this.add.text(256, 240, `${winner} Wins!`, {
        fontFamily: 'Arial',
        fontSize: '32px',
        fill: 'red',
        fontStyle: 'bold'
    }).setOrigin(0.5);  // Center the text on screen

    console.log(gameOverText.text);  // Ensure the text is created correctly
}




