const synth = window.speechSynthesis;

export function speakText(text, voiceType, pitch, rate) {
  return new Promise(resolve => {
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