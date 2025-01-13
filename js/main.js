import { initThreeJS, onWindowResize } from './spaceScene.js';
import { startScene, pauseScene } from './dialogueController.js';

const startButton = document.getElementById('startButton');

startButton.addEventListener('click', startScene);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    pauseScene();
  }
});

document.addEventListener('DOMContentLoaded', initThreeJS);
window.addEventListener('resize', onWindowResize);