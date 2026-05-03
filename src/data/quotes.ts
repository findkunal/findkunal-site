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
    text: 'If personal growth is not your priority, struggle will become your reality.',
  },
  {
    text: 'People mirror microbehaviors faster than they process spoken words.',
  },
  {
    text: "Happiness comes from absolutely wanting what you have, and progress comes from absolutely wanting what you don't have.",
  },
  {
    text: 'Speak when you are angry, and you will make the best speech you will ever regret.',
    by: 'Ambrose Bierce',
  },
  {
    text: "Change has to come from within. It can't be dictated, demanded, or otherwise forced upon people.",
  },
];
