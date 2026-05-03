export type FavoriteItem = {
  title: string;
  by?: string;
  link?: string;
  note?: string;
  isbn?: string;
  /**
   * Poster image. Either a full URL, or a Cloudinary public ID
   * (e.g. `posters/pantheon`) which is auto-expanded to a 400x600
   * f_auto/q_auto delivery URL on the favorites page.
   */
  poster?: string;
  year?: string;
  featured?: boolean;
};

export type FavoriteSection = {
  id: string;
  heading: string;
  description?: string;
  layout?: 'list' | 'cards';
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
  {
    id: 'movies',
    heading: 'Movies',
    description: 'Films that have stayed with me.',
    layout: 'cards',
    items: [
      {
        title: 'Captain Fantastic',
        by: 'Matt Ross',
        year: '2016',
        link: 'https://www.themoviedb.org/movie/334533',
        poster: 'https://media.themoviedb.org/t/p/w500/2sFME73GaD8UsUxPUKe60cPdLif.jpg',
      },
      {
        title: 'Little Miss Sunshine',
        by: 'Jonathan Dayton, Valerie Faris',
        year: '2006',
        link: 'https://www.themoviedb.org/movie/773',
        poster: 'https://media.themoviedb.org/t/p/w500/niNdhTpPHSgw22tK0PLjQMV640v.jpg',
      },
      {
        title: 'Juror #2',
        by: 'Clint Eastwood',
        year: '2024',
        link: 'https://www.themoviedb.org/movie/1052999',
        poster: 'https://media.themoviedb.org/t/p/w500/i26w8yFGOpCoSloroeKQjpqlsG3.jpg',
      },
      {
        title: 'Parasite',
        by: 'Bong Joon-ho',
        year: '2019',
        link: 'https://www.themoviedb.org/movie/496243',
        poster: 'https://media.themoviedb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
      },
      {
        title: 'The Peanut Butter Falcon',
        by: 'Tyler Nilson, Michael Schwartz',
        year: '2019',
        link: 'https://www.themoviedb.org/movie/527641',
        poster: 'https://media.themoviedb.org/t/p/w500/kreTuJBkUjVWePRfhHZuYfhNE1T.jpg',
      },
      {
        title: 'The Straight Story',
        by: 'David Lynch',
        year: '1999',
        link: 'https://www.themoviedb.org/movie/12549',
        poster: 'https://media.themoviedb.org/t/p/w500/tkOidJCoRpqVTUlaQlAtG6Ejm9c.jpg',
      },
    ],
  },
  {
    id: 'shows',
    heading: 'Shows',
    description: 'TV that earned its hours.',
    layout: 'cards',
    items: [
      {
        title: 'Adolescence',
        by: 'Stephen Graham, Jack Thorne',
        year: '2025',
        link: 'https://www.themoviedb.org/tv/249042',
        poster: 'https://media.themoviedb.org/t/p/w500/20i4nShZZg1g1VFHSB8xpaYM4r7.jpg',
      },
      {
        title: 'The Bear',
        by: 'Christopher Storer',
        year: '2022–',
        link: 'https://www.themoviedb.org/tv/136315',
        poster: 'https://media.themoviedb.org/t/p/w500/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg',
      },
      {
        title: 'The Pitt',
        by: 'R. Scott Gemmill',
        year: '2025–',
        link: 'https://www.themoviedb.org/tv/241554',
        poster: 'https://media.themoviedb.org/t/p/w500/mIKfKo2uDk3itzAPYIcSeYr4KtF.jpg',
      },
      {
        title: 'Seinfeld',
        by: 'Larry David, Jerry Seinfeld',
        year: '1989–1998',
        link: 'https://www.themoviedb.org/tv/1400',
        poster: 'https://media.themoviedb.org/t/p/w500/aCw8ONfyz3AhngVQa1E2Ss4KSUQ.jpg',
      },
    ],
  },
  {
    id: 'anime',
    heading: 'Anime',
    description: 'Stories that hit hardest in animated form.',
    layout: 'cards',
    items: [
      {
        title: 'Pantheon',
        by: 'Craig Silverstein',
        year: '2022–2023',
        featured: true,
        link: 'https://www.themoviedb.org/tv/195339-pantheon',
        note: "This one sits very close to my heart. Pantheon takes the question I've been chewing on for years — what makes you, you? — and answers it with the seriousness it deserves. It treats consciousness, grief, family, and identity as engineering problems and as spiritual ones at the same time, without flinching from either. The final stretch is one of the most ambitious things I've seen on a screen: it scales from a single father-daughter conversation to the fate of the universe, and somehow earns every step. I don't know another show that takes ideas this big and stays this human.",
      },
      {
        title: 'Death Note',
        by: 'Tsugumi Ohba, Takeshi Obata',
        year: '2006–2007',
        link: 'https://www.themoviedb.org/tv/13916',
        poster: 'https://media.themoviedb.org/t/p/w500/tCZFfYTIwrR7n94J6G14Y4hAFU6.jpg',
      },
      {
        title: 'Fullmetal Alchemist: Brotherhood',
        by: 'Hiromu Arakawa',
        year: '2009–2010',
        link: 'https://www.themoviedb.org/tv/31911',
        poster: 'https://media.themoviedb.org/t/p/w500/5ZFUEOULaVml7pQuXxhpR2SmVUw.jpg',
      },
      {
        title: 'Berserk',
        by: 'Kentaro Miura',
        year: '1997–1998',
        link: 'https://www.themoviedb.org/tv/30991',
        poster: 'https://media.themoviedb.org/t/p/w500/xDiXDfZwC6XYC6fxHI1jl3A3Ill.jpg',
      },
      {
        title: 'Code Geass: Lelouch of the Rebellion',
        by: 'Goro Taniguchi',
        year: '2006–2008',
        link: 'https://www.themoviedb.org/tv/31724',
        poster: 'https://media.themoviedb.org/t/p/w500/x316WCogkeIwNY4JR8zTCHbI2nQ.jpg',
      },
    ],
  },
];
