// Re-export everything from content.ts for backward compatibility
import {
  business,
  socials,
  seo,
  navLinks,
  hero,
  featuresBar,
  about,
  whyChooseUs,
  services,
  productCategories,
  serviceCategories,
  products,
  galleryImages,
  testimonials,
  faqs,
  delivery,
  materialCategories,
  footer,
  servicesPage,
  testimonialsPage,
  faqPage,
  contactPage,
  bookingPage,
  cartPage,
  checkoutPage,
  wishlistPage,
  searchPage,
  newsletter,
  headerExtras,
  admin,
  statistics,
  galleryCategories,
  getCategoryName,
  getServiceBySlug,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts,
} from "./content";

// Named re-exports for backward compatibility
export {
  servicesPage,
  testimonialsPage,
  faqPage,
  contactPage,
  bookingPage,
  cartPage,
  checkoutPage,
  wishlistPage,
  searchPage,
  newsletter,
  headerExtras,
  admin,
  statistics,
  galleryCategories,
  getCategoryName,
  getServiceBySlug,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts,
  productCategories,
  serviceCategories,
  services,
  products,
  galleryImages,
  testimonials,
  faqs,
  delivery,
  materialCategories,
};

export const BRAND = { ...business, instagram: socials.instagram, facebook: socials.facebook };
export const NAV_LINKS = navLinks;
export const HERO_FEATURES = featuresBar;
export const WHY_CHOOSE_US = whyChooseUs.items;
export const FALLBACK_SERVICES = services;
export const SHOP_CATEGORIES = productCategories;
export const SERVICE_CATEGORIES = serviceCategories;
export const FALLBACK_PRODUCTS = products;
export const FALLBACK_GALLERY = galleryImages;
export const TESTIMONIALS = testimonials;
export const FREQUENTLY_ASKED_QUESTIONS = faqs;
export const FALLBACK_DELIVERY_CHARGES = delivery.charges;
export const MATERIAL_CATEGORIES = materialCategories;
export const FOOTER_LINKS = {
  shop: footer.shopLinks,
  services: footer.serviceLinks,
  company: footer.companyLinks,
  policy: footer.policyLinks,
};

// Re-export types
export type { NavLink, ProductCategory, Product, Service, GalleryImage, Testimonial } from "./content";
