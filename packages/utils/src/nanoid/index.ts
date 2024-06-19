import { customAlphabet } from 'nanoid';

import { LOWERCASE, NUMBER, SYMBOL, UPPERCASE } from '../consts/char';

class Generator {
  private static readonly alphabet: string = NUMBER + LOWERCASE + UPPERCASE;
  private static readonly defaultSize: number = 11;

  static readonly PrimaryKeySize: number = Generator.defaultSize;
  static readonly DefaultAlphabetLen: number = Generator.alphabet.length;

  private static getSize(l?: number): number {
    let size: number = Generator.defaultSize;
    if (l && l > 0) {
      size = l;
    }
    return size;
  }

  static String(l?: number): string {
    const size: number = Generator.getSize(l);
    return customAlphabet(Generator.alphabet, size)();
  }

  static Lowercase(l?: number): string {
    const size: number = Generator.getSize(l);
    return customAlphabet(LOWERCASE, size)();
  }

  static Uppercase(l?: number): string {
    const size: number = Generator.getSize(l);
    return customAlphabet(UPPERCASE, size)();
  }

  static Number(l?: number): string {
    const size: number = Generator.getSize(l);
    return customAlphabet(NUMBER, size)();
  }

  static Symbol(l?: number): string {
    const size: number = Generator.getSize(l);
    return customAlphabet(SYMBOL, size)();
  }

  static PrimaryKey(l?: number): () => string {
    let size: number = Generator.PrimaryKeySize;
    if (l && l > 0) {
      size = l;
    }
    return () => customAlphabet(Generator.alphabet, size)();
  }

  static IsPrimaryKey(id: string): boolean {
    if (!id) {
      return false;
    }
    const size: number = Generator.PrimaryKeySize;
    const strLen: number = id.length;
    const inAlphabet: boolean =
      id.split('').some(char => Generator.alphabet.includes(char)) &&
      Generator.DefaultAlphabetLen * size >= strLen * 4;
    return strLen === size && inAlphabet;
  }
}

export const nanoid = Generator;
