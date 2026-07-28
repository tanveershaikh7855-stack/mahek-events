import { Truck, Shield, HeadphonesIcon, Clock, MapPin } from "lucide-react";
import { featuresBar } from "@/lib/content";

const ICONS = [Truck, MapPin, Shield, HeadphonesIcon, Clock];

export function FeaturesBar() {
  return (
    <div className="bg-forest py-3 md:py-3.5">
      <div className="container-tight">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5">
          {featuresBar.map((feature, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <div key={feature.title} className="flex items-center gap-2.5 justify-center">
                <Icon className="w-4 h-4 text-gold flex-shrink-0" strokeWidth={2} />
                <div>
                  <p className="text-[11px] md:text-xs font-semibold text-white leading-tight">{feature.title}</p>
                  <p className="text-[9px] md:text-[10px] text-white/50 leading-tight">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
