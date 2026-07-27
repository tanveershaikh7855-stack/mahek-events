import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { BRAND, FOOTER_LINKS, WHY_CHOOSE_US } from "@/lib/constants";

const SocialIcon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d={d} />
  </svg>
);

const INSTAGRAM_PATH = "M12 2.25c2.17 0 2.43.01 3.27.05.82.04 1.38.17 1.87.36.52.2.97.47 1.41.91.44.44.71.89.91 1.41.19.49.32 1.05.36 1.87.04.84.05 1.1.05 3.27s-.01 2.43-.05 3.27c-.04.82-.17 1.38-.36 1.87-.2.52-.47.97-.91 1.41-.44.44-.89.71-1.41.91-.49.19-1.05.32-1.87.36-.84.04-1.1.05-3.27.05s-2.43-.01-3.27-.05c-.82-.04-1.38-.17-1.87-.36-.52-.2-.97-.47-1.41-.91-.44-.44-.71-.89-.91-1.41-.19-.49-.32-1.05-.36-1.87-.04-.84-.05-1.1-.05-3.27s.01-2.43.05-3.27c.04-.82.17-1.38.36-1.87.2-.52.47-.97.91-1.41.44-.44.89-.71 1.41-.91.49-.19 1.05-.32 1.87-.36.84-.04 1.1-.05 3.27-.05zm0 1.8c-2.14 0-2.39.01-3.22.04-.78.03-1.2.16-1.48.27-.37.14-.63.31-.9.58-.27.27-.44.53-.58.9-.11.28-.24.7-.27 1.48-.03.83-.04 1.08-.04 3.22 0 2.14.01 2.39.04 3.22.03.78.16 1.2.27 1.48.14.37.31.63.58.9.27.27.53.44.9.58.28.11.7.24 1.48.27.83.03 1.08.04 3.22.04 2.14 0 2.39-.01 3.22-.04.78-.03 1.2-.16 1.48-.27.37-.14.63-.31.9-.58.27-.27.44-.53.58-.9.11-.28.24-.7.27-1.48.03-.83.04-1.08.04-3.22 0-2.14-.01-2.39-.04-3.22-.03-.78-.16-1.2-.27-1.48-.14-.37-.31-.63-.58-.9-.27-.27-.53-.44-.9-.58-.28-.11-.7-.24-1.48-.27-.83-.03-1.08-.04-3.22-.04zM12 6.3a5.7 5.7 0 100 11.4A5.7 5.7 0 0012 6.3zm0 9.4a3.7 3.7 0 110-7.4 3.7 3.7 0 010 7.4zm5.68-9.78a1.32 1.32 0 11-2.64 0 1.32 1.32 0 012.64 0z";

const FACEBOOK_PATH = "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z";

const WHATSAPP_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white/80 pb-16 lg:pb-0">
      <div className="container-tight py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label={`${BRAND.name} - Home`}>
              <Image
                src="/images/logo/logo.png"
                alt="Mahek Decorator"
                width={120}
                height={32}
                className="h-[32px] w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-white/40 text-xs leading-relaxed max-w-xs mb-4">{BRAND.description}</p>
            <div className="flex flex-wrap gap-2.5 mb-4">
              <a
                href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <SocialIcon d={WHATSAPP_PATH} />
                <span>WhatsApp</span>
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{BRAND.email}</span>
              </a>
              <a
                href={`tel:${BRAND.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{BRAND.phone}</span>
              </a>
            </div>
            <div className="flex gap-2.5">
              <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-white/30 hover:text-white transition-all" aria-label="Instagram">
                <SocialIcon d={INSTAGRAM_PATH} />
              </a>
              <a href={BRAND.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-white/30 hover:text-white transition-all" aria-label="Facebook">
                <SocialIcon d={FACEBOOK_PATH} />
              </a>
              <a href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-white/30 hover:text-white transition-all" aria-label="WhatsApp">
                <SocialIcon d={WHATSAPP_PATH} />
              </a>
            </div>
          </div>

          <nav>
            <h4 className="font-heading text-xs font-bold text-white mb-3">Shop</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/40 hover:text-white transition-colors text-xs">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav>
            <h4 className="font-heading text-xs font-bold text-white mb-3">Services</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/40 hover:text-white transition-colors text-xs">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="font-heading text-xs font-bold text-white mb-3">Company</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/40 hover:text-white transition-colors text-xs">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/8">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {WHY_CHOOSE_US.map((item, index) => (
              <div key={index} className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 rounded bg-gold/40" />
                </div>
                <div>
                  <h5 className="font-medium text-white text-xs">{item.title}</h5>
                  <p className="text-white/30 text-[10px] mt-0.5 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-5 border-t border-white/8">
            <p className="text-white/30 text-[10px]">
              &copy; {currentYear} {BRAND.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-[10px] text-white/30">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {BRAND.address}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Mon-Sat 9AM-8PM
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {BRAND.phone}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
