/**
 * Dynamic Background Music System
 * Procedurally generated music that adapts to game state and levels
 */

class MusicSystem {
    constructor() {
        this.audioContext = null;
        this.currentTrack = null;
        this.volume = 0.3;
        this.muted = false;
        this.isPlaying = false;

        // Music nodes
        this.oscillators = [];
        this.gainNodes = [];

        // Track definitions
        this.tracks = {
            menu: { tempo: 120, key: 'C', mood: 'happy', complexity: 'medium' },
            overworld: { tempo: 140, key: 'C', mood: 'adventurous', complexity: 'medium' },
            underground: { tempo: 130, key: 'Am', mood: 'mysterious', complexity: 'low' },
            underwater: { tempo: 100, key: 'F', mood: 'calm', complexity: 'low' },
            castle: { tempo: 150, key: 'Dm', mood: 'intense', complexity: 'high' },
            sky: { tempo: 135, key: 'G', mood: 'uplifting', complexity: 'medium' },
            desert: { tempo: 125, key: 'D', mood: 'exotic', complexity: 'medium' },
            ice: { tempo: 110, key: 'Bb', mood: 'cold', complexity: 'low' },
            volcano: { tempo: 155, key: 'Em', mood: 'intense', complexity: 'high' },
            jungle: { tempo: 145, key: 'A', mood: 'energetic', complexity: 'high' },
            boss: { tempo: 160, key: 'Gm', mood: 'dramatic', complexity: 'high' },
            star: { tempo: 180, key: 'C', mood: 'frantic', complexity: 'high' },
            gameover: { tempo: 80, key: 'Cm', mood: 'sad', complexity: 'low' },
            victory: { tempo: 130, key: 'C', mood: 'triumphant', complexity: 'medium' }
        };

        // Musical scales
        this.scales = {
            'C': [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88],
            'G': [392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 739.99],
            'D': [293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 554.37],
            'A': [440.00, 493.88, 554.37, 587.33, 659.25, 739.99, 830.61],
            'F': [349.23, 392.00, 440.00, 466.16, 523.25, 587.33, 659.25],
            'Bb': [466.16, 523.25, 587.33, 622.25, 698.46, 783.99, 880.00],
            'Am': [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00],
            'Em': [329.63, 369.99, 392.00, 440.00, 493.88, 523.25, 587.33],
            'Dm': [293.66, 329.63, 349.23, 392.00, 440.00, 466.16, 523.25],
            'Gm': [392.00, 440.00, 466.16, 523.25, 587.33, 622.25, 698.46],
            'Cm': [261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 466.16]
        };

        this.initAudioContext();
    }

