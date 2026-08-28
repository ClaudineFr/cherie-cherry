import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const description =
  "Chérie Cherry, coffee shop et concept store : café, déco, papeterie et prêt-à-porter féminin.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cheriecherry.fr"),
  title: {
    default: "Chérie Cherry — Coffee shop & concept store",
    template: "%s — Chérie Cherry",
  },
  description,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Chérie Cherry",
    title: "Chérie Cherry — Coffee shop & concept store",
    description,
    url: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Le panier enveloppe tout le site : la navbar affiche son compteur,
            et n'importe quelle page peut y ajouter un produit. */}
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
