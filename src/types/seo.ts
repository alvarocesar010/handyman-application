export type SeoJson = {
  title: string;
  description: string;

  applicationName?: string;
  authors?: { name: string }[];
  creator?: string;
  publisher?: string;

  icons?: {
    icon: string;
    apple?: string;
  };

  manifest?: string;

  // Added/Updated fields for business contact
  telephone?: string;
  openingHours?: string[]; // e.g., ["Mo-Fr 09:00-19:00", "Sa 09:00-13:00"]

  robots?: {
    index: boolean;
    follow: boolean;
    googleBot?: Record<string, string | number | boolean>;
  };

  openGraph?: {
    title?: string;
    description?: string;
    type: string;
    locale: string;
    url: string;
    siteName: string;
    images: {
      url: string;
      width: number; // Changed to number to match standard metadata usage
      height: number;
      alt: string;
    }[];
  };

  twitter?: {
    card?: string;
    title: string;
    description: string;
    images: string[]; // Changed to string[] to match the JSON array format
  };

  category: string;
  classification: string;

  /**
   * JSON-LD Structured Data for Local Business
   */
  structuredData?: {
    "@context": string;
    "@type": string;
    name: string;
    image: string;
    "@id": string;
    url: string;
    telephone: string;
    priceRange: string;
    address: {
      "@type": string;
      streetAddress?: string;
      addressLocality?: string;
      postalCode?: string;
      addressCountry: string;
    };
    geo?: {
      "@type": string;
      latitude: number;
      longitude: number;
    };
    openingHoursSpecification: {
      "@type": string;
      dayOfWeek: string | string[];
      opens: string;
      closes: string;
    }[];
    areaServed?: {
      "@type": string;
      name: string;
    };
  };
};
