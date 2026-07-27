import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Decorative Materials",
  description:
    "Browse premium decorative materials for birthdays, weddings, corporate events and more.",
};

export default function MaterialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}