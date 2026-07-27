import { Truck, Shield, HeadphonesIcon, Clock, MapPin } from "lucide-react";

const FEATURES = [
  { icon: Truck, label: "Same Day Delivery", sublabel: "Order before 2 PM" },
  { icon: MapPin, label: "140 KM Coverage", sublabel: "Mumbai & beyond" },
  { icon: Shield, label: "Secure Payment", sublabel: "COD, UPI, Cards" },
  { icon: HeadphonesIcon, label: "Dedicated Support", sublabel: "Mon-Sat 9AM-8PM" },
  { icon: Clock, label: "On-Time Setup", sublabel: "Punctual service" },
];

export function FeaturesBar() {
  return (
    <div className="bg-forest py-2.5 md:py-3">
      <div className="container-tight">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
          {FEATURES.map((feature) => (
            <div key={feature.label} className="flex items-center gap-2 justify-center">
              <feature.icon className="w-3.5 h-3.5 text-gold flex-shrink-0" strokeWidth={2} />
              <div>
                <p className="text-[10px] md:text-xs font-semibold text-white leading-tight">{feature.label}</p>
                <p className="text-[8px] md:text-[10px] text-white/50 leading-tight">{feature.sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
