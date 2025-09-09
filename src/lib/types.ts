export type Album = {
  AlbumId: number;
  Title: string;
  ArtistId: number;
};

export type Track = {
  TrackId: number;
  Name: string;
  AlbumId: number;
  Composer: string | null;
  Milliseconds: number;
  UnitPrice: number;
};
