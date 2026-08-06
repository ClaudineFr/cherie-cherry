/* Chérie Cherry — filtres de l'admin en menu déroulant.
 *
 * Par défaut, l'admin Django affiche les filtres (list_filter) dans une colonne
 * à droite (desktop) ou empilés en bas de page (mobile). Ici, on les regroupe
 * derrière un bouton « Filtres » posé en haut à droite de la liste : au clic,
 * un panneau s'ouvre juste sous le bouton avec tous les filtres.
 *
 * On ne recrée PAS les filtres : on réutilise le bloc natif <search
 * id="changelist-filter"> (ses <details data-filter-title> restent les vrais
 * filtres, avec leurs liens qui rechargent la page filtrée). On se contente de
 * le déplacer dans un panneau flottant et de gérer ouverture/fermeture.
 *
 * Accessibilité : le bouton porte aria-expanded/aria-controls ; Échap ferme et
 * redonne le focus au bouton ; un clic à l'extérieur ferme.
 */
(function () {
  "use strict";

  function init() {
    var filter = document.getElementById("changelist-filter");
    if (!filter) { return; } // page sans list_filter : rien à faire

    // Combien de filtres actifs ? (pour afficher une pastille de compte)
    // Un filtre est « actif » si un de ses <li> autre que « Tout » est
    // sélectionné. Django marque le <li> courant avec la classe .selected ;
    // « Tout » est toujours le 1er <li>. On compte les blocs <details> dont le
    // .selected n'est pas le premier <li>.
    function countActive() {
      var n = 0;
      filter.querySelectorAll("details").forEach(function (d) {
        var sel = d.querySelector("li.selected");
        var first = d.querySelector("li");
        if (sel && sel !== first) { n++; }
      });
      return n;
    }

    // Zone d'ancrage : on crée un conteneur positionné en haut à droite, qui
    // contient le bouton + le panneau (le panneau est ancré sous le bouton).
    var wrap = document.createElement("div");
    wrap.className = "cc-filters";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cc-filters-toggle";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "changelist-filter");

    var active = countActive();
    btn.innerHTML =
      '<span class="cc-filters-label">Filtres</span>' +
      (active ? '<span class="cc-filters-count">' + active + "</span>" : "") +
      '<span class="cc-filters-caret" aria-hidden="true">▾</span>';

    wrap.appendChild(btn);

    // On déplace le bloc filtres natif DANS le wrap (il devient le panneau).
    // Sa place d'origine (colonne à droite / bas de page) est ainsi neutralisée.
    filter.classList.add("cc-filters-panel");
    filter.hidden = true;
    wrap.appendChild(filter);

    // Placement de la barre d'outils (recherche + bouton Filtres). IMPORTANT :
    // on la pose AVANT .changelist-form-container, comme frère, et pas dedans.
    // En effet, tant que #changelist-filter reste un descendant du conteneur,
    // Django applique `max-width: calc(100% - 270px)` au bloc du tableau
    // (règle `…:has(#changelist-filter) > div`) et réserve une colonne vide.
    // En sortant le filtre du conteneur, le tableau récupère toute la largeur.
    var search = document.getElementById("changelist-search");
    var container = document.querySelector(".changelist-form-container");
    var changelist = document.getElementById("changelist");

    var bar = document.createElement("div");
    bar.className = "cc-toolbar";
    // On récupère aussi le titre a11y (h2 visually-hidden) de la recherche pour
    // le garder logiquement rattaché, puis on videra l'ancien #toolbar.
    var oldToolbar = document.getElementById("toolbar");
    var srLabel = oldToolbar ? oldToolbar.querySelector("h2") : null;
    if (srLabel) { bar.appendChild(srLabel); }
    if (search) { bar.appendChild(search); } // déplace la recherche dans la barre
    bar.appendChild(wrap);

    if (container && container.parentNode) {
      container.parentNode.insertBefore(bar, container);
    } else if (changelist) {
      changelist.insertBefore(bar, changelist.firstChild);
    } else {
      return;
    }

    // L'ancien #toolbar est désormais vide (sa recherche et son titre ont été
    // déplacés) : on le retire pour supprimer la bande rose résiduelle.
    if (oldToolbar && oldToolbar.children.length === 0) {
      oldToolbar.remove();
    }

    // --- Ouverture / fermeture ---
    function open() {
      filter.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      wrap.classList.add("is-open");
    }
    function close(giveFocusBack) {
      filter.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      wrap.classList.remove("is-open");
      if (giveFocusBack) { btn.focus(); }
    }

    btn.addEventListener("click", function () {
      filter.hidden ? open() : close(false);
    });

    // Clic à l'extérieur du wrap : on ferme.
    document.addEventListener("click", function (e) {
      if (filter.hidden) { return; }
      if (!wrap.contains(e.target)) { close(false); }
    });

    // Échap : ferme et redonne le focus au bouton.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !filter.hidden) { close(true); }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
