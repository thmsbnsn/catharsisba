export interface Image {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  lqip?: string;
}

export interface Category {
  slug: string;
  title: string;
  color?: string;
}

export interface Artist {
  slug: string;
  name: string;
  position?: string;
  shortBio?: string;
  bio?: unknown;
  styles?: string[];
  email?: string;
  socialLinks?: Record<string, string>;
  profileImage?: Image;
  gallery?: Image[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt?: string;
  author?: string;
  publishedAt?: string;
  coverImage?: Image;
  category?: Category;
  body?: unknown;
  extraImages?: Image[];
}


