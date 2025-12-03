// Base Level Scene - Template for all levels
class BaseLevelScene extends Phaser.Scene {
  constructor(key, levelIndex, grid) {
    super(key);
    this.levelIndex = levelIndex;
    this.levelGrid = grid;
  }

  preload() {
    this.load.audio('gameplayMusic', 'bgm/Gameplay.mp3');
  }

  create() {
    this.TILE_SIZE = 40;
    this.GRID_W = 22;
    this.GRID_H = 16;
    this.grid = this.levelGrid;
    this.gameOver = false;

    // Play gameplay music
    const existingMusic = this.sound.get('gameplayMusic');
    if (existingMusic) {
      existingMusic.stop();
      existingMusic.destroy();
    }
    this.gameplayMusic = this.sound.add('gameplayMusic', { loop: true, volume: window.GameState.musicVolume });
    this.gameplayMusic.play();

    // draw tiles
    this.gfx = this.add.graphics();
    this.drawGrid();

    // physics world
    this.physics.world.setBounds(0, 0, this.GRID_W * this.TILE_SIZE, this.GRID_H * this.TILE_SIZE);

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
    this.enemyCell = { x: this.GRID_W - 2, y: 1 };
    this.snapToCell(this.player, this.playerCell);
    this.snapToCell(this.enemy, this.enemyCell);

    // keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D');

    // movement control
    this.moveCooldown = 0;

    // exit/goal
    this.exitCell = { x: this.GRID_W - 2, y: this.GRID_H - 2 };
    this.createExitSprite();

    // enemy path update timer
    this.time.addEvent({ delay: 250, loop: true, callback: () => this.updateEnemyPath() });

    // check win condition
    this.statusText = this.add.text(8, 8, 'Level ' + (this.levelIndex + 1) + ' - Temukan pintu keluar!', { 
      fontFamily: 'Arial', fontSize: 18, color: '#ffffff' 
    });
    
    this.physics.add.overlap(this.player, this.exitSprite, () => {
      if (!this.gameOver) {
        this.gameOver = true;
        this.showWin();
      }
    });
  }

  createRobotTextures() {
    if (!this.textures.exists('robotBlue')) {
      const blueRT = this.textures.createCanvas('robotBlue', this.TILE_SIZE, this.TILE_SIZE);
      const blueCtx = blueRT.getContext();
      this.drawPixelRobot(blueCtx, this.TILE_SIZE, 0x0066ff);
      blueRT.refresh();
    }

    if (!this.textures.exists('robotRed')) {
      const redRT = this.textures.createCanvas('robotRed', this.TILE_SIZE, this.TILE_SIZE);
      const redCtx = redRT.getContext();
      this.drawPixelRobot(redCtx, this.TILE_SIZE, 0xff0000);
      redRT.refresh();
    }
  }

  drawPixelRobot(ctx, size, eyeColor) {
    const s = size * 0.95;
    const offsetX = size / 2;
    const offsetY = size / 2;
    const pixelSize = Math.floor(s / 14);

    const drawPixel = (x, y, color, w = 1, h = 1) => {
      ctx.fillStyle = color;
      ctx.fillRect(offsetX + (x - 7) * pixelSize, offsetY + (y - 7) * pixelSize, w * pixelSize, h * pixelSize);
    };

    const white = '#f5f5f5';
    const black = '#000000';
    const gray = '#9e9e9e';
    const darkGray = '#616161';
    
    drawPixel(-2, -6, black, 4, 1);
    drawPixel(-3, -5, black, 6, 1);
    drawPixel(-3, -4, white, 6, 3);
    drawPixel(-4, -4, black, 1, 3);
    drawPixel(3, -4, black, 1, 3);
    drawPixel(-3, -1, black, 6, 1);
    
    const eyeColorHex = '#' + eyeColor.toString(16).padStart(6, '0');
    drawPixel(-2, -3, eyeColorHex, 4, 1);
    drawPixel(-3, -3, black, 1, 1);
    drawPixel(2, -3, black, 1, 1);
    
    drawPixel(-4, -6, darkGray, 1, 2);
    drawPixel(3, -6, darkGray, 1, 2);
    
    drawPixel(-2, 0, gray, 4, 3);
    drawPixel(-3, 0, black, 1, 3);
    drawPixel(2, 0, black, 1, 3);
    drawPixel(-2, 3, black, 4, 1);
    
    drawPixel(-1, 1, '#ffeb3b', 2, 1);
    
    drawPixel(-4, 0, darkGray, 1, 2);
    drawPixel(-3, 2, darkGray, 1, 1);
    drawPixel(3, 0, darkGray, 1, 2);
    drawPixel(2, 2, darkGray, 1, 1);
    
    drawPixel(-1, 4, darkGray, 1, 2);
    drawPixel(0, 4, darkGray, 1, 2);
    
    drawPixel(-1, 6, black, 1, 1);
    drawPixel(0, 6, black, 1, 1);
  }

