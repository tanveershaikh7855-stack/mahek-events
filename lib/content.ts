// ──────────────────────────────────────────────────────────────
// MAHEK BALLOON — Centralized Content Management System
// ──────────────────────────────────────────────────────────────
// Edit this single file to update the ENTIRE website.
// Every component reads from here. If a field is empty, the
// element is hidden gracefully (no blank spaces).
// ──────────────────────────────────────────────────────────────

// ── BUSINESS ──────────────────────────────────────────────────
export const business = {
  name: "Mahek Balloons",
  tagline: "Premium Helium & Nitrogen Balloon Decoration in Pune",
  description:
    "Premium helium & nitrogen balloon decoration in Saras Baug, Pune. Balloon bouquets, birthday, wedding & event decoration. Delivery up to 70 KM across Pune.",
  founded: 2015,
  deliveryRadiusKm: 70,
  rating: 4.9,
  totalCustomers: 5000,
  yearsExperience: 11,
  email: "hello@mahekballoons.com",
  phone: "8087867988",
  phoneFormatted: "+91 8087867988",
  whatsapp: "918087867988",
  address: "Opposite Saras Baug Garden, Pune, Maharashtra",
  area: "Saras Baug, Pune",
  state: "Maharashtra",
  city: "Pune",
  pincode: "411004",
  // Localities we actively serve — used in SEO copy and JSON-LD areaServed so
  // "balloon decoration <area>" searches surface the shop.
  serviceAreas: [
    "Saras Baug",
    "Kondhwa",
    "Koregaon Park",
    "Camp",
    "Handewadi",
    "Swargate",
    "Hadapsar",
    "Wanowrie",
    "NIBM Road",
    "Market Yard",
  ],
  googleMapsUrl:
    "https://maps.app.goo.gl/8WdoEqNAuCB9Qzwf7",
  // Where the "Write a Google Review" button sends customers.
  googleReviewUrl: "https://share.google/zCi9pK84FhA4ApnKO",
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.3!2d73.8567!3d18.5074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf0e3a4b5c1d%3A0x1234567890abcdef!2sSaras%20Baug%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
} as const;

// ── SOCIAL LINKS ──────────────────────────────────────────────
export const socials = {
  instagram: "https://www.instagram.com/mahek.balloons/",
  facebook: "https://facebook.com/mahekballoons",
} as const;

// ── SEO ───────────────────────────────────────────────────────
export const seo = {
  metaTitle:
    "Mahek Balloons — Helium & Nitrogen Balloon Decoration in Saras Baug, Pune",
  metaDescription:
    "Premium helium & nitrogen balloon decoration in Saras Baug, Pune. Birthday, wedding, baby shower & event decor, balloon bouquets and party supplies. Serving Kondhwa, Koregaon Park, Camp, Handewadi & all Pune — delivery up to 70 KM. Book online, collect from our shop.",
  keywords: [
    // Core intent
    "balloon decoration Pune",
    "helium balloons Pune",
    "nitrogen balloons Pune",
    "balloon decoration Saras Baug",
    "helium balloon decoration Pune",
    "birthday decoration Pune",
    "balloon bouquets Pune",
    "party decoration Pune",
    "wedding balloon decoration Pune",
    "baby shower decoration Pune",
    "anniversary decoration Pune",
    // Locality long-tail
    "balloon decoration Kondhwa",
    "balloon decoration Koregaon Park",
    "balloon decoration Camp Pune",
    "balloon decoration Handewadi",
    "balloon decoration Hadapsar",
    "balloon decoration Swargate",
    "balloon decoration NIBM Road",
    "balloon decoration Wanowrie",
    // Product/service
    "chrome balloons",
    "foil balloons",
    "number balloons",
    "helium balloon delivery Pune",
    "balloon shop near me Pune",
    "birthday balloon decorators near me",
  ],
  ogImage: "/images/logo/logo.png",
  siteUrl: "https://mahekballoons.com",
} as const;

// ── NAVIGATION ────────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
  children?: { name: string; href: string; icon: string }[];
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Flowers", href: "/flowers" },
  { label: "Offers", href: "/offers" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Videos", href: "/videos" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Book Decoration", href: "/booking" },
];

// ── HERO ──────────────────────────────────────────────────────
export const hero = {
  badge: "Premium Balloon & Decoration Studio",
  title: "Make Every",
  highlight: "Celebration",
  subtitle: "Unforgettable",
  description:
    "Premium helium balloons, elegant bouquets, and bespoke decoration services for your most meaningful celebrations. Same-day delivery within 70 KM.",
  primaryButton: { label: "Shop Balloons", href: "/shop" },
  secondaryButton: { label: "Book Decoration", href: "/booking" },
  whatsappButton: "WhatsApp",
  image: "/images/IMG-20260728-WA0032.webp",
  stats: [
    { value: "5000+", label: "Happy Customers" },
    { value: "11+", label: "Years Experience" },
    { value: "4.9", label: "Customer Rating" },
  ],
  features: [
    "Same-Day Delivery",
    "Secure Payment",
    "On-Time Setup",
    "Premium Quality",
  ],
} as const;

export type HeroSlide = {
  image: string;
  title: string;
  subtitle: string;
  badge?: string;
  price?: string;
  cta?: { label: string; href: string };
  infoCard: { icon: string; label: string; sublabel: string };
};

export const heroCarousel: HeroSlide[] = [
  {
    image: "/images/IMG-20260728-WA0010.webp",
    title: "Premium Helium Balloons",
    subtitle: "Elegant balloon styling for your most meaningful celebrations.",
    badge: "Since 2015",
    cta: { label: "Shop Balloons", href: "/shop" },
    infoCard: { icon: "truck", label: "Same-Day Delivery", sublabel: "Within 70 KM" },
  },
  {
    image: "/images/IMG-20260728-WA0031.webp",
    title: "Wedding Room Decor",
    subtitle: "Transform your venue into a romantic paradise.",
    badge: "Premium",
    price: "Starting ₹14,999",
    cta: { label: "View Packages", href: "/services/wedding" },
    infoCard: { icon: "star", label: "4.9 Rating", sublabel: "5000+ Happy Customers" },
  },
  {
    image: "/images/IMG-20260728-WA0024.webp",
    title: "Luxury Birthday Decoration",
    subtitle: "Complete birthday setups with balloon arches and backdrops.",
    badge: "Best Seller",
    price: "Starting ₹2,499",
    cta: { label: "Book Now", href: "/booking" },
    infoCard: { icon: "map", label: "70 KM Coverage", sublabel: "Pune & Beyond" },
  },
  {
    image: "/images/IMG-20260729-WA0005.jpg",
    title: "Baby Shower Elegance",
    subtitle: "Soft pastel themes for your little one's arrival.",
    badge: "Trending",
    cta: { label: "Explore", href: "/services/baby-shower" },
    infoCard: { icon: "star", label: "Custom Designs", sublabel: "Tailored to Your Theme" },
  },
  {
    image: "/images/IMG-20260729-WA0060.jpg",
    title: "Premium Balloon Artistry",
    subtitle: "Chrome, foil & helium balloons in every color and theme.",
    badge: "New Collection",
    cta: { label: "Shop Balloons", href: "/shop" },
    infoCard: { icon: "truck", label: "Shop Pickup", sublabel: "Collect from Saras Baug" },
  },
];

// ── FEATURES BAR ──────────────────────────────────────────────
export const featuresBar = [
  { title: "Same Day Delivery", description: "Order before 2 PM" },
  { title: "Wide Coverage", description: "Pune & beyond" },
  { title: "Secure Payment", description: "COD, UPI, Cards" },
  { title: "Dedicated Support", description: "Mon-Sat 9AM-8PM" },
  { title: "On-Time Setup", description: "Punctual service" },
] as const;

