// Phaser 3 maze chase game with A* enemy, enhanced visuals + coins

const TILE_SIZE = 40;
const GRID_W = 22; // columns
const GRID_H = 16; // rows

// Game state management
const GameState = {
  unlockedLevels: 1, // Start with level 1 unlocked
  musicVolume: 0.5,
  sfxVolume: 0.5
};

// Main Menu Scene
class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('mainMenu');
  }

  preload() {
    this.load.image('background', 'Asset/Gemini_Generated_Image_hjbl1khjbl1khjbl.png');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background image
    const bg = this.add.image(centerX, centerY, 'background');
    bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Title

    // Start button
    const startBtn = this.createButton(centerX, centerY - 50, 'START', () => {
      this.scene.start('levelSelect');
    });

    // Options button
    const optionsBtn = this.createButton(centerX, centerY + 50, 'OPTIONS', () => {
      this.scene.start('options');
    });

    // Exit button
    const exitBtn = this.createButton(centerX, centerY + 150, 'KELUAR', () => {
      window.location.href = 'https://www.google.com';
    });
  }

  createButton(x, y, text, callback) {
    const btn = this.add.text(x, y, text, {
      fontFamily: 'Arial',
      fontSize: 32,
      color: '#ffffff',
      backgroundColor: '#1fb6aa',
      padding: { x: 40, y: 15 },
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setInteractive();

    btn.on('pointerover', () => {
      btn.setBackgroundColor('#3be0d4');
      btn.setScale(1.1);
    });

    btn.on('pointerout', () => {
      btn.setBackgroundColor('#1fb6aa');
      btn.setScale(1);
    });

    btn.on('pointerdown', callback);

    return btn;
  }
}

// Level Select Scene
class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('levelSelect');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background
    this.cameras.main.setBackgroundColor('#10151a');

    // Title
    this.add.text(centerX, 80, 'Pilih Level', {
      fontFamily: 'Arial',
      fontSize: 48,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Level buttons in grid
    const cols = 3;
    const startX = centerX - 200;
    const startY = centerY - 100;
    const spacingX = 150;
    const spacingY = 120;

    for (let i = 0; i < 5; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * spacingX;
      const y = startY + row * spacingY;
      const levelNum = i + 1;
      const isUnlocked = levelNum <= GameState.unlockedLevels;

      this.createLevelButton(x, y, levelNum, isUnlocked);
    }

    // Back button
    const backBtn = this.add.text(centerX, centerY + 200, 'KEMBALI', {
      fontFamily: 'Arial',
      fontSize: 28,
      color: '#ffffff',
      backgroundColor: '#616161',
      padding: { x: 30, y: 10 }
    }).setOrigin(0.5).setInteractive();

    backBtn.on('pointerover', () => backBtn.setBackgroundColor('#757575'));
    backBtn.on('pointerout', () => backBtn.setBackgroundColor('#616161'));
    backBtn.on('pointerdown', () => this.scene.start('mainMenu'));
  }

  createLevelButton(x, y, levelNum, isUnlocked) {
    const btnColor = isUnlocked ? '#1fb6aa' : '#424242';
    const textColor = isUnlocked ? '#ffffff' : '#757575';
    const btnText = isUnlocked ? 'Level ' + levelNum : '🔒';

    const btn = this.add.text(x, y, btnText, {
      fontFamily: 'Arial',
      fontSize: 24,
      color: textColor,
      backgroundColor: btnColor,
      padding: { x: 25, y: 15 },
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    if (isUnlocked) {
      btn.setInteractive();
      btn.on('pointerover', () => {
        btn.setBackgroundColor('#3be0d4');
        btn.setScale(1.1);
      });
      btn.on('pointerout', () => {
        btn.setBackgroundColor('#1fb6aa');
        btn.setScale(1);
      });
      btn.on('pointerdown', () => {
        this.scene.start('maze', { level: levelNum - 1 });
      });
    }

    return btn;
  }
}

// Options Scene
class OptionsScene extends Phaser.Scene {
  constructor() {
    super('options');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.cameras.main.setBackgroundColor('#10151a');

    // Title
    this.add.text(centerX, 80, 'Pengaturan', {
      fontFamily: 'Arial',
      fontSize: 48,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Music volume
    this.add.text(centerX - 200, centerY - 80, 'Volume Musik:', {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#ffffff'
    });
    this.musicText = this.add.text(centerX + 150, centerY - 80, Math.floor(GameState.musicVolume * 100) + '%', {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#1fb6aa'
    });

    // SFX volume
    this.add.text(centerX - 200, centerY, 'Volume SFX:', {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#ffffff'
    });
    this.sfxText = this.add.text(centerX + 150, centerY, Math.floor(GameState.sfxVolume * 100) + '%', {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#1fb6aa'
    });

    // Reset progress button
    const resetBtn = this.add.text(centerX, centerY + 100, 'RESET PROGRESS', {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#ffffff',
      backgroundColor: '#d32f2f',
      padding: { x: 30, y: 12 }
    }).setOrigin(0.5).setInteractive();

    resetBtn.on('pointerover', () => resetBtn.setBackgroundColor('#f44336'));
    resetBtn.on('pointerout', () => resetBtn.setBackgroundColor('#d32f2f'));
    resetBtn.on('pointerdown', () => {
      GameState.unlockedLevels = 1;
      this.add.text(centerX, centerY + 150, 'Progress direset!', {
        fontFamily: 'Arial',
        fontSize: 18,
        color: '#00ff00'
      }).setOrigin(0.5);
    });

    // Back button
    const backBtn = this.add.text(centerX, centerY + 200, 'KEMBALI', {
      fontFamily: 'Arial',
      fontSize: 28,
      color: '#ffffff',
      backgroundColor: '#616161',
      padding: { x: 30, y: 10 }
    }).setOrigin(0.5).setInteractive();

    backBtn.on('pointerover', () => backBtn.setBackgroundColor('#757575'));
    backBtn.on('pointerout', () => backBtn.setBackgroundColor('#616161'));
    backBtn.on('pointerdown', () => this.scene.start('mainMenu'));
  }
}

// 5 different maze levels with increasing difficulty
const LEVELS = [
  // Level 1 - Easy
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Level 2 - Medium
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1],
    [1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Level 3 - Hard
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1,0,1],
    [1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1],
    [1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Level 4 - Very Hard
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Level 5 - Expert
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ]
];

// Static maze layout (0 = walkable, 1 = wall)
function generateGrid(level = 0) {
  return LEVELS[level % LEVELS.length];
}

class MazeScene extends Phaser.Scene {
  constructor() {
    super('maze');
    this.currentLevel = 0;
  }

  init(data) {
    this.currentLevel = data.level || 0;
  }

  preload() {}

  create() {
    this.grid = generateGrid(this.currentLevel);
    this.gameOver = false;

    // draw tiles
    this.gfx = this.add.graphics();
    this.drawGrid();

    // physics world
    this.physics.world.setBounds(0, 0, GRID_W * TILE_SIZE, GRID_H * TILE_SIZE);

    // create robot textures
    this.createRobotTextures();

    // player sprite (blue-eyed robot)
    this.player = this.add.image(0, 0, 'robotBlue');
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // enemy sprite (red-eyed robot)
    this.enemy = this.add.image(0, 0, 'robotRed');
    this.physics.add.existing(this.enemy);
    this.enemy.body.setCollideWorldBounds(true);

    // place at grid positions
    this.playerCell = { x: 1, y: 1 };
    this.enemyCell = { x: GRID_W - 2, y: 1 };
    this.snapToCell(this.player, this.playerCell);
    this.snapToCell(this.enemy, this.enemyCell);

    // keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D');

    // movement control
    this.moveCooldown = 0; // simple turn-based movement feel

    // exit/goal
    this.exitCell = { x: GRID_W - 2, y: GRID_H - 2 };
    this.createExitSprite();

    // enemy path update timer
    this.time.addEvent({ delay: 250, loop: true, callback: () => this.updateEnemyPath() });

    // check win condition
    this.statusText = this.add.text(8, 8, 'Level ' + (this.currentLevel + 1) + ' - Temukan pintu keluar!', { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' });
    this.physics.add.overlap(this.player, this.exitSprite, () => {
      if (!this.gameOver) {
        this.gameOver = true;
        this.showWin();
      }
    });
  }

  createRobotTextures() {
    // Create blue-eyed robot texture
    const blueRT = this.textures.createCanvas('robotBlue', TILE_SIZE, TILE_SIZE);
    const blueCtx = blueRT.getContext();
    this.drawPixelRobot(blueCtx, TILE_SIZE, 0x0066ff);
    blueRT.refresh();

    // Create red-eyed robot texture
    const redRT = this.textures.createCanvas('robotRed', TILE_SIZE, TILE_SIZE);
    const redCtx = redRT.getContext();
    this.drawPixelRobot(redCtx, TILE_SIZE, 0xff0000);
    redRT.refresh();
  }

  drawPixelRobot(ctx, size, eyeColor) {
    const s = size * 0.95;
    const offsetX = size / 2;
    const offsetY = size / 2; // centered vertically
    const pixelSize = Math.floor(s / 14); // smaller pixel blocks for full fit

    // Helper to draw pixel blocks
    const drawPixel = (x, y, color, w = 1, h = 1) => {
      ctx.fillStyle = color;
      ctx.fillRect(offsetX + (x - 7) * pixelSize, offsetY + (y - 7) * pixelSize, w * pixelSize, h * pixelSize);
    };

    // Helmet/Head (white) - rounded top
    const white = '#f5f5f5';
    const black = '#000000';
    const gray = '#9e9e9e';
    const darkGray = '#616161';
    
    // Top of helmet
    drawPixel(-2, -6, black, 4, 1);
    drawPixel(-3, -5, black, 6, 1);
    drawPixel(-3, -4, white, 6, 3);
    
    // Helmet outline
    drawPixel(-4, -4, black, 1, 3);
    drawPixel(3, -4, black, 1, 3);
    drawPixel(-3, -1, black, 6, 1);
    
    // Visor (eye strip)
    const eyeColorHex = '#' + eyeColor.toString(16).padStart(6, '0');
    drawPixel(-2, -3, eyeColorHex, 4, 1);
    drawPixel(-3, -3, black, 1, 1);
    drawPixel(2, -3, black, 1, 1);
    
    // Antenna/ears
    drawPixel(-4, -6, darkGray, 1, 2);
    drawPixel(3, -6, darkGray, 1, 2);
    
    // Body (gray metallic)
    drawPixel(-2, 0, gray, 4, 3);
    drawPixel(-3, 0, black, 1, 3);
    drawPixel(2, 0, black, 1, 3);
    drawPixel(-2, 3, black, 4, 1);
    
    // Chest detail (yellow panel)
    drawPixel(-1, 1, '#ffeb3b', 2, 1);
    
    // Arms
    drawPixel(-4, 0, darkGray, 1, 2);
    drawPixel(-3, 2, darkGray, 1, 1);
    drawPixel(3, 0, darkGray, 1, 2);
    drawPixel(2, 2, darkGray, 1, 1);
    
    // Legs
    drawPixel(-1, 4, darkGray, 1, 2);
    drawPixel(0, 4, darkGray, 1, 2);
    
    // Feet
    drawPixel(-1, 6, black, 1, 1);
    drawPixel(0, 6, black, 1, 1);
  }

  drawGrid() {
    this.gfx.clear();
    for (let y = 0; y < GRID_H; y++) {
      for (let x = 0; x < GRID_W; x++) {
        const px = x * TILE_SIZE, py = y * TILE_SIZE;
        if (this.grid[y][x] === 1) {
          // beveled wall block
          const base = 0x1fb6aa; // teal
          const dark = 0x0e7c75;
          const light = 0x3be0d4;
          this.gfx.fillStyle(base, 1);
          this.gfx.fillRoundedRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4, 8);
          // top highlight
          this.gfx.fillStyle(light, 1);
          this.gfx.fillRect(px + 4, py + 4, TILE_SIZE - 8, 8);
          // left shadow
          this.gfx.fillStyle(dark, 1);
          this.gfx.fillRect(px + 4, py + 12, 6, TILE_SIZE - 16);
        } else {
          // floor with subtle gradient stripe
          const floor = 0xB0BEC5;
          this.gfx.fillStyle(floor, 1);
          this.gfx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          this.gfx.fillStyle(0x98a6ad, 0.4);
          this.gfx.fillRect(px, py + TILE_SIZE - 6, TILE_SIZE, 3);
        }
      }
    }
  }

  createExitSprite() {
    const exitSize = TILE_SIZE * 0.9;
    const exitRT = this.textures.createCanvas('exitDoor', TILE_SIZE, TILE_SIZE);
    const ctx = exitRT.getContext();
    
    // Draw exit door (green glowing door)
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(TILE_SIZE * 0.1, TILE_SIZE * 0.05, TILE_SIZE * 0.8, TILE_SIZE * 0.9);
    ctx.strokeStyle = '#00cc00';
    ctx.lineWidth = 3;
    ctx.strokeRect(TILE_SIZE * 0.1, TILE_SIZE * 0.05, TILE_SIZE * 0.8, TILE_SIZE * 0.9);
    
    // Door handle
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(TILE_SIZE * 0.7, TILE_SIZE * 0.5, TILE_SIZE * 0.08, TILE_SIZE * 0.12);
    
    // Glow effect
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.fillRect(TILE_SIZE * 0.05, 0, TILE_SIZE * 0.9, TILE_SIZE);
    
    exitRT.refresh();
    
    this.exitSprite = this.physics.add.staticImage(
      this.exitCell.x * TILE_SIZE + TILE_SIZE / 2,
      this.exitCell.y * TILE_SIZE + TILE_SIZE / 2,
      'exitDoor'
    );
  }

  snapToCell(obj, cell) {
    obj.x = cell.x * TILE_SIZE + TILE_SIZE / 2;
    obj.y = cell.y * TILE_SIZE + TILE_SIZE / 2;
  }

  cellIsWalkable(x, y) {
    return y >= 0 && y < GRID_H && x >= 0 && x < GRID_W && this.grid[y][x] === 0;
  }

  tryMove(entityCell, dx, dy) {
    const nx = entityCell.x + dx;
    const ny = entityCell.y + dy;
    if (this.cellIsWalkable(nx, ny)) {
      entityCell.x = nx; entityCell.y = ny;
      return true;
    }
    return false;
  }

  updateEnemyPath() {
    const path = Pathfinding.findPath(this.grid, this.enemyCell, this.playerCell);
    if (path && path.length > 1) {
      // first step is current cell, second is next
      const next = path[1];
      this.enemyCell.x = next.x;
      this.enemyCell.y = next.y;
      this.snapToCell(this.enemy, this.enemyCell);
    }
    // check catch
    if (this.enemyCell.x === this.playerCell.x && this.enemyCell.y === this.playerCell.y) {
      this.gameOver = true;
      this.showCaught();
    }
  }

  showCaught() {
    const txt = this.add.text(GRID_W * TILE_SIZE / 2, GRID_H * TILE_SIZE / 2 - 80, 'Tertangkap!', {
      fontFamily: 'Arial', fontSize: 28, color: '#ff0000', backgroundColor: '#000000', padding: { x: 15, y: 10 }, align: 'center'
    }).setOrigin(0.5);
    
    const restartBtn = this.createButton(GRID_W * TILE_SIZE / 2, GRID_H * TILE_SIZE / 2 + 20, 'RESTART LEVEL', () => {
      this.cleanupAndRestart();
    });
    
    const menuBtn = this.createButton(GRID_W * TILE_SIZE / 2, GRID_H * TILE_SIZE / 2 + 90, 'KEMBALI KE MENU', () => {
      this.cleanupAndGoToMenu();
    });
  }

  showWin() {
    const nextLevel = this.currentLevel + 1;
    
    // Unlock next level
    if (nextLevel + 1 > GameState.unlockedLevels && nextLevel < LEVELS.length) {
      GameState.unlockedLevels = nextLevel + 1;
    }
    
    let message = '';
    let isLastLevel = false;
    
    if (nextLevel >= LEVELS.length) {
      message = 'Selamat! Semua level selesai!';
      isLastLevel = true;
    } else {
      message = 'Level ' + (this.currentLevel + 1) + ' Selesai!\nLevel ' + (nextLevel + 1) + ' terbuka!';
    }
    
    const txt = this.add.text(GRID_W * TILE_SIZE / 2, GRID_H * TILE_SIZE / 2 - 80, message, {
      fontFamily: 'Arial', fontSize: 22, color: '#00ff00', backgroundColor: '#000000', padding: { x: 15, y: 10 }, align: 'center'
    }).setOrigin(0.5);
    
    // Create buttons
    if (isLastLevel) {
      const menuBtn = this.createButton(GRID_W * TILE_SIZE / 2, GRID_H * TILE_SIZE / 2 + 20, 'KEMBALI KE MENU', () => {
        this.cleanupAndGoToMenu();
      });
    } else {
      const nextBtn = this.createButton(GRID_W * TILE_SIZE / 2, GRID_H * TILE_SIZE / 2 + 20, 'LEVEL BERIKUTNYA', () => {
        this.cleanupAndRestart(nextLevel);
      });
      
      const menuBtn = this.createButton(GRID_W * TILE_SIZE / 2, GRID_H * TILE_SIZE / 2 + 90, 'KEMBALI KE MENU', () => {
        this.cleanupAndGoToMenu();
      });
    }
  }

  cleanupAndRestart(level) {
    const targetLevel = level !== undefined ? level : this.currentLevel;
    this.gameOver = false;
    this.input.keyboard.removeAllListeners();
    this.scene.restart({ level: targetLevel });
  }

  cleanupAndGoToMenu() {
    this.gameOver = false;
    this.input.keyboard.removeAllListeners();
    this.scene.start('levelSelect');
  }

  createButton(x, y, text, callback) {
    const btn = this.add.text(x, y, text, {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#ffffff',
      backgroundColor: '#1fb6aa',
      padding: { x: 25, y: 12 },
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setInteractive();

    btn.on('pointerover', () => {
      btn.setBackgroundColor('#3be0d4');
      btn.setScale(1.05);
    });

    btn.on('pointerout', () => {
      btn.setBackgroundColor('#1fb6aa');
      btn.setScale(1);
    });

    btn.on('pointerdown', callback);

    return btn;
  }

  update(time, delta) {
    if (this.gameOver) return;
    
    this.moveCooldown -= delta;
    if (this.moveCooldown <= 0) {
      let dx = 0, dy = 0;
      if (this.cursors.left.isDown || this.keys.A.isDown) dx = -1;
      else if (this.cursors.right.isDown || this.keys.D.isDown) dx = 1;
      else if (this.cursors.up.isDown || this.keys.W.isDown) dy = -1;
      else if (this.cursors.down.isDown || this.keys.S.isDown) dy = 1;

      if (dx !== 0 || dy !== 0) {
        if (this.tryMove(this.playerCell, dx, dy)) {
          this.snapToCell(this.player, this.playerCell);
          this.moveCooldown = 120; // ms
        }
      }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GRID_W * TILE_SIZE,
    height: GRID_H * TILE_SIZE
  },
  backgroundColor: '#10151a',
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [MainMenuScene, LevelSelectScene, OptionsScene, MazeScene]
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});
