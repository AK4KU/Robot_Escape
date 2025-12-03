// Main Menu Scene
class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('mainMenu');
  }

  preload() {
    this.load.image('background', 'Asset/Gemini_Generated_Image_hjbl1khjbl1khjbl.png');
    this.load.audio('menuMusic', 'bgm/Main_Menu.mp3');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Play menu music
    const existingMusic = this.sound.get('menuMusic');
    if (existingMusic) {
      existingMusic.stop();
      existingMusic.destroy();
    }
    this.menuMusic = this.sound.add('menuMusic', { loop: true, volume: window.GameState.musicVolume });
    this.menuMusic.play();

    // Background image
    const bg = this.add.image(centerX, centerY, 'background');
    bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Title

    // Start button
    this.createButton(centerX, centerY - 50, 'START', () => {
      if (this.menuMusic) {
        this.menuMusic.stop();
        this.menuMusic.destroy();
      }
      this.scene.start('levelSelect');
    });

    // Options button
    this.createButton(centerX, centerY + 50, 'OPTIONS', () => {
      if (this.menuMusic) {
        this.menuMusic.stop();
        this.menuMusic.destroy();
      }
      this.scene.start('options');
    });

    // Exit button
    this.createButton(centerX, centerY + 150, 'KELUAR', () => {
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