// ── ABOUT ─────────────────────────────────────────────────────
export const about = {
  badge: "Our Story",
  title: "Making Celebrations",
  highlight: "Beautiful Since 2015",
  description:
    "Mahek Balloons was born from a simple idea — every celebration deserves to look as special as the moment itself. What started as a small balloon delivery service in Pune has grown into a trusted name for premium decorations.",
  story: [
    "Founded in 2015, Mahek Balloons began as a passion project — delivering beautifully arranged helium balloons for birthdays and celebrations across Pune.",
    "As demand grew, so did our vision. Today we offer a full range of decoration services including balloon bouquets, flower arrangements, wedding decor, corporate event styling, and more.",
    "Every project — whether a simple balloon bunch or a full wedding setup — receives the same attention to detail, premium materials, and commitment to excellence.",
  ],
  mission:
    "Give customers unforgettable memories through premium decoration.",
  vision:
    "To become Pune's most trusted name in celebration decor, known for creativity, quality, and heartfelt service.",
  values: {
    title: "Our Values",
    subtitle: "The principles that guide every celebration we create.",
    items: [
      {
        title: "Quality First",
        description:
          "We use only premium-grade balloons, fresh flowers, and decorator materials. Every detail matters.",
        tag: "Decorator Grade",
      },
      {
        title: "Customer Centric",
        description:
          "Your vision is our blueprint. We listen, understand, and deliver beyond expectations.",
        tag: "Custom Themes",
      },
      {
        title: "Design Excellence",
        description:
          "Our in-house stylists combine modern aesthetics with timeless elegance for every event.",
        tag: "Expert Design",
      },
      {
        title: "End-to-End Service",
        description:
          "From consultation to setup to takedown, we handle everything so you can enjoy your celebration.",
        tag: "Setup & Removal",
      },
    ],
  },
  team: {
    title: "Meet Our Team",
    subtitle: "The creative minds behind every beautiful celebration.",
    members: [
      {
        name: "Mahek Sharma",
        role: "Founder & Creative Director",
        description:
          "Founded Mahek Balloons with a vision to bring premium balloon artistry to Pune celebrations.",
        image: "/images/IMG-20260728-WA0010.webp",
      },
      {
        name: "Priya Verma",
        role: "Lead Stylist",
        description:
          "11+ years of experience creating stunning event transformations across the city.",
        image: "/images/IMG-20260728-WA0011.webp",
      },
      {
        name: "Arun Patel",
        role: "Operations Manager",
        description:
          "Ensures every delivery and setup happens on time, every time, within 70 KM radius.",
        image: "/images/IMG-20260728-WA0012.webp",
      },
    ],
  },
  cta: {
    title: "Ready to Create Magic?",
    subtitle: "Let's make your next celebration unforgettable.",
    primaryButton: { label: "Book Decoration", href: "/booking" },
    secondaryButton: { label: "Contact Us", href: "/contact" },
  },
  stats: [
    { value: "5000+", label: "Customers Served" },
    { value: "1000+", label: "Events Decorated" },
    { value: "11+", label: "Years Experience" },
    { value: "70 KM", label: "Delivery Radius" },
  ],
} as const;

// ── WHY CHOOSE US ─────────────────────────────────────────────
export const whyChooseUs = {
  badge: "Our Promise",
  title: "Why Choose Mahek Balloons?",
  items: [
    {
      title: "70 KM Delivery",
      description:
        "Same-day helium balloon delivery across Pune, Pimpri-Chinchwad, and extended suburbs.",
      tag: "Order by 2 PM",
      icon: "truck",
    },
    {
      title: "Premium Materials",
      description:
        "High-grade latex, foil balloons, and fresh flowers that look better and last longer.",
      tag: "Decorator Grade",
      icon: "sparkles",
    },
    {
      title: "Expert Design Team",
      description:
        "In-house stylists with 11+ years of combined experience creating elegant decorations.",
      tag: "Custom Themes",
      icon: "palette",
    },
    {
      title: "Secure Payment",
      description:
        "Pay via COD, UPI, Credit/Debit cards, or wallets. 50% advance confirms your date.",
      tag: "COD Available",
      icon: "shield",
    },
    {
      title: "5000+ Happy Customers",
      description:
        "Trusted by thousands across Pune for birthdays, weddings, corporate events, and proposals.",
      tag: "4.9 Star Average",
      icon: "heart",
    },
    {
      title: "End-to-End Service",
      description:
        "From concept to setup and takedown, we handle everything. You enjoy the celebration.",
      tag: "Setup & Removal",
      icon: "check-circle",
    },
  ],
} as const;

// ── STATISTICS ────────────────────────────────────────────────
export const statistics = {
  happyCustomers: "5000+",
  deliveryRadius: "70",
  rating: "4.9",
  yearsExperience: "11+",
} as const;

// ── SERVICE CATEGORIES ────────────────────────────────────────
export const serviceCategories = [
  { name: "Birthday Decoration", slug: "birthday", subtitle: "Memorable birthday setups" },
  { name: "Anniversary", slug: "anniversary", subtitle: "Romantic milestone celebrations" },
  { name: "Baby Shower", slug: "baby-shower", subtitle: "Gentle, dreamy arrivals" },
  { name: "Corporate Events", slug: "corporate", subtitle: "Polished brand experiences" },
  { name: "Wedding Decoration", slug: "wedding", subtitle: "Elegant wedding ambiance" },
  { name: "Haldi Ceremony", slug: "haldi", subtitle: "Vibrant traditional styling" },
  { name: "Reception", slug: "reception", subtitle: "Grand reception decor" },
  { name: "House Decoration", slug: "house-decoration", subtitle: "Transform your living spaces" },
  { name: "Proposal", slug: "proposal", subtitle: "Unforgettable yes moments" },
  { name: "Room Decoration", slug: "room-decoration", subtitle: "Intimate surprise setups" },
] as const;

// ── SERVICES ──────────────────────────────────────────────────
export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceFrom: number;
  image: string;
  features: string[];
}

export const servicesPage = {
  badge: "Expert Styling",
  title: "Premium Decoration Services",
  subtitle:
    "From intimate celebrations to grand events, our expert stylists create unforgettable experiences.",
  cta: {
    title: "Ready to Transform Your Event?",
    description:
      "Tell us about your event and we'll create a custom decoration plan that matches your vision and budget.",
    button: { label: "Book Your Decoration", href: "/booking" },
  },
} as const;

export const services: Service[] = [
  {
    id: "svc-1",
    name: "Birthday Decoration",
    slug: "birthday",
    description: "Tailored birthday setups from intimate home celebrations to grand venue decor.",
    priceFrom: 2499,
    image: "/images/IMG-20260728-WA0023.webp",
    features: ["Theme customization", "Balloon arch or bunches", "Backdrop & signage", "Setup & takedown"],
  },
  {
    id: "svc-2",
    name: "Anniversary Decoration",
    slug: "anniversary",
    description: "Romantic anniversary decor with candles, flowers and elegant balloon styling.",
    priceFrom: 3499,
    image: "/images/IMG-20260728-WA0029.webp",
    features: ["Romantic themes", "Flower arrangements", "Ambient lighting", "Couple signage"],
  },
  {
    id: "svc-3",
    name: "Baby Shower",
    slug: "baby-shower",
    description: "Soft, dreamy baby shower decor designed around delicate palettes and gentle details.",
    priceFrom: 3999,
    image: "/images/IMG-20260728-WA0037.webp",
    features: ["Gender reveal add-ons", "Dessert table decor", "Organic balloon garland", "Welcome signage"],
  },
  {
    id: "svc-4",
    name: "Corporate Events",
    slug: "corporate",
    description: "Brand-aligned decor for product launches, conferences and employee celebrations.",
    priceFrom: 8999,
    image: "/images/IMG-20260729-WA0012.jpg",
    features: ["Brand color matching", "Stage backdrop", "Balloon columns", "Custom prints"],
  },
  {
    id: "svc-5",
    name: "Wedding Decoration",
    slug: "wedding",
    description: "Elegant floral and balloon decor for wedding entrances, stages and dining areas.",
    priceFrom: 14999,
    image: "/images/IMG-20260728-WA0034.webp",
    features: ["Mandap & stage", "Entrance florals", "Aisle decor", "Custom palettes"],
  },
  {
    id: "svc-6",
    name: "Haldi Ceremony",
    slug: "haldi",
    description: "Vibrant haldi setups with marigolds, drapes and cheerful yellow accents.",
    priceFrom: 5999,
    image: "/images/IMG-20260728-WA0033.webp",
    features: ["Marigold arrangements", "Seat decor", "Floral jewelry station", "Photo corner"],
  },
  {
    id: "svc-7",
    name: "Reception Decor",
    slug: "reception",
    description: "Grand reception decor combining florals, lighting and bespoke centerpieces.",
    priceFrom: 19999,
    image: "/images/IMG-20260728-WA0030.webp",
    features: ["Grand entrance", "Stage design", "Table centerpieces", "Ambient lighting"],
  },
  {
    id: "svc-8",
    name: "House Decoration",
    slug: "house-decoration",
    description: "Transform living spaces for festivals, poojas or intimate family gatherings.",
    priceFrom: 4999,
    image: "/images/IMG-20260728-WA0035.webp",
    features: ["Room styling", "Floral torans", "Festival themes", "Same day service"],
  },
  {
    id: "svc-9",
    name: "Proposal Decoration",
    slug: "proposal",
    description: "Discreet, beautiful and unforgettable proposal setups for your special moment.",
    priceFrom: 5499,
    image: "/images/IMG-20260728-WA0028.webp",
    features: ["Private venue styling", "Candle pathways", "Marry me signage", "Photography add-ons"],
  },
  {
    id: "svc-10",
    name: "Room Decoration",
    slug: "room-decoration",
    description: "Intimate room setups for birthdays, anniversaries or surprise celebrations.",
    priceFrom: 2999,
    image: "/images/IMG-20260729-WA0004.jpg",
    features: ["Bed decor", "Balloon floor scatter", "Fairy lights", "Cake table styling"],
  },
];

