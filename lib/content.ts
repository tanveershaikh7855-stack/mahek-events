// ──────────────────────────────────────────────────────────────
// MAHEK BALLOON — Centralized Content Management System
// ──────────────────────────────────────────────────────────────
// Edit this single file to update the ENTIRE website.
// Every component reads from here. If a field is empty, the
// element is hidden gracefully (no blank spaces).
// ──────────────────────────────────────────────────────────────

// ── BUSINESS ──────────────────────────────────────────────────
export const business = {
  name: "Mahek Balloon",
  tagline: "Premium Helium Balloons & Decoration Services",
  description:
    "Premium helium balloons, balloon bouquets, party supplies and luxury decoration services delivered within 140 KM.",
  founded: 2015,
  deliveryRadiusKm: 140,
  rating: 4.9,
  totalCustomers: 5000,
  yearsExperience: 11,
  email: "hello@mahekballoon.com",
  phone: "8087867988",
  phoneFormatted: "+91 8087867988",
  whatsapp: "918087867988",
  address: "Opposite Saras Baug Garden, Pune, Maharashtra",
  area: "Saras Baug, Pune",
  state: "Maharashtra",
  city: "Pune",
  pincode: "411004",
  googleMapsUrl:
    "https://maps.app.goo.gl/8WdoEqNAuCB9Qzwf7",
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.0390079727!2d72.88118615!3d19.08225065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
} as const;

// ── SOCIAL LINKS ──────────────────────────────────────────────
export const socials = {
  instagram: "https://www.instagram.com/mahek.balloons/",
  facebook: "https://facebook.com/mahekballoon",
} as const;

// ── SEO ───────────────────────────────────────────────────────
export const seo = {
  metaTitle: "Mahek Balloon | Premium Helium Balloons & Decoration Services",
  metaDescription:
    "Premium helium balloons, balloon bouquets, party supplies and luxury decoration services. Same-day delivery within 140 KM. Book decorations online.",
  keywords: [
    "helium balloons",
    "balloon bouquets",
    "balloon decoration",
    "party supplies",
    "birthday decoration",
    "wedding decoration",
    "flower bouquets",
    "same day delivery",
    "chrome balloons",
    "foil balloons",
    "number balloons",
    "shape balloons",
  ],
  ogImage: "/images/logo/logo.png",
  siteUrl: "https://mahekballoon.com",
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
  {
    label: "Decorative Material",
    href: "/materials",
    children: [
      { name: "Balloons", href: "/materials/balloons", icon: "🎈" },
      { name: "Flower Stands", href: "/materials/flower-stands", icon: "💐" },
      { name: "Metal Frames", href: "/materials/metal-frames", icon: "🏗️" },
      { name: "Ring Frames", href: "/materials/ring-frames", icon: "💍" },
      { name: "Neon Signs", href: "/materials/neon-signs", icon: "✨" },
      { name: "LED Numbers", href: "/materials/led-numbers", icon: "🔢" },
      { name: "Cake Tables", href: "/materials/cake-tables", icon: "🎂" },
      { name: "Welcome Boards", href: "/materials/welcome-boards", icon: "🚪" },
      { name: "Wedding Thrones", href: "/materials/wedding-thrones", icon: "👑" },
      { name: "Artificial Flowers", href: "/materials/artificial-flowers", icon: "🌸" },
      { name: "Fresh Flowers", href: "/materials/fresh-flowers", icon: "🌷" },
      { name: "Stage Props", href: "/materials/stage-props", icon: "🎭" },
      { name: "Curtains", href: "/materials/curtains", icon: "🎬" },
      { name: "Fabric Drapes", href: "/materials/fabric-drapes", icon: "🪟" },
      { name: "Lighting", href: "/materials/lighting", icon: "💡" },
      { name: "Chairs", href: "/materials/chairs", icon: "🪑" },
      { name: "Centerpieces", href: "/materials/centerpieces", icon: "🕯️" },
      { name: "Mandap Items", href: "/materials/mandap-items", icon: "🛕" },
      { name: "Kids Theme Props", href: "/materials/kids-theme-props", icon: "🎪" },
      { name: "Birthday Props", href: "/materials/birthday-props", icon: "🎈" },
      { name: "Baby Shower Props", href: "/materials/baby-shower-props", icon: "🍼" },
      { name: "Haldi Props", href: "/materials/haldi-props", icon: "🧴" },
      { name: "Mehendi Props", href: "/materials/mehendi-props", icon: "🌿" },
      { name: "Festival Decorations", href: "/materials/festival-decorations", icon: "🪔" },
      { name: "Custom Items", href: "/materials/custom", icon: "✂️" },
    ],
  },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
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
    "Premium helium balloons, elegant bouquets, and bespoke decoration services for your most meaningful celebrations. Same-day delivery within 140 KM.",
  primaryButton: { label: "Shop Balloons", href: "/shop" },
  secondaryButton: { label: "Book Decoration", href: "/booking" },
  whatsappButton: "WhatsApp",
  image: "/images/hero/balloons.png",
  stats: [
    { value: "5000+", label: "Happy Customers" },
    { value: "140 KM", label: "Delivery Radius" },
    { value: "4.9", label: "Customer Rating" },
  ],
  features: [
    "Same-Day Delivery",
    "Secure Payment",
    "On-Time Setup",
    "140 KM Coverage",
  ],
} as const;

