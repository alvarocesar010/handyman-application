export type ServiceStep = {
  title: string;
  description: string;
  image: { src: string; alt: string };
};
type ServiceSteps = {
  title: string;
  items: ServiceStep[];
};

export type Service = {
  key: string;
  slug: string;
  title: string;
  summary: string;
  longDescription: string[] | string;
  startingPrice?: number;
  durationHint?: string;
  inclusions: string[];
  exclusions?: string[];
  faqs?: { q: string; a: string }[];
  icon: string;
  budget?: { service: string; price: number };

  categoriesTitle?: string;
  categories?: Record<string, string[]>;
  categoryImages?: Record<string, { src: string; alt: string }>;
  steps?: ServiceSteps;
};
