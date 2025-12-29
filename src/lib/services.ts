import {
  DoorOpen,
  Heater,
  Wrench,
  ShowerHead,
  WashingMachine,
  Droplet,
  Lightbulb,
  Zap,
  LucideIcon,
  Tv,
  Ruler,
  Drill,
  Bath,
  Layers,
} from "lucide-react";

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
  startingPrice?: number; // cents
  durationHint?: string;
  inclusions: string[];
  exclusions?: string[];
  faqs?: { q: string; a: string }[];
  icon: LucideIcon;

  // Tópicos por categoria + imagem por categoria
  categories?: Record<string, string[]>;
  categoryImages?: Record<string, { src: string; alt: string }>;
  steps?: ServiceStep[];
};

export const SERVICES: Service[] = [
  // door-service
  {
    slug: "door-services",
    title: "Door Installation & Replacement Services",
    summary:
      "Professional fitting, repair, and replacement of all types of doors — internal, external, furniture, enclosure, and more.",
    longDescription:
      "We provide a complete door fitting and replacement service for homes and businesses. Whether it's an interior, exterior, or furniture door, we ensure a perfect fit, smooth operation, and a clean finish. We handle everything from wooden and composite doors to glass enclosures, wardrobes, and appliance doors. We measure, align, plane when necessary, and fit or reuse hinges, handles, and locks. Suitable for damaged, swollen, or misaligned doors — or if you simply want an upgrade. We can also advise on fire-rated, moisture-resistant, or acoustic options depending on your needs.",
    startingPrice: 5500,
    durationHint: "Usually 1–2 hours per door",

    categories: {
      "Internal Doors": [
        "Bedroom doors",
        "Living room doors",
        "Hallway doors",
        "Closet and storage doors",
      ],
      "External Doors": [
        "Front and back entry doors",
        "Patio and balcony doors",
        "Garage side doors",
        "Garden and shed doors",
      ],
      "Furniture & Cabinet Doors": [
        "Wardrobe doors (sliding or hinged)",
        "Kitchen cabinet doors",
        "Cupboard doors",
        "TV and media unit doors",
      ],
      "Bathroom & Enclosure Doors": [
        "Shower enclosure doors",
        "Glass partition doors",
        "Toilet cubicle doors",
      ],
      "Appliance Doors": [
        "Dishwasher panel doors",
        "Fridge integrated doors",
        "Laundry cabinet doors",
      ],
      "Specialty & Custom Doors": [
        "Fire-rated doors",
        "Acoustic/soundproof doors",
        "Moisture-resistant doors",
        "Custom-sized or bespoke joinery doors",
      ],
    },

    // Imagem por categoria (usada dentro dos cards de tópicos)
    // Ajuste os paths conforme suas imagens em /public
    categoryImages: {
      "Internal Doors": {
        src: "/images/services/doors/door-internal.jpg",
        alt: "Internal wooden door being fitted",
      },
      "External Doors": {
        src: "/images/services/doors/door-external.jpg",
        alt: "External composite front door",
      },
      "Furniture & Cabinet Doors": {
        src: "/images/services/doors/door-kitchen-cabinet.jpg",
        alt: "Kitchen cabinet door alignment",
      },
      "Bathroom & Enclosure Doors": {
        src: "/images/services/doors/door-shower.jpg",
        alt: "Shower enclosure glass door",
      },
      "Appliance Doors": {
        src: "/images/services/doors/door-appliance.jpg",
        alt: "Integrated appliance door fitted",
      },
      "Specialty & Custom Doors": {
        src: "/images/services/doors/door-fire-rated.jpg",
        alt: "Fire-rated door with label",
      },
    },

    inclusions: [
      "Remove and dispose of old door if required",
      "Measure and ensure perfect alignment",
      "Fit new door, hinges, handles, and locks",
      "Plane door edges for smooth operation",
      "Adjust frames and ensure proper clearance",
      "Supply of standard spare parts (hinges, locks, handles, screws, etc.) if needed",
      "Customer can also supply their own materials",
    ],
    exclusions: [
      "Custom painting, varnishing, or staining (available upon request)",
      "Glass cutting or design engraving",
      "Supply of non-standard or bespoke doors unless pre-agreed",
    ],
    faqs: [
      {
        q: "Can you supply the doors and parts?",
        a: "Yes, we can provide all the required spare parts like hinges, handles, and locks, as well as supply standard-sized doors. However, customers are also free to provide their own materials if preferred.",
      },
      {
        q: "Do you repair or adjust existing doors?",
        a: "Absolutely. We can repair swollen, misaligned, or sticking doors, as well as rehang or plane them for a smoother fit.",
      },
      {
        q: "Do you install bathroom or glass doors?",
        a: "Yes, we fit bathroom and shower enclosure doors, including glass and aluminium models with waterproof sealing.",
      },
      {
        q: "Do you work on wardrobe and kitchen cabinet doors?",
        a: "Yes, we can replace or repair furniture and cabinet doors, adjust hinges, and install new fittings.",
      },
      {
        q: "Do you offer fire or moisture-resistant doors?",
        a: "Yes, we can advise and install certified fire-rated and moisture-resistant doors suitable for kitchens, bathrooms, or commercial use.",
      },
      {
        q: "Can you fix broken hinges or loose handles?",
        a: "Yes, we replace or reinforce hinges, handles, locks, and any other fittings that are damaged or worn out.",
      },
      {
        q: "Do you offer painting or finishing?",
        a: "We don’t usually paint or varnish as part of the standard service, but it can be arranged if required.",
      },
    ],

    icon: DoorOpen,
  },

  // furniture-assembly
  {
    slug: "furniture-assembly",
    title: "Furniture Assembly & Installation",
    summary:
      "Flat-pack furniture assembled neatly and securely — for bedrooms, living rooms, offices, and more.",
    longDescription:
      "We assemble flat-pack furniture from major retailers like IKEA, JYSK, and Argos. From wardrobes and beds to office desks and TV units, we ensure everything is level, safe, and cleanly installed. Tall or heavy items are secured to walls when required for safety. Ideal for new homes, offices, or anyone who wants a tidy, professional finish.",
    startingPrice: 6000,
    durationHint: "Varies by item size and complexity",

    categories: {
      "Bedroom Furniture": [
        "Wardrobes (hinged or sliding)",
        "Bed frames and headboards",
        "Chest of drawers and dressers",
        "Bedside tables",
      ],
      "Living Room Furniture": [
        "TV stands and entertainment units",
        "Bookcases and shelving",
        "Coffee tables and side tables",
        "Storage cabinets",
      ],
      "Office & Study Furniture": [
        "Desks and computer tables",
        "Office chairs",
        "Filing cabinets",
        "Shelving units",
      ],
      "Dining Area": [
        "Dining tables and chairs",
        "Bar stools",
        "Sideboards and display units",
      ],
      "Children’s Room": [
        "Kids’ beds and bunk beds",
        "Toy storage units",
        "Study desks and shelves",
      ],
      "Outdoor Furniture": [
        "Garden tables and chairs",
        "Benches and loungers",
        "Patio sets and storage boxes",
      ],
    },

    categoryImages: {
      "Bedroom Furniture": {
        src: "/images/services/furniture/bedroom-furniture.jpg",
        alt: "Wardrobe and bed assembly in a bedroom",
      },
      "Living Room Furniture": {
        src: "/images/services/furniture/livingroom-furniture.jpg",
        alt: "TV unit and bookshelf assembled in living room",
      },
      "Office & Study Furniture": {
        src: "/images/services/furniture/office-furniture.jpg",
        alt: "Office desk and chair assembly",
      },
      "Dining Area": {
        src: "/images/services/furniture/dining-furniture.jpg",
        alt: "Dining table and chairs assembled",
      },
      "Children’s Room": {
        src: "/images/services/furniture/kids-furniture.jpg",
        alt: "Bunk bed and toy storage assembly",
      },
      "Outdoor Furniture": {
        src: "/images/services/furniture/outdoor-furniture.jpg",
        alt: "Garden furniture assembled on patio",
      },
    },

    inclusions: [
      "Assemble flat-pack furniture per instructions",
      "Check and tighten all fixings/connectors",
      "Secure tall items to walls when required",
      "Align doors, drawers, and hinges",
      "Tidy up packaging and leave the area clean",
    ],
    exclusions: [
      "Furniture supply (we assemble what you provide)",
      "Electrical or plumbing connections within units",
      "Custom carpentry or wall modifications",
    ],
    faqs: [
      {
        q: "Can you assemble furniture from any brand?",
        a: "Yes, we work with IKEA, JYSK, Argos, Wayfair and others, plus unbranded flat-packs.",
      },
      {
        q: "Do you fix wardrobes to the wall?",
        a: "Yes, we secure tall/heavy items to walls if suitable fixings are available.",
      },
      {
        q: "Can you dismantle old furniture?",
        a: "Yes, we can dismantle existing items before assembling new ones if requested.",
      },
      {
        q: "Do you remove packaging?",
        a: "We tidy the area and can remove/dispose of packaging on request.",
      },
    ],
    icon: Drill,
  },
  // curtain-installation
  {
    slug: "curtain-installation",
    title: "Curtain & Blinds Installation",
    summary: "Professional fitting of curtains and blinds, safely and neatly.",
    longDescription:
      "Our experts can install all types of curtains and blinds, ensuring a perfect fit and secure fixings. We measure and mark positions accurately, drill and fit brackets, hang curtains or blinds, and make sure everything is level and smooth. We’ll also tidy up the area and remove any packaging when finished.",
    startingPrice: 5000,
    durationHint: "Varies by number of windows",
    inclusions: [
      "Accurate measurement and marking",
      "Secure bracket installation",
      "Curtains or blinds fitted and aligned",
      "Safety check of all fittings",
      "Area cleaned and packaging removed",
    ],
    icon: Ruler,

    steps: [
      {
        title: "Measure and confirm the position",
        description:
          "We confirm the window measurements, choose the correct height, and mark the fixing points so everything sits straight and symmetrical.",
        image: {
          src: "/images/services/curtains/step-1-measure.jpg",
          alt: "Measuring a window for curtain rail placement",
        },
      },
      {
        title: "Mark and drill safely",
        description:
          "We locate solid fixing points, check for hidden cables/pipes where relevant, and drill clean holes for secure mounting.",
        image: {
          src: "/images/services/curtains/step-2-drill.jpg",
          alt: "Drilling holes for a curtain rail bracket",
        },
      },
      {
        title: "Fit brackets and rail/track",
        description:
          "Brackets are mounted securely and the rail or track is installed. We ensure it’s level and correctly spaced.",
        image: {
          src: "/images/services/curtains/step-3-fit.jpg",
          alt: "Bracket and rail installed and being aligned",
        },
      },
      {
        title: "Hang, align, and finish",
        description:
          "Curtains or blinds are fitted, aligned, and tested. We tidy up and remove any packaging once everything is working smoothly.",
        image: {
          src: "/images/services/curtains/step-4-hang.jpg",
          alt: "Curtains hung and aligned neatly on the rail",
        },
      },
    ],
  },
  // bathroom-renovation
  {
    slug: "bathroom-renovation",
    title: "Bathroom Renovation & Upgrades",
    summary:
      "Clean, modern bathroom makeovers for Dublin homes – from small refreshes to full renovations.",
    longDescription:
      "We renovate bathrooms in Dublin houses, apartments and rentals – from quick updates to full rip-out and refit. Whether you need a new shower enclosure, updated tiles, better storage or a complete new layout, we manage the work neatly and efficiently. We take care of tiling, fixtures, minor plumbing adjustments, sealing and finishing details so you’re left with a clean, fresh bathroom that’s ready to use. Ideal for landlords, new homeowners and anyone tired of a dated bathroom.",
    startingPrice: 25000, // €250 – adjust to whatever matches your pricing
    durationHint:
      "From 1 day for small updates, up to several days for full renovations",

    categories: {
      "Full Bathroom Renovation": [
        "Strip-out of old tiles, fixtures and units",
        "Preparation of walls and floors for new finishes",
        "Installation of new bath or walk-in shower",
        "Fitting new toilet, basin and vanity unit",
      ],
      "Partial Upgrades & Refresh": [
        "Replacing old vanity, basin or toilet",
        "Upgrading taps, shower mixers and accessories",
        "New mirrors, cabinets and storage units",
        "Fresh silicone and sealing around wet areas",
      ],
      "Tiling & Wall Finishes": [
        "Wall and floor tiling in showers and full bathrooms",
        "Replacing broken or loose tiles",
        "Re-grouting and grout repairs",
        "Tiling around baths, basins and splashbacks",
      ],
      "Shower & Bath Upgrades": [
        "Fitting new shower enclosures and doors",
        "Replacing shower trays and screens",
        "Upgrading electric or mixer showers (plumber/electrician may be required)",
        "Finishing with neat sealing and trims",
      ],
      "Small Bathrooms & Ensuites": [
        "Layout tweaks for tight Dublin bathrooms",
        "Slimline vanity and compact toilet solutions",
        "Wall-hung storage to free up floor space",
        "Bright finishes to make small spaces feel larger",
      ],
      "Accessibility & Safety": [
        "Grab rails and support bars fitted securely",
        "Low-step or walk-in shower options",
        "Non-slip flooring options",
        "Comfort-height WC and easy-reach storage",
      ],
    },

    categoryImages: {
      "Full Bathroom Renovation": {
        src: "/images/services/bathroom/full-renovation.jpg",
        alt: "Newly renovated modern bathroom in a Dublin home",
      },
      "Partial Upgrades & Refresh": {
        src: "/images/services/bathroom/partial-upgrade.jpg",
        alt: "Updated bathroom vanity and mirror after a small renovation",
      },
      "Tiling & Wall Finishes": {
        src: "/images/services/bathroom/tiling-waterproofing.jpg",
        alt: "Bathroom wall and floor tiling being installed",
      },
      "Shower & Bath Upgrades": {
        src: "/images/services/bathroom/shower-upgrade.jpg",
        alt: "Glass shower enclosure with modern shower tray",
      },
      "Small Bathrooms & Ensuites": {
        src: "/images/services/bathroom/small-bathroom.jpg",
        alt: "Compact bathroom with bright tiles and clever storage",
      },
      "Accessibility & Safety": {
        src: "/images/services/bathroom/accessibility.jpg",
        alt: "Walk-in shower with grab rails installed for safety",
      },
    },

    inclusions: [
      "On-site assessment and planning for your bathroom upgrade",
      "Installation of new fixtures and fittings as requested",
      "Tile installation, repair and finishing",
      "Clean and precise silicone sealing",
      "Final tidy-up and basic clean after completion",
      "Material supply unless agreed in advance",
    ],

    // ⚠️ Removed exclusions for plumbing, tiling, accessories, electrical — at your request
    exclusions: [
      "Work that requires planning permission or major structural alterations (moving walls, enlarging rooms, etc.)",
      "Specialised certification-required works outside the agreed renovation scope (e.g., new electrical circuits, boiler relocation, or full re-piping if not included in the quote)",
      "Hidden problems that require separate approval (e.g., severe mould behind walls, rotten floors, or leaks discovered during demolition)",
    ],

    faqs: [
      {
        q: "Can you help choose bathroom materials and fixtures?",
        a: "Yes. If you prefer, we can recommend or supply suitable options for tiles, fixtures, cabinets and finishes.",
      },
      {
        q: "Do you work on small bathrooms and ensuites?",
        a: "Absolutely. Many Dublin bathrooms are compact, and we specialise in making the most of limited space.",
      },
      {
        q: "How long does a bathroom renovation take?",
        a: "Small upgrades can be completed in a day. Full renovations typically take several days depending on size and complexity.",
      },
      {
        q: "Can you replace only the shower or vanity?",
        a: "Yes, we also offer partial bathroom upgrades — shower replacement, tiling, vanity installation and more.",
      },
      {
        q: "Do you work with rentals or landlords?",
        a: "Yes, we regularly renovate bathrooms in rental properties with landlord approval.",
      },
    ],

    // use whatever icon set you already have; example with a wrench icon:
    icon: Bath, // or Bathroom, ShowerHead, etc. from your icon library
  },
  // laminate-flooring
  {
    slug: "laminate-flooring-installation",
    title: "Laminate Flooring Installation",
    summary:
      "Laminate flooring installed professionally — with old floor removal, subfloor prep, and finishing included.",
    longDescription:
      "We install laminate flooring in homes and apartments across Dublin — ideal for bedrooms, living rooms, hallways, and more. You can supply your own laminate and underlay, or we can recommend and provide durable, stylish options to suit your needs. Our service includes removal of old flooring, subfloor preparation, precise installation, fitting of trims and thresholds, and a tidy finish. Whether it’s a new home or a refresh of an existing space, we ensure a professional result.",
    startingPrice: 2500, // €25/m²
    durationHint: "1–2 days for most rooms; time depends on size and layout",

    categories: {
      "Living & Bedrooms": [
        "Laminate flooring installation in bedrooms and lounges",
        "Removal of old laminate, carpet, or vinyl",
        "Underlay fitting and board layout planning",
        "Thresholds and finishing trims included",
      ],
      "Hallways & Entryways": [
        "Hard-wearing laminate installation for busy areas",
        "Straight and angled layouts for tricky hallway shapes",
        "Neat joins to adjacent flooring types",
        "Durable trims and scuff protection",
      ],
      "Laminate Supply & Advice": [
        "You can supply your own laminate and underlay",
        "We can also supply high-quality laminate options",
        "Advice on styles, colours, and water-resistant options",
        "Delivery coordination for supplied materials",
      ],
      "Floor Prep & Finishing": [
        "Inspection and basic levelling of subfloor",
        "Vapour barrier and underlay fitting (if required)",
        "Edge finishing with beading or scotia trims",
        "Final clean-up and floor ready to walk on",
      ],
    },

    categoryImages: {
      "Living & Bedrooms": {
        src: "/images/services/flooring/living-bedroom.jpg",
        alt: "Laminate flooring installed in a bright living room",
      },
      "Hallways & Entryways": {
        src: "/images/services/flooring/hallway-floor.jpg",
        alt: "Laminate floor fitted neatly in a hallway with trims",
      },
      "Laminate Supply & Advice": {
        src: "/images/services/flooring/floor-samples.jpg",
        alt: "Selection of laminate flooring samples being reviewed",
      },
      "Floor Prep & Finishing": {
        src: "/images/services/flooring/subfloor-prep.jpg",
        alt: "Laminate flooring installation with underlay and trim",
      },
    },

    inclusions: [
      "Removal of old laminate or carpet (if required)",
      "Inspection and basic subfloor preparation",
      "Installation of underlay and laminate boards",
      "Cutting and fitting of trims and thresholds",
      "Final tidy-up and area ready for use",
    ],
    exclusions: [
      "Major subfloor repairs (e.g., concrete levelling or rot repair)",
      "Skirting board removal or replacement unless agreed",
      "Custom stair nosings or step work unless quoted separately",
    ],

    faqs: [
      {
        q: "Can I supply my own laminate and underlay?",
        a: "Yes, you're welcome to supply your own. We’ll confirm compatibility and let you know if anything else is needed.",
      },
      {
        q: "Do you remove the old flooring?",
        a: "Yes, we can remove old laminate, carpet, or vinyl as part of the service. Please mention this when booking.",
      },
      {
        q: "Do you level the floor before laying laminate?",
        a: "We handle basic levelling to ensure a clean installation. If major levelling is required, we’ll discuss it during the quote.",
      },
      {
        q: "Can you supply the laminate flooring?",
        a: "Yes – we can recommend and supply good quality laminate and underlay to match your budget and needs.",
      },
      {
        q: "What areas of the home can you install laminate in?",
        a: "We install laminate in bedrooms, living rooms, hallways, home offices and more – anywhere dry and suitable for laminate.",
      },
    ],

    icon: Layers, // or Flooring, Ruler, Home – depending on your icon set
  },
  // fit-shower
  {
    slug: "fit-shower",
    title: "Fit Shower",
    summary: "Professional installation of showers and bathroom fittings.",
    longDescription:
      "We install electric and mixer showers (plumbing only), mount the unit and rail, seal where required and test for leaks. If electrical work is needed, a Safe Electric registered electrician will handle the connection.",
    startingPrice: 14000,
    durationHint: "2–3 hours",
    inclusions: [
      "Mount unit & rail",
      "Connect water supply",
      "Seal & leak test",
      "User checks",
    ],
    exclusions: [
      "Electrical connection unless included",
      "Tiling/major carpentry",
    ],
    faqs: [
      {
        q: "Can you supply the shower?",
        a: "You can supply it or we can recommend suitable units for Dublin water pressure.",
      },
      {
        q: "Do you do tiling?",
        a: "Minor sealing is included; re-tiling is a separate service.",
      },
    ],
    icon: ShowerHead,
  },
  // heater-maintenance
  {
    slug: "heater-maintenance",
    title: "Heater Maintenance",
    summary: "Annual check, cleaning and performance diagnostics (non-gas).",
    longDescription:
      "Keep your heating running efficiently. We perform visual safety checks, clean dust/debris, inspect connections, test controls and thermostats, and produce a short report with recommendations. For gas appliances requiring RGII certification we coordinate with a registered gas installer.",
    startingPrice: 9000,
    durationHint: "60–90 minutes",
    inclusions: [
      "Safety & visual checks",
      "Cleaning",
      "Controls tested",
      "Report",
    ],
    exclusions: ["RGII gas certification", "Parts not included"],
    faqs: [
      {
        q: "Do you work on all brands?",
        a: "Yes—most common household brands. For out-of-support units we’ll advise options.",
      },
    ],
    icon: Heater,
  },
  // fit-washing-dishwasher
  {
    slug: "fit-washing-dishwasher",
    title: "Fit Washing Machine & Dishwasher",
    summary: "Safe installation and testing of appliances.",
    longDescription:
      "We fit new washing machines and dishwashers, connect water in/out, level the unit, and run a short test cycle to confirm there are no leaks. We can also replace old hoses and valves if needed.",
    startingPrice: 5500,
    durationHint: "60–90 minutes",
    inclusions: [
      "Positioning your appliance",
      "Connect water & waste",
      "Level unit",
      "Test run & leak check",
      "Demonstrate your new appliance and complete one full cycle.",
    ],
    icon: WashingMachine,
  },
  // tap-replacement
  {
    slug: "tap-replacement",
    title: "Tap Replacement",
    summary: "Replace leaking or broken taps in kitchens and bathrooms.",
    longDescription:
      "We isolate water, remove the old tap, clean the seating, fit the new tap with fresh seals, and check for leaks. We can advise on suitable taps if your sink has a non-standard hole size.",
    startingPrice: 5000,
    durationHint: "45–60 minutes",
    inclusions: [
      "Removal & install",
      "New flexi tails if needed",
      "Leak check",
    ],
    icon: Droplet,
  },
  // lights-replacement
  {
    slug: "lights-replacement",
    title: "Lights Replacement",
    summary: "Swap old fittings for modern, efficient lighting.",
    longDescription:
      "We replace ceiling and wall light fittings, check connections, and test operation. For new circuits or outdoor wiring we involve a registered electrician for compliance.",
    startingPrice: 5000,
    durationHint: "30–60 minutes",
    inclusions: ["Remove old fitting", "Install new fitting", "Basic testing"],
    icon: Lightbulb,
  },
  // eletrical-repairs
  {
    slug: "electrical-repairs",
    title: "Electrical Repairs",
    summary: "Minor electrical fixes carried out safely and efficiently.",
    longDescription:
      "We troubleshoot common issues like broken switches, faulty sockets, and fixture replacements. For consumer unit work or new wiring we partner with a Safe Electric registered electrician.",
    startingPrice: 6000,
    durationHint: "Varies by issue",
    inclusions: [
      "Fault finding",
      "Replace defective parts (labour)",
      "Safety checks",
    ],
    icon: Zap,
  },
  // tv-assembly
  {
    slug: "tv-assembly",
    title: "TV Assembly & Installation",
    summary:
      "Professional TV installation, setup, and connection to your equipment.",
    longDescription:
      "Our experts deliver and install your new TV so you can start watching your favourite shows as soon as possible. We’ll set up your TV, connect it to any existing equipment, hook up soundbars or speakers, connect smart TVs to your WiFi, give you a full demo, and clear up all packaging when we’re done.",
    startingPrice: 6000,
    durationHint: "Varies by TV size and setup",
    inclusions: [
      "TV delivery and installation on the same day, at a time that suits you",
      "Set up your TV on a stand or mount it to a wall (wall bracket required)",
      "Connect to home cinema, soundbar, or speakers",
      "Connect to WiFi and demonstrate smart features",
      "Clear up all packaging after installation",
    ],
    icon: Tv,
  },

  // shower-repair
  {
    slug: "shower-repair",
    title: "Shower Repair & Maintenance",
    summary: "Expert repair and servicing of showers from all major brands.",
    longDescription:
      "Whether your shower is leaking, the temperature control is acting up, or you’re just not getting the pressure you used to, our technicians are on hand. We handle all types of shower repairs — from electric and mixer showers to digital systems. We work with the most trusted brands you’ll find around Dublin such as Mira, Triton and many more. You’ll receive a full diagnosis, parts replaced if needed, a demonstration of the fixed unit, and we’ll leave the area clean and tidy when we’re done.",
    startingPrice: 4500,
    durationHint: "Typically 1 to 3 hours (depends on fault & system)",
    inclusions: [
      "Inspection & fault diagnosis",
      "Replacement of worn or faulty parts",
      "System check (pressure, temperature, leak-test)",
      "Brands covered include Mira, Triton, Aqualisa and more",
      "Area cleaned and removed debris",
    ],
    icon: Wrench,
  },
];

export const SERVICE_MAP = new Map(SERVICES.map((s) => [s.slug, s]));
