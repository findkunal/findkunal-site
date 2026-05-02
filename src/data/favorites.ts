export type FavoriteItem = {
  title: string;
  by?: string;
  link?: string;
  note?: string;
  isbn?: string;
};

export type FavoriteSection = {
  id: string;
  heading: string;
  description?: string;
  items: FavoriteItem[];
};

export const favorites: FavoriteSection[] = [
  {
    id: 'books',
    heading: 'Books',
    description: 'Books that shaped how I think.',
    items: [
      {
        title: 'Triggers',
        by: 'Marshall Goldsmith',
        isbn: '9780804141369',
        link: 'https://www.goodreads.com/book/show/22788824-triggers',
        note: 'On the behavioral triggers that shape who we become \u2014 and how to take control of them.',
      },
      {
        title: "The Hitchhiker's Guide to the Galaxy",
        by: 'Douglas Adams',
        isbn: '9780345391803',
        link: 'https://www.goodreads.com/book/show/11.The_Hitchhiker_s_Guide_to_the_Galaxy',
        note: 'The funniest book about nothing mattering and everything being interesting.',
      },
      {
        title: 'Siddhartha',
        by: 'Hermann Hesse',
        isbn: '9780811200684',
        link: 'https://www.goodreads.com/book/show/52036.Siddhartha',
        note: 'A short novel about searching for meaning. Re-read it every few years.',
      },
      {
        title: 'Atomic Habits',
        by: 'James Clear',
        isbn: '9780735211292',
        link: 'https://jamesclear.com/atomic-habits',
        note: 'Small changes, compounded. The most practical book on behavior I\u2019ve read.',
      },
      {
        title: 'The Psychology of Money',
        by: 'Morgan Housel',
        isbn: '9780857197689',
        link: 'https://www.goodreads.com/book/show/41881472-the-psychology-of-money',
        note: 'Not about money \u2014 about how humans think. One of the clearest books I\u2019ve read.',
      },
      {
        title: 'Meditations',
        by: 'Marcus Aurelius',
        isbn: '9780812968255',
        link: 'https://www.goodreads.com/book/show/30659.Meditations',
        note: 'The original journal of someone trying to be a better human, in public.',
      },
      {
        title: 'Man\u2019s Search for Meaning',
        by: 'Viktor E. Frankl',
        isbn: '9780807014271',
        link: 'https://www.goodreads.com/book/show/4069.Man_s_Search_for_Meaning',
      },
    ],
  },
  {
    id: 'podcasts',
    heading: 'Podcasts',
    items: [
      {
        title: 'Lex Fridman Podcast',
        by: 'Lex Fridman',
        link: 'https://lexfridman.com/podcast/',
        note: 'Long, curious conversations with scientists, thinkers, and builders.',
      },
      {
        title: 'Hidden Brain',
        by: 'Shankar Vedantam',
        link: 'https://hiddenbrain.org/',
        note: 'Psychology and behavioral science made genuinely gripping.',
      },
    ],
  },
  {
    id: 'essays',
    heading: 'Essays',
    description: 'Pieces I keep coming back to.',
    items: [
      {
        title: 'Do Things That Don\u2019t Scale',
        by: 'Paul Graham',
        link: 'http://www.paulgraham.com/ds.html',
      },
    ],
  },
  {
    id: 'tools',
    heading: 'Tools',
    description: 'Software I rely on.',
    items: [
      { title: 'Astro', link: 'https://astro.build/', note: 'This site runs on it.' },
      { title: 'Cloudinary', link: 'https://cloudinary.com/', note: 'Hosts every image you see here.' },
      { title: 'VS Code', link: 'https://code.visualstudio.com/' },
    ],
  },
];
