export const BRAND = {
  name: "Mahek Decorator",
  tagline: "Premium Helium Balloons & Decoration Services",
  description:
    "Premium helium balloons, balloon bouquets, party supplies and luxury decoration services delivered within 140 KM.",
  email: "hello@mahekdecor.com",
  phone: "+91 98765 43210",
  whatsapp: "+919876543210",
  address: "Mumbai, Maharashtra, India",
  instagram: "https://instagram.com/mahekdecor",
  facebook: "https://facebook.com/mahekdecor",
  deliveryRadiusKm: 140,
  founded: 2015,
  customers: 5000,
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.0390079727!2d72.88118615!3d19.08225065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  {
    label: "Decorative Material",
    href: "/materials",
    children: [
      { name: "Balloons", href: "/materials/balloons", icon: "🌈" },
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

export const SHOP_CATEGORIES = [
  { name: "Helium Balloons", slug: "helium-balloons", subtitle: "Floating elegance for every occasion" },
  { name: "Balloon Bouquets", slug: "balloon-bouquets", subtitle: "Curated bunches, hand-tied with care" },
  { name: "Balloon Packets", slug: "balloon-packets", subtitle: "Ready-to-fill premium balloons" },
  { name: "Party Supplies", slug: "party-supplies", subtitle: "Complete celebration essentials" },
  { name: "Flower Bouquets", slug: "flower-bouquets", subtitle: "Fresh blooms for meaningful moments" },
];

export const SERVICE_CATEGORIES = [
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
];

export const HERO_FEATURES = [
  { label: "Same Day Delivery", description: "Order before 2 PM" },
  { label: "140 KM Delivery", description: "Wide coverage radius" },
  { label: "Premium Quality", description: "Verified materials" },
  { label: "Secure Payment", description: "COD, UPI & Cards" },
  { label: "Customer Support", description: "Mon - Sat, 9AM - 8PM" },
];

export const MATERIAL_CATEGORIES = [
  { name: "Balloons", slug: "balloons", icon: "🎈", description: "Helium, foil & latex balloons in every color & theme", image: "/images/balloon-bunch.png" },
  { name: "Flower Stands", slug: "flower-stands", icon: "💐", description: "Elegant stands for bouquets and centerpieces", image: "/images/flower-stand.png" },
  { name: "Metal Frames", slug: "metal-frames", icon: "🏗️", description: "Durable geometric frames for grand installations", image: "/images/metal-frame.png" },
  { name: "Ring Frames", slug: "ring-frames", icon: "💍", description: "Decorative ring structures, entrance arches & more", image: "/images/ring-frame.png" },
  { name: "Neon Signs", slug: "neon-signs", icon: "✨", description: "Custom neon text & logo signs for events", image: "/images/neon-sign.png" },
  { name: "LED Numbers", slug: "led-numbers", icon: "🔢", description: "Glowing number letters for milestone celebrations", image: "/images/led-numbers.png" },
  { name: "Cake Tables", slug: "cake-tables", icon: "🎂", description: "Elevated display tables with backdrop & lighting", image: "/images/cake-table.png" },
  { name: "Welcome Boards", slug: "welcome-boards", icon: "🚪", description: "Custom welcome signage with floral & balloon decor", image: "/images/welcome-board.png" },
  { name: "Wedding Thrones", slug: "wedding-thrones", icon: "👑", description: "Royal seats & throne setups for the couple", image: "/images/wedding-throne.png" },
  { name: "Artificial Flowers", slug: "artificial-flowers", icon: "🌸", description: "Long-lasting flower arrangements in premium quality", image: "/images/artificial-flower.png" },
  { name: "Fresh Flowers", slug: "fresh-flowers", icon: "🌷", description: "Hand-picked blooms for elegant decorations", image: "/images/fresh-flower.png" },
  { name: "Stage Props", slug: "stage-props", icon: "🎭", description: "Backdrops, podiums & stage accessories", image: "/images/stage-props.png" },
  { name: "Curtains", slug: "curtains", icon: "🎬", description: "Luxurious drapes in silk, organza & velvet", image: "/images/curtain.png" },
  { name: "Fabric Drapes", slug: "fabric-drapes", icon: "🪟", description: "Themed fabric draping for venue transformation", image: "/images/fabric-drape.png" },
  { name: "Lighting", slug: "lighting", icon: "💡", description: "Fairy lights, LEDs, chandeliers & spotlight setups", image: "/images/lighting.png" },
  { name: "Chairs", slug: "chairs", icon: "🪑", description: "Banquet, designer & themed chair rentals", image: "/images/chair.png" },
  { name: "Centerpieces", slug: "centerpieces", icon: "🕯️", description: "Table centerpieces with florals, candles & decor", image: "/images/centerpiece.png" },
  { name: "Mandap Items", slug: "mandap-items", icon: "🛕", description: "Sacred mandap decorations with florals & draping", image: "/images/mandap.png" },
  { name: "Kids Theme Props", slug: "kids-theme-props", icon: "🎪", description: "Themed props & setups for children's events", image: "/images/kids-theme.png" },
  { name: "Birthday Props", slug: "birthday-props", icon: "🎈", description: "Age number balloons, photo props & theme setups", image: "/images/birthday-props.png" },
  { name: "Baby Shower Props", slug: "baby-shower-props", icon: "🍼", description: "Soft pastel themes, baby props & gender reveal", image: "/images/baby-shower.png" },
  { name: "Haldi Props", slug: "haldi-props", icon: "🧴", description: "Traditional haldi ceremony decor & backdrop", image: "/images/haldi-props.png" },
  { name: "Mehendi Props", slug: "mehendi-props", icon: "🌿", description: "Mehendi ceremony themes, arches & seating", image: "/images/mehendi-props.png" },
  { name: "Festival Decorations", slug: "festival-decorations", icon: "🪔", description: "Diwali, Navratri, Christmas & themed decor", image: "/images/festival.png" },
  { name: "Custom Items", slug: "custom-decor", icon: "✂️", description: "Bespoke decoration solutions for unique events", image: "/images/custom-decor.png" },
];

export const FOOTER_LINKS = {
  shop: [
    { label: "Helium Balloons", href: "/shop/helium-balloons" },
    { label: "Balloon Bouquets", href: "/shop/balloon-bouquets" },
    { label: "Balloon Packets", href: "/shop/balloon-packets" },
    { label: "Party Supplies", href: "/shop/party-supplies" },
    { label: "Flower Bouquets", href: "/shop/flower-bouquets" },
  ],
  services: [
    { label: "Birthday Decoration", href: "/services/birthday" },
    { label: "Wedding Decoration", href: "/services/wedding" },
    { label: "Corporate Events", href: "/services/corporate" },
    { label: "Baby Shower", href: "/services/baby-shower" },
    { label: "Proposal Setup", href: "/services/proposal" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Reviews", href: "/testimonials" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  policies: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Shipping & Delivery", href: "/shipping" },
    { label: "Refund Policy", href: "/refund" },
  ],
};

export const FREQUENTLY_ASKED_QUESTIONS = [
  {
    question: "Do you deliver helium balloons within 140 KM?",
    answer:
      "Yes. We deliver helium balloon bunches, bouquets and party supplies within a 140 KM radius from Mumbai. Delivery charges are calculated automatically at checkout based on your distance.",
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

export const TESTIMONIALS = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Mumbai",
    image: "/images/princess-bouquet.png",
    rating: 5,
    review:
      "The balloon bouquet arrived exactly as shown. Premium packaging and the balloons stayed afloat for days. Will definitely order again.",
    verified: true,
  },
  {
    id: "2",
    name: "Rahul Mehta",
    location: "Thane",
    image: "/images/bouquet-box.png",
    rating: 5,
    review:
      "Mahek Decorator transformed our anniversary celebration. The decor was elegant, not gaudy, and the team was professional from start to finish.",
    verified: true,
  },
  {
    id: "3",
    name: "Ananya Patel",
    location: "Navi Mumbai",
    image: "/images/draveewi-bouquet.png",
    rating: 5,
    review:
      "I planned a surprise proposal and they handled every detail discreetly and beautifully. Worth every rupee for the peace of mind.",
    verified: true,
  },
  {
    id: "4",
    name: "Vikram Joshi",
    location: "Pune",
    image: "/images/birthday-bouquet.png",
    rating: 5,
    review:
      "Ordered corporate event decorations for our product launch. The branding colors matched perfectly. Fast delivery within the 140 KM range.",
    verified: true,
  },
];

export const WHY_CHOOSE_US = [
  {
    title: "Premium Materials",
    description: "We source high-grade latex, foil balloons and fresh flowers that look better and last longer.",
  },
  {
    title: "Wide Delivery Network",
    description: "Reliable delivery across 140 KM radius with real-time order tracking and updates.",
  },
  {
    title: "Design Expertise",
    description: "Our in-house stylists plan every detail, balancing elegance with your personal taste.",
  },
  {
    title: "Transparent Pricing",
    description: "No hidden charges. Clear quotes for products and services with GST invoices included.",
  },
];
