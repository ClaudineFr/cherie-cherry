// Deux boutons à côté du mot de passe généré : en proposer un autre, et le
// copier. Le mot de passe est produit côté serveur à l'ouverture du
// formulaire ; ici on se contente d'en fabriquer un du même format, pour
// éviter un aller-retour réseau à chaque clic.

(function () {
  "use strict";

  // Le même vocabulaire que catalog/passwords.py, en plus court : ces mots ne
  // servent qu'au bouton « en générer un autre ».
  var MOTS = [
    "Cerise", "Menthe", "Vanille", "Praline", "Amande", "Noisette",
    "Caramel", "Chocolat", "Framboise", "Myrtille", "Abricot", "Citron",
    "Lavande", "Jasmin", "Rose", "Pivoine", "Tulipe", "Iris",
    "Matcha", "Latte", "Moka", "Espresso", "Chai", "Cappuccino",
    "Croissant", "Brioche", "Madeleine", "Financier", "Palmier", "Sable",
    "Velours", "Satin", "Lin", "Coton", "Soie", "Cachemire",
    "Aurore", "Zephyr", "Brise", "Nuage", "Etoile", "Comete",
    "Bergamote", "Verveine", "Tilleul", "Camomille", "Figue", "Grenade",
    "Sorbet", "Nougat", "Guimauve", "Meringue", "Comptoir", "Terrasse"
  ];

  // crypto.getRandomValues plutôt que Math.random : c'est un mot de passe.
  function auHasard(max) {
    var buf = new Uint32Array(1);
    window.crypto.getRandomValues(buf);
    return buf[0] % max;
  }

  function generer() {
    var premier = MOTS[auHasard(MOTS.length)];
    var second;
    do {
      second = MOTS[auHasard(MOTS.length)];
    } while (second === premier);
    var chiffres = String(auHasard(10000)).padStart(4, "0");
    return premier + "-" + chiffres + "-" + second;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var champ = document.querySelector(".cc-password-field");
    if (!champ) return;

    var outils = document.createElement("span");
    outils.className = "cc-password-tools";

    var regenerer = document.createElement("button");
    regenerer.type = "button";
    regenerer.className = "cc-password-btn";
    regenerer.textContent = "En générer un autre";
    regenerer.addEventListener("click", function () {
      champ.value = generer();
    });

    var copier = document.createElement("button");
    copier.type = "button";
    copier.className = "cc-password-btn";
    copier.textContent = "Copier";
    copier.addEventListener("click", function () {
      // navigator.clipboard demande une origine sécurisée : en local (http)
      // il peut manquer, d'où la sélection du champ en secours — la personne
      // fait alors Cmd+C.
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(champ.value).then(function () {
          copier.textContent = "Copié !";
          setTimeout(function () {
            copier.textContent = "Copier";
          }, 1500);
        });
      } else {
        champ.select();
      }
    });

    outils.appendChild(regenerer);
    outils.appendChild(copier);
    champ.parentNode.insertBefore(outils, champ.nextSibling);
  });
})();
