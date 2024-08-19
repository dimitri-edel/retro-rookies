
class CharacterSelectionScene extends Phaser.Scene {
	constructor() {
		super({ key: 'CharacterSelectionScene' });
	}

	preload() {
		this.load.spritesheet('terminator-select', 'assets/terminator-select.png', {
			frameWidth: 80,  // Width of each frame
			frameHeight: 100,          // Height of each frame
		});

		this.load.spritesheet('wolverine', 'assets/wolverine-spritesheet.png', {
			frameWidth: 70,  // Adjust the frameWidth to the actual width of each frame
			frameHeight: 60,  // Adjust the frameHeight to the actual height of each frame
		});
		this.load.spritesheet('trunks-select', 'assets/trunks-select.png', {
			frameWidth: 50,  // Width of each frame
			frameHeight: 50,          // Height of each frame
		});

		this.load.spritesheet('vegeta-select', 'assets/vegeta-select.png', {
			frameWidth: 70.57142857,  // Width of each frame
			frameHeight: 60,          // Height of each frame
		});

		this.load.spritesheet('sasuke-select', 'assets/sasuke-move-left.png', {
			frameWidth: 60.83333333,
			frameHeight: 60,
		});
		this.load.spritesheet('batman-select', 'assets/batman-super-attack-left.png', {  // Load Batman's super attack sprite sheet
			frameWidth: 62.42857143,  // Frame width for Batman's super attack
			frameHeight: 60           // Frame height for Batman's super attack
		});
	}

	create() {
		this.add.text(256, 50, "Player 1, Select Your Character", {
			fontFamily: 'Arial',
			fontSize: '24px',
			fill: 'white',
		}).setOrigin(0.5);

		// Display character options
		const character1 = this.add.sprite(100, 150, 'terminator-select', 0).setInteractive(); // Wolverine's first frame as a selection thumbnail
		const character3 = this.add.sprite(400, 150, 'wolverine', 0).setInteractive(); // Wolverine's first frame as a selection thumbnail
		const character4 = this.add.sprite(100, 250, 'trunks-select', 0).setInteractive(); // Trunks' first frame as a selection thumbnail
		const character5 = this.add.sprite(250, 250, 'vegeta-select', 0).setInteractive(); // Vegeta's first frame as a selection thumbnail
		const character6 = this.add.sprite(400, 250, 'sasuke-select', 0).setInteractive();
		const character7 = this.add.sprite(100, 350, 'batman-select', 5).setInteractive(); // Batman's super attack frame 5 as a selection thumbnail

		// Scale the character options
		character1.setDisplaySize(100, 100);
		character3.setDisplaySize(100, 100);
		character4.setDisplaySize(100, 100);
		character5.setDisplaySize(100, 100);
		character6.setDisplaySize(100, 100);
		character7.setDisplaySize(100, 100);
		let player1Selected = null;
		let player2Selected = null;

		// Handle Player 1 selection
		this.input.on('gameobjectdown', (pointer, gameObject) => {
			if (!player1Selected) {
				player1Selected = gameObject.texture.key;
				this.add.text(gameObject.x - 20, gameObject.y, "Player 1", {
					fontFamily: 'Arial',
					fontSize: '18px',
					fill: 'white',
				});
				
				this.add.rectangle(gameObject.x, gameObject.y, 100, 100, 0x000000, 0.5);

				this.add.text(256, 50, "Player 2, Select Your Character", {
					fontFamily: 'Arial',
					fontSize: '24px',
					fill: 'white',
				}).setOrigin(0.5);
			} else if (!player2Selected) {
				player2Selected = gameObject.texture.key;
				this.add.text(gameObject.x - 20, gameObject.y, "Player 2", {
					fontFamily: 'Arial',
					fontSize: '18px',
					fill: 'white',
				});
				this.add.rectangle(gameObject.x, gameObject.y, 100, 100, 0x000000, 0.5);

				this.time.delayedCall(1000, () => {
					this.startGame(player1Selected, player2Selected);
				});
			}
		});
	}

	startGame(player1Character, player2Character) {
		// Start the main game scene, passing the selected characters
		this.scene.start('MainGame', {
			player1Character: player1Character,
			player2Character: player2Character,
		});
	}
}



class MainGame extends Phaser.Scene {
	constructor() {
		super({ key: 'MainGame' });
	}

	init(data) {
		// Store the selected characters for both players
		this.player1Character = data.player1Character;
		this.player2Character = data.player2Character;
	}

