export type FavoriteItem = {
  title: string;
  by?: string;
  link?: string;
  note?: string;
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
        title: 'Meditations',
        by: 'Marcus Aurelius',
        link: 'https://www.goodreads.com/book/show/30659.Meditations',
        note: 'The original journal of someone trying to be a better human, in public.',
      },
      {
        title: 'Man\u2019s Search for Meaning',
        by: 'Viktor E. Frankl',
        link: 'https://www.goodreads.com/book/show/4069.Man_s_Search_for_Meaning',
      },
    ],
  },
  {
    id: 'podcasts',
    heading: 'Podcasts',
    items: [
      {
        title: 'The Daily Stoic',
        by: 'Ryan Holiday',
        link: 'https://dailystoic.com/podcast/',
      },
      {
        title: 'Huberman Lab',
        by: 'Andrew Huberman',
        link: 'https://hubermanlab.com/',
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
