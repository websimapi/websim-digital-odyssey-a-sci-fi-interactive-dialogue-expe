import { dialogue } from './dialogueData.js';
import { speakText } from './speechController.js';

let currentDialogueIndex = 0;
let isPaused = false;
const startButton = document.getElementById('startButton');
const audioPlayer = document.getElementById('backgroundMusic');

export async function startScene() {
  isPaused = false;
  startButton.style.display = 'none';
  audioPlayer.play();
  audioPlayer.volume = 0.3;
  currentDialogueIndex = 0;
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  for (const line of dialogue) {
    if (isPaused) break;
    updateSceneText(line.text);
    await speakText(line.text, line.voice, line.pitch, line.rate);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  if (!isPaused) {
    const fadeOut = setInterval(() => {
      if (audioPlayer.volume > 0.02) {
        audioPlayer.volume -= 0.02;
      } else {
        audioPlayer.pause();
        clearInterval(fadeOut);
      }
    }, 100);
  }
}

export function pauseScene() {
  isPaused = true;
  window.speechSynthesis.cancel();
  audioPlayer.pause();
  startButton.style.display = 'flex';
  document.querySelector('.character-portrait').style.opacity = '0';
  document.querySelector('.father-portrait').style.opacity = '0';
}

function updateSceneText(text) {
  const dialogueText = document.getElementById('dialogueText');
  dialogueText.textContent = text;
  
  const novaPortrait = document.querySelector('.character-portrait');
  const fatherPortrait = document.querySelector('.father-portrait');
  
  const currentLine = dialogue[currentDialogueIndex];
  if (currentLine.voice === 'female') {
    novaPortrait.style.opacity = '1';
    fatherPortrait.style.opacity = '0';
    dialogueText.className = 'nova-text';
  } else {
    novaPortrait.style.opacity = '0'; 
    fatherPortrait.style.opacity = '1';
    dialogueText.className = 'father-text';
  }
  
  currentDialogueIndex++;
}