	preload() {
		// Load background images
		this.load.image("background", "assets/sprites/background.png");
		this.load.image("background2", "assets/sprites/background2.png");

		// Load the spritesheets for the selected characters
		// Terminator spritesheets
		// Sequence of terminator walking left
		this.load.spritesheet('terminator-walk-left', 'assets/sprites/terminator-walk-left.png', {
			frameWidth: 80,  // Width of each frame
			frameHeight: 130,          // Height of each frame
		});
		// Sequence of terminator walking right
		this.load.spritesheet('terminator-walk-right', 'assets/sprites/terminator-walk-right.png', {
			frameWidth: 80,  // Width of each frame
			frameHeight: 130,          // Height of each frame
		});
		// Sequence of terminator jumping right
		this.load.spritesheet('terminator-jump-right', 'assets/sprites/terminator-jump-right.png', {
			frameWidth: 80,  // Width of each frame
			frameHeight: 130,          // Height of each frame
		});
		// Sequence of terminator jumping left
		this.load.spritesheet('terminator-jump-left', 'assets/sprites/terminator-jump-left.png', {
			frameWidth: 80,  // Width of each frame
			frameHeight: 130,          // Height of each frame
		});
		// Sequence of terminator attacking right
		this.load.spritesheet('terminator-attack-right', 'assets/sprites/terminator-attack-right.png', {
			frameWidth: 200,  // Width of each frame
			frameHeight: 130,          // Height of each frame
		});
		// Sequence of terminator attacking left
		this.load.spritesheet('terminator-attack-left', 'assets/sprites/terminator-attack-left.png', {
			frameWidth: 200,  // Width of each frame
			frameHeight: 130,          // Height of each frame
		});
		// Sequence of terminator super attacking right
		this.load.spritesheet('terminator-super-attack-right', 'assets/sprites/terminator-super-attack-right.png', {
			frameWidth: 200,  // Width of each frame
			frameHeight: 130,          // Height of each frame
		});
		// Sequence of terminator super attacking left
		this.load.spritesheet('terminator-super-attack-left', 'assets/sprites/terminator-super-attack-left.png', {
			frameWidth: 200,  // Width of each frame
			frameHeight: 130,          // Height of each frame
		});


		this.load.spritesheet('wolverine-left', 'assets/wolverine-left.png', {
			frameWidth: 50.6,
			frameHeight: 42,
		});

		this.load.spritesheet('wolverine-jump', 'assets/jump.png', {
			frameWidth: 49,
			frameHeight: 42,
		});

		this.load.spritesheet('wolverine-attack', 'assets/wolverine-attack.png', {
			frameWidth: 51.2,
			frameHeight: 42,
		});

		this.load.spritesheet('wolverine-superattack', 'assets/wolverine-superattack.png', {
			frameWidth: 48,
			frameHeight: 42,
		});

		// Load Trunks spritesheets
		this.load.spritesheet('trunks-right', 'assets/trunks-right.png', {
			frameWidth: 50.57142857,  // Width of each frame
			frameHeight: 60,          // Height of each frame
		});

		this.load.spritesheet('trunks-jump', 'assets/trunks-jump.png', {
			frameWidth: 36.33333333,  // Width of each frame
			frameHeight: 60,          // Height of each frame
		});

		this.load.spritesheet('trunks-attack-right', 'assets/trunks-attack-right.png', {
			frameWidth: 67,           // Width of each frame
			frameHeight: 60,          // Height of each frame
		});

		this.load.spritesheet('trunks-attack-super-right', 'assets/trunks-attack-super-right.png', {
			frameWidth: 54.9,
			frameHeight: 60,
		});


		// Load Vegeta's spritesheets
		this.load.spritesheet('vegeta-move-left', 'assets/vegeta-move-left.png', {
			frameWidth: 49.42857143,
			frameHeight: 60,
		});

		this.load.spritesheet('vegeta-jump', 'assets/vegeta-jump.png', {
			frameWidth: 35.57142857,
			frameHeight: 60,
		});

		this.load.spritesheet('vegeta-attack-right', 'assets/vegeta-attack-right.png', {
			frameWidth: 58.77777778,
			frameHeight: 60,
		});

		this.load.spritesheet('vegeta-super-attack-right', 'assets/vegeta-super-attack-right.png', {
			frameWidth: 56.08333333,
			frameHeight: 60,
		});

		// Preload Sasuke's spritesheets
		this.load.spritesheet('sasuke-move-left', 'assets/sasuke-move-left.png', {
			frameWidth: 60.83333333,
			frameHeight: 60,
		});

		this.load.spritesheet('sasuke-jump', 'assets/sasuke-jump.png', {
			frameWidth: 61.83333333,
			frameHeight: 60,
		});

		this.load.spritesheet('sasuke-super-attack-left', 'assets/sasuke-super-attack-left.png', {
			frameWidth: 77,
			frameHeight: 60,
		});

		this.load.spritesheet('sasuke-attack-left', 'assets/sasuke-attack-left.png', {
			frameWidth: 87.25,
			frameHeight: 60,
		});

		this.load.spritesheet('batman-attack-left', 'assets/batman-attack-left.png', {
			frameWidth: 50.5,
			frameHeight: 60,
			endFrame: 8
		});

		this.load.spritesheet('batman-super-attack-left', 'assets/batman-super-attack-left.png', {
			frameWidth: 62.42857143,
			frameHeight: 60,
			endFrame: 6
		});

		this.load.spritesheet('batman-move-left', 'assets/batman-move-left.png', {
			frameWidth: 40.1,
			frameHeight: 60,
			endFrame: 9
		});

		this.load.spritesheet('batman-jump', 'assets/batman-jump.png', {
			frameWidth: 51.28571429,
			frameHeight: 60,
			endFrame: 6
		});
		this.load.image("pack-a-punch", "assets/sprites/pack-a-punch.png");
		this.load.image("touch-of-death", "assets/sprites/touch-of-death.png");
		this.load.image("speed-boost", "assets/sprites/speed-boost.png");
		this.load.image("super-jump", "assets/sprites/super-jump.png");
		this.load.image("extra-mana", "assets/sprites/extra-mana.png");
		this.load.image("health-potion", "assets/sprites/health-potion.png");



		// Load tiles and other assets
		for (let i = 1; i <= 75; i++) {
			const tileId = `tile_${String(i).padStart(4, "0")}`;
			this.load.image(tileId, `assets/${tileId}.png`);
		}
		// Load audio files for sound effects
		this.load.audio('regular-attack', 'assets/sounds/regular-attack.mp3');
		this.load.audio('super-attack', 'assets/sounds/super-attack.mp3');
		this.load.audio('jump', 'assets/sounds/jump.mp3');
		this.load.audio('background3', 'assets/music/background.mp3')

		// Load lava, traps, and other necessary assets
		this.load.image("lava", "assets/fire.png");
		this.load.image("spikes", "assets/spikes.png");
		this.load.image("trap", "assets/trap.png");
	}

