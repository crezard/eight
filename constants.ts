import { PartOfSpeech, PartConfig } from './types';

export const PARTS_DATA: PartConfig[] = [
  {
    id: PartOfSpeech.NOUN,
    koreanName: '명사',
    color: 'bg-blue-500',
    icon: '📦',
    description: '사람, 사물, 장소, 이름 등을 나타내는 말',
    simpleExample: 'Apple, Book, Seoul, Joy'
  },
  {
    id: PartOfSpeech.PRONOUN,
    koreanName: '대명사',
    color: 'bg-indigo-500',
    icon: '👆',
    description: '명사를 대신해서 쓰는 말',
    simpleExample: 'I, You, It, They'
  },
  {
    id: PartOfSpeech.VERB,
    koreanName: '동사',
    color: 'bg-red-500',
    icon: '🏃',
    description: '동작이나 상태를 나타내는 말 (~다)',
    simpleExample: 'Run, Eat, Is, Have'
  },
  {
    id: PartOfSpeech.ADJECTIVE,
    koreanName: '형용사',
    color: 'bg-pink-500',
    icon: '✨',
    description: '명사나 대명사를 꾸며주는 말 (~ㄴ, ~의)',
    simpleExample: 'Happy, Big, Red, Good'
  },
  {
    id: PartOfSpeech.ADVERB,
    koreanName: '부사',
    color: 'bg-orange-500',
    icon: '🚀',
    description: '동사, 형용사, 다른 부사를 꾸며주는 말',
    simpleExample: 'Very, Quickly, Well, Always'
  },
  {
    id: PartOfSpeech.PREPOSITION,
    koreanName: '전치사',
    color: 'bg-green-500',
    icon: '📍',
    description: '명사 앞에 놓여 시간, 장소, 방향 등을 나타내는 말',
    simpleExample: 'In, On, At, For'
  },
  {
    id: PartOfSpeech.CONJUNCTION,
    koreanName: '접속사',
    color: 'bg-yellow-500',
    icon: '🔗',
    description: '단어와 단어, 문장과 문장을 이어주는 말',
    simpleExample: 'And, But, Because, So'
  },
  {
    id: PartOfSpeech.INTERJECTION,
    koreanName: '감탄사',
    color: 'bg-purple-500',
    icon: '❗',
    description: '놀람, 느낌, 부름 등을 나타내는 말',
    simpleExample: 'Wow, Oh, Ouch, Hey'
  }
];