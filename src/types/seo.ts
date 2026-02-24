export type SeoJson = {
  title: string;
  description: string;
  keywords?: string[];

  authors?: { name: string }[];
  applicationName?: string;
  creator?: string;
  publisher?: string;

  icons?: {
    icon?: string;
    apple?: string;
  };

  manifest?: string;

  robots?: {
    index: boolean;
    follow: boolean;
    googleBot?: Record<string, string | number | boolean>;
  };

  openGraph?: {
    title?: string;
    description?: string;
    ogImg?: string;
  };

  twitter?: {
    card?: string;
    site?: string;
    creator?: string;
  };
};
