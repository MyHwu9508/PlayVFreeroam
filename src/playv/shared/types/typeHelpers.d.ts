export type AlphabetLowerCharacter =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';
export type AlphabetUpperCharacter = Uppercase<AlphabetLowerCharacter>;
export type AlphabetCharacter = AlphabetLowerCharacter | AlphabetUpperCharacter;
export type NumericCharacter = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type AlphaNumericCharacter = AlphabetCharacter | NumericCharacter;

export type AlphaNumericStringReplacer<S extends string, Acc extends string = ''> = S extends `${infer Char}${infer Rest}`
  ? AlphaNumericStringReplacer<Rest, `${Acc}${Char extends AlphaNumericCharacter ? Char : '!'}`>
  : Acc;

export type AlphaNumericString<S extends string> = S extends AlphaNumericStringReplacer<S> ? S : 'Not a valid AlphaNumericString';
