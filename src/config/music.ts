interface Song {
  name: string;
  artist: string;
  file: string;
  link?: string;  // 外部連結
  cover?: string;  // 封面圖片
  artistLink?: string;  // 藝術家連結
}

export const defaultCover = '/images/music-default.png';  // 預設封面

export const playlist: Song[] = [

  {
    name: "2:33 AM",
    artist: "しゃろう",
    file: "/music/233AM/223 AM.mp3",
    link: "https://www.youtube.com/watch?v=UztxQkaZLog",
    cover: "/music/233AM/profile.jpg",
    artistLink: "https://www.youtube.com/@Sharou"
  },
  {
    name: "3:03 PM",
    artist: "しゃろう",
    file: "/music/303PM/303 PM.mp3",
    link: "https://www.youtube.com/watch?v=UztxQkaZLog",
    cover: "/music/303PM/profile.jpg",
    artistLink: "https://www.youtube.com/@Sharou"
  },
  {
    name: "おひるすぎ",
    artist: "fai",
    file: "/music/おひるすぎ/おひるすぎ.mp3",
    link: "https://www.youtube.com/watch?v=Mpg8SVSdu_A",
    cover: "/music/おひるすぎ/profile.png",
    artistLink: "https://www.youtube.com/@fai_musics"
  },
  {
    name: "弟みたいな存在",
    artist: "横山克-四月は君の嘘",
    file: "/music/弟みたいな存在/横山克 - 弟みたいな存在.mp3",
    link: "https://www.youtube.com/watch?v=WtOOk0IKixM",
    cover: "/music/弟みたいな存在/profile.jpg",
    artistLink: "https://www.youtube.com/@kevinseopiano"
  },
  {
    name: "シンシアリー",
    artist: "しまも (Covered by Kotoha)",
    file: "/music/シンシアリー/しまも (Covered by Kotoha) - シンシアリー.mp3",
    link: "https://www.youtube.com/watch?v=1oEjz4X-q0E",
    cover: "/music/シンシアリー/profile.jpg",
    artistLink: "https://www.youtube.com/@Kotoha_ktnh"
  },
  {
    name: "怒鳴り傷",
    artist: "可不",
    file: "/music/怒鳴り傷/怒鳴り傷.mp3",
    link: "https://www.youtube.com/watch?v=gERyKqM5Gvs&list=RDMM&start_radio=1&rv=9QLT1Aw_45s",
    cover: "/music/怒鳴り傷/profile.jpg",
    artistLink: "https://www.youtube.com/@Hana-song"
  }
];

export const defaultSong = playlist[0]; 