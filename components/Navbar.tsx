"use client";
// ce composant s'exécute aussi dans le navigateur, il peut utiliser useState, écouter des clics, etc.

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between bg-green px-8 py-5 text-cream">
      <Link href="/" className="font-serif text-2xl tracking-wide">
        Chérie Cherry
      </Link>

      {/* Bouton burger : visible uniquement sur mobile (caché à partir de sm:) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        className="sm:hidden"
      >
        {isOpen ? (
          <FaXmark className="h-6 w-6" />
        ) : (
          <FaBars className="h-6 w-6" />
        )}
      </button>

      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } absolute left-0 top-full w-full flex-col items-center gap-6 bg-green px-8 py-6 text-sm uppercase tracking-widest sm:static sm:flex sm:w-auto sm:flex-row sm:gap-8 sm:bg-transparent sm:p-0`}
      >
        <Link href="/" className="transition-opacity hover:opacity-70">
          Accueil
        </Link>
        <Link
          href="/coffee-shop"
          className="transition-opacity hover:opacity-70"
        >
          Coffee Shop
        </Link>
        <Link
          href="/concept-store"
          className="transition-opacity hover:opacity-70"
        >
          Concept Store
        </Link>
        <Link href="/a-propos" className="transition-opacity hover:opacity-70">
          À propos
        </Link>
        <Link href="/contact" className="transition-opacity hover:opacity-70">
          Contact
        </Link>
      </div>
    </nav>
  );
}
