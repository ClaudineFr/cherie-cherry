import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-green px-8 py-5 text-cream">
      <Link href="/" className="font-serif text-2xl tracking-wide">
        Chérie Cherry
      </Link>
      <div className="flex gap-8 text-sm uppercase tracking-widest">
        <Link href="/" className="transition-opacity hover:opacity-70">
          Accueil
        </Link>
        <Link href="/boutique" className="transition-opacity hover:opacity-70">
          Boutique
        </Link>
        <Link href="/contact" className="transition-opacity hover:opacity-70">
          Contact
        </Link>
      </div>
    </nav>
  );
}