// ── PRODUCT CATEGORIES ────────────────────────────────────────
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  type: "PRODUCT" | "SERVICE";
  image: string;
}

export const productCategories: ProductCategory[] = [
  { id: "cat-1", name: "Helium Balloons", slug: "helium-balloons", subtitle: "Floating elegance for every occasion", type: "PRODUCT", image: "/images/IMG-20260729-WA0010.jpg" },
  { id: "cat-2", name: "Balloon Bouquets", slug: "balloon-bouquets", subtitle: "Curated bunches, hand-tied with care", type: "PRODUCT", image: "/images/IMG-20260728-WA0047.webp" },
  { id: "cat-3", name: "Balloon Packets", slug: "balloon-packets", subtitle: "Ready-to-fill premium balloons", type: "PRODUCT", image: "/images/IMG-20260729-WA0060.jpg" },
  { id: "cat-4", name: "Party Supplies", slug: "party-supplies", subtitle: "Complete celebration essentials", type: "PRODUCT", image: "/images/IMG-20260728-WA0025.webp" },
  { id: "cat-5", name: "Flower Bouquets", slug: "flower-bouquets", subtitle: "Fresh blooms for meaningful moments", type: "PRODUCT", image: "/images/IMG-20260729-WA0075.jpg" },
  { id: "cat-6", name: "Chrome Balloons", slug: "chrome-balloons", subtitle: "Mirror-finish metallic balloons", type: "PRODUCT", image: "/images/IMG-20260728-WA0045.webp" },
  { id: "cat-7", name: "Foil Balloons", slug: "foil-balloons", subtitle: "Premium foil balloons for every theme", type: "PRODUCT", image: "/images/IMG-20260729-WA0068.jpg" },
  { id: "cat-8", name: "Shape Balloons", slug: "shape-balloons", subtitle: "Unique shaped balloons for celebrations", type: "PRODUCT", image: "/images/IMG-20260728-WA0044.webp" },
  { id: "cat-9", name: "Number Balloons", slug: "number-balloons", subtitle: "Celebrate milestones with number balloons", type: "PRODUCT", image: "/images/IMG-20260729-WA0080.jpg" },
];

// ── PRODUCTS ──────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  basePrice: number;
  salePrice: number | null;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  deliveryBadge: string;
  categoryId: string;
  images: string[];
  tags: string[];
  variants?: Array<{ label: string; options: string[] }>;
}