	create() {

		const getBackgroundImage = () => {
			const randomBackground = Math.floor(Math.random() * 2);
			switch (randomBackground) {
				case 0:
					return this.add.image(256, 240, "background").setScale(4);
				case 1:
					return this.add.image(256, 240, "background2");
			}
		}

		// Add and scale the background
		const background = getBackgroundImage();
		// Play background music
		const backgroundMusic = this.sound.add('background3', {
			volume: 0.1, // Set volume to a reasonable level
			loop: true   // Loop the background music
		});
		backgroundMusic.play();

		const attackDuration = 1; // 0.2 seconds for each attack animation

		// Calculate frame rates based on the number of frames
		const basicAttackFrameRate = 20 / attackDuration; // Assuming 4 frames for basic attack
		const superAttackFrameRate = 20 / attackDuration;

		// Create animations for the terminator
		// Terminator walking right
		this.anims.create({
			key: 'terminator-walk-right',
			frames: this.anims.generateFrameNumbers('terminator-walk-right', { start: 0, end: 4 }), // Adjust frame numbers
			frameRate: 15, // Faster frame rate for walking
			repeat: -1 // Loop indefinitely
		});
		// Terminator walking left
		this.anims.create({
			key: 'terminator-walk-left',
			frames: this.anims.generateFrameNumbers('terminator-walk-left', { start: 0, end: 4 }), // Adjust frame numbers
			frameRate: 15, // Faster frame rate for walking
			repeat: -1 // Loop indefinitely
		});
		// Terminator is idle left
		this.anims.create({
			key: 'terminator-idle-left',
			frames: [{ key: 'terminator-walk-left', frame: 0 }], // Choose a single frame for idle
			frameRate: 1, // Very slow or no repeat
			repeat: 0
		});
		// Terminator is idle right
		this.anims.create({
			key: 'terminator-idle-right',
			frames: [{ key: 'terminator-walk-right', frame: 0 }], // Choose a single frame for idle
			frameRate: 1, // Very slow or no repeat
			repeat: 0
		});


		// Terminator jumping right
		this.anims.create({
			key: 'terminator-jump-right',
			frames: [{ key: 'terminator-jump-right', frame: 0 }], // Single frame for jumping
			frameRate: 10,
			repeat: 0
		});
		// Terminator jumping left
		this.anims.create({
			key: 'terminator-jump-left',
			frames: [{ key: 'terminator-jump-left', frame: 0 }], // Single frame for jumping
			frameRate: 10,
			repeat: 0
		});

		// Terminator basic attack right
		this.anims.create({
			key: 'terminator-attack-right',
			frames: this.anims.generateFrameNumbers('terminator-attack-right', { start: 0, end: 4 }), // 4 frames
			frameRate: basicAttackFrameRate,
			repeat: 0
		});
		// Terminator basic attack left
		this.anims.create({
			key: 'terminator-attack-left',
			frames: this.anims.generateFrameNumbers('terminator-attack-left', { start: 0, end: 4 }), // 4 frames
			frameRate: basicAttackFrameRate,
			repeat: 0
		});
		// Terminator super attack right
		this.anims.create({
			key: 'terminator-super-attack-right',
			frames: this.anims.generateFrameNumbers('terminator-super-attack-right', { start: 0, end: 4 }), // 5 frames
			frameRate: superAttackFrameRate,
			repeat: 0
		});
		// Terminator super attack left
		this.anims.create({
			key: 'terminator-super-attack-left',
			frames: this.anims.generateFrameNumbers('terminator-super-attack-left', { start: 0, end: 4 }), // 5 frames
			frameRate: superAttackFrameRate,
			repeat: 0
		});


		// Create animations for Wolverine
		// Create Wolverine animations
		this.anims.create({
			key: 'wolverine-move-right',
			frames: this.anims.generateFrameNumbers('wolverine-left', { start: 0, end: 4 }), // Adjust frame numbers
			frameRate: 15, // Faster frame rate for walking
			repeat: -1 // Loop indefinitely
		});



		this.anims.create({
			key: 'wolverine-jump',
			frames: [{ key: 'wolverine-jump', frame: 0 }], // Single frame for jumping
			frameRate: 10,
			repeat: 0
		});

		this.anims.create({
			key: 'wolverine-basic-attack-right',
			frames: this.anims.generateFrameNumbers('wolverine-attack', { start: 0, end: 4 }), // 4 frames
			frameRate: basicAttackFrameRate,
			repeat: 0
		});

		this.anims.create({
			key: 'wolverine-basic-attack-left',
			frames: this.anims.generateFrameNumbers('wolverine-attack', { start: 0, end: 4 }), // 4 frames
			frameRate: basicAttackFrameRate,
			repeat: 0
		});

		this.anims.create({
			key: 'wolverine-super-attack-right',
			frames: this.anims.generateFrameNumbers('wolverine-superattack', { start: 0, end: 4 }), // 5 frames
			frameRate: superAttackFrameRate,
			repeat: 0
		});

		this.anims.create({
			key: 'wolverine-super-attack-left',
			frames: this.anims.generateFrameNumbers('wolverine-superattack', { start: 0, end: 4 }), // 5 frames
			frameRate: superAttackFrameRate,
			repeat: 0
		});

		this.anims.create({
			key: 'wolverine-idle-right',
			frames: [{ key: 'wolverine-left', frame: 0 }], // Choose a single frame for idle
			frameRate: 1, // Very slow or no repeat
			repeat: 0
		});

		this.anims.create({
			key: 'wolverine-idle-left',
			frames: [{ key: 'wolverine-left', frame: 0 }],
			frameRate: 1,
			repeat: 0
		});


		this.anims.create({
			key: 'trunks-move-right',
			frames: this.anims.generateFrameNumbers('trunks-right', { start: 0, end: 6 }),
			frameRate: 15,
			repeat: -1
		});

		this.anims.create({
			key: 'trunks-jump-right',
			frames: this.anims.generateFrameNumbers('trunks-jump', { start: 0, end: 5 }),
			frameRate: 10,
			repeat: 0
		});

		this.anims.create({
			key: 'trunks-basic-attack-right',
			frames: this.anims.generateFrameNumbers('trunks-attack-right', { start: 0, end: 4 }),
			frameRate: basicAttackFrameRate,
			repeat: 0
		});

		this.anims.create({
			key: 'trunks-super-attack-right',
			frames: this.anims.generateFrameNumbers('trunks-attack-super-right', { start: 0, end: 9 }),
			frameRate: superAttackFrameRate,
			repeat: 0
		});


		// Create Trunks' left-facing animations by mirroring the right-facing ones
		this.anims.create({
			key: 'trunks-move-left',
			frames: this.anims.generateFrameNumbers('trunks-right', { start: 0, end: 6 }),
			frameRate: 15,
			repeat: -1
		});

		this.anims.create({
			key: 'trunks-jump-left',
			frames: this.anims.generateFrameNumbers('trunks-jump', { start: 0, end: 5 }),
			frameRate: 10,
			repeat: 0
		});

		this.anims.create({
			key: 'trunks-basic-attack-left',
			frames: this.anims.generateFrameNumbers('trunks-attack-right', { start: 0, end: 4 }),
			frameRate: basicAttackFrameRate,
			repeat: 0
		});

		this.anims.create({
			key: 'trunks-super-attack-left',
			frames: this.anims.generateFrameNumbers('trunks-attack-super-right', { start: 0, end: 9 }),
			frameRate: superAttackFrameRate,
			repeat: 0
		});
		this.anims.create({
			key: 'trunks-idle',
			frames: [{ key: 'trunks-right', frame: 0 }], // Assuming the first frame of the 'trunks-right' spritesheet is the idle pose
			frameRate: 1, // Slow frame rate since it's an idle animation
			repeat: -1    // Loop indefinitely
		});

		// Trunks Idle Animations
		this.anims.create({
			key: 'trunks-idle-right',
			frames: [{ key: 'trunks-right', frame: 0 }], // Use the first frame as the idle frame
			frameRate: 1,
			repeat: -1
		});

		this.anims.create({
			key: 'trunks-idle-left',
			frames: [{ key: 'trunks-right', frame: 0 }],
			frameRate: 1,
			repeat: -1
		});




		this.anims.create({
			key: 'vegeta-jump',
			frames: this.anims.generateFrameNumbers('vegeta-jump', { start: 0, end: 6 }),
			frameRate: 10,
			repeat: 0
		});

		this.anims.create({
			key: 'vegeta-move-left',
			frames: this.anims.generateFrameNumbers('vegeta-move-left', { start: 0, end: 5 }), // Assuming there are 6 frames (0-5)
			frameRate: 15,
			repeat: -1
		});
		this.anims.create({
			key: 'vegeta-basic-attack-left',
			frames: this.anims.generateFrameNumbers('vegeta-attack-right', { start: 0, end: 7 }),
			frameRate: 20,
			repeat: 0
		});
		this.anims.create({
			key: 'vegeta-basic-attack-right',
			frames: this.anims.generateFrameNumbers('vegeta-attack-right', { start: 0, end: 7 }), // Same frames as right but flipped
			frameRate: 20,
			repeat: 0
		});

		this.anims.create({
			key: 'vegeta-super-attack-right',
			frames: this.anims.generateFrameNumbers('vegeta-super-attack-right', { start: 0, end: 11 }),
			frameRate: superAttackFrameRate,
			repeat: 0
		});

		this.anims.create({
			key: 'vegeta-super-attack-left',
			frames: this.anims.generateFrameNumbers('vegeta-super-attack-right', { start: 0, end: 11 }),
			frameRate: 20,
			repeat: 0
		});

		// Vegeta Idle Animations
		this.anims.create({
			key: 'vegeta-idle-right',
			frames: [{ key: 'vegeta-jump', frame: 2 }], // Use the second frame of the jump animation
			frameRate: 1,
			repeat: -1
		});

		this.anims.create({
			key: 'vegeta-idle-left',
			frames: [{ key: 'vegeta-jump', frame: 2 }], // Use the second frame of the jump animation
			frameRate: 1,
			repeat: -1
		});


		// Sasuke Animations
		this.anims.create({
			key: 'sasuke-move-left',
			frames: this.anims.generateFrameNumbers('sasuke-move-left', { start: 0, end: 5 }),
			frameRate: 15,
			repeat: -1
		});

		this.anims.create({
			key: 'sasuke-jump',
			frames: this.anims.generateFrameNumbers('sasuke-jump', { start: 0, end: 5 }),
			frameRate: 10,
			repeat: 0
		});

		this.anims.create({
			key: 'sasuke-super-attack-left',
			frames: this.anims.generateFrameNumbers('sasuke-super-attack-left', { start: 0, end: 6 }),
			frameRate: 20,
			repeat: 0
		});

		this.anims.create({
			key: 'sasuke-attack-left',
			frames: this.anims.generateFrameNumbers('sasuke-attack-left', { start: 0, end: 3 }),
			frameRate: 20,
			repeat: 0
		});

		this.anims.create({
			key: 'sasuke-idle',
			frames: [{ key: 'sasuke-move-left', frame: 0 }], // Assuming idle uses the first frame of movement
			frameRate: 1,
			repeat: -1
		});

		this.anims.create({
			key: 'batman-move-left',
			frames: this.anims.generateFrameNumbers('batman-move-left', { start: 0, end: 9 }),
			frameRate: 15,
			repeat: -1
		});
		this.anims.create({
			key: 'batman-jump',
			frames: this.anims.generateFrameNumbers('batman-jump', { start: 0, end: 6 }),
			frameRate: 10,
			repeat: 0
		});
		this.anims.create({
			key: 'batman-attack-left',
			frames: this.anims.generateFrameNumbers('batman-attack-left', { start: 0, end: 7 }),
			frameRate: 20,
			repeat: 0
		});
		this.anims.create({
			key: 'batman-super-attack-left',
			frames: this.anims.generateFrameNumbers('batman-super-attack-left', { start: 0, end: 6 }),
			frameRate: 20,
			repeat: 0
		});


		this.anims.create({
			key: 'batman-idle',
			frames: [{ key: 'batman-super-attack-left', frame: 0 }], // Using the 5th frame for idle
			frameRate: 1,
			repeat: -1
		});


		// Player drop off height
		const playerDropHeight = 300;
		// Create player sprites based on selection
		if (this.player1Character === 'vegeta-select') {
			player1 = this.physics.add.sprite(50, playerDropHeight, 'vegeta-move-left');
			player1.play('vegeta-idle-right');
			player1.flipX = false; // Ensure Player 1 faces right
		} else if (this.player1Character === 'terminator-select') {
			player1 = this.physics.add.sprite(50, playerDropHeight, 'terminator-idle-right').setScale(0.4);
			player1.play('terminator-idle-right');
			// Since some sprites need scaling , set size for player 1
			player1.setSize(50, 110);
			player1.flipX = false; // Ensure Player 1 faces right
		}
		else if (this.player1Character === 'wolverine') {
			player1 = this.physics.add.sprite(50, playerDropHeight, 'wolverine-left');
			player1.play('wolverine-idle-right');
			player1.flipX = false; // Ensure Player 1 faces right
		} else if (this.player1Character === 'trunks-select') {
			player1 = this.physics.add.sprite(50, playerDropHeight, 'trunks-right');
			player1.play('trunks-idle-right');
			player1.flipX = false; // Ensure Player 1 faces right
		} else if (this.player1Character === 'sasuke-select') {
			player1 = this.physics.add.sprite(50, playerDropHeight, 'sasuke-move-left');
			player1.play('sasuke-idle');
			player1.flipX = false; // Ensure Player 1 faces right
		} else if (this.player1Character === 'batman-select') {
			player1 = this.physics.add.sprite(50, playerDropHeight, 'batman-super-attack-left');
			player1.play('batman-idle');
			player1.flipX = false; // Ensure Player 1 faces right
		} else {
			player1 = this.physics.add.sprite(50, playerDropHeight, 'player1');
			player1.setTexture('player1');
			player1.flipX = false; // Ensure Player 1 faces right
		}


		if (this.player2Character === 'vegeta-select') {
			player2 = this.physics.add.sprite(450, playerDropHeight, 'vegeta-move-left');
			player2.play('vegeta-idle-left');
			player2.flipX = true; // Ensure Player 2 faces left
		} else if (this.player2Character === 'terminator-select') {
			player2 = this.physics.add.sprite(450, playerDropHeight, 'terminator-idle-right').setScale(0.4);
			player2.play('terminator-idle-right');
			player2.flipX = true;
			player2.setSize(50, 110); // Ensure Player 2 faces left
		}
		else if (this.player2Character === 'wolverine') {
			player2 = this.physics.add.sprite(450, playerDropHeight, 'wolverine-left');
			player2.play('wolverine-idle-left');
			player2.flipX = true; // Ensure Player 2 faces left
		} else if (this.player2Character === 'trunks-select') {
			player2 = this.physics.add.sprite(450, playerDropHeight, 'trunks-right');
			player2.play('trunks-idle-right');
			player2.flipX = true; // Ensure Player 2 faces left
		} else if (this.player2Character === 'sasuke-select') {
			player2 = this.physics.add.sprite(450, playerDropHeight, 'sasuke-move-left');
			player2.play('sasuke-idle');
			player2.flipX = true; // Ensure Player 2 faces left
		} else if (this.player2Character === 'batman-select') {
			player2 = this.physics.add.sprite(450, playerDropHeight, 'batman-super-attack-left');
			player2.play('batman-idle');
			player2.flipX = true; // Ensure Player 2 faces left
		} else {
			player2 = this.physics.add.sprite(450, playerDropHeight, 'player2');
			player2.setTexture('player2');
			player2.flipX = true; // Ensure Player 2 faces left
		}



		const platforms = this.physics.add.staticGroup();
		// Define sounds for regular and super attacks
		const regularAttackSound = this.sound.add('regular-attack', { rate: 1 }); // Keep normal playback rate
		const superAttackSound = this.sound.add('super-attack', { rate: 1 }); // Keep normal playback rate
		const jumpSound = this.sound.add('jump', { rate: 1 }); // Keep normal playback rate

		// Store these sounds for easy access in other functions
		this.gameSounds = {
			regularAttack: regularAttackSound,
			superAttack: superAttackSound,
			jump: jumpSound
		};
		// Function to get a random tile
		function getRandomTile() {
			const randomIndex = Phaser.Math.Between(1, 75);
			return `tile_${String(randomIndex).padStart(4, "0")}`;
		}

		function generateMap() {
			const random_map = Math.floor(Math.random() * 3);

			switch (random_map) {
				case 0:
					platforms.create(256, 464, getRandomTile()).setScale(12, 1).refreshBody(); // Central base platform
					platforms.create(130, 380, getRandomTile()).setScale(4, 1).refreshBody(); // Left middle platform
					platforms.create(380, 380, getRandomTile()).setScale(4, 1).refreshBody(); // Right middle platform
					platforms.create(128, 350, getRandomTile()).setScale(2, 1).refreshBody(); // Left upper middle platform
					platforms.create(384, 350, getRandomTile()).setScale(2, 1).refreshBody(); // Right upper middle platform
					platforms.create(250, 300, getRandomTile()).setScale(10, 1).refreshBody(); // Right upper middle platform
					// Upper Platforms - High-Level for Aerial Combat
					platforms.create(64, 260, getRandomTile()).setScale(2, 1).refreshBody();  // Upper left platform
					platforms.create(448, 260, getRandomTile()).setScale(2, 1).refreshBody(); // Upper right platform
					platforms.create(334, 120, getRandomTile()).setScale(2, 1).refreshBody(); // Central high platform
					platforms.create(160, 150, getRandomTile()).setScale(2, 1).refreshBody(); // Central high platform
					// Super Jump Platforms at the Bottom Left and Right
					platforms.create(50, 464, getRandomTile()).setScale(4, 1).refreshBody(); // Left super jump platform
					platforms.create(448, 464, getRandomTile()).setScale(4, 1).refreshBody(); // Right super jump platform
					break;
				case 1:
					platforms.create(160, 150, getRandomTile()).setScale(6, 1).refreshBody(); // Central high platform
					platforms.create(334, 150, getRandomTile()).setScale(6, 1).refreshBody(); // Central high platform
					platforms.create(458, 220, getRandomTile()).setScale(2, 1).refreshBody(); // Upper right platform
					platforms.create(54, 220, getRandomTile()).setScale(2, 1).refreshBody();  // Upper left platform
					platforms.create(90, 300, getRandomTile()).setScale(2, 1).refreshBody(); // Left upper middle platform
					platforms.create(420, 300, getRandomTile()).setScale(2, 1).refreshBody(); // Right upper middle platform
					platforms.create(250, 300, getRandomTile()).setScale(8, 1).refreshBody(); // middle platform
					// Upper Platforms - High-Level for Aerial Combat
					platforms.create(330, 380, getRandomTile()).setScale(4, 1).refreshBody(); // Right middle platform
					platforms.create(150, 380, getRandomTile()).setScale(4, 1).refreshBody(); // Left middle platform
					platforms.create(230, 464, getRandomTile()).setScale(13, 1).refreshBody(); // Central base platform
					// // Super Jump Platforms at the Bottom Left and Right
					platforms.create(50, 444, getRandomTile()).setScale(4, 1).refreshBody(); // Left super jump platform
					platforms.create(448, 444, getRandomTile()).setScale(4, 1).refreshBody(); // Right super jump platform
					break;
				case 2:
					platforms.create(160, 150, getRandomTile()).setScale(6, 1).refreshBody(); // Central high platform
					platforms.create(334, 150, getRandomTile()).setScale(6, 1).refreshBody(); // Central high platform
					platforms.create(458, 220, getRandomTile()).setScale(2, 1).refreshBody(); // Upper right platform
					platforms.create(54, 220, getRandomTile()).setScale(2, 1).refreshBody();  // Upper left platform
					platforms.create(50, 300, getRandomTile()).setScale(4, 1).refreshBody(); // Left upper middle platform
					platforms.create(420, 300, getRandomTile()).setScale(4, 1).refreshBody(); // Right upper middle platform
					platforms.create(250, 300, getRandomTile()).setScale(8, 1).refreshBody(); // middle platform
					// Upper Platforms - High-Level for Aerial Combat
					platforms.create(380, 380, getRandomTile()).setScale(2, 1).refreshBody(); // Right middle platform
					platforms.create(100, 380, getRandomTile()).setScale(2, 1).refreshBody(); // Left middle platform
					platforms.create(250, 454, getRandomTile()).setScale(11, 1).refreshBody(); // Central base platform
					// // Super Jump Platforms at the Bottom Left and Right
					platforms.create(20, 454, getRandomTile()).setScale(4, 1).refreshBody(); // Left super jump platform
					platforms.create(468, 454, getRandomTile()).setScale(4, 1).refreshBody(); // Right super jump platform
					break;
			}
		}
		// Generate the map of the tiles
		generateMap();

		// Lava and traps setup
		const lava = this.physics.add.staticGroup();
		lava.create(256, 478, "lava").setScale(32, 0.5).refreshBody();

		const traps = this.physics.add.group();
		traps.create(294, 180, 'trap').setScale(0.25).refreshBody(); // Trap on upper right platform
		traps.create(200, 430, "spikes").setScale(0.25).refreshBody();
		traps.create(190, 180, 'trap').setScale(0.25).refreshBody(); // Trap on left lower platform

		// Initialize player health and mana text displays
		player1HealthBar = this.add.graphics({ x: 10, y: 10 });
		player1ManaBar = this.add.graphics({ x: 10, y: 30 });
		player2HealthBar = this.add.graphics({ x: 400, y: 10 });
		player2ManaBar = this.add.graphics({ x: 400, y: 30 });

		// Draw initial bars
		drawHealthBar(player1HealthBar, player1Health);
		drawManaBar(player1ManaBar, player1Mana);
		drawHealthBar(player2HealthBar, player2Health);
		drawManaBar(player2ManaBar, player2Mana);

		// Create player sprites with physics


		player1.setBounce(0.2);
		player1.setCollideWorldBounds(true);
		player1.damageMultiplier = 1;
		player1.jumpHeight = 260;
		player1.speedMultiplier = 1;
		player1.setGravityY(-300);

		player2.setBounce(0.2);
		player2.setCollideWorldBounds(true);
		player2.damageMultiplier = 1;
		player2.jumpHeight = 260;
		player2.speedMultiplier = 1;
		player2.setGravityY(-300);

		player1.mana = player1Mana;
		player2.mana = player2Mana;


		// Add collision between players and platforms, traps, and lava
		this.physics.add.collider(player1, platforms);
		this.physics.add.collider(player2, platforms);
		this.physics.add.collider(traps, platforms); // Ensure traps collide with platforms
		this.physics.add.collider(traps, lava, () => traps.setActive(false)); // Deactivate traps that fall into lava

		// Ensure players are not getting the error by properly initializing the overlap after players are created
		this.physics.add.overlap(player1, lava, hitLava, null, this);
		this.physics.add.overlap(player2, lava, hitLava, null, this);

		this.physics.add.overlap(player1, traps, hitTrap, null, this);
		this.physics.add.overlap(player2, traps, hitTrap, null, this);

		// Set up input controls
		cursors = this.input.keyboard.createCursorKeys();
		keys = this.input.keyboard.addKeys({
			W: Phaser.Input.Keyboard.KeyCodes.W,
			A: Phaser.Input.Keyboard.KeyCodes.A,
			S: Phaser.Input.Keyboard.KeyCodes.S,
			D: Phaser.Input.Keyboard.KeyCodes.D,
			SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
			NUMPAD_ONE: Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE // Ensure correct key code
		});

		// Mana regeneration event
		this.time.addEvent({
			delay: 5000,
			callback: rechargeMana,
			callbackScope: this,
			loop: true,
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

	update() {
		if (gameOver) return;

		// Handle player movement
		handlePlayerMovement(player1, { jump: keys.W, left: keys.A, right: keys.D });
		handlePlayerMovement(player2, { jump: cursors.up, left: cursors.left, right: cursors.right });

		// Adjust facing direction based on the opponent's position
		adjustDirectionBasedOnOpponent(player1, player2);
		adjustDirectionBasedOnOpponent(player2, player1);

		// Manage attacks for both players
		manageAttacks.call(this);
	}
}
function hitLava(player, lava) {
	if (!gameOver) {
		console.log(
			(player === player1 ? "Player 1" : "Player 2") + " fell into the lava. Instant Game Over."
		);
		endGame.call(this, player === player1 ? "Player 2" : "Player 1");
	}
}

function hitTrap(player, trap) {
	if (!player.trapContact) {
		player.trapContact = true;

		// Disable player movement for 1.5 seconds
		player.setVelocityX(0);
		player.setVelocityY(0);
		player.body.moves = false;

		this.time.delayedCall(1500, () => {
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


function adjustDirectionBasedOnOpponent(player, opponent) {
	// Determine the character of the player
	const isSpecialCharacter = player.texture.key.includes('sasuke') ||
		player.texture.key.includes('batman') ||
		player.texture.key.includes('wolverine');

	if (isSpecialCharacter) {
		// For Sasuke, Batman, and Wolverine
		if (player.x < opponent.x) {
			// Face right
			player.flipX = false;
		} else {
			// Face left
			player.flipX = true;
		}
	} else {
		// For all other characters
		if (player.x < opponent.x) {
			// Face right
			player.flipX = true;
		} else {
			// Face left
			player.flipX = false;
		}
	}
}
function collectItem(player, item) {
	if (!item || !item.getData("key")) {
		console.error("Item collection failed: item data is missing.");
		return; // Early exit if no item or key data found.
	}

	const itemKey = item.getData("key");
	console.log("Item collected: " + itemKey); // Confirm item collection.

	// Apply effects and start a timer to reset them
	switch (itemKey) {
		case "pack-a-punch":
			player.damageMultiplier *= 1.5;
			console.log(`Damage Multiplier Updated to: ${player.damageMultiplier}`);
			this.time.delayedCall(
				15000,
				() => resetEffect(player, "damageMultiplier", 1),
				[],
				this
			);
			break;
		case "touch-of-death":
			player.damageMultiplier *= 2.5;
			console.log(`Damage Multiplier Updated to: ${player.damageMultiplier}`);
			this.time.delayedCall(
				15000,
				() => resetEffect(player, "damageMultiplier", 1),
				[],
				this
			);
			break;
		case "speed-boost":
			player.speedMultiplier = (player.speedMultiplier || 1) * 2; // Ensure multiplier exists.
			console.log(`Speed Multiplier Updated to: ${player.speedMultiplier}`);
			this.time.delayedCall(
				15000,
				() => resetEffect(player, "speedMultiplier", 1),
				[],
				this
			);
			break;
		case "super-jump":
			player.jumpHeight *= 3;
			console.log(`Jump Height Updated to: ${player.jumpHeight}`);
			this.time.delayedCall(
				15000,
				() => resetEffect(player, "jumpHeight", 200),
				[],
				this
			);
			break;
		case "extra-mana":
			player.mana = Math.min(player.mana + 50, 150);
			console.log(`Mana Updated to: ${player.mana}`);
			// No need to reset mana after 15 seconds
			break;
		case "health-potion":
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
function handlePlayerMovement(player, controls) {
	if (!player || !player.active) return;

	// Initialize player state if not already set
	player.state = player.state || 'idle';

	// Reset horizontal velocity
	player.setVelocityX(0);

	// Handle jumping
	if (controls.jump.isDown && player.body.blocked.down) {
		player.setVelocityY(-player.jumpHeight);
		player.state = 'jumping';
		if (player.flipX === true) {
			playAnimation(player, 'jump-left');
		} else {
			playAnimation(player, 'jump-right');
		}
	} else if (player.state === 'jumping' && player.body.blocked.down) {
		// Transition from jumping to idle or move based on input
		player.state = 'idle';
		playAnimation(player, 'idle');
	}

	// Handle horizontal movement
	if (controls.left.isDown) {
		player.setVelocityX(-150 * player.speedMultiplier);
		if (player.state !== 'jumping') {
			player.state = 'moving';
			playAnimation(player, 'move-left');
			player.flipX = true;
		}
		player.flipX = true;
	} else if (controls.right.isDown) {
		player.setVelocityX(150 * player.speedMultiplier);
		if (player.state !== 'jumping') {
			player.state = 'moving';
			playAnimation(player, 'move-right');
			player.flipX = false;
		}
		player.flipX = false;
	} else if (player.body.blocked.down && player.state !== 'jumping') {
		// If no movement keys are pressed and the player is on the ground
		if (player.state !== 'idle') {
			player.state = 'idle';
			playAnimation(player, 'idle');
		}
	}

	// Ensure the player remains visible and active
	ensureSpriteVisibility(player);
}

function playAnimation(player, action) {
	console.log("Player animation: " + action);

	const characterAnimations = {
		'terminator': {
			'jump-right': 'terminator-jump-right',
			'jump-left': 'terminator-jump-left',
			'move-left': 'terminator-walk-left',
			'move-right': 'terminator-walk-right',
			'idle': 'terminator-idle-right'
		},
		'wolverine': {
			'jump-right': 'wolverine-jump',
			'jump-left': 'wolverine-jump',
			'move-left': 'wolverine-move-right',
			'move-right': 'wolverine-move-right',
			'idle': 'wolverine-idle-right'
		},
		'trunks': {
			'jump-right': 'trunks-jump-right',
			'jump-left': 'trunks-jump-right',
			'move-left': 'trunks-move-left',
			'move-right': 'trunks-move-right',
			'idle': 'trunks-idle-right'
		},
		'vegeta': {
			'jump-right': 'vegeta-jump',
			'jump-left': 'vegeta-jump',
			'move-left': 'vegeta-move-left',
			'move-right': 'vegeta-move-left',
			'idle': 'vegeta-idle-right'
		},
		'sasuke': {
			'jump-right': 'sasuke-jump',
			'jump-left': 'sasuke-jump',
			'move-left': 'sasuke-move-left',
			'move-right': 'sasuke-move-left',
			'idle': 'sasuke-idle'
		},
		'batman': {
			'jump-right': 'batman-jump',
			'jump-left': 'batman-jump',
			'move-left': 'batman-move-left',
			'move-right': 'batman-move-left', // Batman only has left animations, so reuse them
			'idle': 'batman-idle'
		}
	};

	// Determine the character key from the player's texture
	const animKey = player.texture.key.includes('wolverine') ? 'wolverine' :
		player.texture.key.includes('trunks') ? 'trunks' :
			player.texture.key.includes('sasuke') ? 'sasuke' :
				player.texture.key.includes('batman') ? 'batman' :
					player.texture.key.includes('terminator') ? 'terminator' : 'vegeta';

	const animation = characterAnimations[animKey][action];
	// Play the animation
	console.log("Player animation: " + animation);
	player.play(animation, true);

	// Ensure correct flipping for left movement
	player.flipX = (action === 'move-left');



}




function manageAttacks() {
	if (Phaser.Input.Keyboard.JustDown(keys.SPACE) && this.time.now > lastPlayer1AttackTime + attackDelay) {
		lastPlayer1AttackTime = this.time.now; // Update last attack time
		handleAttack.call(this, player1, player2, 'regular');
	}

	if (Phaser.Input.Keyboard.JustDown(keys.S) && this.time.now > lastPlayer1AttackTime + attackDelay) {
		lastPlayer1AttackTime = this.time.now; // Update last attack time
		handleAttack.call(this, player1, player2, 'super');
	}

	if (Phaser.Input.Keyboard.JustDown(cursors.down) && this.time.now > lastPlayer2AttackTime + attackDelay) {
		lastPlayer2AttackTime = this.time.now; // Update last attack time
		handleAttack.call(this, player2, player1, 'regular');
	}

	if (Phaser.Input.Keyboard.JustDown(keys.NUMPAD_ONE) && this.time.now > lastPlayer2AttackTime + attackDelay) {
		lastPlayer2AttackTime = this.time.now; // Update last attack time
		handleAttack.call(this, player2, player1, 'super');
	}
}
function handleAttack(attacker, target, type) {
	const attackCosts = { 'regular': 20, 'super': 50 };
	const animations = {
		'terminator': {
			'regular': attacker.flipX ? 'terminator-attack-left' : 'terminator-attack-right',
			'super': attacker.flipX ? 'terminator-super-attack-left' : 'terminator-super-attack-right'
		},
		'wolverine': {
			'regular': attacker.flipX ? 'wolverine-basic-attack-left' : 'wolverine-basic-attack-right',
			'super': attacker.flipX ? 'wolverine-super-attack-left' : 'wolverine-super-attack-right'
		},
		'trunks': {
			'regular': attacker.flipX ? 'trunks-basic-attack-left' : 'trunks-basic-attack-right',
			'super': attacker.flipX ? 'trunks-super-attack-left' : 'trunks-super-attack-right'
		},
		'vegeta': {
			'regular': 'vegeta-basic-attack-right', // Start with right attack
			'super': 'vegeta-super-attack-right'    // Start with right super attack
		},
		'sasuke': {
			'regular': attacker.flipX ? 'sasuke-attack-left' : 'sasuke-attack-left',
			'super': attacker.flipX ? 'sasuke-super-attack-left' : 'sasuke-super-attack-left'
		},
		'batman': {
			'regular': 'batman-attack-left',
			'super': 'batman-attack-left'
		}
	};

	const animKey = attacker.texture.key.includes('wolverine') ? 'wolverine' :
		attacker.texture.key.includes('trunks') ? 'trunks' :
			attacker.texture.key.includes('sasuke') ? 'sasuke' :
				attacker.texture.key.includes('batman') ? 'batman' :
					attacker.texture.key.includes('terminator') ? 'terminator' : 'vegeta';

	const animation = animations[animKey][type];
	const manaCost = attackCosts[type];

    if (attacker.mana >= manaCost) {
        attacker.mana -= manaCost;

		        // Update the global mana variables
        if (attacker === player1) {
            player1Mana = attacker.mana;
        } else if (attacker === player2) {
            player2Mana = attacker.mana;
        }
        
        if (type === 'regular' || type === 'super') {
            this.gameSounds[`${type}Attack`].play();
            activateHitbox.call(this, attacker, target, type === 'regular' ? 10 : 25);

			// Play the right-side attack first, then flip to left
			attacker.play(animation, true).on('animationcomplete', () => {
				if (animKey === 'vegeta') {
					attacker.flipX = !attacker.flipX; // Flip the sprite
					attacker.play(attacker.flipX ? 'vegeta-basic-attack-left' : 'vegeta-basic-attack-right', true);
				}
			});
		}

		drawManaBar(attacker === player1 ? player1ManaBar : player2ManaBar, attacker.mana);
	} else {
		console.log('Not enough mana for attack:', type);
	}
}


function activateHitbox(attacker, target, baseDamage) {
	if (!attacker || !attacker.active) return;

	const hitbox = this.physics.add
		.sprite(attacker.x + (attacker.flipX ? -20 : 20), attacker.y, null)
		.setSize(40, 40)
		.setVisible(false)
		.setActive(true);

	this.physics.add.overlap(hitbox, target, () => {
		const damage = baseDamage * attacker.damageMultiplier;
		handlePlayerHit(attacker, target, hitbox, damage);
		const direction = attacker.x < target.x ? 1 : -1;
		target.setVelocityX(200 * direction);
		target.setVelocityY(-100);
	}, null, this);

	this.time.delayedCall(100, () => {
		deactivateHitbox(hitbox);
	});
}

function activateSuperPunch(attacker, target) {
	const distance = Phaser.Math.Distance.Between(attacker.x, attacker.y, target.x, target.y);
	const attackRange = 200;

	if (distance <= attackRange) {
		const hitbox = this.physics.add.sprite(attacker.x + (attacker.flipX ? -20 : 20), attacker.y, null)
			.setSize(40, 40)
			.setVisible(false)
			.setActive(true);

		this.physics.add.overlap(hitbox, target, () => {
			const damage = 25 * attacker.damageMultiplier;
			handlePlayerHit(attacker, target, hitbox, damage);
			const direction = attacker.x < target.x ? 1 : -1;
			target.setVelocityX(-2000 * direction);
			target.setVelocityY(0);
		}, null, this);

		this.time.delayedCall(100, () => {
			hitbox.destroy();
		});
	}
}

function handlePlayerHit(attacker, target, hitbox, damage) {
	if (hitbox.active && target.active && !target.body.immovable) {
		if (target === player1) {
			player1Health -= damage;
			drawHealthBar(player1HealthBar, player1Health);
		} else if (target === player2) {
			player2Health -= damage;
			drawHealthBar(player2HealthBar, player2Health);
		}

		deactivateHitbox(hitbox);
		restartCharacter(target);

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
		hitbox.destroy();
	}
}

function ensureSpriteVisibility(player) {
	if (player.x < 0 || player.x > config.width || player.y < 0 || player.y > config.height) {
		player.setPosition(128, 200);
	}

	player.setVisible(true);
	player.setActive(true);
	player.body.enable = true;
}

function restartCharacter(player) {
	const currentPosition = { x: player.x, y: player.y };
	player.body.enable = false;
	player.setPosition(currentPosition.x, currentPosition.y);
	player.setVisible(true);
	player.setActive(true);
	player.body.enable = true;
}

// Create a text display for health and mana
function createText(scene, x, y, text) {
	return scene.add.text(x, y, text, {
		fontFamily: "Arial",
		fontSize: "16px",
		fill: "black",
	});
}

// Update the health bar display when a player's health changes
function drawHealthBar(graphics, health) {
	graphics.clear(); // Clear the previous graphics
	graphics.fillStyle(0xff0000, 1); // Red color for health
	graphics.fillRect(0, 0, health, 10); // Draw health bar based on health value
	graphics.lineStyle(2, 0x000000, 1); // Black outline for better visibility
	graphics.strokeRect(0, 0, 100, 10); // Fixed size outline for the health bar
}

// Update the mana bar display when a player's mana changes
function drawManaBar(graphics, mana) {
	graphics.clear(); // Clear the previous graphics
	graphics.fillStyle(0x0000ff, 1); // Blue color for mana
	graphics.fillRect(0, 0, mana, 10); // Draw mana bar based on mana value
	graphics.lineStyle(2, 0x000000, 1); // Black outline for better visibility
	graphics.strokeRect(0, 0, 100, 10); // Fixed size outline for the mana bar
}

// Recharge mana for both players every 5 seconds
function rechargeMana() {
   if (player1Mana < 100) {
        player1Mana = Math.min(player1Mana + 30, 100);
        drawManaBar(player1ManaBar, player1Mana); // Update mana bar
        console.log(`Player 1 Mana recharged. Current Mana: ${player1Mana}`);
    }
    if (player2Mana < 100) {
        player2Mana = Math.min(player2Mana + 30, 100);
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

	// Display the game over text
	const gameOverText = this.add
		.text(256, 240, `${winner} Wins!`, {
			fontFamily: "Arial",
			fontSize: "32px",
			fill: "red",
			fontStyle: "bold",
		})
		.setOrigin(0.5); // Center the text on screen

	console.log(gameOverText.text); // Ensure the text is created correctly
}
const config = {
	type: Phaser.AUTO,
	width: 512,
	height: 480,
	parent: "game-container",
	pixelArt: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 600 },
			debug: true,
		},
	},
	scene: [CharacterSelectionScene, MainGame], // Use the new name here
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