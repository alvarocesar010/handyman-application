// src/lib/services.ts
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
} from "lucide-react";

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
  icon: LucideIcon; // lucide-react component type
};

export const SERVICES: Service[] = [
  {
    slug: "door-replacement",
    title: "Door Replacement",
    summary:
      "Internal/external doors replaced with hinges aligned and locks fitted.",
    longDescription:
      "We replace internal and external doors including frames when required. We measure, plane for a perfect fit, align hinges, and install or reuse handles and locks. Ideal when doors are swollen, damaged, or you want an upgrade. We can advise on suitable fire-rated or moisture-resistant doors for kitchens and bathrooms.",
    startingPrice: 5500,
    durationHint: "Usually 1–2 hours",
    inclusions: [
      "Remove old door",
      "Fit new door & hinges",
      "Plane & align",
      "Fit handle/lock",
    ],
    exclusions: [
      "Supply of door/ironmongery unless agreed",
      "Painting/varnishing",
    ],
    faqs: [
      {
        q: "Can you supply the door?",
        a: "Yes, we can source standard sizes. For custom sizes we’ll measure and advise.",
      },
      {
        q: "Do you install fire doors?",
        a: "Yes, including intumescent strips and compliant hardware where required.",
      },
    ],
    icon: DoorOpen,
  },
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
  {
    slug: "furniture-assembly",
    title: "Furniture Assembly",
    summary: "Flat-pack furniture assembled correctly and safely.",
    longDescription:
      "We assemble flat-pack furniture from popular retailers and secure tall items to walls when needed for safety. We tidy packaging and ensure doors, drawers and hinges are aligned.",
    startingPrice: 6000,
    durationHint: "Varies by item",
    inclusions: [
      "Assembly per instructions",
      "Fixings checked",
      "Area left tidy",
    ],
    icon: Wrench,
  },
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
  },
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
