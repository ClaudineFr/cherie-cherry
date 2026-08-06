/* Chérie Cherry — tableaux de l'admin (changelist).
 *
 * Deux rôles :
 *
 * 1) Colonne « éditer » (crayon) ajoutée en fin de tableau sur TOUS les écrans :
 *    en-tête sans titre + une icône crayon par ligne, qui ouvre la fiche
 *    (…/change/). C'est le seul point d'entrée vers l'édition depuis la liste.
 *
 * 2) En MOBILE seulement : l'édition en liste (list_editable) rend prix / stock
 *    / ordre / dispo sous forme de <input>/<select>, larges et peu lisibles au
 *    doigt. On les remplace par leur valeur en texte (lecture seule) ; l'édition
 *    passe alors par le crayon. Réversible : on masque les <input> sans les
 *    détruire et on insère un <span.cc-cell-static> à côté.
 */
(function () {
  "use strict";

  // Même seuil que la media query CSS (max-width: 640px).
  var MOBILE = window.matchMedia("(max-width: 640px)");

  // Formate la valeur d'un champ pour l'affichage texte.
  function textFor(field) {
    // Cases à cocher (booléens : coup de cœur, dispo, actif, fermé…).
    if (field.type === "checkbox") {
      return { text: field.checked ? "Oui" : "Non", bool: field.checked };
    }
    // Listes déroulantes (<select>) : on montre le libellé choisi.
    if (field.tagName === "SELECT") {
      var opt = field.options[field.selectedIndex];
      return { text: opt ? opt.text : "", bool: null };
    }
    // Champs numériques (prix, stock, ordre) et texte : la valeur telle quelle.
    // Un prix "45.00" reste "45.00" (le symbole € est déjà dans l'en-tête).
    return { text: field.value, bool: null };
  }

  // Transforme les cellules éditables d'une ligne de tableau en texte.
  function staticizeRow(row) {
    var fields = row.querySelectorAll(
      'td input[type="text"], td input[type="number"], td input[type="checkbox"], td select'
    );
    fields.forEach(function (field) {
      var cell = field.closest("td");
      // On ignore la case à cocher de SÉLECTION de ligne (colonne d'actions) :
      // ce n'est pas un champ de donnée, il doit rester une vraie case.
      if (cell && cell.classList.contains("action-checkbox")) { return; }
      // Inutile de traiter une cellule déjà masquée (colonne cachée en mobile).
      if (cell && getComputedStyle(cell).display === "none") { return; }

      // Idempotent : si on a déjà traité cette cellule, on ne double pas.
      if (field.dataset.ccStaticized === "1") { return; }
      field.dataset.ccStaticized = "1";

      var info = textFor(field);
      var span = document.createElement("span");
      span.className = "cc-cell-static";
      if (info.bool === true) { span.classList.add("cc-bool-true"); }
      if (info.bool === false) { span.classList.add("cc-bool-false"); }
      span.textContent = info.text;

      // On masque l'input d'origine (sans le retirer) et on affiche le texte.
      field.style.display = "none";
      field.insertAdjacentElement("afterend", span);
    });
  }

  // Restaure les champs éditables (repasse en desktop / élargissement).
  function restore() {
    document.querySelectorAll(".cc-cell-static").forEach(function (span) {
      span.remove();
    });
    document.querySelectorAll('[data-cc-staticized="1"]').forEach(function (field) {
      field.style.display = "";
      delete field.dataset.ccStaticized;
    });
  }

  // Trouve l'URL de la fiche (…/change/) d'une ligne. Django la pose selon le
  // cas sur le nom OU sur la vignette : on prend le premier lien qui pointe
  // vers une page de changement.
  function changeUrlFor(row) {
    var links = row.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      // …/change/ éventuellement suivi d'une query (?_changelist_filters=…)
      // ou d'un fragment. On matche donc /change/ non forcément en fin de URL.
      if (/\/change\/(\?|#|$)/.test(href)) {
        return href;
      }
    }
    return null;
  }

  // Petit lien-icône crayon vers la fiche (réutilise le sprite Lucide #icon-edit).
  function makeEditLink(url) {
    var a = document.createElement("a");
    a.className = "cc-edit-link";
    a.href = url;
    a.title = "Modifier";
    a.setAttribute("aria-label", "Modifier");
    a.innerHTML = '<svg class="cc-icon" aria-hidden="true"><use href="#icon-edit"></use></svg>';
    return a;
  }

  // Ajoute une colonne « éditer » (crayon) en fin de tableau : une cellule
  // d'en-tête SANS titre + une cellule par ligne avec l'icône. Idempotent.
  function addEditColumn(table) {
    if (table.dataset.ccEditcol === "1") { return; }

    // En-tête : cellule vide (pas de titre pour cette colonne).
    var headRow = table.querySelector("thead tr");
    if (headRow && !headRow.querySelector("th.cc-edit-col")) {
      var th = document.createElement("th");
      th.className = "cc-edit-col";
      th.setAttribute("scope", "col");
      th.innerHTML = '<span class="visually-hidden">Modifier</span>';
      headRow.appendChild(th);
    }

    // Corps : une cellule crayon par ligne (si on a trouvé l'URL de fiche).
    table.querySelectorAll("tbody tr").forEach(function (row) {
      if (row.querySelector("td.cc-edit-col")) { return; }
      var url = changeUrlFor(row);
      var td = document.createElement("td");
      td.className = "cc-edit-col";
      if (url) { td.appendChild(makeEditLink(url)); }
      row.appendChild(td);
    });

    table.dataset.ccEditcol = "1";
  }

  function apply() {
    var table = document.getElementById("result_list");
    if (!table) { return; }
    // La colonne « éditer » est présente sur tous les écrans.
    addEditColumn(table);
    // Le passage des champs éditables en texte ne concerne que le mobile.
    if (MOBILE.matches) {
      table.querySelectorAll("tbody tr").forEach(staticizeRow);
    } else {
      restore();
    }
  }

  function onReady() {
    apply();
    // Rebascule si l'écran passe le seuil (rotation, redimensionnement).
    if (MOBILE.addEventListener) {
      MOBILE.addEventListener("change", apply);
    } else if (MOBILE.addListener) {
      MOBILE.addListener(apply); // anciens navigateurs
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
})();