  drawGrid() {
    this.gfx.clear();
    for (let y = 0; y < this.GRID_H; y++) {
      for (let x = 0; x < this.GRID_W; x++) {
        const px = x * this.TILE_SIZE, py = y * this.TILE_SIZE;
        if (this.grid[y][x] === 1) {
          const base = 0x1fb6aa;
          const dark = 0x0e7c75;
          const light = 0x3be0d4;
          this.gfx.fillStyle(base, 1);
          this.gfx.fillRoundedRect(px + 2, py + 2, this.TILE_SIZE - 4, this.TILE_SIZE - 4, 8);
          this.gfx.fillStyle(light, 1);
          this.gfx.fillRect(px + 4, py + 4, this.TILE_SIZE - 8, 8);
          this.gfx.fillStyle(dark, 1);
          this.gfx.fillRect(px + 4, py + 12, 6, this.TILE_SIZE - 16);
        } else {
          const floor = 0xB0BEC5;
          this.gfx.fillStyle(floor, 1);
          this.gfx.fillRect(px, py, this.TILE_SIZE, this.TILE_SIZE);
          this.gfx.fillStyle(0x98a6ad, 0.4);
          this.gfx.fillRect(px, py + this.TILE_SIZE - 6, this.TILE_SIZE, 3);
        }
      }
    }
  }

  createExitSprite() {
    const exitSize = this.TILE_SIZE * 0.9;
    
    if (!this.textures.exists('exitDoor')) {
      const exitRT = this.textures.createCanvas('exitDoor', this.TILE_SIZE, this.TILE_SIZE);
      const ctx = exitRT.getContext();
      
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(this.TILE_SIZE * 0.1, this.TILE_SIZE * 0.05, this.TILE_SIZE * 0.8, this.TILE_SIZE * 0.9);
      ctx.strokeStyle = '#00cc00';
      ctx.lineWidth = 3;
      ctx.strokeRect(this.TILE_SIZE * 0.1, this.TILE_SIZE * 0.05, this.TILE_SIZE * 0.8, this.TILE_SIZE * 0.9);
      
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(this.TILE_SIZE * 0.7, this.TILE_SIZE * 0.5, this.TILE_SIZE * 0.08, this.TILE_SIZE * 0.12);
      
      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.fillRect(this.TILE_SIZE * 0.05, 0, this.TILE_SIZE * 0.9, this.TILE_SIZE);
      
      exitRT.refresh();
    }
    
    this.exitSprite = this.physics.add.staticImage(
      this.exitCell.x * this.TILE_SIZE + this.TILE_SIZE / 2,
      this.exitCell.y * this.TILE_SIZE + this.TILE_SIZE / 2,
      'exitDoor'
    );
  }

  snapToCell(obj, cell) {
    obj.x = cell.x * this.TILE_SIZE + this.TILE_SIZE / 2;
    obj.y = cell.y * this.TILE_SIZE + this.TILE_SIZE / 2;
  }

