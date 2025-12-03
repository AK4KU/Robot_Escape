// Global game state
window.GameState = {
  unlockedLevels: 1,
  musicVolume: 0.5,
  sfxVolume: 0.5
};

// Game configuration
const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 880,
    height: 640
  },
  backgroundColor: '#10151a',
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [
    MainMenuScene,
    LevelSelectScene,
    OptionsScene,
    Level1Scene,
    Level2Scene,
    Level3Scene,
    Level4Scene,
    Level5Scene
  ]
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});