// ── FEATURES BAR ──────────────────────────────────────────────
export const featuresBar = [
  { title: "Same Day Delivery", description: "Order before 2 PM" },
  { title: "140 KM Coverage", description: "Pune & beyond" },
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
    "Mahek Balloon was born from a simple idea — every celebration deserves to look as special as the moment itself. What started as a small balloon delivery service in Pune has grown into a trusted name for premium decorations.",
  story: [
    "Founded in 2015, Mahek Balloon began as a passion project — delivering beautifully arranged helium balloons for birthdays and celebrations across Pune.",
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
          "Founded Mahek Balloon with a vision to bring premium balloon artistry to Pune celebrations.",
        image: "/images/about/team-1.png",
      },
      {
        name: "Priya Verma",
        role: "Lead Stylist",
        description:
          "10+ years of experience creating stunning event transformations across the city.",
        image: "/images/about/team-2.png",
      },
      {
        name: "Arun Patel",
        role: "Operations Manager",
        description:
          "Ensures every delivery and setup happens on time, every time, within 140 KM radius.",
        image: "/images/about/team-3.png",
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
    { value: "10+", label: "Years Experience" },
    { value: "140 KM", label: "Delivery Radius" },
  ],
} as const;

// ── WHY CHOOSE US ─────────────────────────────────────────────
export const whyChooseUs = {
  badge: "Our Promise",
  title: "Why Choose Mahek Balloon?",
  items: [
    {
      title: "140 KM Delivery",
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
        "In-house stylists with 10+ years of combined experience creating elegant decorations.",
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
  deliveryRadius: "140",
  rating: "4.9",
  yearsExperience: "10+",
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
    image: "/images/services/birthday.png",
    features: ["Theme customization", "Balloon arch or bunches", "Backdrop & signage", "Setup & takedown"],
  },
  {
    id: "svc-2",
    name: "Anniversary Decoration",
    slug: "anniversary",
    description: "Romantic anniversary decor with candles, flowers and elegant balloon styling.",
    priceFrom: 3499,
    image: "/images/services/anniversary.png",
    features: ["Romantic themes", "Flower arrangements", "Ambient lighting", "Couple signage"],
  },
  {
    id: "svc-3",
    name: "Baby Shower",
    slug: "baby-shower",
    description: "Soft, dreamy baby shower decor designed around delicate palettes and gentle details.",
    priceFrom: 3999,
    image: "/images/services/baby-shower.png",
    features: ["Gender reveal add-ons", "Dessert table decor", "Organic balloon garland", "Welcome signage"],
  },
  {
    id: "svc-4",
    name: "Corporate Events",
    slug: "corporate",
    description: "Brand-aligned decor for product launches, conferences and employee celebrations.",
    priceFrom: 8999,
    image: "/images/services/corporate.png",
    features: ["Brand color matching", "Stage backdrop", "Balloon columns", "Custom prints"],
  },
  {
    id: "svc-5",
    name: "Wedding Decoration",
    slug: "wedding",
    description: "Elegant floral and balloon decor for wedding entrances, stages and dining areas.",
    priceFrom: 14999,
    image: "/images/services/wedding.png",
    features: ["Mandap & stage", "Entrance florals", "Aisle decor", "Custom palettes"],
  },
  {
    id: "svc-6",
    name: "Haldi Ceremony",
    slug: "haldi",
    description: "Vibrant haldi setups with marigolds, drapes and cheerful yellow accents.",
    priceFrom: 5999,
    image: "/images/services/haldi.png",
    features: ["Marigold arrangements", "Seat decor", "Floral jewelry station", "Photo corner"],
  },
  {
    id: "svc-7",
    name: "Reception Decor",
    slug: "reception",
    description: "Grand reception decor combining florals, lighting and bespoke centerpieces.",
    priceFrom: 19999,
    image: "/images/services/reception.png",
    features: ["Grand entrance", "Stage design", "Table centerpieces", "Ambient lighting"],
  },
  {
    id: "svc-8",
    name: "House Decoration",
    slug: "house-decoration",
    description: "Transform living spaces for festivals, poojas or intimate family gatherings.",
    priceFrom: 4999,
    image: "/images/services/house.png",
    features: ["Room styling", "Floral torans", "Festival themes", "Same day service"],
  },
  {
    id: "svc-9",
    name: "Proposal Decoration",
    slug: "proposal",
    description: "Discreet, beautiful and unforgettable proposal setups for your special moment.",
    priceFrom: 5499,
    image: "/images/services/proposal.png",
    features: ["Private venue styling", "Candle pathways", "Marry me signage", "Photography add-ons"],
  },
  {
    id: "svc-10",
    name: "Room Decoration",
    slug: "room-decoration",
    description: "Intimate room setups for birthdays, anniversaries or surprise celebrations.",
    priceFrom: 2999,
    image: "/images/services/room.png",
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
  { id: "cat-1", name: "Helium Balloons", slug: "helium-balloons", subtitle: "Floating elegance for every occasion", type: "PRODUCT", image: "/images/products/helium.png" },
  { id: "cat-2", name: "Balloon Bouquets", slug: "balloon-bouquets", subtitle: "Curated bunches, hand-tied with care", type: "PRODUCT", image: "/images/products/bouquets.png" },
  { id: "cat-3", name: "Balloon Packets", slug: "balloon-packets", subtitle: "Ready-to-fill premium balloons", type: "PRODUCT", image: "/images/products/packets.png" },
  { id: "cat-4", name: "Party Supplies", slug: "party-supplies", subtitle: "Complete celebration essentials", type: "PRODUCT", image: "/images/products/party.png" },
  { id: "cat-5", name: "Flower Bouquets", slug: "flower-bouquets", subtitle: "Fresh blooms for meaningful moments", type: "PRODUCT", image: "/images/products/flowers.png" },
  { id: "cat-6", name: "Chrome Balloons", slug: "chrome-balloons", subtitle: "Mirror-finish metallic balloons", type: "PRODUCT", image: "/images/products/chrome.png" },
  { id: "cat-7", name: "Foil Balloons", slug: "foil-balloons", subtitle: "Premium foil balloons for every theme", type: "PRODUCT", image: "/images/products/foil.png" },
  { id: "cat-8", name: "Shape Balloons", slug: "shape-balloons", subtitle: "Unique shaped balloons for celebrations", type: "PRODUCT", image: "/images/products/shapes.png" },
  { id: "cat-9", name: "Number Balloons", slug: "number-balloons", subtitle: "Celebrate milestones with number balloons", type: "PRODUCT", image: "/images/products/numbers.png" },
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
  { id: "prod-1", name: "Pastel Helium Balloon Bunch", slug: "pastel-helium-balloon-bunch", shortDesc: "12 premium helium balloons in soft pastel tones.", description: "A refined bunch of 12 helium-filled balloons in blush, ivory and soft peach. Tied with satin ribbon and weighted for easy placement.", basePrice: 799, salePrice: 699, sku: "HB-001", stock: 50, rating: 4.9, reviewCount: 128, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/products/helium/pastel-bunch.png", "/images/products/helium/pastel-bunch-2.png"], tags: ["pastel", "helium", "birthday", "elegant"], variants: [{ label: "Color", options: ["Pastel Mix", "Rose Gold", "Ivory", "Lavender"] }] },
  { id: "prod-2", name: "Chrome Foil Balloon Set", slug: "chrome-foil-balloon-set", shortDesc: "Reflective chrome foil balloons for premium decor.", description: "Set of 6 chrome foil balloons in your choice of silver, gold or rose gold. Perfect for milestone celebrations.", basePrice: 599, salePrice: null, sku: "HB-002", stock: 100, rating: 4.7, reviewCount: 42, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/products/helium/chrome-set.png"], tags: ["chrome", "foil", "premium", "milestone"], variants: [{ label: "Color", options: ["Silver", "Gold", "Rose Gold", "Copper"] }] },
  { id: "prod-3", name: "Giant Helium Balloon 36 inch", slug: "giant-helium-balloon-36", shortDesc: "Oversized latex balloon for dramatic effect.", description: "A show-stopping 36-inch giant helium balloon. Available in solid colors with optional ribbon tail.", basePrice: 349, salePrice: null, sku: "HB-003", stock: 80, rating: 4.6, reviewCount: 67, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/products/helium/giant-36.png"], tags: ["giant", "latex", "dramatic", "statement"], variants: [{ label: "Color", options: ["White", "Black", "Gold", "Red", "Pink"] }] },
  { id: "prod-4", name: "Metallic Helium Balloon Bouquet", slug: "metallic-helium-balloon-bouquet", shortDesc: "Mixed metallic helium balloons with confetti.", description: "Bundle of 8 metallic helium balloons with confetti fill. Creates a dazzling display for any celebration.", basePrice: 1099, salePrice: 949, sku: "HB-004", stock: 35, rating: 4.8, reviewCount: 91, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/products/helium/metallic-bouquet.png"], tags: ["metallic", "confetti", "dazzling", "celebration"], variants: [{ label: "Theme", options: ["Gold & Silver", "Rose Gold", "Rainbow Metallic"] }] },
  { id: "prod-5", name: "Pearl White Helium Bunch", slug: "pearl-white-helium-bunch", shortDesc: "Elegant pearl finish helium balloons.", description: "10 helium balloons with a soft pearl finish. Perfect for weddings, anniversaries and sophisticated events.", basePrice: 899, salePrice: null, sku: "HB-005", stock: 40, rating: 4.9, reviewCount: 56, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/products/helium/pearl-white.png"], tags: ["pearl", "white", "wedding", "elegant"], variants: [{ label: "Size", options: ["Standard 12 inch", "Large 18 inch"] }] },
  { id: "prod-6", name: "Neon Glow Helium Balloons", slug: "neon-glow-helium-balloons", shortDesc: "UV-reactive neon balloons for night events.", description: "Set of 15 neon latex balloons that glow under UV light. Perfect for night parties and themed events.", basePrice: 699, salePrice: 599, sku: "HB-006", stock: 60, rating: 4.5, reviewCount: 38, isFeatured: false, deliveryBadge: "Next Day", categoryId: "cat-1", images: ["/images/products/helium/neon-glow.png"], tags: ["neon", "glow", "uv", "night-party"], variants: [{ label: "Color Pack", options: ["Neon Pink & Blue", "Neon Green & Yellow", "Mixed Neon"] }] },
  { id: "prod-7", name: "Helium Balloon Garland Kit", slug: "helium-balloon-garland-kit", shortDesc: "DIY helium balloon garland with strip tape.", description: "Everything you need to create a stunning balloon garland. Includes 50 balloons, decorating strip, glue dots and ribbon.", basePrice: 1299, salePrice: 1099, sku: "HB-007", stock: 25, rating: 4.7, reviewCount: 74, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/products/helium/garland-kit.png"], tags: ["diy", "garland", "kit", "decorating"], variants: [{ label: "Theme", options: ["Eucalyptus Green", "Blush Pink", "Gold & White", "Sage Green"] }] },
  { id: "prod-8", name: "Birthday Number Helium Balloon", slug: "birthday-number-helium-balloon", shortDesc: "Large foil number balloon with helium.", description: "Single 40-inch foil number balloon filled with helium. Available in digits 0-9 and in gold, silver, or rose gold.", basePrice: 449, salePrice: null, sku: "HB-008", stock: 120, rating: 4.6, reviewCount: 203, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/products/helium/number-balloon.png"], tags: ["number", "birthday", "foil", "milestone"], variants: [{ label: "Digit", options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] }, { label: "Color", options: ["Gold", "Silver", "Rose Gold"] }] },
  { id: "prod-9", name: "Helium Balloon Tower Kit", slug: "helium-balloon-tower-kit", shortDesc: "Stackable balloon column kit with base.", description: "Create a 6-foot balloon column with this complete kit. Includes balloons, column strip, base plate and weights.", basePrice: 1599, salePrice: 1399, sku: "HB-009", stock: 15, rating: 4.8, reviewCount: 29, isFeatured: false, deliveryBadge: "Next Day", categoryId: "cat-1", images: ["/images/products/helium/tower-kit.png"], tags: ["tower", "column", "kit", "statement"], variants: [{ label: "Color", options: ["Gold & White", "Rose Gold & Blush", "Navy & Silver"] }] },
  { id: "prod-10", name: "Organic Balloon Arch Kit", slug: "organic-balloon-arch-kit", shortDesc: "Mixed-size balloons for organic arch.", description: "Premium kit with 120 balloons in varied sizes (5, 10, 12, 18 inch) for a stunning organic balloon arch.", basePrice: 2499, salePrice: 2199, sku: "HB-010", stock: 20, rating: 4.9, reviewCount: 45, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-1", images: ["/images/products/helium/organic-arch.png"], tags: ["organic", "arch", "premium", "mixed-size"], variants: [{ label: "Theme", options: ["Sage Green & White", "Blush & Gold", "Navy & White", "Rainbow"] }] },

  // ── BALLOON BOUQUETS ─────────────────────────────────────────
  { id: "prod-21", name: "Rose Gold Birthday Bouquet", slug: "rose-gold-birthday-bouquet", shortDesc: "Luxury birthday balloon bouquet with confetti accents.", description: "Make birthdays unforgettable with this rose gold and confetti balloon bouquet. Includes number option and premium box packaging.", basePrice: 1499, salePrice: 1299, sku: "BB-001", stock: 30, rating: 4.8, reviewCount: 86, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-2", images: ["/images/products/bouquets/rose-gold-birthday.png"], tags: ["rose-gold", "birthday", "luxury", "confetti"], variants: [{ label: "Number", options: ["18", "21", "25", "30", "40", "50"] }] },
  { id: "prod-22", name: "Gender Reveal Balloon Box", slug: "gender-reveal-balloon-box", shortDesc: "Surprise balloon box with confetti poppers.", description: "A beautifully wrapped box that releases pink or blue balloons when opened. Includes confetti poppers and a cake topper.", basePrice: 1299, salePrice: 1199, sku: "BB-002", stock: 25, rating: 4.8, reviewCount: 53, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-2", images: ["/images/products/bouquets/gender-reveal.png"], tags: ["gender-reveal", "surprise", "baby", "confetti"], variants: [{ label: "Reveal", options: ["Boy", "Girl", "Twins"] }] },
  { id: "prod-23", name: "Elegant Wedding Bouquet", slug: "elegant-wedding-bouquet", shortDesc: "White and gold balloon bouquet for weddings.", description: "Sophisticated wedding balloon bouquet featuring white, gold and pearl balloons with silk ribbon accents.", basePrice: 2499, salePrice: 2199, sku: "BB-003", stock: 15, rating: 4.9, reviewCount: 41, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-2", images: ["/images/products/bouquets/elegant-wedding.png"], tags: ["wedding", "elegant", "white", "gold"], variants: [{ label: "Style", options: ["Classic", "Modern", "Rustic"] }] },
  { id: "prod-24", name: "Kids Birthday Bouquet", slug: "kids-birthday-bouquet", shortDesc: "Colorful balloon bouquet for children.", description: "A fun, vibrant balloon bouquet with cartoon-themed foil balloons, latex balloons and a mini gift bag.", basePrice: 999, salePrice: 849, sku: "BB-004", stock: 40, rating: 4.7, reviewCount: 112, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-2", images: ["/images/products/bouquets/kids-birthday.png"], tags: ["kids", "colorful", "cartoon", "fun"], variants: [{ label: "Theme", options: ["Unicorn", "Dinosaur", "Space", "Princess", "Cars"] }] },
  { id: "prod-25", name: "Anniversary Heart Bouquet", slug: "anniversary-heart-bouquet", shortDesc: "Heart-shaped foil balloons with roses.", description: "Romantic anniversary bouquet with heart-shaped foil balloons, artificial roses and fairy lights.", basePrice: 1799, salePrice: 1599, sku: "BB-005", stock: 20, rating: 4.9, reviewCount: 38, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-2", images: ["/images/products/bouquets/anniversary-heart.png"], tags: ["anniversary", "heart", "romantic", "roses"], variants: [{ label: "Anniversary Year", options: ["1st", "5th", "10th", "25th", "50th"] }] },

  // ── CHROME BALLOONS ──────────────────────────────────────────
  { id: "prod-101", name: "Chrome Gold Latex 12 inch", slug: "chrome-gold-latex-12", shortDesc: "Mirror-finish gold chrome balloons.", description: "Premium chrome-finish latex balloons with stunning mirror-like gold shine. 12 inch size, pack of 10.", basePrice: 399, salePrice: 349, sku: "CH-001", stock: 150, rating: 4.8, reviewCount: 124, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-6", images: ["/images/products/chrome/gold-12.png"], tags: ["chrome", "gold", "mirror", "metallic"], variants: [{ label: "Color", options: ["Gold", "Silver", "Rose Gold", "Copper", "Blue"] }] },
  { id: "prod-102", name: "Chrome Silver Latex 12 inch", slug: "chrome-silver-latex-12", shortDesc: "Mirror-finish silver chrome balloons.", description: "High-shine silver chrome balloons for elegant decor. Pack of 10, decorator grade quality.", basePrice: 399, salePrice: null, sku: "CH-002", stock: 120, rating: 4.7, reviewCount: 98, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-6", images: ["/images/products/chrome/silver-12.png"], tags: ["chrome", "silver", "mirror", "elegant"], variants: [{ label: "Color", options: ["Silver", "Gold", "Rose Gold"] }] },
  { id: "prod-103", name: "Chrome Rose Gold Latex 12 inch", slug: "chrome-rose-gold-latex-12", shortDesc: "Trending rose gold chrome balloons.", description: "Instagram-trending rose gold chrome balloons with reflective mirror finish. Pack of 10.", basePrice: 449, salePrice: 399, sku: "CH-003", stock: 100, rating: 4.9, reviewCount: 156, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-6", images: ["/images/products/chrome/rose-gold-12.png"], tags: ["chrome", "rose-gold", "trending", "instagram"], variants: [{ label: "Color", options: ["Rose Gold", "Gold", "Silver"] }] },

  // ── FOIL BALLOONS ────────────────────────────────────────────
  { id: "prod-111", name: "Happy Birthday Foil Banner", slug: "happy-birthday-foil-banner", shortDesc: "Gold foil happy birthday letters.", description: "Individual gold foil letter balloons spelling Happy Birthday. Self-sealing, reusable.", basePrice: 499, salePrice: 449, sku: "FL-001", stock: 100, rating: 4.7, reviewCount: 189, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-7", images: ["/images/products/foil/happy-birthday-banner.png"], tags: ["foil", "banner", "birthday", "gold"], variants: [{ label: "Color", options: ["Gold", "Silver", "Rose Gold", "Black"] }] },
  { id: "prod-112", name: "Star Foil Balloon 18 inch", slug: "star-foil-balloon-18", shortDesc: "Metallic star-shaped foil balloon.", description: "Beautiful 5-point star foil balloon in metallic finish. Self-sealing valve. Pack of 6.", basePrice: 349, salePrice: null, sku: "FL-002", stock: 120, rating: 4.6, reviewCount: 98, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-7", images: ["/images/products/foil/star-18.png"], tags: ["foil", "star", "metallic", "pack"], variants: [{ label: "Color", options: ["Gold", "Silver", "Rose Gold", "Red"] }] },
  { id: "prod-113", name: "Heart Foil Balloon 18 inch", slug: "heart-foil-balloon-18", shortDesc: "Romantic heart-shaped foil balloon.", description: "Glossy heart-shaped foil balloon for romantic occasions. Self-sealing, reusable. Pack of 4.", basePrice: 399, salePrice: 349, sku: "FL-003", stock: 90, rating: 4.8, reviewCount: 134, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-7", images: ["/images/products/foil/heart-18.png"], tags: ["foil", "heart", "romantic", "valentine"], variants: [{ label: "Color", options: ["Red", "Pink", "Gold", "Rose Gold", "White"] }] },

  // ── SHAPE BALLOONS ───────────────────────────────────────────
  { id: "prod-121", name: "Unicorn Shape Foil Balloon", slug: "unicorn-shape-foil", shortDesc: "Magical unicorn-shaped balloon.", description: "Adorable unicorn-shaped foil balloon for kids' parties. Self-sealing, reusable. 30 inch tall.", basePrice: 299, salePrice: 249, sku: "SH-001", stock: 80, rating: 4.8, reviewCount: 156, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-8", images: ["/images/products/shapes/unicorn.png"], tags: ["shape", "unicorn", "kids", "magical"], variants: [] },
  { id: "prod-122", name: "Crown Shape Foil Balloon", slug: "crown-shape-foil", shortDesc: "Royal crown-shaped balloon.", description: "Elegant crown-shaped foil balloon for birthday royalty. Gold metallic finish. 24 inch.", basePrice: 249, salePrice: null, sku: "SH-002", stock: 90, rating: 4.7, reviewCount: 89, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-8", images: ["/images/products/shapes/crown.png"], tags: ["shape", "crown", "royal", "gold"], variants: [{ label: "Color", options: ["Gold", "Silver", "Rose Gold"] }] },
  { id: "prod-123", name: "Butterfly Shape Foil Balloon", slug: "butterfly-shape-foil", shortDesc: "Delicate butterfly-shaped balloon.", description: "Beautiful butterfly-shaped foil balloon for garden parties and spring events. 18 inch wingspan.", basePrice: 199, salePrice: null, sku: "SH-003", stock: 70, rating: 4.6, reviewCount: 67, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-8", images: ["/images/products/shapes/butterfly.png"], tags: ["shape", "butterfly", "garden", "spring"], variants: [{ label: "Color", options: ["Pink", "Blue", "Gold", "Rainbow"] }] },

  // ── NUMBER BALLOONS ──────────────────────────────────────────
  { id: "prod-131", name: "Gold Number Balloon 40 inch", slug: "gold-number-balloon-40", shortDesc: "Large gold foil number balloon.", description: "Premium 40-inch gold foil number balloon. Self-sealing, reusable. Choose any digit 0-9.", basePrice: 299, salePrice: 249, sku: "NB-001", stock: 200, rating: 4.8, reviewCount: 345, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-9", images: ["/images/products/numbers/gold-40.png"], tags: ["number", "gold", "milestone", "birthday"], variants: [{ label: "Digit", options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] }, { label: "Color", options: ["Gold", "Silver", "Rose Gold", "Black", "Blue", "Pink"] }] },
  { id: "prod-132", name: "Silver Number Balloon 40 inch", slug: "silver-number-balloon-40", shortDesc: "Large silver foil number balloon.", description: "Shiny 40-inch silver foil number balloon. Perfect for milestone birthdays and anniversaries.", basePrice: 299, salePrice: null, sku: "NB-002", stock: 180, rating: 4.7, reviewCount: 267, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-9", images: ["/images/products/numbers/silver-40.png"], tags: ["number", "silver", "milestone", "anniversary"], variants: [{ label: "Digit", options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] }, { label: "Color", options: ["Silver", "Gold", "Rose Gold"] }] },
  { id: "prod-133", name: "Rose Gold Number Balloon 40 inch", slug: "rose-gold-number-balloon-40", shortDesc: "Trending rose gold number balloon.", description: "Instagram-trending 40-inch rose gold foil number balloon. Self-sealing, reusable.", basePrice: 349, salePrice: 299, sku: "NB-003", stock: 150, rating: 4.9, reviewCount: 312, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-9", images: ["/images/products/numbers/rose-gold-40.png"], tags: ["number", "rose-gold", "trending", "birthday"], variants: [{ label: "Digit", options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] }, { label: "Color", options: ["Rose Gold", "Gold", "Silver"] }] },

  // ── PARTY SUPPLIES ───────────────────────────────────────────
  { id: "prod-61", name: "Proposal Room Decoration Kit", slug: "proposal-room-decoration-kit", shortDesc: "Complete candle and balloon room setup kit.", description: "Everything needed for an intimate proposal: balloons, candles, rose petals, fairy lights and a marquee 'Marry Me' sign.", basePrice: 3499, salePrice: 2999, sku: "PS-001", stock: 15, rating: 5.0, reviewCount: 34, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-4", images: ["/images/products/party/proposal-kit.png"], tags: ["proposal", "room", "romantic", "kit"], variants: [{ label: "Theme", options: ["Classic Red", "White & Gold", "Blush"] }] },
  { id: "prod-62", name: "Happy Birthday Balloon Banner", slug: "happy-birthday-balloon-banner", shortDesc: "Foil letter banner with matching balloons.", description: "Reusable foil 'Happy Birthday' banner with a set of 20 matching latex balloons and weights.", basePrice: 899, salePrice: 749, sku: "PS-002", stock: 60, rating: 4.5, reviewCount: 91, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-4", images: ["/images/products/party/birthday-banner.png"], tags: ["birthday", "banner", "foil", "reusable"], variants: [{ label: "Color", options: ["Gold", "Rose Gold", "Silver", "Multicolor"] }] },
  { id: "prod-63", name: "LED Fairy String Lights", slug: "led-fairy-string-lights", shortDesc: "10-meter warm white fairy lights.", description: "Battery-operated warm white LED fairy lights. Waterproof, flexible and perfect for event decor.", basePrice: 399, salePrice: 349, sku: "PS-003", stock: 100, rating: 4.6, reviewCount: 178, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-4", images: ["/images/products/party/fairy-lights.png"], tags: ["led", "fairy-lights", "warm", "decor"] },

  // ── FLOWER BOUQUETS ──────────────────────────────────────────
  { id: "prod-81", name: "White & Green Flower Bouquet", slug: "white-green-flower-bouquet", shortDesc: "Elegant seasonal blooms with eucalyptus.", description: "A timeless arrangement of white seasonal flowers, eucalyptus and soft greenery. Wrapped in premium kraft paper.", basePrice: 1199, salePrice: null, sku: "FB-001", stock: 20, rating: 4.9, reviewCount: 67, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-5", images: ["/images/products/flowers/white-green.png"], tags: ["flowers", "white", "green", "elegant"], variants: [{ label: "Size", options: ["Small", "Medium", "Large"] }] },
  { id: "prod-82", name: "Rose Gold Rose Bouquet", slug: "rose-gold-rose-bouquet", shortDesc: "Preserved roses in rose gold box.", description: "Eternal preserved roses arranged in a luxury rose gold box. Lasts 1-2 years without maintenance.", basePrice: 2999, salePrice: 2699, sku: "FB-002", stock: 15, rating: 4.9, reviewCount: 43, isFeatured: true, deliveryBadge: "Same Day", categoryId: "cat-5", images: ["/images/products/flowers/rose-gold-roses.png"], tags: ["roses", "preserved", "luxury", "rose-gold"], variants: [{ label: "Rose Count", options: ["9 Roses", "16 Roses", "25 Roses", "36 Roses"] }] },
  { id: "prod-83", name: "Mixed Seasonal Bouquet", slug: "mixed-seasonal-bouquet", shortDesc: "Fresh seasonal flowers in mixed colors.", description: "A cheerful mix of seasonal flowers hand-tied with satin ribbon. Changes with the freshest available blooms.", basePrice: 899, salePrice: 799, sku: "FB-003", stock: 25, rating: 4.7, reviewCount: 89, isFeatured: false, deliveryBadge: "Same Day", categoryId: "cat-5", images: ["/images/products/flowers/mixed-seasonal.png"], tags: ["flowers", "seasonal", "mixed", "fresh"], variants: [] },
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
  { id: "g1", category: "birthday", image: "/images/gallery/birthday-arch.png", title: "Pastel Birthday Setup" },
  { id: "g2", category: "wedding", image: "/images/gallery/wedding-room.png", title: "Wedding Room Decor" },
  { id: "g3", category: "baby-shower", image: "/images/gallery/baby-shower-arch.png", title: "Baby Shower Arch" },
  { id: "g4", category: "corporate", image: "/images/gallery/corporate-event.png", title: "Corporate Event Setup" },
  { id: "g5", category: "proposal", image: "/images/gallery/proposal-setup.png", title: "Proposal Bouquet Box" },
  { id: "g6", category: "room-decor", image: "/images/gallery/room-decor.png", title: "Premium Balloon Display" },
  { id: "g7", category: "birthday", image: "/images/gallery/birthday-bouquet.png", title: "Birthday Bouquet" },
  { id: "g8", category: "wedding", image: "/images/gallery/wedding-bouquet.png", title: "Celebration Bouquet" },
  { id: "g9", category: "baby-shower", image: "/images/gallery/baby-welcome.png", title: "Baby Welcome Setup" },
  { id: "g10", category: "corporate", image: "/images/gallery/corporate-balloon.png", title: "Premium Arrangement" },
  { id: "g11", category: "proposal", image: "/images/gallery/proposal-romantic.png", title: "Romantic Setup" },
  { id: "g12", category: "room-decor", image: "/images/gallery/room-birthday.png", title: "Birthday Room Decor" },
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
    image: "/images/testimonials/priya.png",
    rating: 5,
    review:
      "The balloon bouquet arrived exactly as shown. Premium packaging and the balloons stayed afloat for days. Will definitely order again.",
    verified: true,
  },
  {
    id: "2",
    name: "Rahul Mehta",
    location: "Pimpri-Chinchwad",
    image: "/images/testimonials/rahul.png",
    rating: 5,
    review:
      "Mahek Balloon transformed our anniversary celebration. The decor was elegant, not gaudy, and the team was professional from start to finish.",
    verified: true,
  },
  {
    id: "3",
    name: "Ananya Patel",
    location: "Pune",
    image: "/images/testimonials/ananya.png",
    rating: 5,
    review:
      "I planned a surprise proposal and they handled every detail discreetly and beautifully. Worth every rupee for the peace of mind.",
    verified: true,
  },
  {
    id: "4",
    name: "Vikram Joshi",
    location: "Pune",
    image: "/images/testimonials/vikram.png",
    rating: 5,
    review:
      "Ordered corporate event decorations for our product launch. The branding colors matched perfectly. Fast delivery within the 140 KM range.",
    verified: true,
  },
  {
    id: "5",
    name: "Sneha Kulkarni",
    location: "Pune",
    image: "/images/testimonials/sneha.png",
    rating: 5,
    review:
      "My daughter's birthday was absolutely magical thanks to Mahek Balloon. The unicorn theme setup was beyond our expectations!",
    verified: true,
  },
  {
    id: "6",
    name: "Amit Deshmukh",
    location: "Pune",
    image: "/images/testimonials/amit.png",
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
    question: "Do you deliver helium balloons within 140 KM?",
    answer:
      "Yes. We deliver helium balloon bunches, bouquets and party supplies within a 140 KM radius from Pune. Delivery charges are calculated automatically at checkout based on your distance.",
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
  radius: 140,
  charges: [
    { minDistance: 0, maxDistance: 10, charge: 0, freeAbove: 499 },
    { minDistance: 10, maxDistance: 30, charge: 99, freeAbove: 999 },
    { minDistance: 30, maxDistance: 70, charge: 199, freeAbove: 1999 },
    { minDistance: 70, maxDistance: 140, charge: 349, freeAbove: 2999 },
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
  deliveryBadge: "140 KM Delivery",
  deliverySubtext: "Same day available",
  paymentBadge: "Secure Payment",
  paymentSubtext: "COD, UPI, Cards",
  supportBadge: "Support",
  supportSubtext: "Mon-Sat 9AM-8PM",
} as const;

// ── MATERIAL CATEGORIES ───────────────────────────────────────
export const materialCategories = [
  { name: "Balloons", slug: "balloons", icon: "🎈", description: "Helium, foil & latex balloons in every color & theme", image: "/images/materials/balloons.png" },
  { name: "Flower Stands", slug: "flower-stands", icon: "💐", description: "Elegant stands for bouquets and centerpieces", image: "/images/materials/flower-stands.png" },
  { name: "Metal Frames", slug: "metal-frames", icon: "🏗️", description: "Durable geometric frames for grand installations", image: "/images/materials/metal-frames.png" },
  { name: "Ring Frames", slug: "ring-frames", icon: "💍", description: "Decorative ring structures, entrance arches & more", image: "/images/materials/ring-frames.png" },
  { name: "Neon Signs", slug: "neon-signs", icon: "✨", description: "Custom neon text & logo signs for events", image: "/images/materials/neon-signs.png" },
  { name: "LED Numbers", slug: "led-numbers", icon: "🔢", description: "Glowing number letters for milestone celebrations", image: "/images/materials/led-numbers.png" },
  { name: "Cake Tables", slug: "cake-tables", icon: "🎂", description: "Elevated display tables with backdrop & lighting", image: "/images/materials/cake-tables.png" },
  { name: "Welcome Boards", slug: "welcome-boards", icon: "🚪", description: "Custom welcome signage with floral & balloon decor", image: "/images/materials/welcome-boards.png" },
  { name: "Wedding Thrones", slug: "wedding-thrones", icon: "👑", description: "Royal seats & throne setups for the couple", image: "/images/materials/wedding-thrones.png" },
  { name: "Artificial Flowers", slug: "artificial-flowers", icon: "🌸", description: "Long-lasting flower arrangements in premium quality", image: "/images/materials/artificial-flowers.png" },
  { name: "Fresh Flowers", slug: "fresh-flowers", icon: "🌷", description: "Hand-picked blooms for elegant decorations", image: "/images/materials/fresh-flowers.png" },
  { name: "Stage Props", slug: "stage-props", icon: "🎭", description: "Backdrops, podiums & stage accessories", image: "/images/materials/stage-props.png" },
  { name: "Curtains", slug: "curtains", icon: "🎬", description: "Luxurious drapes in silk, organza & velvet", image: "/images/materials/curtains.png" },
  { name: "Fabric Drapes", slug: "fabric-drapes", icon: "🪟", description: "Themed fabric draping for venue transformation", image: "/images/materials/fabric-drapes.png" },
  { name: "Lighting", slug: "lighting", icon: "💡", description: "Fairy lights, LEDs, chandeliers & spotlight setups", image: "/images/materials/lighting.png" },
  { name: "Chairs", slug: "chairs", icon: "🪑", description: "Banquet, designer & themed chair rentals", image: "/images/materials/chairs.png" },
  { name: "Centerpieces", slug: "centerpieces", icon: "🕯️", description: "Table centerpieces with florals, candles & decor", image: "/images/materials/centerpieces.png" },
  { name: "Mandap Items", slug: "mandap-items", icon: "🛕", description: "Sacred mandap decorations with florals & draping", image: "/images/materials/mandap-items.png" },
  { name: "Kids Theme Props", slug: "kids-theme-props", icon: "🎪", description: "Themed props & setups for children's events", image: "/images/materials/kids-theme-props.png" },
  { name: "Birthday Props", slug: "birthday-props", icon: "🎈", description: "Age number balloons, photo props & theme setups", image: "/images/materials/birthday-props.png" },
  { name: "Baby Shower Props", slug: "baby-shower-props", icon: "🍼", description: "Soft pastel themes, baby props & gender reveal", image: "/images/materials/baby-shower-props.png" },
  { name: "Haldi Props", slug: "haldi-props", icon: "🧴", description: "Traditional haldi ceremony decor & backdrop", image: "/images/materials/haldi-props.png" },
  { name: "Mehendi Props", slug: "mehendi-props", icon: "🌿", description: "Mehendi ceremony themes, arches & seating", image: "/images/materials/mehendi-props.png" },
  { name: "Festival Decorations", slug: "festival-decorations", icon: "🪔", description: "Diwali, Navratri, Christmas & themed decor", image: "/images/materials/festival-decorations.png" },
  { name: "Custom Items", slug: "custom-decor", icon: "✂️", description: "Bespoke decoration solutions for unique events", image: "/images/materials/custom-decor.png" },
] as const;

// ── ADMIN ─────────────────────────────────────────────────────
export const admin = {
  loginTitle: "Admin Login",
  loginSubtitle: "Mahek Balloon Admin Panel",
  emailLabel: "Email Address",
  emailPlaceholder: "admin@mahekballoon.com",
  passwordLabel: "Password",
  passwordPlaceholder: "Enter password",
  signInButton: "Sign In",
  defaultCredentials: "Default: admin@mahekballoon.com / admin123",
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
