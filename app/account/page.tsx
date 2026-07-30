import { Metadata } from "next";
import Link from "next/link";
import { User, Heart, ShoppingBag, Calendar, LogOut, Package, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "My Account | Mahek Balloon",
  description: "Manage your profile, bookings, wishlist, and account settings.",
};

const dummyBookings = [
  { id: "B001", product: "Rose Gold Birthday Bouquet", date: "2026-08-15", status: "Confirmed", quantity: 1, total: "₹1,299" },
  { id: "B002", product: "Wedding Throne Setup", date: "2026-09-01", status: "Pending", quantity: 1, total: "₹25,000" },
  { id: "B003", product: "Helium Balloon Bunch", date: "2026-07-20", status: "Delivered", quantity: 3, total: "₹2,097" },
];

const dummyWishlist = [
  { id: "W001", name: "Pastel Helium Balloon Bunch", price: "₹699", image: "/images/hero-balloons.webp" },
  { id: "W002", name: "Rose Gold Birthday Bouquet", price: "₹1,299", image: "/images/rose-gold-birthday-bouquet.png" },
  { id: "W003", name: "Chrome Foil Balloon Set", price: "₹599", image: "/images/chrome-foil-balloon-set.png" },
];

export default function AccountPage() {
  return (
    <main className="min-h-screen pt-16 md:pt-18 bg-background">
      <section className="section-spacing">
        <div className="container-tight">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="heading-hero text-ink">My Account</h1>
              <p className="body-large text-secondary-text mt-2">Manage your profile, bookings, and preferences.</p>
            </div>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/">
                <LogOut className="w-4 h-4" />
                Logout
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-border p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-forest-light flex items-center justify-center">
                  <User className="w-10 h-10 text-forest" />
                </div>
                <h2 className="font-heading font-semibold text-xl text-ink">Tanveer Singh</h2>
                <p className="text-sm text-secondary-text mt-1">tanveer@example.com</p>
                <p className="text-sm text-secondary-text mt-1 flex items-center justify-center gap-1.5">
                  <Phone className="w-4 h-4" /> +91 98765 43210
                </p>
                <p className="text-sm text-secondary-text mt-1 flex items-center justify-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Pune, Maharashtra
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-border p-6">
                <h3 className="font-heading font-semibold text-lg text-ink mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-forest" /> My Bookings
                </h3>
                {dummyBookings.length === 0 ? (
                  <p className="text-secondary-text text-sm">No bookings yet.</p>
                ) : (
                  <div className="space-y-3">
                    {dummyBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-ink text-sm truncate">{booking.product}</p>
                          <p className="text-xs text-secondary-text mt-0.5">
                            {booking.date} · Qty: {booking.quantity}
                          </p>
                        </div>
                        <Badge variant={booking.status === "Confirmed" ? "default" : booking.status === "Pending" ? "secondary" : "outline"} className="text-[10px]">
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-border p-6">
                <h3 className="font-heading font-semibold text-lg text-ink mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-forest" /> Wishlist
                </h3>
                {dummyWishlist.length === 0 ? (
                  <p className="text-secondary-text text-sm">Your wishlist is empty.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {dummyWishlist.map((item) => (
                      <Link key={item.id} href={`/shop/${item.name.toLowerCase().replace(/\s+/g, "-")}`} className="flex gap-3 p-3 rounded-xl border border-border hover:border-forest/30 transition-colors">
                        <div className="w-16 h-16 rounded-xl bg-secondary flex-shrink-0 flex items-center justify-center text-2xl">🎈</div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink line-clamp-1">{item.name}</p>
                          <p className="text-xs text-forest font-semibold">{item.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-border p-6">
                <h3 className="font-heading font-semibold text-lg text-ink mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-forest" /> Recent Orders
                </h3>
                <p className="text-secondary-text text-sm">No recent orders yet. <Link href="/shop" className="text-forest underline">Browse products</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}