    /**
     * Initialize Web Audio API
     */
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            errorHandler.logError('Music', new Error('Web Audio API not supported'));
            this.audioContext = null;
        }
    }

    /**
     * Play a music track
     * @param {string} trackName - Name of the track
     */
    play(trackName) {
        if (!this.audioContext || this.muted || !this.tracks[trackName]) {
            return;
        }

        // Stop current track
        this.stop();

        this.currentTrack = trackName;
        this.isPlaying = true;

        const track = this.tracks[trackName];

        // Start playing based on track type
        if (trackName === 'menu' || trackName === 'victory') {
            this.playMelody(track);
        } else if (trackName === 'gameover') {
            this.playGameOverMusic(track);
        } else if (trackName === 'boss') {
            this.playBossMusic(track);
        } else if (trackName === 'star') {
            this.playStarMusic(track);
        } else {
            this.playLevelMusic(track);
        }
    }

    /**
     * Stop current track
     */
    stop() {
        this.isPlaying = false;

        // Stop all oscillators
        this.oscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {
                // Already stopped
            }
        });

        // Clear arrays
        this.oscillators = [];
        this.gainNodes = [];
    }

    /**
     * Play level background music
     * @param {Object} track - Track configuration
     */
    playLevelMusic(track) {
        const scale = this.scales[track.key];
        const beatDuration = 60 / track.tempo;

        // Bass line
        this.playBassline(scale, beatDuration, track.complexity);

        // Melody
        this.playMelodyLine(scale, beatDuration, track.complexity, track.mood);

        // Harmony (if complex enough)
        if (track.complexity !== 'low') {
            this.playHarmony(scale, beatDuration);
        }

        // Percussion
        this.playPercussion(beatDuration, track.mood);
    }

    /**
     * Play bassline pattern
     * @param {Array} scale - Musical scale
     * @param {number} beatDuration - Duration of one beat
     * @param {string} complexity - Complexity level
     */
    playBassline(scale, beatDuration, complexity) {
        if (!this.audioContext) {
            return;
        }

        const pattern = complexity === 'high'
            ? [0, 2, 4, 2, 0, 4, 2, 0]
            : [0, 0, 4, 4, 0, 0, 4, 4];

        const playBassNote = (index) => {
            if (!this.isPlaying) {
                return;
            }

            const note = scale[pattern[index % pattern.length]] / 2; // One octave lower
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'triangle';
            osc.frequency.value = note;

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            gain.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + beatDuration * 0.8);

            osc.start();
            osc.stop(this.audioContext.currentTime + beatDuration);

            this.oscillators.push(osc);
            this.gainNodes.push(gain);

            setTimeout(() => playBassNote(index + 1), beatDuration * 1000);
        };

        playBassNote(0);
    }

    /**
     * Play melody line
     * @param {Array} scale - Musical scale
     * @param {number} beatDuration - Duration of one beat
     * @param {string} complexity - Complexity level
     * @param {string} mood - Mood of the track
     */
    playMelodyLine(scale, beatDuration, complexity, mood) {
        if (!this.audioContext) {
            return;
        }

        const noteDuration = complexity === 'high' ? beatDuration / 2 : beatDuration;

        const playMelodyNote = () => {
            if (!this.isPlaying) {
                return;
            }

            // Generate melodic pattern based on mood
            let noteIndex;
            if (mood === 'mysterious' || mood === 'cold') {
                noteIndex = Math.floor(Math.random() * 3) + 2; // Middle-low range
            } else if (mood === 'uplifting' || mood === 'triumphant') {
                noteIndex = Math.floor(Math.random() * 3) + 4; // Upper range
            } else {
                noteIndex = Math.floor(Math.random() * 5) + 1; // Full range
            }

            const note = scale[noteIndex] * 2; // One octave higher
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = mood === 'intense' ? 'square' : 'sine';
            osc.frequency.value = note;

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            gain.gain.setValueAtTime(this.volume * 0.15, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + noteDuration * 0.9);

            osc.start();
            osc.stop(this.audioContext.currentTime + noteDuration);

            this.oscillators.push(osc);
            this.gainNodes.push(gain);

            setTimeout(playMelodyNote, noteDuration * 1000);
        };

        playMelodyNote();
    }

    /**
     * Play harmony
     * @param {Array} scale - Musical scale
     * @param {number} beatDuration - Duration of one beat
     */
    playHarmony(scale, beatDuration) {
        if (!this.audioContext) {
            return;
        }

        const playChord = (index) => {
            if (!this.isPlaying) {
                return;
            }

            const chordPattern = [0, 3, 4, 2];
            const root = scale[chordPattern[index % chordPattern.length]];
            const third = scale[(chordPattern[index % chordPattern.length] + 2) % scale.length];

            [root, third].forEach(freq => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.type = 'triangle';
                osc.frequency.value = freq;

                osc.connect(gain);
                gain.connect(this.audioContext.destination);

                gain.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime);
                gain.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime + beatDuration * 4);

                osc.start();
                osc.stop(this.audioContext.currentTime + beatDuration * 4);

                this.oscillators.push(osc);
                this.gainNodes.push(gain);
            });

            setTimeout(() => playChord(index + 1), beatDuration * 4 * 1000);
        };

        playChord(0);
    }

    /**
     * Play percussion pattern
     * @param {number} beatDuration - Duration of one beat
     * @param {string} mood - Mood of the track
     */
    playPercussion(beatDuration, mood) {
        if (!this.audioContext) {
            return;
        }

        const playBeat = (index) => {
            if (!this.isPlaying) {
                return;
            }

            // Kick drum on beats 1 and 3
            if (index % 4 === 0 || index % 4 === 2) {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
                osc.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.1);

                osc.connect(gain);
                gain.connect(this.audioContext.destination);

                gain.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

                osc.start();
                osc.stop(this.audioContext.currentTime + 0.1);

                this.oscillators.push(osc);
                this.gainNodes.push(gain);
            }

            // Hi-hat on every beat for energetic moods
            if (mood === 'energetic' || mood === 'frantic' || mood === 'intense') {
                const noise = this.audioContext.createBufferSource();
                const buffer = this.audioContext.createBuffer(1, 4410, this.audioContext.sampleRate);
                const data = buffer.getChannelData(0);

                for (let i = 0; i < buffer.length; i++) {
                    data[i] = Math.random() * 2 - 1;
                }

                noise.buffer = buffer;
                const gain = this.audioContext.createGain();

                noise.connect(gain);
                gain.connect(this.audioContext.destination);

                gain.gain.setValueAtTime(this.volume * 0.05, this.audioContext.currentTime);

                noise.start();

                this.oscillators.push(noise);
                this.gainNodes.push(gain);
            }

            setTimeout(() => playBeat(index + 1), beatDuration * 1000);
        };

        playBeat(0);
    }

    /**
     * Play menu/victory melody
     * @param {Object} track - Track configuration
     */
    playMelody(track) {
        const scale = this.scales[track.key];
        const beatDuration = 60 / track.tempo;

        const melody = track.key === 'C' && track.mood === 'triumphant'
            ? [0, 2, 4, 5, 4, 2, 0, 4, 6, 5, 4, 2, 0] // Victory
            : [0, 2, 4, 0, 2, 4, 6, 4, 2, 0]; // Menu

        const playNote = (index) => {
            if (!this.isPlaying || index >= melody.length) {
                if (this.isPlaying && track.mood !== 'triumphant') {
                    setTimeout(() => playNote(0), 1000); // Loop for menu
                }
                return;
            }

            const freq = scale[melody[index]] * 2;
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'square';
            osc.frequency.value = freq;

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            gain.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + beatDuration * 0.9);

            osc.start();
            osc.stop(this.audioContext.currentTime + beatDuration);

            this.oscillators.push(osc);
            this.gainNodes.push(gain);

            setTimeout(() => playNote(index + 1), beatDuration * 1000);
        };

        playNote(0);
    }

    /**
     * Play game over music
     * @param {Object} track - Track configuration
     */
    playGameOverMusic(track) {
        const scale = this.scales[track.key];
        const beatDuration = 60 / track.tempo;
        const melody = [6, 5, 4, 3, 2, 1, 0];

        melody.forEach((note, index) => {
            setTimeout(() => {
                const freq = scale[note] * 2;
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.type = 'sine';
                osc.frequency.value = freq;

                osc.connect(gain);
                gain.connect(this.audioContext.destination);

                gain.gain.setValueAtTime(this.volume * 0.25, this.audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + beatDuration * 1.5);

                osc.start();
                osc.stop(this.audioContext.currentTime + beatDuration * 1.5);

                this.oscillators.push(osc);
                this.gainNodes.push(gain);
            }, index * beatDuration * 1000);
        });
    }

    /**
     * Play boss battle music
     * @param {Object} track - Track configuration
     */
    playBossMusic(track) {
        // Intense, fast-paced music
        this.playLevelMusic(track);
    }

    /**
     * Play star power music
     * @param {Object} track - Track configuration
     */
    playStarMusic(track) {
        // Super fast, exciting music
        this.playLevelMusic(track);
    }

    /**
     * Set music volume
     * @param {number} volume - Volume (0-1)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Mute/unmute music
     * @param {boolean} mute - Mute state
     */
    setMuted(mute) {
        this.muted = mute;
        if (mute) {
            this.stop();
        }
    }

    /**
     * Fade out current track
     * @param {number} duration - Fade duration in seconds
     * @param {Function} callback - Callback when fade complete
     */
    fadeOut(duration = 1, callback = null) {
        if (!this.audioContext) {
            return;
        }

        const fadeSteps = 20;
        const stepDuration = duration / fadeSteps;
        const volumeStep = this.volume / fadeSteps;

        let currentStep = 0;
        const fadeInterval = setInterval(() => {
            currentStep++;
            this.volume -= volumeStep;

            if (currentStep >= fadeSteps) {
                clearInterval(fadeInterval);
                this.stop();
                this.volume = 0.3; // Reset volume
                if (callback) {
                    callback();
                }
            }
        }, stepDuration * 1000);
    }

    /**
     * Cross-fade to new track
     * @param {string} newTrack - Name of new track
     */
    crossFade(newTrack) {
        this.fadeOut(0.5, () => {
            this.play(newTrack);
        });
    }
}

// Global instance
let musicSystem;
