export type ServiceStep = {
  title: string;
  description: string;
  image: { src: string; alt: string };
};


export type Service = {
  slug: string;
  title: string;
  summary: string;
  longDescription: string;
  startingPrice?: number;
  durationHint?: string;
  inclusions: string[];
  exclusions?: string[];
  faqs?: { q: string; a: string }[];
  icon: string;

  categoriesTitle?: string;
  categories?: Record<string, string[]>;
  categoryImages?: Record<string, { src: string; alt: string }>;
  steps?: ServiceStep[];
};
