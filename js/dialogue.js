const startButton = document.getElementById('startButton');
const audioPlayer = document.getElementById('backgroundMusic');
let currentDialogueIndex = 0;
const synth = window.speechSynthesis;
let isPaused = false;

const dialogue = [
  { text: "Father, why do the stars look different today? They seem... closer somehow.", voice: "female", pitch: 1.2, rate: 0.9 },
  { text: "The ship has entered a new sector, my dear. We're approaching the Centauri Belt.", voice: "male", pitch: 0.8, rate: 0.8 },
  { text: "Will we ever dock somewhere? I've read about the space stations in the old books, with their gardens and markets...", voice: "female", pitch: 1.2, rate: 0.9 },
  { text: "The outside world is dangerous, Nova. Everything you need is here within our ship. I've designed it that way.", voice: "male", pitch: 0.7, rate: 0.8 },
  { text: "But I'm sixteen now. Surely I could at least visit the observation deck on Level 7? You've never let me go above Level 3.", voice: "female", pitch: 1.2, rate: 1 },
  { text: "The upper levels aren't safe for you. Trust in my judgment, as I've trusted you with the knowledge of our stars.", voice: "male", pitch: 0.7, rate: 0.8 },
  { text: "Your hand... it feels colder than usual.", voice: "female", pitch: 1.1, rate: 0.8 },
  { text: "Perhaps you should rest, Nova. You've been studying the star charts for hours.", voice: "male", pitch: 0.6, rate: 0.7 },
  { text: "I'm not tired. And you're avoiding my question about Level 7 again.", voice: "female", pitch: 1.2, rate: 1.1 },
  { text: "Nova. Return to your quarters. That's an order.", voice: "male", pitch: 0.5, rate: 0.6 }
];

function speakText(text, voiceType, pitch, rate) {
  return new Promise(resolve => {
    if (isPaused) {
      resolve();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = pitch;
    utterance.rate = rate;
    
    const voices = synth.getVoices();
    const voice = voices.find(v => 
      voiceType === 'female' ? v.name.includes('Female') : v.name.includes('Male')
    ) || voices[0];
    utterance.voice = voice;
    
    utterance.onend = resolve;
    synth.speak(utterance);
  });
}

function updateSceneText(text) {
  const dialogueText = document.getElementById('dialogueText');
  dialogueText.textContent = text;
  
  const novaPortrait = document.querySelector('.character-portrait');
  const fatherPortrait = document.querySelector('.father-portrait');
  
  const currentLine = dialogue[currentDialogueIndex - 1];
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
  synth.cancel();
  audioPlayer.pause();
  startButton.style.display = 'flex';
  document.querySelector('.character-portrait').style.opacity = '0';
  document.querySelector('.father-portrait').style.opacity = '0';
}