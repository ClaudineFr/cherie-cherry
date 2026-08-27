"use client";
// ce composant s'exécute aussi dans le navigateur, il peut utiliser useState, écouter des clics, etc.

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import logo from "@/public/logo-mark.png";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/coffee-shop", label: "Coffee Shop" },
  { href: "/concept-store", label: "Concept Store" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar relative flex items-center justify-between bg-green px-8 py-5 text-cream">
      <Link href="/" aria-label="Chérie Cherry — accueil" className="navbar-logo shrink-0">
        <Image
          src={logo}
          alt="Chérie Cherry"
          priority
          className="h-10 w-auto"
        />
      </Link>

      {/* Bouton burger : visible uniquement sur mobile (caché à partir de sm:) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        className="navbar-burger sm:hidden"
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
        } navbar-menu absolute left-0 top-full w-full flex-col items-center gap-6 bg-green px-8 py-6 text-[0.7rem] uppercase tracking-[0.08em] sm:static sm:flex sm:w-auto sm:flex-row sm:gap-6 sm:bg-transparent sm:p-0`}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="navbar-link transition-opacity hover:opacity-70"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
