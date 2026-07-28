// Re-export from the centralized content CMS
export {
  productCategories as FALLBACK_CATEGORIES,
  products as FALLBACK_PRODUCTS,
  services as FALLBACK_SERVICES,
  galleryImages as FALLBACK_GALLERY,
} from "./content";

import { delivery } from "./content";
export const FALLBACK_DELIVERY_CHARGES = delivery.charges;
