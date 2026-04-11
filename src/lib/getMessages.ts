import enCommon from "@/messages/en/common.json";
import enHome from "@/messages/en/home.json";
import enServices from "@/messages/en/services.json";
import enBooking from "@/messages/en/booking.json";
import enLayout from "@/messages/en/layout.json";
import enServicesSlug from "@/messages/en/servicesSlug.json";

import ptCommon from "@/messages/pt/common.json";
import ptHome from "@/messages/pt/home.json";
import ptServices from "@/messages/pt/services.json";
import ptBooking from "@/messages/pt/booking.json";
import ptLayout from "@/messages/pt/layout.json";
import ptServicesSlug from "@/messages/pt/servicesSlug.json";

import { SeoJson } from "@/types/seo";

export type Messages = {
  common: {
    brand?: string;
    cta_quote?: string;
  };
  home: {
    seo: SeoJson;
    heroSection: {
      title?: string;
      subtitle?: string;
      bookButton: string;
      callButton: { phone: string; children: string };
      ul: { li0: string; li1: string; li2: string };
    };
    servicesGrid: {
      title: string;
    };
    whyUs: {
      title: string;
      points: {
        icon: string;
        title: string;
        text: string;
      }[];
    };
  };
  services: {
    seo: SeoJson;
    title?: string;
    cta?: string;
  };

  booking: {
    seo: SeoJson;
    title?: string;
  };

  layout: {
    NavBar: {
      navLinks: {
        href: string;
        label: string;
      }[];
      Image: {
        height: number;
        src: string;
        alt: string;
        width: number;
        text?: string;
      };
      buttons: {
        book: string;
        accessBookings: string;
      };
    };
  };

  servicesSlug: {
    header: {
      duration: string;
      price: {
        value: string;
        from: string;
        noValue: string;
      };
      buttons: {
        booking: string;
        whats: {
          href: string;
          content: string;
        };
      };
    };

    description: {
      title: string;
      cta: string;
      cta1: string;
      cta2: string;
    };

    included: {
      title: string;
    };

    excluded: {
      title: string;
      default: string[];
    };

    faq: {
      title: string;
    };

    actions: {
      book: string;
      back: string;
    };

    aria: {
      whatsapp: string;
    };
  };
};

export function getMessages(locale: "en" | "pt"): Messages {
  return locale === "pt"
    ? {
        common: ptCommon,
        home: ptHome,
        services: ptServices,
        booking: ptBooking,
        layout: ptLayout,
        servicesSlug: ptServicesSlug,
      }
    : {
        common: enCommon,
        home: enHome,
        services: enServices,
        booking: enBooking,
        layout: enLayout,
        servicesSlug: enServicesSlug,
      };
}
