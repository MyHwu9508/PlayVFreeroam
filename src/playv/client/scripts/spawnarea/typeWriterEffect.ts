import alt from 'alt-client';
import { shuffleArray } from '../../utils/objects';
import native from 'natives';

const wordsToType = ['Welcome!', 'Willkommen!', 'Bonjour!', 'Hola!', 'Witamy!', 'Bienvenue!', 'Ласкаво просимо!', 'Bun venit!']; // Add more words as needed
const typingSpeed = 250; // Adjust typing speed (milliseconds)

class Typewriter {
  private currentIndex = 0;
  private currentCharIndex = 0;
  private lastTypingTime = Date.now();
  private typedText = '';
  private words: string[];
  private isLoopPaused: boolean = true;
  private ped: number;

  constructor(words: string[], private speed: number) {
    this.words = shuffleArray(words);
    alt.everyTick(() => {
      this.typeNextCharacter();
      this.drawTypedText();
    });
  }

  private typeNextCharacter(): void {
    if (this.isLoopPaused) return;
    if (this.currentIndex < this.words.length) {
      const currentTime = Date.now();
      if (currentTime - this.lastTypingTime >= this.speed) {
        const word = this.words[this.currentIndex];
        if (this.currentCharIndex < word.length) {
          this.typedText = word.substring(0, this.currentCharIndex + 1);
          this.currentCharIndex++;
        } else {
          this.currentCharIndex = 0;
          this.currentIndex++;
          this.typedText = ''; // Clear typed text for the next word
        }
        this.lastTypingTime = currentTime;
      }
    } else {
      this.currentIndex = 0;
    }
  }

  private drawTypedText(): void {
    if (this.isLoopPaused || this.ped === undefined || !native.isEntityAPed(this.ped) || alt.getMeta('showHud') === false) return;
    const pos = alt.getPedBonePos(this.ped, 12844).add(0, 0, 0.4);
    if (!pos) return;
    if (this.typedText) {
      alt.Utils.drawText3dThisFrame(this.typedText, pos, 1, 0.5, new alt.RGBA(255, 255, 255, 200), true, true);
    }
  }

  setActive(state: boolean): void {
    this.isLoopPaused = !state;
  }
  setPed(ped: number): void {
    this.ped = ped;
  }
}

// Example usage
export const typewriterInstance = new Typewriter(wordsToType, typingSpeed);
