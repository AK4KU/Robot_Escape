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
    this.musicText = this.add.text(centerX + 150, centerY - 80, Math.floor(window.GameState.musicVolume * 100) + '%', {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#1fb6aa'
    });

    // Music volume buttons
    this.createButton(centerX + 220, centerY - 80, '+', () => {
      window.GameState.musicVolume = Math.min(1, window.GameState.musicVolume + 0.1);
      this.musicText.setText(Math.floor(window.GameState.musicVolume * 100) + '%');
      this.updateAllMusicVolume();
    }, 40, 40);

    this.createButton(centerX + 80, centerY - 80, '-', () => {
      window.GameState.musicVolume = Math.max(0, window.GameState.musicVolume - 0.1);
      this.musicText.setText(Math.floor(window.GameState.musicVolume * 100) + '%');
      this.updateAllMusicVolume();
    }, 40, 40);

    // SFX volume
    this.add.text(centerX - 200, centerY, 'Volume SFX:', {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#ffffff'
    });
    this.sfxText = this.add.text(centerX + 150, centerY, Math.floor(window.GameState.sfxVolume * 100) + '%', {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#1fb6aa'
    });

    // SFX volume buttons
    this.createButton(centerX + 220, centerY, '+', () => {
      window.GameState.sfxVolume = Math.min(1, window.GameState.sfxVolume + 0.1);
      this.sfxText.setText(Math.floor(window.GameState.sfxVolume * 100) + '%');
    }, 40, 40);

    this.createButton(centerX + 80, centerY, '-', () => {
      window.GameState.sfxVolume = Math.max(0, window.GameState.sfxVolume - 0.1);
      this.sfxText.setText(Math.floor(window.GameState.sfxVolume * 100) + '%');
    }, 40, 40);

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
      window.GameState.unlockedLevels = 1;
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

  updateAllMusicVolume() {
    // Update all active music in the game
    this.sound.sounds.forEach(sound => {
      if (sound.key === 'menuMusic' || sound.key === 'gameplayMusic') {
        sound.setVolume(window.GameState.musicVolume);
      }
    });
  }

  createButton(x, y, text, callback, width = 200, height = 50) {
    const btn = this.add.text(x, y, text, {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#ffffff',
      backgroundColor: '#1fb6aa',
      padding: { x: width / 5, y: height / 5 },
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
}
