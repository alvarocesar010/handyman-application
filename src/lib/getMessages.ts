import enCommon from "@/messages/en/common.json";
import enHome from "@/messages/en/home.json";
import enServices from "@/messages/en/services.json";

import ptCommon from "@/messages/pt/common.json";
import ptHome from "@/messages/pt/home.json";
import ptServices from "@/messages/pt/services.json";

export type Messages = {
  common: {
    brand?: string;
    cta_quote?: string;
  };
  home: {
    title?: string;
    subtitle?: string;
  };
  services: {
    title?: string;
    cta?: string;
  };
};

export function getMessages(locale: "en" | "pt"): Messages {
  return locale === "pt"
    ? {
        common: ptCommon,
        home: ptHome,
        services: ptServices,
      }
    : {
        common: enCommon,
        home: enHome,
        services: enServices,
      };
}
