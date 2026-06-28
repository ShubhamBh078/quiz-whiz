export const soundCorrect = new Audio('/sounds/correctanswer.mp3');
export const soundWrong = new Audio('/sounds/wronganswer.wav');
export const soundTick = new Audio('/sounds/normalcounter.mp3');
export const endtimeTick = new Audio('/sounds/endtimecounter.mp3');

soundCorrect.volume = 0.3;
soundWrong.volume = 0.15;
soundTick.volume = 0.2;
endtimeTick.volume = 0.4;

export let isMuted = false;

export function toggleMute(muteBtn) {
    isMuted = !isMuted;
    
    // Update the button UI
    muteBtn.innerText = isMuted ? "🔇" : "🔊";
    muteBtn.classList.toggle('bg-red-950/40', isMuted);
    muteBtn.classList.toggle('border-red-500/40', isMuted);

    // 🛑 CRITICAL FIX: Instantly stop any currently playing sounds
    if (isMuted) {
        soundTick.pause();
        endtimeTick.pause();
        soundCorrect.pause();
        soundWrong.pause();
    }
}

export function playSound(soundAsset) {
    if (!isMuted) {
        soundAsset.currentTime = 0;
        soundAsset.play().catch(e => console.log("Audio target blocked: ", e));
    }
}