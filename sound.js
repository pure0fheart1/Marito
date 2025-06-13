// Sound system for the Mario game
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.currentMusic = null;
        this.muted = false;
        
        this.initAudioContext();
        this.createSounds();
    }
    
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.audioContext = null;
        }
    }
    
    createSounds() {
        if (!this.audioContext) return;
        
        this.sounds = {
            jump: () => this.createJumpSound(),
            coin: () => this.createCoinSound(),
            powerup: () => this.createPowerUpSound(),
            enemyHit: () => this.createEnemyHitSound(),
            enemyDeath: () => this.createEnemyDeathSound(),
            breakBlock: () => this.createBreakBlockSound(),
            fireball: () => this.createFireballSound(),
            oneUp: () => this.createOneUpSound(),
            gameover: () => this.createGameOverSound(),
            levelComplete: () => this.createLevelCompleteSound(),
            star: () => this.createStarSound()
        };
    }
    
    createTone(frequency, duration, type = 'square', volume = 0.1) {
        if (!this.audioContext || this.muted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(volume * this.sfxVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
        
        return { oscillator, gainNode };
    }
    
    createJumpSound() {
        this.createTone(440, 0.1, 'square', 0.2);
        setTimeout(() => {
            this.createTone(660, 0.1, 'square', 0.15);
        }, 50);
    }
    
    createCoinSound() {
        this.createTone(988, 0.1, 'square', 0.3);
        setTimeout(() => {
            this.createTone(1319, 0.2, 'square', 0.2);
        }, 100);
    }
    
    createPowerUpSound() {
        const frequencies = [262, 330, 392, 523, 659, 784, 1047];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createTone(freq, 0.1, 'square', 0.2);
            }, index * 50);
        });
    }
    
    createEnemyHitSound() {
        this.createTone(220, 0.1, 'sawtooth', 0.3);
        setTimeout(() => {
            this.createTone(165, 0.2, 'sawtooth', 0.2);
        }, 100);
    }
    
    createEnemyDeathSound() {
        this.createTone(330, 0.1, 'square', 0.3);
        setTimeout(() => {
            this.createTone(262, 0.1, 'square', 0.25);
        }, 100);
        setTimeout(() => {
            this.createTone(196, 0.2, 'square', 0.2);
        }, 200);
    }
    
    createBreakBlockSound() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createTone(Utils.random(200, 400), 0.05, 'sawtooth', 0.2);
            }, i * 20);
        }
    }
    
    createFireballSound() {
        this.createTone(150, 0.15, 'sawtooth', 0.25);
        setTimeout(() => {
            this.createTone(100, 0.1, 'sawtooth', 0.2);
        }, 75);
    }
    
    createOneUpSound() {
        const melody = [262, 330, 392, 523, 659, 784, 1047, 1319];
        melody.forEach((freq, index) => {
            setTimeout(() => {
                this.createTone(freq, 0.15, 'square', 0.3);
            }, index * 100);
        });
    }
    
    createGameOverSound() {
        const melody = [523, 494, 466, 440, 415, 392, 370, 349];
        melody.forEach((freq, index) => {
            setTimeout(() => {
                this.createTone(freq, 0.3, 'triangle', 0.4);
            }, index * 200);
        });
    }
    
    createLevelCompleteSound() {
        const melody = [392, 523, 659, 784, 1047, 784, 1047];
        melody.forEach((freq, index) => {
            setTimeout(() => {
                this.createTone(freq, 0.2, 'square', 0.3);
            }, index * 150);
        });
    }
    
    createStarSound() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createTone(440 + i * 110, 0.05, 'sine', 0.2);
            }, i * 25);
        }
    }
    
    playBackgroundMusic(theme) {
        if (!this.audioContext || this.muted) return;
        
        this.stopMusic();
        
        switch (theme) {
            case 'overworld':
                this.playOverworldMusic();
                break;
            case 'underground':
                this.playUndergroundMusic();
                break;
            case 'castle':
                this.playCastleMusic();
                break;
        }
    }
    
    playOverworldMusic() {
        const melody = [
            659, 659, 0, 659, 0, 523, 659, 0, 784, 0, 0, 0, 392, 0, 0, 0,
            523, 0, 0, 392, 0, 0, 330, 0, 0, 440, 0, 494, 0, 466, 440, 0
        ];
        
        const playNote = (index) => {
            if (index >= melody.length) {
                setTimeout(() => this.playOverworldMusic(), 1000);
                return;
            }
            
            const freq = melody[index];
            if (freq > 0) {
                this.createTone(freq, 0.2, 'square', 0.1);
            }
            
            setTimeout(() => playNote(index + 1), 200);
        };
        
        playNote(0);
    }
    
    playUndergroundMusic() {
        const melody = [
            262, 0, 262, 0, 262, 0, 208, 0, 262, 0, 330, 0, 392, 0, 0, 0
        ];
        
        const playNote = (index) => {
            if (index >= melody.length) {
                setTimeout(() => this.playUndergroundMusic(), 500);
                return;
            }
            
            const freq = melody[index];
            if (freq > 0) {
                this.createTone(freq, 0.3, 'triangle', 0.08);
            }
            
            setTimeout(() => playNote(index + 1), 300);
        };
        
        playNote(0);
    }
    
    playCastleMusic() {
        const melody = [
            330, 0, 330, 0, 330, 0, 262, 0, 330, 0, 392, 0, 330, 0, 262, 0
        ];
        
        const playNote = (index) => {
            if (index >= melody.length) {
                setTimeout(() => this.playCastleMusic(), 800);
                return;
            }
            
            const freq = melody[index];
            if (freq > 0) {
                this.createTone(freq, 0.4, 'sawtooth', 0.06);
            }
            
            setTimeout(() => playNote(index + 1), 400);
        };
        
        playNote(0);
    }
    
    stopMusic() {
        this.currentMusic = null;
    }
    
    playSound(soundName) {
        if (this.sounds[soundName] && !this.muted) {
            this.sounds[soundName]();
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Utils.clamp(volume, 0, 1);
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Utils.clamp(volume, 0, 1);
    }
    
    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopMusic();
        }
        return this.muted;
    }
    
    isMuted() {
        return this.muted;
    }
    
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}