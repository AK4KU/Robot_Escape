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
      const isUnlocked = levelNum <= window.GameState.unlockedLevels;

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
    backBtn.on('pointerdown', () => {
      this.scene.start('mainMenu');
    });
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
        this.scene.start('level' + levelNum);
      });
    }

    return btn;
  }
}