export const products: Product[] = [
  // ── HELIUM BALLOONS ──────────────────────────────────────────
  { id: "prod-1", name: "Pastel Helium Balloon Bunch", slug: "pastel-helium-balloon-bunch", shortDesc: "12 premium helium balloons in soft pastel tones.", description: "A refined bunch of 12 helium-filled balloons in blush, ivory and soft peach. Tied with satin ribbon and weighted for easy placement.", basePrice: 799, salePrice: 699, sku: "HB-001", stock: 50, rating: 4.9, reviewCount: 128, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/IMG-20260728-WA0010.webp", "/images/IMG-20260728-WA0033.webp"], tags: ["pastel", "helium", "birthday", "elegant"], variants: [{ label: "Color", options: ["Pastel Mix", "Rose Gold", "Ivory", "Lavender"] }] },
  { id: "prod-2", name: "Chrome Foil Balloon Set", slug: "chrome-foil-balloon-set", shortDesc: "Reflective chrome foil balloons for premium decor.", description: "Set of 6 chrome foil balloons in your choice of silver, gold or rose gold. Perfect for milestone celebrations.", basePrice: 599, salePrice: null, sku: "HB-002", stock: 100, rating: 4.7, reviewCount: 42, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/IMG-20260728-WA0045.webp", "/images/IMG-20260728-WA0012.webp"], tags: ["chrome", "foil", "premium", "milestone"], variants: [{ label: "Color", options: ["Silver", "Gold", "Rose Gold", "Copper"] }] },
  { id: "prod-3", name: "Giant Helium Balloon 36 inch", slug: "giant-helium-balloon-36", shortDesc: "Oversized latex balloon for dramatic effect.", description: "A show-stopping 36-inch giant helium balloon. Available in solid colors with optional ribbon tail.", basePrice: 349, salePrice: null, sku: "HB-003", stock: 80, rating: 4.6, reviewCount: 67, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/IMG-20260728-WA0026.webp", "/images/IMG-20260728-WA0050.webp"], tags: ["giant", "latex", "dramatic", "statement"], variants: [{ label: "Color", options: ["White", "Black", "Gold", "Red", "Pink"] }] },
  { id: "prod-4", name: "Metallic Helium Balloon Bouquet", slug: "metallic-helium-balloon-bouquet", shortDesc: "Mixed metallic helium balloons with confetti.", description: "Bundle of 8 metallic helium balloons with confetti fill. Creates a dazzling display for any celebration.", basePrice: 1099, salePrice: 949, sku: "HB-004", stock: 35, rating: 4.8, reviewCount: 91, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/IMG-20260728-WA0013.webp", "/images/IMG-20260729-WA0060.jpg"], tags: ["metallic", "confetti", "dazzling", "celebration"], variants: [{ label: "Theme", options: ["Gold & Silver", "Rose Gold", "Rainbow Metallic"] }] },
  { id: "prod-5", name: "Pearl White Helium Bunch", slug: "pearl-white-helium-bunch", shortDesc: "Elegant pearl finish helium balloons.", description: "10 helium balloons with a soft pearl finish. Perfect for weddings, anniversaries and sophisticated events.", basePrice: 899, salePrice: null, sku: "HB-005", stock: 40, rating: 4.9, reviewCount: 56, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/IMG-20260728-WA0019.webp", "/images/IMG-20260728-WA0047.webp"], tags: ["pearl", "white", "wedding", "elegant"], variants: [{ label: "Size", options: ["Standard 12 inch", "Large 18 inch"] }] },
  { id: "prod-6", name: "Rainbow Helium Balloon Bunch", slug: "neon-glow-helium-balloons", shortDesc: "Vibrant multicolour helium balloons for a joyful pop.", description: "A cheerful bunch of 15 metallic rainbow helium balloons. Perfect for kids' parties, colourful themes and celebrations that need a bright, happy burst of colour.", basePrice: 699, salePrice: 599, sku: "HB-006", stock: 60, rating: 4.5, reviewCount: 38, isFeatured: false, deliveryBadge: "Next Day", categoryId: "cat-1", images: ["/images/IMG-20260729-WA0010.jpg", "/images/IMG-20260729-WA0080.jpg"], tags: ["rainbow", "colourful", "vibrant", "kids-party"], variants: [{ label: "Colour Pack", options: ["Full Rainbow", "Bright Primary", "Pastel Mix"] }] },
  { id: "prod-7", name: "Helium Balloon Garland Kit", slug: "helium-balloon-garland-kit", shortDesc: "DIY helium balloon garland with strip tape.", description: "Everything you need to create a stunning balloon garland. Includes 50 balloons, decorating strip, glue dots and ribbon.", basePrice: 1299, salePrice: 1099, sku: "HB-007", stock: 25, rating: 4.7, reviewCount: 74, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/IMG-20260728-WA0032.webp", "/images/IMG-20260728-WA0034.webp"], tags: ["diy", "garland", "kit", "decorating"], variants: [{ label: "Theme", options: ["Eucalyptus Green", "Blush Pink", "Gold & White", "Sage Green"] }] },
  { id: "prod-8", name: "Birthday Number Helium Balloon", slug: "birthday-number-helium-balloon", shortDesc: "Large foil number balloon with helium.", description: "Single 40-inch foil number balloon filled with helium. Available in digits 0-9 and in gold, silver, or rose gold.", basePrice: 449, salePrice: null, sku: "HB-008", stock: 120, rating: 4.6, reviewCount: 203, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/IMG-20260728-WA0022.webp", "/images/IMG-20260728-WA0014.webp"], tags: ["number", "birthday", "foil", "milestone"], variants: [{ label: "Digit", options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] }, { label: "Color", options: ["Gold", "Silver", "Rose Gold"] }] },
  { id: "prod-9", name: "Helium Balloon Tower Kit", slug: "helium-balloon-tower-kit", shortDesc: "Stackable balloon column kit with base.", description: "Create a 6-foot balloon column with this complete kit. Includes balloons, column strip, base plate and weights.", basePrice: 1599, salePrice: 1399, sku: "HB-009", stock: 15, rating: 4.8, reviewCount: 29, isFeatured: false, deliveryBadge: "Next Day", categoryId: "cat-1", images: ["/images/IMG-20260729-WA0030.jpg", "/images/IMG-20260728-WA0038.webp"], tags: ["tower", "column", "kit", "statement"], variants: [{ label: "Color", options: ["Gold & White", "Rose Gold & Blush", "Navy & Silver"] }] },
  { id: "prod-10", name: "Organic Balloon Arch Kit", slug: "organic-balloon-arch-kit", shortDesc: "Mixed-size balloons for organic arch.", description: "Premium kit with 120 balloons in varied sizes (5, 10, 12, 18 inch) for a stunning organic balloon arch.", basePrice: 2499, salePrice: 2199, sku: "HB-010", stock: 20, rating: 4.9, reviewCount: 45, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/IMG-20260728-WA0032.webp", "/images/IMG-20260728-WA0035.webp"], tags: ["organic", "arch", "premium", "mixed-size"], variants: [{ label: "Theme", options: ["Sage Green & White", "Blush & Gold", "Navy & White", "Rainbow"] }] },

  // ── BALLOON BOUQUETS ─────────────────────────────────────────
  { id: "prod-21", name: "Rose Gold Birthday Bouquet", slug: "rose-gold-birthday-bouquet", shortDesc: "Luxury birthday balloon bouquet with confetti accents.", description: "Make birthdays unforgettable with this rose gold and confetti balloon bouquet. Includes number option and premium box packaging.", basePrice: 1499, salePrice: 1299, sku: "BB-001", stock: 30, rating: 4.8, reviewCount: 86, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-2", images: ["/images/IMG-20260728-WA0046.webp", "/images/IMG-20260728-WA0040.webp", "/images/IMG-20260728-WA0041.webp"], tags: ["rose-gold", "birthday", "luxury", "confetti"], variants: [{ label: "Number", options: ["18", "21", "25", "30", "40", "50"] }] },
  { id: "prod-22", name: "Gender Reveal Balloon Box", slug: "gender-reveal-balloon-box", shortDesc: "Surprise balloon box with confetti poppers.", description: "A beautifully wrapped box that releases pink or blue balloons when opened. Includes confetti poppers and a cake topper.", basePrice: 1299, salePrice: 1199, sku: "BB-002", stock: 25, rating: 4.8, reviewCount: 53, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-2", images: ["/images/IMG-20260728-WA0038.webp", "/images/IMG-20260728-WA0036.webp", "/images/IMG-20260728-WA0039.webp"], tags: ["gender-reveal", "surprise", "baby", "confetti"], variants: [{ label: "Reveal", options: ["Boy", "Girl", "Twins"] }] },
  { id: "prod-23", name: "Elegant Wedding Bouquet", slug: "elegant-wedding-bouquet", shortDesc: "White and gold balloon bouquet for weddings.", description: "Sophisticated wedding balloon bouquet featuring white, gold and pearl balloons with silk ribbon accents.", basePrice: 2499, salePrice: 2199, sku: "BB-003", stock: 15, rating: 4.9, reviewCount: 41, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-2", images: ["/images/IMG-20260728-WA0043.webp", "/images/IMG-20260728-WA0047.webp", "/images/IMG-20260728-WA0042.webp"], tags: ["wedding", "elegant", "white", "gold"], variants: [{ label: "Style", options: ["Classic", "Modern", "Rustic"] }] },
  { id: "prod-24", name: "Kids Birthday Bouquet", slug: "kids-birthday-bouquet", shortDesc: "Colorful balloon bouquet for children.", description: "A fun, vibrant balloon bouquet with cartoon-themed foil balloons, latex balloons and a mini gift bag.", basePrice: 999, salePrice: 849, sku: "BB-004", stock: 40, rating: 4.7, reviewCount: 112, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-2", images: ["/images/IMG-20260729-WA0018.jpg", "/images/IMG-20260729-WA0020.jpg", "/images/IMG-20260729-WA0090.jpg"], tags: ["kids", "colorful", "cartoon", "fun"], variants: [{ label: "Theme", options: ["Unicorn", "Dinosaur", "Space", "Princess", "Cars"] }] },
  { id: "prod-25", name: "Anniversary Heart Bouquet", slug: "anniversary-heart-bouquet", shortDesc: "Heart-shaped foil balloons with roses.", description: "Romantic anniversary bouquet with heart-shaped foil balloons, artificial roses and fairy lights.", basePrice: 1799, salePrice: 1599, sku: "BB-005", stock: 20, rating: 4.9, reviewCount: 38, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-2", images: ["/images/IMG-20260728-WA0048.webp", "/images/IMG-20260729-WA0068.jpg", "/images/IMG-20260728-WA0050.webp"], tags: ["anniversary", "heart", "romantic", "roses"], variants: [{ label: "Anniversary Year", options: ["1st", "5th", "10th", "25th", "50th"] }] },

  // ── CHROME BALLOONS ──────────────────────────────────────────
  { id: "prod-101", name: "Chrome Gold Latex 12 inch", slug: "chrome-gold-latex-12", shortDesc: "Mirror-finish gold chrome balloons.", description: "Premium chrome-finish latex balloons with stunning mirror-like gold shine. 12 inch size, pack of 10.", basePrice: 399, salePrice: 349, sku: "CH-001", stock: 150, rating: 4.8, reviewCount: 124, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-6", images: ["/images/IMG-20260728-WA0045.webp", "/images/IMG-20260729-WA0012.jpg"], tags: ["chrome", "gold", "mirror", "metallic"], variants: [{ label: "Color", options: ["Gold", "Silver", "Rose Gold", "Copper", "Blue"] }] },
  { id: "prod-102", name: "Chrome Silver Latex 12 inch", slug: "chrome-silver-latex-12", shortDesc: "Mirror-finish silver chrome balloons.", description: "High-shine silver chrome balloons for elegant decor. Pack of 10, decorator grade quality.", basePrice: 399, salePrice: null, sku: "CH-002", stock: 120, rating: 4.7, reviewCount: 98, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-6", images: ["/images/IMG-20260729-WA0060.jpg", "/images/IMG-20260728-WA0013.webp"], tags: ["chrome", "silver", "mirror", "elegant"], variants: [{ label: "Color", options: ["Silver", "Gold", "Rose Gold"] }] },
  { id: "prod-103", name: "Chrome Rose Gold Latex 12 inch", slug: "chrome-rose-gold-latex-12", shortDesc: "Trending rose gold chrome balloons.", description: "Instagram-trending rose gold chrome balloons with reflective mirror finish. Pack of 10.", basePrice: 449, salePrice: 399, sku: "CH-003", stock: 100, rating: 4.9, reviewCount: 156, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-6", images: ["/images/IMG-20260728-WA0034.webp", "/images/IMG-20260728-WA0014.webp"], tags: ["chrome", "rose-gold", "trending", "instagram"], variants: [{ label: "Color", options: ["Rose Gold", "Gold", "Silver"] }] },

  // ── FOIL BALLOONS ────────────────────────────────────────────
  { id: "prod-111", name: "Happy Birthday Foil Banner", slug: "happy-birthday-foil-banner", shortDesc: "Gold foil happy birthday letters.", description: "Individual gold foil letter balloons spelling Happy Birthday. Self-sealing, reusable.", basePrice: 499, salePrice: 449, sku: "FL-001", stock: 100, rating: 4.7, reviewCount: 189, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-7", images: ["/images/IMG-20260728-WA0011.webp", "/images/IMG-20260728-WA0025.webp"], tags: ["foil", "banner", "birthday", "gold"], variants: [{ label: "Color", options: ["Gold", "Silver", "Rose Gold", "Black"] }] },
  { id: "prod-112", name: "Star Foil Balloon 18 inch", slug: "star-foil-balloon-18", shortDesc: "Metallic star-shaped foil balloon.", description: "Beautiful 5-point star foil balloon in metallic finish. Self-sealing valve. Pack of 6.", basePrice: 349, salePrice: null, sku: "FL-002", stock: 120, rating: 4.6, reviewCount: 98, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-7", images: ["/images/IMG-20260729-WA0020.jpg", "/images/IMG-20260728-WA0022.webp"], tags: ["foil", "star", "metallic", "pack"], variants: [{ label: "Color", options: ["Gold", "Silver", "Rose Gold", "Red"] }] },
  { id: "prod-113", name: "Heart Foil Balloon 18 inch", slug: "heart-foil-balloon-18", shortDesc: "Romantic heart-shaped foil balloon.", description: "Glossy heart-shaped foil balloon for romantic occasions. Self-sealing, reusable. Pack of 4.", basePrice: 399, salePrice: 349, sku: "FL-003", stock: 90, rating: 4.8, reviewCount: 134, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-7", images: ["/images/IMG-20260729-WA0068.jpg", "/images/IMG-20260728-WA0050.webp"], tags: ["foil", "heart", "romantic", "valentine"], variants: [{ label: "Color", options: ["Red", "Pink", "Gold", "Rose Gold", "White"] }] },

  // ── SHAPE BALLOONS ───────────────────────────────────────────
  { id: "prod-121", name: "Unicorn Shape Foil Balloon", slug: "unicorn-shape-foil", shortDesc: "Magical unicorn-shaped balloon.", description: "Adorable unicorn-shaped foil balloon for kids' parties. Self-sealing, reusable. 30 inch tall.", basePrice: 299, salePrice: 249, sku: "SH-001", stock: 80, rating: 4.8, reviewCount: 156, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-8", images: ["/images/IMG-20260728-WA0015.webp"], tags: ["shape", "unicorn", "kids", "magical"], variants: [] },
  { id: "prod-122", name: "Crown Shape Foil Balloon", slug: "crown-shape-foil", shortDesc: "Royal crown-shaped balloon.", description: "Elegant crown-shaped foil balloon for birthday royalty. Gold metallic finish. 24 inch.", basePrice: 249, salePrice: null, sku: "SH-002", stock: 90, rating: 4.7, reviewCount: 89, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-8", images: ["/images/IMG-20260728-WA0045.webp"], tags: ["shape", "crown", "royal", "gold"], variants: [{ label: "Color", options: ["Gold", "Silver", "Rose Gold"] }] },
  { id: "prod-123", name: "Butterfly Shape Foil Balloon", slug: "butterfly-shape-foil", shortDesc: "Delicate butterfly-shaped balloon.", description: "Beautiful butterfly-shaped foil balloon for garden parties and spring events. 18 inch wingspan.", basePrice: 199, salePrice: null, sku: "SH-003", stock: 70, rating: 4.6, reviewCount: 67, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-8", images: ["/images/IMG-20260728-WA0044.webp", "/images/IMG-20260729-WA0045.jpg", "/images/IMG-20260728-WA0049.webp"], tags: ["shape", "butterfly", "garden", "spring"], variants: [{ label: "Color", options: ["Pink", "Blue", "Gold", "Rainbow"] }] },

  // ── NUMBER BALLOONS ──────────────────────────────────────────
  { id: "prod-131", name: "Gold Number Balloon 40 inch", slug: "gold-number-balloon-40", shortDesc: "Large gold foil number balloon.", description: "Premium 40-inch gold foil number balloon. Self-sealing, reusable. Choose any digit 0-9.", basePrice: 299, salePrice: 249, sku: "NB-001", stock: 200, rating: 4.8, reviewCount: 345, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-9", images: ["/images/IMG-20260729-WA0080.jpg", "/images/IMG-20260728-WA0024.webp"], tags: ["number", "gold", "milestone", "birthday"], variants: [{ label: "Digit", options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] }, { label: "Color", options: ["Gold", "Silver", "Rose Gold", "Black", "Blue", "Pink"] }] },
  { id: "prod-132", name: "Silver Number Balloon 40 inch", slug: "silver-number-balloon-40", shortDesc: "Large silver foil number balloon.", description: "Shiny 40-inch silver foil number balloon. Perfect for milestone birthdays and anniversaries.", basePrice: 299, salePrice: null, sku: "NB-002", stock: 180, rating: 4.7, reviewCount: 267, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-9", images: ["/images/IMG-20260728-WA0022.webp", "/images/IMG-20260728-WA0023.webp"], tags: ["number", "silver", "milestone", "anniversary"], variants: [{ label: "Digit", options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] }, { label: "Color", options: ["Silver", "Gold", "Rose Gold"] }] },
  { id: "prod-133", name: "Rose Gold Number Balloon 40 inch", slug: "rose-gold-number-balloon-40", shortDesc: "Trending rose gold number balloon.", description: "Instagram-trending 40-inch rose gold foil number balloon. Self-sealing, reusable.", basePrice: 349, salePrice: 299, sku: "NB-003", stock: 150, rating: 4.9, reviewCount: 312, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-9", images: ["/images/IMG-20260728-WA0014.webp", "/images/IMG-20260728-WA0046.webp"], tags: ["number", "rose-gold", "trending", "birthday"], variants: [{ label: "Digit", options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] }, { label: "Color", options: ["Rose Gold", "Gold", "Silver"] }] },

  // ── PARTY SUPPLIES ───────────────────────────────────────────
  { id: "prod-61", name: "Proposal Room Decoration Kit", slug: "proposal-room-decoration-kit", shortDesc: "Complete candle and balloon room setup kit.", description: "Everything needed for an intimate proposal: balloons, candles, rose petals, fairy lights and a marquee 'Marry Me' sign.", basePrice: 3499, salePrice: 2999, sku: "PS-001", stock: 15, rating: 5.0, reviewCount: 34, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-4", images: ["/images/IMG-20260728-WA0028.webp", "/images/IMG-20260728-WA0029.webp", "/images/IMG-20260729-WA0004.jpg"], tags: ["proposal", "room", "romantic", "kit"], variants: [{ label: "Theme", options: ["Classic Red", "White & Gold", "Blush"] }] },
  { id: "prod-62", name: "Happy Birthday Balloon Banner", slug: "happy-birthday-balloon-banner", shortDesc: "Foil letter banner with matching balloons.", description: "Reusable foil 'Happy Birthday' banner with a set of 20 matching latex balloons and weights.", basePrice: 899, salePrice: 749, sku: "PS-002", stock: 60, rating: 4.5, reviewCount: 91, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-4", images: ["/images/IMG-20260728-WA0025.webp", "/images/IMG-20260728-WA0011.webp"], tags: ["birthday", "banner", "foil", "reusable"], variants: [{ label: "Color", options: ["Gold", "Rose Gold", "Silver", "Multicolor"] }] },
  { id: "prod-63", name: "LED Fairy String Lights", slug: "led-fairy-string-lights", shortDesc: "10-meter warm white fairy lights.", description: "Battery-operated warm white LED fairy lights. Waterproof, flexible and perfect for event decor.", basePrice: 399, salePrice: 349, sku: "PS-003", stock: 100, rating: 4.6, reviewCount: 178, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-4", images: ["/images/IMG-20260728-WA0033.webp"], tags: ["led", "fairy-lights", "warm", "decor"] },

  // ── FLOWER BOUQUETS ──────────────────────────────────────────
  { id: "prod-81", name: "White & Green Flower Bouquet", slug: "white-green-flower-bouquet", shortDesc: "Elegant seasonal blooms with eucalyptus.", description: "A timeless arrangement of white seasonal flowers, eucalyptus and soft greenery. Wrapped in premium kraft paper.", basePrice: 1199, salePrice: null, sku: "FB-001", stock: 20, rating: 4.9, reviewCount: 67, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-5", images: ["/images/IMG-20260729-WA0075.jpg", "/images/IMG-20260729-WA0005.jpg"], tags: ["flowers", "white", "green", "elegant"], variants: [{ label: "Size", options: ["Small", "Medium", "Large"] }] },
  { id: "prod-82", name: "Rose Gold Rose Bouquet", slug: "rose-gold-rose-bouquet", shortDesc: "Preserved roses in rose gold box.", description: "Eternal preserved roses arranged in a luxury rose gold box. Lasts 1-2 years without maintenance.", basePrice: 2999, salePrice: 2699, sku: "FB-002", stock: 15, rating: 4.9, reviewCount: 43, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-5", images: ["/images/IMG-20260729-WA0092.jpg", "/images/IMG-20260729-WA0005.jpg"], tags: ["roses", "preserved", "luxury", "rose-gold"], variants: [{ label: "Rose Count", options: ["9 Roses", "16 Roses", "25 Roses", "36 Roses"] }] },
  { id: "prod-83", name: "Mixed Seasonal Bouquet", slug: "mixed-seasonal-bouquet", shortDesc: "Fresh seasonal flowers in mixed colors.", description: "A cheerful mix of seasonal flowers hand-tied with satin ribbon. Changes with the freshest available blooms.", basePrice: 899, salePrice: 799, sku: "FB-003", stock: 25, rating: 4.7, reviewCount: 89, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-5", images: ["/images/IMG-20260729-WA0005.jpg", "/images/IMG-20260729-WA0092.jpg"], tags: ["flowers", "seasonal", "mixed", "fresh"], variants: [] },
];

// ── GALLERY ───────────────────────────────────────────────────
export interface GalleryImage {
  id: string;
  category: string;
  image: string;
  title: string;
}

export const galleryCategories = [
  "All Work",
  "Birthday",
  "Wedding",
  "Baby Shower",
  "Corporate",
  "Proposal",
  "Room Decor",
] as const;

export const galleryImages: GalleryImage[] = [
  // Birthday
  { id: "g1", category: "birthday", image: "/images/IMG-20260728-WA0024.webp", title: "Black & Gold First Birthday" },
  { id: "g2", category: "birthday", image: "/images/IMG-20260728-WA0023.webp", title: "Blue Second Birthday Setup" },
  { id: "g3", category: "birthday", image: "/images/IMG-20260728-WA0011.webp", title: "Happy Birthday Banner Theme" },
  { id: "g4", category: "birthday", image: "/images/IMG-20260729-WA0090.jpg", title: "Boss Baby Birthday" },
  { id: "g5", category: "birthday", image: "/images/IMG-20260728-WA0010.webp", title: "Pastel First Birthday" },
  // Wedding
  { id: "g6", category: "wedding", image: "/images/IMG-20260728-WA0043.webp", title: "Sage & Gold Bubble Bouquet" },
  { id: "g7", category: "wedding", image: "/images/IMG-20260728-WA0047.webp", title: "Elegant Neutral Bouquet" },
  // Baby Shower
  { id: "g8", category: "baby-shower", image: "/images/IMG-20260728-WA0037.webp", title: "Baby Blocks & Cloud Setup" },
  { id: "g9", category: "baby-shower", image: "/images/IMG-20260729-WA0005.jpg", title: "Welcome Home Baby Room" },
  { id: "g10", category: "baby-shower", image: "/images/IMG-20260728-WA0038.webp", title: "Gender Reveal Bouquets" },
  // Corporate
  { id: "g11", category: "corporate", image: "/images/IMG-20260728-WA0032.webp", title: "Restaurant Balloon Arch" },
  { id: "g12", category: "corporate", image: "/images/IMG-20260729-WA0012.jpg", title: "Rose Gold Ceiling Decor" },
  { id: "g13", category: "corporate", image: "/images/IMG-20260728-WA0031.webp", title: "Silver Lounge Celebration" },
  // Proposal
  { id: "g14", category: "proposal", image: "/images/IMG-20260728-WA0028.webp", title: "Red Heart Proposal Room" },
  { id: "g15", category: "proposal", image: "/images/IMG-20260728-WA0029.webp", title: "Red Hearts Ceiling" },
  { id: "g16", category: "proposal", image: "/images/IMG-20260729-WA0004.jpg", title: "Romantic Bedroom Surprise" },
  // Room Decor
  { id: "g17", category: "room-decor", image: "/images/IMG-20260728-WA0021.webp", title: "Blue Room Decoration" },
  { id: "g18", category: "room-decor", image: "/images/IMG-20260728-WA0034.webp", title: "Rose Gold Ceiling Room" },
  { id: "g19", category: "room-decor", image: "/images/IMG-20260728-WA0035.webp", title: "Teal Ceiling Room" },
  { id: "g20", category: "room-decor", image: "/images/IMG-20260728-WA0033.webp", title: "Pastel Ceiling & Flowers" },
];

// ── TESTIMONIALS ──────────────────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  review: string;
  verified: boolean;
}

export const testimonialsPage = {
  badge: "Testimonials",
  title: "What Our Customers Say",
  subtitle: "Trusted by thousands across Pune for premium balloons and decorations.",
  cta: {
    title: "Join 5000+ happy customers",
    subtitle: "Your satisfaction is our priority. Every review drives us to do better.",
  },
} as const;

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Pune",
    image: "/images/IMG-20260728-WA0013.webp",
    rating: 5,
    review:
      "The balloon bouquet arrived exactly as shown. Premium packaging and the balloons stayed afloat for days. Will definitely order again.",
    verified: true,
  },
  {
    id: "2",
    name: "Rahul Mehta",
    location: "Pimpri-Chinchwad",
    image: "/images/IMG-20260728-WA0014.webp",
    rating: 5,
    review:
      "Mahek Balloons transformed our anniversary celebration. The decor was elegant, not gaudy, and the team was professional from start to finish.",
    verified: true,
  },
  {
    id: "3",
    name: "Ananya Patel",
    location: "Pune",
    image: "/images/IMG-20260728-WA0015.webp",
    rating: 5,
    review:
      "I planned a surprise proposal and they handled every detail discreetly and beautifully. Worth every rupee for the peace of mind.",
    verified: true,
  },
  {
    id: "4",
    name: "Vikram Joshi",
    location: "Pune",
    image: "/images/IMG-20260728-WA0019.webp",
    rating: 5,
    review:
      "Ordered corporate event decorations for our product launch. The branding colors matched perfectly. Fast delivery within the 70 KM range.",
    verified: true,
  },
  {
    id: "5",
    name: "Sneha Kulkarni",
    location: "Pune",
    image: "/images/IMG-20260728-WA0020.webp",
    rating: 5,
    review:
      "My daughter's birthday was absolutely magical thanks to Mahek Balloons. The unicorn theme setup was beyond our expectations!",
    verified: true,
  },
  {
    id: "6",
    name: "Amit Deshmukh",
    location: "Pune",
    image: "/images/IMG-20260728-WA0021.webp",
    rating: 5,
    review:
      "Outstanding service! The team arrived early, set up everything perfectly, and even helped with last-minute changes. Highly recommended.",
    verified: true,
  },
];

// ── FAQ ───────────────────────────────────────────────────────
export const faqPage = {
  badge: "FAQ",
  title: "Frequently Asked Questions",
  subtitle: "Everything you need to know about balloons, decorations, delivery, and more.",
  searchPlaceholder: "Search questions...",
  noResults: "No results found",
  noResultsHint: "Try a different search term.",
} as const;

export const faqs = [
  {
    question: "Where is Mahek Balloons located?",
    answer:
      "We are located opposite Saras Baug Garden, Pune. We serve all of Pune including Kondhwa, Koregaon Park, Camp, Handewadi, Hadapsar, Swargate, NIBM Road and Wanowrie, with delivery up to 70 KM.",
  },
  {
    question: "Do you make helium and nitrogen balloons?",
    answer:
      "Yes. We specialise in premium helium balloon decoration and also offer nitrogen-filled balloons. From single helium bunches to complete event decoration, everything is prepared fresh in our Saras Baug studio.",
  },
  {
    question: "Do I collect my order from the shop or is it delivered?",
    answer:
      "For balloon products, you book online and then collect your order from our Saras Baug shop at your chosen time — this keeps helium balloons fresh and perfectly inflated. For full decoration bookings, our team travels to your venue and sets up on site (delivery up to 70 KM across Pune).",
  },
  {
    question: "Do you deliver helium balloons within 70 KM?",
    answer:
      "Our decoration and setup service covers a 70 KM radius from Pune. Balloon products ordered online are collected from our Saras Baug shop. Charges for on-site decoration are based on your distance.",
  },
  {
    question: "How do I book a decoration service?",
    answer:
      "Choose your event type on our Services page and click 'Book Decoration'. Fill in the event details, date, venue and budget. Our team will confirm your booking via WhatsApp and email within 2 hours.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Cash on Delivery (COD), UPI, Credit/Debit cards and wallets. For decoration bookings, a 50% advance is required to confirm your slot.",
  },
  {
    question: "Can I customize balloon colors and themes?",
    answer:
      "Absolutely. Most products support color or theme variants. For large events, contact us directly via WhatsApp for fully custom packages.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Product orders can be cancelled before dispatch. Decoration bookings cancelled 48 hours before the event receive a full advance refund. Cancellations within 48 hours are non-refundable.",
  },
  {
    question: "Do you provide same-day delivery?",
    answer:
      "Yes, for all in-stock helium balloon products ordered before 2 PM. Same-day decoration setup requires at least 6 hours notice and is subject to availability.",
  },
];

// ── DELIVERY ──────────────────────────────────────────────────
export const delivery = {
  area: "Saras Baug, Pune",
  radius: 70,
  charges: [
    { minDistance: 0, maxDistance: 10, charge: 0, freeAbove: 499 },
    { minDistance: 10, maxDistance: 30, charge: 99, freeAbove: 999 },
    { minDistance: 30, maxDistance: 50, charge: 199, freeAbove: 1999 },
    { minDistance: 50, maxDistance: 70, charge: 349, freeAbove: 2999 },
  ],
} as const;

// ── CONTACT ───────────────────────────────────────────────────
export const contactPage = {
  badge: "Contact Us",
  title: "Get in Touch",
  subtitle: "Have a question about balloons, decorations, or delivery? We're here to help.",
  businessHours: "Mon - Sat, 9:00 AM - 8:00 PM",
  whatsapp: "Chat with us",
  instagram: "@mahek.balloons",
  form: {
    title: "Send Us a Message",
    nameLabel: "Your Name *",
    namePlaceholder: "Full name",
    phoneLabel: "Phone Number *",
    phonePlaceholder: "+91 8087867988",
    emailLabel: "Email Address",
    emailPlaceholder: "your@email.com",
    messageLabel: "Message *",
    messagePlaceholder: "Tell us how we can help you...",
    submitButton: "Send Message",
    successTitle: "Message Sent!",
    successMessage: "Thank you for reaching out. Our team will get back to you within 2 hours during business hours.",
    sendAnother: "Send Another Message",
  },
} as const;

// ── BOOKING ───────────────────────────────────────────────────
export const bookingPage = {
  badge: "Book Decoration",
  title: "Book Your Decoration",
  subtitle: "Tell us about your event and our team will create the perfect decoration plan within 2 hours.",
  form: {
    contactTitle: "Contact Information",
    nameLabel: "Full Name *",
    namePlaceholder: "Your full name",
    phoneLabel: "Phone Number *",
    phonePlaceholder: "+91 8087867988",
    emailLabel: "Email Address",
    emailPlaceholder: "your@email.com",
    eventTitle: "Event Details",
    eventTypeLabel: "Event Type *",
    eventTypePlaceholder: "Select event type",
    eventTypes: ["Birthday", "Wedding", "Anniversary", "Baby Shower", "Corporate Event", "Proposal", "Haldi Ceremony", "Reception", "Festival", "Other"],
    venueLabel: "Venue *",
    venuePlaceholder: "Venue name or address",
    dateLabel: "Event Date *",
    timeLabel: "Event Time *",
    budgetLabel: "Budget Range (₹)",
    budgetPlaceholder: "Estimated budget",
    instructionsLabel: "Special Instructions",
    instructionsPlaceholder: "Theme preferences, color palette, any specific requests...",
    submitButton: "Submit Booking Request",
  },
  confirmations: [
    "Our team will confirm your booking via WhatsApp within 2 hours",
    "A 50% advance payment confirms your slot",
    "Free consultation and site visit within Pune",
  ],
  success: {
    title: "Booking Confirmed!",
    event: "Event:",
    venue: "Venue:",
    date: "Date:",
    budget: "Budget:",
    trackButton: "Track on WhatsApp",
  },
} as const;

// ── CART ──────────────────────────────────────────────────────
export const cartPage = {
  emptyTitle: "Your Cart is Empty",
  emptyDescription: "Looks like you haven't added anything yet. Browse our collection of premium helium balloons and decorations.",
  emptyButton: "Shop Now",
  title: "Shopping Cart",
  clearAll: "Clear All",
  orderSummary: "Order Summary",
  subtotal: "Subtotal",
  gst: "GST (5%)",
  delivery: "Delivery",
  free: "Free",
  total: "Total",
  checkoutButton: "Proceed to Checkout",
  freeDelivery: "Free delivery on orders above ₹999",
  secureCheckout: "Secure checkout with COD/UPI/Card",
  applyCoupon: "Apply coupon at checkout",
  continueShopping: "Continue Shopping",
} as const;

// ── CHECKOUT ──────────────────────────────────────────────────
export const checkoutPage = {
  title: "Checkout",
  subtitle: "Complete your order",
  emptyTitle: "Your Cart is Empty",
  emptyDescription: "Add items to your cart before checking out.",
  emptyButton: "Shop Now",
  shippingTitle: "Shipping Information",
  nameLabel: "Full Name *",
  namePlaceholder: "Enter your full name",
  phoneLabel: "Phone Number *",
  phonePlaceholder: "+91 8087867988",
  emailLabel: "Email Address",
  emailPlaceholder: "your@email.com",
  addressLabel: "Delivery Address *",
  addressPlaceholder: "House/Flat No., Street, Landmark",
  cityLabel: "City *",
  cityPlaceholder: "Pune",
  pincodeLabel: "Pincode *",
  pincodePlaceholder: "411004",
  stateLabel: "State *",
  statePlaceholder: "Maharashtra",
  paymentTitle: "Payment Method",
  paymentMethods: [
    { id: "COD", name: "Cash on Delivery", description: "Pay when you receive" },
    { id: "UPI", name: "UPI (GPay/PhonePe/Paytm)", description: "Instant payment via UPI" },
    { id: "CARD", name: "Credit/Debit Card", description: "Visa, Mastercard, RuPay" },
  ],
  orderNotes: "Order Notes",
  orderNotesPlaceholder: "Special delivery instructions, preferred time, gate code, etc.",
  orderSummary: "Order Summary",
  placeOrderButton: "Place Order",
  secureNote: "Secure & encrypted checkout",
  whatsappNote: "WhatsApp order confirmation",
  successTitle: "Order Placed!",
  successMessage: "Thank you for your order! You'll receive a confirmation via WhatsApp shortly.",
  continueButton: "Continue Shopping",
} as const;

// ── WISHLIST ──────────────────────────────────────────────────
export const wishlistPage = {
  emptyTitle: "Your Wishlist is Empty",
  emptyDescription: "Save your favorite items here and come back to them anytime.",
  emptyButton: "Explore Products",
  title: "Wishlist",
  clearAll: "Clear All",
  addToCart: "Add to Cart",
} as const;

// ── SEARCH ────────────────────────────────────────────────────
export const searchPage = {
  placeholder: "Search balloons, bouquets, decorations...",
  noResults: "No products found",
  noResultsHint: "Try different keywords or browse categories.",
  typeHint: "Type above to search our catalog of premium balloons and decorations.",
} as const;

// ── NEWSLETTER ────────────────────────────────────────────────
export const newsletter = {
  badge: "Stay Inspired",
  subtitle: "Decoration ideas, exclusive offers, and new products. No spam.",
  placeholder: "Enter your email",
  button: "Subscribe",
  disclaimer: "By subscribing, you agree to our Privacy Policy.",
} as const;

// ── FOOTER ────────────────────────────────────────────────────
export const footer = {
  shopHeading: "Shop",
  servicesHeading: "Services",
  companyHeading: "Company",
  supportHeading: "Support",
  businessHours: "Mon-Sat 9AM-8PM",
  shopLinks: [
    { label: "Helium Balloons", href: "/shop/helium-balloons" },
    { label: "Balloon Bouquets", href: "/shop/balloon-bouquets" },
    { label: "Balloon Packets", href: "/shop/balloon-packets" },
    { label: "Party Supplies", href: "/shop/party-supplies" },
    { label: "Flower Bouquets", href: "/shop/flower-bouquets" },
    { label: "Chrome Balloons", href: "/shop/chrome-balloons" },
    { label: "Foil Balloons", href: "/shop/foil-balloons" },
    { label: "Number Balloons", href: "/shop/number-balloons" },
  ],
  serviceLinks: [
    { label: "Birthday Decoration", href: "/services/birthday" },
    { label: "Wedding Decoration", href: "/services/wedding" },
    { label: "Corporate Events", href: "/services/corporate" },
    { label: "Baby Shower", href: "/services/baby-shower" },
    { label: "Proposal Setup", href: "/services/proposal" },
  ],
  companyLinks: [
    { label: "About Us", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Reviews", href: "/testimonials" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  policyLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Shipping & Delivery", href: "/shipping" },
    { label: "Refund Policy", href: "/refund" },
  ],
} as const;

// ── HEADER EXTRAS ─────────────────────────────────────────────
export const headerExtras = {
  viewAllMaterials: "View All Materials",
  bookASetup: "Book a Setup",
  searchPlaceholder: "Search materials, products, decor...",
  wishlistLabel: "Wishlist",
  cartLabel: "Cart",
  deliveryBadge: "70 KM Delivery",
  deliverySubtext: "Same day available",
  paymentBadge: "Secure Payment",
  paymentSubtext: "COD, UPI, Cards",
  supportBadge: "Support",
  supportSubtext: "Mon-Sat 9AM-8PM",
} as const;

// ── MATERIAL CATEGORIES ───────────────────────────────────────
export const materialCategories = [
  { name: "Balloons", slug: "balloons", icon: "🎈", description: "Helium, foil & latex balloons in every color & theme", image: "/images/IMG-20260729-WA0080.jpg" },
  { name: "Flower Stands", slug: "flower-stands", icon: "💐", description: "Elegant stands for bouquets and centerpieces", image: "/images/princess-bouquet.png" },
  { name: "Metal Frames", slug: "metal-frames", icon: "🏗️", description: "Durable geometric frames for grand installations", image: "/images/birthday-arch.png" },
  { name: "Ring Frames", slug: "ring-frames", icon: "💍", description: "Decorative ring structures, entrance arches & more", image: "/images/baby-shower-arch.png" },
  { name: "Neon Signs", slug: "neon-signs", icon: "✨", description: "Custom neon text & logo signs for events", image: "/images/wedding-room.png" },
  { name: "LED Numbers", slug: "led-numbers", icon: "🔢", description: "Glowing number letters for milestone celebrations", image: "/images/birthday-arch.png" },
  { name: "Cake Tables", slug: "cake-tables", icon: "🎂", description: "Elevated display tables with backdrop & lighting", image: "/images/wedding-room.png" },
  { name: "Welcome Boards", slug: "welcome-boards", icon: "🚪", description: "Custom welcome signage with floral & balloon decor", image: "/images/baby-welcome.png" },
  { name: "Wedding Thrones", slug: "wedding-thrones", icon: "👑", description: "Royal seats & throne setups for the couple", image: "/images/wedding-room.png" },
  { name: "Artificial Flowers", slug: "artificial-flowers", icon: "🌸", description: "Long-lasting flower arrangements in premium quality", image: "/images/birthday-bouquet.png" },
  { name: "Fresh Flowers", slug: "fresh-flowers", icon: "🌷", description: "Hand-picked blooms for elegant decorations", image: "/images/princess-bouquet.png" },
  { name: "Stage Props", slug: "stage-props", icon: "🎭", description: "Backdrops, podiums & stage accessories", image: "/images/balloon-wall.png" },
  { name: "Curtains", slug: "curtains", icon: "🎬", description: "Luxurious drapes in silk, organza & velvet", image: "/images/wedding-room.png" },
  { name: "Fabric Drapes", slug: "fabric-drapes", icon: "🪟", description: "Themed fabric draping for venue transformation", image: "/images/baby-shower-arch.png" },
  { name: "Lighting", slug: "lighting", icon: "💡", description: "Fairy lights, LEDs, chandeliers & spotlight setups", image: "/images/hero-balloons.png" },
  { name: "Chairs", slug: "chairs", icon: "🪑", description: "Banquet, designer & themed chair rentals", image: "/images/wedding-room.png" },
  { name: "Centerpieces", slug: "centerpieces", icon: "🕯️", description: "Table centerpieces with florals, candles & decor", image: "/images/bouquet-box.png" },
  { name: "Mandap Items", slug: "mandap-items", icon: "🛕", description: "Sacred mandap decorations with florals & draping", image: "/images/wedding-room.png" },
  { name: "Kids Theme Props", slug: "kids-theme-props", icon: "🎪", description: "Themed props & setups for children's events", image: "/images/birthday-arch.png" },
  { name: "Birthday Props", slug: "birthday-props", icon: "🎈", description: "Age number balloons, photo props & theme setups", image: "/images/birthday-bouquet.png" },
  { name: "Baby Shower Props", slug: "baby-shower-props", icon: "🍼", description: "Soft pastel themes, baby props & gender reveal", image: "/images/baby-welcome.png" },
  { name: "Haldi Props", slug: "haldi-props", icon: "🧴", description: "Traditional haldi ceremony decor & backdrop", image: "/images/birthday-arch.png" },
  { name: "Mehendi Props", slug: "mehendi-props", icon: "🌿", description: "Mehendi ceremony themes, arches & seating", image: "/images/baby-shower-arch.png" },
  { name: "Festival Decorations", slug: "festival-decorations", icon: "🪔", description: "Diwali, Navratri, Christmas & themed decor", image: "/images/hero-balloons.png" },
  { name: "Custom Items", slug: "custom-decor", icon: "✂️", description: "Bespoke decoration solutions for unique events", image: "/images/bouquet-box.png" },
] as const;

// ── ADMIN ─────────────────────────────────────────────────────
export const admin = {
  loginTitle: "Admin Login",
  loginSubtitle: "Mahek Balloons Admin Panel",
  emailLabel: "Email Address",
  emailPlaceholder: "bshaikh818@gmail.com",
  passwordLabel: "Password",
  passwordPlaceholder: "Enter password",
  signInButton: "Sign In",
  defaultCredentials: "",
} as const;

// ── HELPER: Get category name by ID ──────────────────────────
export function getCategoryName(categoryId: string): string {
  return productCategories.find((c) => c.id === categoryId)?.name ?? "Products";
}

// ── HELPER: Get service by slug ──────────────────────────────
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

// ── HELPER: Get products by category ─────────────────────────
export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}

// ── HELPER: Get featured products ────────────────────────────
export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

// ── HELPER: Search products ──────────────────────────────────
export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDesc.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}
