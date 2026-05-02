export type Quote = {
  text: string;
  by?: string;
  source?: string;
  link?: string;
  tags?: string[];
};

// A commonplace book — passages I've copied down because they kept resonating.
// Add new entries by appending to this array.
export const quotes: Quote[] = [
  {
    text: 'You have power over your mind — not outside events. Realize this, and you will find strength.',
    by: 'Marcus Aurelius',
    source: 'Meditations',
    tags: ['stoicism', 'mind'],
  },
  {
    text: 'We suffer more often in imagination than in reality.',
    by: 'Seneca',
    source: 'Letters from a Stoic',
    tags: ['stoicism', 'fear'],
  },
  {
    text: 'The impediment to action advances action. What stands in the way becomes the way.',
    by: 'Marcus Aurelius',
    source: 'Meditations',
    tags: ['stoicism', 'work'],
  },
  {
    text: 'When we are no longer able to change a situation, we are challenged to change ourselves.',
    by: 'Viktor E. Frankl',
    source: 'Man\u2019s Search for Meaning',
    tags: ['meaning'],
  },
  {
    text: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    by: 'James Clear',
    source: 'Atomic Habits',
    tags: ['habits'],
  },
  {
    text: 'The two most powerful warriors are patience and time.',
    by: 'Leo Tolstoy',
    source: 'War and Peace',
    tags: ['patience'],
  },
];
