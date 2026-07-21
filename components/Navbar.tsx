import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-zinc-200 px-8 py-4">
      <Link href="/" className="text-xl font-semibold tracking-tight">
        Chérie Cherry 🍒
      </Link>
      <div className="flex gap-6 text-sm text-zinc-600">
        <Link href="/" className="hover:text-black">
          Accueil
        </Link>
        <Link href="/boutique" className="hover:text-black">
          Boutique
        </Link>
      </div>
    </nav>
  );
}