  cellIsWalkable(x, y) {
    return y >= 0 && y < this.GRID_H && x >= 0 && x < this.GRID_W && this.grid[y][x] === 0;
  }

  tryMove(entityCell, dx, dy) {
    const nx = entityCell.x + dx;
    const ny = entityCell.y + dy;
    if (this.cellIsWalkable(nx, ny)) {
      entityCell.x = nx; 
      entityCell.y = ny;
      return true;
    }
    return false;
  }

  updateEnemyPath() {
    if (this.gameOver) return;
    
    const path = Pathfinding.findPath(this.grid, this.enemyCell, this.playerCell);
    if (path && path.length > 1) {
      const next = path[1];
      this.enemyCell.x = next.x;
      this.enemyCell.y = next.y;
      this.snapToCell(this.enemy, this.enemyCell);
    }
    
    if (this.enemyCell.x === this.playerCell.x && this.enemyCell.y === this.playerCell.y) {
      this.gameOver = true;
      this.showCaught();
    }
  }

  showCaught() {
    this.add.text(this.GRID_W * this.TILE_SIZE / 2, this.GRID_H * this.TILE_SIZE / 2 - 80, 'Tertangkap!', {
      fontFamily: 'Arial', fontSize: 28, color: '#ff0000', backgroundColor: '#000000', padding: { x: 15, y: 10 }
    }).setOrigin(0.5);
    
    this.createButton(this.GRID_W * this.TILE_SIZE / 2, this.GRID_H * this.TILE_SIZE / 2 + 20, 'RESTART LEVEL', () => {
      this.scene.restart();
    });
    
    this.createButton(this.GRID_W * this.TILE_SIZE / 2, this.GRID_H * this.TILE_SIZE / 2 + 90, 'KEMBALI KE MENU', () => {
      if (this.gameplayMusic) {
        this.gameplayMusic.stop();
        this.gameplayMusic.destroy();
      }
      this.scene.start('levelSelect');
    });
  }

  showWin() {
    const nextLevel = this.levelIndex + 1;
    
    if (nextLevel + 1 > window.GameState.unlockedLevels && nextLevel < 5) {
      window.GameState.unlockedLevels = nextLevel + 1;
    }
    
    let message = '';
    const isLastLevel = nextLevel >= 5;
    
    if (isLastLevel) {
      message = 'Selamat! Semua level selesai!';
    } else {
      message = 'Level ' + (this.levelIndex + 1) + ' Selesai!\nLevel ' + (nextLevel + 1) + ' terbuka!';
    }
    
    this.add.text(this.GRID_W * this.TILE_SIZE / 2, this.GRID_H * this.TILE_SIZE / 2 - 80, message, {
      fontFamily: 'Arial', fontSize: 22, color: '#00ff00', backgroundColor: '#000000', padding: { x: 15, y: 10 }, align: 'center'
    }).setOrigin(0.5);
    
    if (isLastLevel) {
      this.createButton(this.GRID_W * this.TILE_SIZE / 2, this.GRID_H * this.TILE_SIZE / 2 + 20, 'KEMBALI KE MENU', () => {
        if (this.gameplayMusic) {
          this.gameplayMusic.stop();
          this.gameplayMusic.destroy();
        }
        this.scene.start('levelSelect');
      });
    } else {
      this.createButton(this.GRID_W * this.TILE_SIZE / 2, this.GRID_H * this.TILE_SIZE / 2 + 20, 'LEVEL BERIKUTNYA', () => {
        this.scene.start('level' + (nextLevel + 1));
      });
      
      this.createButton(this.GRID_W * this.TILE_SIZE / 2, this.GRID_H * this.TILE_SIZE / 2 + 90, 'KEMBALI KE MENU', () => {
        if (this.gameplayMusic) {
          this.gameplayMusic.stop();
          this.gameplayMusic.destroy();
        }
        this.scene.start('levelSelect');
      });
    }
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
          this.moveCooldown = 120;
        }
      }
    }
  }
}
