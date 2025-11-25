export enum PartOfSpeech {
  NOUN = 'Noun',
  PRONOUN = 'Pronoun',
  VERB = 'Verb',
  ADJECTIVE = 'Adjective',
  ADVERB = 'Adverb',
  PREPOSITION = 'Preposition',
  CONJUNCTION = 'Conjunction',
  INTERJECTION = 'Interjection'
}

export interface PartConfig {
  id: PartOfSpeech;
  koreanName: string;
  color: string;
  icon: string;
  description: string;
  simpleExample: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
