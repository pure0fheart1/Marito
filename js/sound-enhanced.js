/**
 * Enhanced Sound Effects Library
 * Comprehensive procedurally generated sounds for all game actions
 */

class EnhancedSoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.masterVolume = 1.0;
        this.currentMusic = null;
        this.muted = false;
        this.musicNodes = [];

        this.initAudioContext();
        this.createAllSounds();
    }

    /**
     * Initialize Web Audio API context
     */
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            errorHandler.logError('Sound', new Error('Web Audio API not supported'));
            this.audioContext = null;
        }
    }

    /**
     * Create all sound effects
     */
    createAllSounds() {
        if (!this.audioContext) {
            return;
        }

        this.sounds = {
            // Movement sounds
            jump: () => this.createJumpSound(),
            doubleJump: () => this.createDoubleJumpSound(),
            land: () => this.createLandSound(),
            dash: () => this.createDashSound(),
            groundPound: () => this.createGroundPoundSound(),
            skid: () => this.createSkidSound(),

            // Collection sounds
            coin: () => this.createCoinSound(),
            bigCoin: () => this.createBigCoinSound(),
            powerup: () => this.createPowerUpSound(),
            oneUp: () => this.createOneUpSound(),
            star: () => this.createStarSound(),
            secret: () => this.createSecretSound(),

            // Combat sounds
            enemyHit: () => this.createEnemyHitSound(),
            enemyDeath: () => this.createEnemyDeathSound(),
            fireball: () => this.createFireballSound(),
            fireballHit: () => this.createFireballHitSound(),
            stomp: () => this.createStompSound(),
            shellKick: () => this.createShellKickSound(),

            // Damage sounds
            playerHit: () => this.createPlayerHitSound(),
            playerDeath: () => this.createPlayerDeathSound(),
            loseLife: () => this.createLoseLifeSound(),

            // Block/environment sounds
            breakBlock: () => this.createBreakBlockSound(),
            hitBlock: () => this.createHitBlockSound(),
            pipe: () => this.createPipeSound(),
            spring: () => this.createSpringSound(),
            switch: () => this.createSwitchSound(),

            // UI sounds
            pause: () => this.createPauseSound(),
            unpause: () => this.createUnpauseSound(),
            menuSelect: () => this.createMenuSelectSound(),
            menuConfirm: () => this.createMenuConfirmSound(),
            menuCancel: () => this.createMenuCancelSound(),
            achievementUnlock: () => this.createAchievementUnlockSound(),

            // Level sounds
            levelComplete: () => this.createLevelCompleteSound(),
            levelStart: () => this.createLevelStartSound(),
            gameover: () => this.createGameOverSound(),
            victory: () => this.createVictorySound(),
            warning: () => this.createWarningSound(),
            timeRunningOut: () => this.createTimeRunningOutSound()
        };
    }

    /**
     * Create a tone with envelope
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in seconds
     * @param {string} type - Oscillator type
     * @param {number} volume - Volume (0-1)
     * @param {number} attack - Attack time
     * @param {number} release - Release time
     */
    createTone(frequency, duration, type = 'square', volume = 0.1, attack = 0.01, release = 0.1) {
        if (!this.audioContext || this.muted) {
            return null;
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const now = this.audioContext.currentTime;

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, now);

        // ADSR envelope
        const adjustedVolume = volume * this.sfxVolume * this.masterVolume;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(adjustedVolume, now + attack);
        gainNode.gain.setValueAtTime(adjustedVolume, now + duration - release);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);

        return { oscillator, gainNode };
    }

    /**
     * Create noise sound
     * @param {number} duration - Duration in seconds
     * @param {number} volume - Volume (0-1)
     * @param {string} type - 'white' or 'pink'
     */
    createNoise(duration, volume = 0.1, type = 'white') {
        if (!this.audioContext || this.muted) {
            return null;
        }

        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        if (type === 'white') {
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
        } else if (type === 'pink') {
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                data[i] *= 0.11;
                b6 = white * 0.115926;
            }
        }

        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();

        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        gainNode.gain.setValueAtTime(volume * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);

        source.start(this.audioContext.currentTime);

        return { source, gainNode };
    }

    // Movement Sounds

    createJumpSound() {
        this.createTone(600, 0.12, 'square', 0.15);
        setTimeout(() => this.createTone(800, 0.08, 'square', 0.1), 60);
    }

    createDoubleJumpSound() {
        this.createTone(700, 0.08, 'sine', 0.2);
        setTimeout(() => this.createTone(900, 0.08, 'sine', 0.15), 40);
        setTimeout(() => this.createTone(1100, 0.1, 'sine', 0.12), 80);
    }

    createLandSound() {
        this.createTone(200, 0.06, 'sine', 0.12);
        this.createNoise(0.05, 0.08, 'white');
    }

    createDashSound() {
        this.createNoise(0.15, 0.15, 'white');
        this.createTone(400, 0.1, 'sawtooth', 0.1);
    }

    createGroundPoundSound() {
        this.createTone(80, 0.2, 'sine', 0.3);
        this.createNoise(0.15, 0.25, 'pink');
        setTimeout(() => this.createTone(60, 0.15, 'sine', 0.2), 50);
    }

    createSkidSound() {
        this.createNoise(0.2, 0.1, 'white');
    }

    // Collection Sounds

    createCoinSound() {
        this.createTone(988, 0.08, 'square', 0.25);
        setTimeout(() => this.createTone(1319, 0.15, 'square', 0.18), 80);
    }

    createBigCoinSound() {
        this.createTone(1319, 0.1, 'square', 0.3);
        setTimeout(() => this.createTone(1568, 0.1, 'square', 0.25), 100);
        setTimeout(() => this.createTone(2093, 0.2, 'square', 0.2), 200);
    }

    createPowerUpSound() {
        const frequencies = [262, 330, 392, 523, 659, 784, 1047];
        frequencies.forEach((freq, index) => {
            setTimeout(() => this.createTone(freq, 0.1, 'square', 0.18), index * 45);
        });
    }

    createOneUpSound() {
        const melody = [659, 659, 659, 523, 659, 784];
        melody.forEach((freq, index) => {
            setTimeout(() => this.createTone(freq, 0.15, 'square', 0.2), index * 100);
        });
    }

    createStarSound() {
        const frequencies = [523, 659, 784, 1047, 784, 659, 523];
        frequencies.forEach((freq, index) => {
            setTimeout(() => this.createTone(freq, 0.08, 'sine', 0.15), index * 60);
        });
    }

    createSecretSound() {
        const melody = [784, 988, 1175, 1397, 1568];
        melody.forEach((freq, index) => {
            setTimeout(() => this.createTone(freq, 0.12, 'sine', 0.18), index * 80);
        });
    }

    // Combat Sounds

    createEnemyHitSound() {
        this.createTone(220, 0.1, 'sawtooth', 0.25);
        setTimeout(() => this.createTone(165, 0.15, 'sawtooth', 0.18), 80);
    }

    createEnemyDeathSound() {
        this.createTone(330, 0.08, 'square', 0.25);
        setTimeout(() => this.createTone(262, 0.08, 'square', 0.2), 80);
        setTimeout(() => this.createTone(196, 0.15, 'square', 0.15), 160);
    }

    createFireballSound() {
        this.createTone(150, 0.12, 'sawtooth', 0.15);
        this.createNoise(0.08, 0.08, 'white');
    }

    createFireballHitSound() {
        this.createNoise(0.1, 0.15, 'white');
        this.createTone(300, 0.08, 'square', 0.2);
    }

    createStompSound() {
        this.createTone(250, 0.08, 'square', 0.25);
        this.createNoise(0.06, 0.12, 'pink');
    }

    createShellKickSound() {
        this.createTone(400, 0.1, 'square', 0.2);
        this.createNoise(0.08, 0.1, 'white');
    }

    // Damage Sounds

    createPlayerHitSound() {
        this.createTone(200, 0.15, 'sawtooth', 0.3);
        setTimeout(() => this.createTone(150, 0.2, 'sawtooth', 0.25), 100);
    }

    createPlayerDeathSound() {
        const melody = [330, 294, 262, 220, 196, 165, 147];
        melody.forEach((freq, index) => {
            setTimeout(() => this.createTone(freq, 0.15, 'square', 0.22), index * 120);
        });
    }

    createLoseLifeSound() {
        this.createTone(392, 0.2, 'square', 0.25);
        setTimeout(() => this.createTone(330, 0.3, 'square', 0.2), 150);
    }

    // Block/Environment Sounds

    createBreakBlockSound() {
        this.createNoise(0.15, 0.2, 'white');
        this.createTone(350, 0.1, 'square', 0.2);
    }

    createHitBlockSound() {
        this.createTone(500, 0.08, 'square', 0.18);
        this.createNoise(0.05, 0.1, 'white');
    }

    createPipeSound() {
        this.createTone(523, 0.1, 'sine', 0.2);
        setTimeout(() => this.createTone(392, 0.15, 'sine', 0.18), 100);
        setTimeout(() => this.createTone(330, 0.2, 'sine', 0.15), 250);
    }

    createSpringSound() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createTone(800 + i * 100, 0.05, 'sine', 0.15);
            }, i * 30);
        }
    }

    createSwitchSound() {
        this.createTone(600, 0.06, 'square', 0.2);
        setTimeout(() => this.createTone(900, 0.08, 'square', 0.15), 60);
    }

    // UI Sounds

    createPauseSound() {
        this.createTone(440, 0.1, 'sine', 0.2);
    }

    createUnpauseSound() {
        this.createTone(660, 0.1, 'sine', 0.2);
    }

    createMenuSelectSound() {
        this.createTone(800, 0.05, 'square', 0.15);
    }

    createMenuConfirmSound() {
        this.createTone(1000, 0.08, 'square', 0.2);
        setTimeout(() => this.createTone(1200, 0.1, 'square', 0.15), 80);
    }

    createMenuCancelSound() {
        this.createTone(600, 0.08, 'square', 0.2);
        setTimeout(() => this.createTone(400, 0.1, 'square', 0.15), 80);
    }

    createAchievementUnlockSound() {
        const melody = [659, 784, 1047, 1319, 1568];
        melody.forEach((freq, index) => {
            setTimeout(() => this.createTone(freq, 0.12, 'sine', 0.18), index * 70);
        });
    }

    // Level Sounds

    createLevelCompleteSound() {
        const melody = [392, 523, 659, 784, 1047, 784, 659, 1047];
        melody.forEach((freq, index) => {
            setTimeout(() => this.createTone(freq, 0.15, 'square', 0.2), index * 120);
        });
    }

    createLevelStartSound() {
        const melody = [523, 659, 784];
        melody.forEach((freq, index) => {
            setTimeout(() => this.createTone(freq, 0.15, 'square', 0.22), index * 100);
        });
    }

    createGameOverSound() {
        const melody = [262, 247, 233, 220, 208, 196];
        melody.forEach((freq, index) => {
            setTimeout(() => this.createTone(freq, 0.25, 'sine', 0.25), index * 200);
        });
    }

    createVictorySound() {
        const melody = [523, 523, 523, 415, 466, 523, 466, 523, 659];
        melody.forEach((freq, index) => {
            setTimeout(() => this.createTone(freq, 0.18, 'square', 0.22), index * 130);
        });
    }

    createWarningSound() {
        this.createTone(880, 0.15, 'square', 0.25);
        setTimeout(() => this.createTone(880, 0.15, 'square', 0.25), 200);
    }

    createTimeRunningOutSound() {
        this.createTone(988, 0.08, 'square', 0.3);
    }

    /**
     * Play a sound effect
     * @param {string} soundName - Name of the sound
     */
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        } else {
            console.warn(`Sound '${soundName}' not found`);
        }
    }

    /**
     * Set master volume
     * @param {number} volume - Volume (0-1)
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Set music volume
     * @param {number} volume - Volume (0-1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Set SFX volume
     * @param {number} volume - Volume (0-1)
     */
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Mute/unmute all sounds
     * @param {boolean} mute - Mute state
     */
    setMuted(mute) {
        this.muted = mute;
        if (mute) {
            this.stopAllSounds();
        }
    }

    /**
     * Stop all currently playing sounds
     */
    stopAllSounds() {
        // Individual sounds will stop automatically
        // This is more for music management
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }
}

// Global instance
let enhancedSoundManager;
