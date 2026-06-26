/* =====================================================================
   KUUBERA STORE — APP LOGIC
   ---------------------------------------------------------------------
   You normally DON'T need to touch this file.
   It loads your products from  products.csv , then draws the catalog,
   filtering, search and the popup. Your settings come from products.js.
   ===================================================================== */

(function () {
  "use strict";

  /* ---- Grab the elements we need from index.html ---- */
  var grid          = document.getElementById("product-grid");
  var filterBar     = document.getElementById("filter-bar");
  var searchInput   = document.getElementById("search-input");
  var emptyState    = document.getElementById("empty-state");
  var resultCount   = document.getElementById("result-count");

  /* Modal (product popup) elements */
  var modal         = document.getElementById("product-modal");
  var modalOverlay  = document.getElementById("modal-overlay");
  var modalContent  = document.getElementById("modal-content");

  /* Current view state */
  var PRODUCTS       = [];        // filled after products.csv loads
  var activeCategory = "All";
  var searchTerm     = "";

  /* Format a price number like 4999 into "₹4,999" */
  function formatPrice(value) {
    return CURRENCY + Number(value).toLocaleString("en-IN");
  }

  /* Build the WhatsApp ordering link with a pre-filled message. */
  function whatsAppLink(product, size) {
    var message = "Hi Kuubera Store, I'd like to order: " + product.name;
    if (size) {
      message += " (Size: " + size + ")";
    }
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  /* ==================  LOAD PRODUCTS FROM CSV  ================== */

  /* A small, correct CSV parser. Handles quoted fields, commas and
     line breaks inside quotes, and "" as an escaped quote. */
  function parseCSV(text) {
    var rows = [], row = [], field = "", inQuotes = false, i = 0;
    while (i < text.length) {
      var ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        field += ch; i++; continue;
      }
      if (ch === '"')  { inQuotes = true; i++; continue; }
      if (ch === ',')  { row.push(field); field = ""; i++; continue; }
      if (ch === '\r') { i++; continue; }
      if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += ch; i++;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  /* "S|M|L" -> ["S","M","L"];  blank -> [] */
  function splitList(value) {
    if (!value) return [];
    return value.split("|").map(function (x) { return x.trim(); }).filter(Boolean);
  }

  /* Parse the sizes column into objects with per-size availability.
     Each entry may carry a status:  "M"  -> available,  "M:no" -> sold out.
     Accepted "sold out" markers: no / out / false / 0 / soldout.        */
  function parseSizes(value) {
    return splitList(value).map(function (token) {
      var parts = token.split(":");
      var label = parts[0].trim();
      var status = (parts[1] || "").trim().toLowerCase();
      var soldOut = status === "no" || status === "out" || status === "false" ||
                    status === "0"  || status === "soldout" || status === "sold out";
      return { label: label, available: !soldOut };
    }).filter(function (s) { return s.label; });
  }

  /* Turn the parsed CSV rows into product objects we can render. */
  function rowsToProducts(rows) {
    if (!rows.length) return [];
    var headers = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    function col(cells, key) {
      var idx = headers.indexOf(key);
      return idx === -1 ? "" : String(cells[idx] || "").trim();
    }
    var list = [];
    for (var r = 1; r < rows.length; r++) {
      var cells = rows[r];
      var name = col(cells, "name");
      if (!name) continue;   // skip blank lines / rows with no name
      var sizes = parseSizes(col(cells, "sizes"));
      // The product is "Available" if at least one size is in stock.
      // (No sizes listed = treated as available.)
      var inStock = sizes.length
        ? sizes.some(function (s) { return s.available; })
        : true;
      list.push({
        name:        name,
        category:    col(cells, "category") || "Other",
        price:       Number(col(cells, "price").replace(/[^0-9.]/g, "")) || 0,
        sizes:       sizes,
        description: col(cells, "description"),
        images:      splitList(col(cells, "images")),
        inStock:     inStock,
        amazonUrl:   col(cells, "amazon_url"),
      });
    }
    return list;
  }

  function showMessage(html) {
    grid.innerHTML = "";
    emptyState.hidden = true;
    resultCount.textContent = "";
    var note = document.getElementById("status-note") || document.createElement("p");
    note.id = "status-note";
    note.className = "status-note";
    note.innerHTML = html;
    if (!note.parentNode) grid.parentNode.insertBefore(note, grid);
  }
  function clearMessage() {
    var note = document.getElementById("status-note");
    if (note) note.parentNode.removeChild(note);
  }

  function loadProducts() {
    showMessage("Loading the collection…");
    fetch(PRODUCTS_CSV, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then(function (text) {
        PRODUCTS = rowsToProducts(parseCSV(text));
        clearMessage();
        if (!PRODUCTS.length) {
          showMessage("No products found in <strong>products.csv</strong>. " +
                      "Add a row for each item and refresh the page.");
          return;
        }
        setupReveal();
        buildFilters();
        render();
      })
      .catch(function (err) {
        console.error("Kuubera Store: could not load products.csv —", err);
        showMessage(
          "Couldn't load the product list. If you're previewing on your computer, " +
          "make sure you started the local server (see the README) and opened " +
          "<strong>http://localhost:8000</strong> — don't double-click the HTML file. " +
          "On your live site this works automatically."
        );
      });
  }

  /* ---- Build the category filter buttons from the products ---- */
  function buildFilters() {
    var categories = ["All"];
    PRODUCTS.forEach(function (p) {
      if (categories.indexOf(p.category) === -1) categories.push(p.category);
    });

    filterBar.innerHTML = "";
    categories.forEach(function (cat) {
      var btn = document.createElement("button");
      btn.className = "filter-pill" + (cat === activeCategory ? " is-active" : "");
      btn.type = "button";
      btn.textContent = cat;
      btn.setAttribute("aria-pressed", cat === activeCategory ? "true" : "false");
      btn.addEventListener("click", function () {
        activeCategory = cat;
        buildFilters();   // re-render to move the highlight
        render();
      });
      filterBar.appendChild(btn);
    });
  }

  /* ---- Decide which products to show based on filter + search ---- */
  function getVisibleProducts() {
    return PRODUCTS.filter(function (p) {
      var matchesCategory = activeCategory === "All" || p.category === activeCategory;
      var matchesSearch   = p.name.toLowerCase().indexOf(searchTerm) !== -1;
      return matchesCategory && matchesSearch;
    });
  }

  /* ---- Draw one product card ---- */
  function createCard(product, index) {
    var card = document.createElement("article");
    card.className = "card" + (product.inStock ? "" : " is-soldout");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "View details for " + product.name);

    var firstImage = (product.images && product.images[0]) || "logo-mark.png";

    card.innerHTML =
      '<div class="card__media">' +
        '<img src="images/' + escapeHtml(firstImage) + '" alt="' + escapeHtml(product.name) + '"' +
            ' loading="lazy" decoding="async" width="600" height="800">' +
        (product.inStock
            ? '<span class="badge badge--stock">Available</span>'
            : '<span class="badge badge--soldout">Sold Out</span>') +
      '</div>' +
      '<div class="card__body">' +
        '<h3 class="card__name">' + escapeHtml(product.name) + '</h3>' +
        '<p class="card__cat">' + escapeHtml(product.category) + '</p>' +
        '<p class="card__price">' + formatPrice(product.price) + '</p>' +
      '</div>';

    function open() { openModal(index); }
    card.addEventListener("click", open);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });

    return card;
  }

  /* ---- Render the whole grid ---- */
  function render() {
    var visible = getVisibleProducts();
    grid.innerHTML = "";

    if (visible.length === 0) {
      emptyState.hidden = false;
      resultCount.textContent = "No products found";
      return;
    }
    emptyState.hidden = true;
    resultCount.textContent =
      visible.length + (visible.length === 1 ? " piece" : " pieces");

    visible.forEach(function (product) {
      var originalIndex = PRODUCTS.indexOf(product);
      grid.appendChild(createCard(product, originalIndex));
    });
  }

  /* ====================  PRODUCT POPUP (MODAL)  ==================== */

  var lastFocused = null;

  function openModal(index) {
    var product = PRODUCTS[index];
    if (!product) return;

    lastFocused = document.activeElement;

    var images = product.images && product.images.length ? product.images : ["logo-mark.png"];

    // Thumbnail strip (only if more than one image)
    var thumbs = "";
    if (images.length > 1) {
      thumbs = '<div class="gallery__thumbs">' +
        images.map(function (img, i) {
          return '<button type="button" class="thumb' + (i === 0 ? ' is-active' : '') +
                 '" data-img="images/' + escapeHtml(img) + '">' +
                 '<img src="images/' + escapeHtml(img) + '" alt="View ' + (i + 1) +
                 '" loading="lazy" width="80" height="107"></button>';
        }).join("") +
      '</div>';
    }

    // Size selector (only if sizes exist). Sold-out sizes are shown disabled;
    // the first AVAILABLE size is pre-selected.
    var firstAvailableSize = "";
    var sizeBlock = "";
    if (product.sizes && product.sizes.length) {
      var activeSet = false;
      var pills = product.sizes.map(function (s) {
        var cls = "size-pill";
        var attr = ' data-size="' + escapeHtml(s.label) + '"';
        if (!s.available) {
          cls += " is-unavailable";
          attr += ' disabled title="Sold out" aria-label="' + escapeHtml(s.label) + ' — sold out"';
        } else if (!activeSet) {
          cls += " is-active";
          activeSet = true;
          firstAvailableSize = s.label;
        }
        return '<button type="button" class="' + cls + '"' + attr + '>' + escapeHtml(s.label) + '</button>';
      }).join("");
      sizeBlock =
        '<div class="size-block">' +
          '<p class="field-label">Size</p>' +
          '<div class="size-options" role="group" aria-label="Choose a size">' + pills + '</div>' +
        '</div>';
    }

    var stockTag = product.inStock
      ? '<span class="badge badge--stock">Available</span>'
      : '<span class="badge badge--soldout">Sold Out</span>';

    // "Buy on Amazon" button — only if an amazon link was provided in the CSV.
    var amazonBlock = product.amazonUrl
      ? '<a class="btn-amazon" href="' + escapeHtml(product.amazonUrl) + '"' +
          ' target="_blank" rel="noopener">' + amazonIcon() + 'Buy on Amazon</a>'
      : '';

    modalContent.innerHTML =
      '<button type="button" class="modal__close" id="modal-close" aria-label="Close">&times;</button>' +
      '<div class="modal__grid">' +
        '<div class="gallery">' +
          '<div class="gallery__main">' +
            '<img id="gallery-main-img" src="images/' + escapeHtml(images[0]) + '" alt="' +
                 escapeHtml(product.name) + '" width="600" height="800">' +
          '</div>' +
          thumbs +
        '</div>' +
        '<div class="modal__info">' +
          '<p class="modal__cat">' + escapeHtml(product.category) + '</p>' +
          '<h2 class="modal__name">' + escapeHtml(product.name) + '</h2>' +
          '<p class="modal__price">' + formatPrice(product.price) + ' ' + stockTag + '</p>' +
          '<p class="modal__desc">' + escapeHtml(product.description) + '</p>' +
          sizeBlock +
          '<div class="buy-actions">' +
            (product.inStock
              ? '<a id="order-btn" class="btn-whatsapp" href="' +
                  whatsAppLink(product, firstAvailableSize) + '" target="_blank" rel="noopener">' +
                  whatsAppIcon() + 'Order on WhatsApp</a>'
              : '<span class="btn-whatsapp is-disabled" aria-disabled="true">' +
                  whatsAppIcon() + 'Sold Out</span>') +
            amazonBlock +
          '</div>' +
          (product.inStock
            ? '<p class="modal__note">You\'ll be taken to WhatsApp with your order pre-filled.</p>'
            : '') +
        '</div>' +
      '</div>';

    // --- Wire up gallery thumbnails ---
    var mainImg = document.getElementById("gallery-main-img");
    Array.prototype.forEach.call(modalContent.querySelectorAll(".thumb"), function (t) {
      t.addEventListener("click", function () {
        mainImg.src = t.getAttribute("data-img");
        modalContent.querySelectorAll(".thumb").forEach(function (x) { x.classList.remove("is-active"); });
        t.classList.add("is-active");
      });
    });

    // --- Wire up size selection (updates the WhatsApp link) ---
    // Only available sizes are selectable, and only if the order button exists.
    var orderBtn = document.getElementById("order-btn");
    if (orderBtn) {
      modalContent.querySelectorAll(".size-pill:not(.is-unavailable)").forEach(function (pill) {
        pill.addEventListener("click", function () {
          modalContent.querySelectorAll(".size-pill").forEach(function (x) { x.classList.remove("is-active"); });
          pill.classList.add("is-active");
          orderBtn.href = whatsAppLink(product, pill.getAttribute("data-size"));
        });
      });
    }

    // --- Close handlers ---
    document.getElementById("modal-close").addEventListener("click", closeModal);

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // stop background scrolling
    document.getElementById("modal-close").focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  /* Close when clicking the dark overlay or pressing Escape */
  modalOverlay.addEventListener("click", closeModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  /* ====================  HELPERS  ==================== */

  /* Inline WhatsApp logo (SVG) so we don't load an external icon. */
  function whatsAppIcon() {
    return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">' +
      '<path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 ' +
      '11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 ' +
      '11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 ' +
      '9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 ' +
      '9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.717zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>';
  }

  /* Inline Amazon "smile" logo (SVG). */
  function amazonIcon() {
    return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">' +
      '<path d="M15.93 17.09c-2.13 1.57-5.22 2.4-7.87 2.4-3.72 0-7.07-1.38-9.6-3.66-.2-.18-.02-.43.22-.29 2.74 1.59 6.12 2.55 9.62 2.55 2.36 0 4.95-.49 7.33-1.5.36-.16.66.23.3.5zm.89-1.02c-.27-.35-1.8-.17-2.48-.08-.21.02-.24-.16-.05-.29 1.22-.86 3.23-.61 3.46-.32.24.29-.06 2.3-1.21 3.26-.18.15-.34.07-.27-.12.26-.62.83-2 .55-2.35z"/>' +
      '<path d="M13.5 8.34V7.2c0-.17.13-.29.29-.29h5.12c.16 0 .29.12.29.28v.97c0 .17-.14.38-.39.72l-2.65 3.79c.99-.02 2.03.13 2.92.63.2.11.26.28.27.45v1.2c0 .17-.18.36-.37.26-1.58-.83-3.68-.92-5.43.01-.18.09-.37-.09-.37-.26v-1.14c0-.19 0-.51.19-.8l3.07-4.41h-2.67c-.16 0-.29-.11-.29-.28z"/>' +
      '<path d="M5.6 14.9H4.04c-.15-.01-.27-.12-.28-.27V7.22c0-.16.14-.29.3-.29h1.45c.15 0 .27.12.28.27v.98h.03c.38-1.01 1.09-1.48 2.05-1.48.98 0 1.59.47 2.03 1.48.38-1.01 1.24-1.48 2.16-1.48.65 0 1.36.27 1.8.87.5.67.4 1.64.4 2.49v5.01c0 .16-.14.29-.3.29h-1.55c-.16-.01-.28-.13-.28-.29V10.4c0-.34.03-1.18-.04-1.5-.12-.53-.46-.68-.9-.68-.37 0-.76.25-.92.65-.16.4-.14 1.06-.14 1.53v4.21c0 .16-.14.29-.3.29H8.49c-.16-.01-.28-.13-.28-.29V10.4c0-.89.15-2.19-.95-2.19-1.11 0-1.07 1.27-1.07 2.19v4.21c0 .16-.13.29-.29.29z"/></svg>';
  }

  /* Escape text so it can't break the HTML (also safe in attributes). */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* Reveal-on-scroll fade-in for cards (set up once). */
  function setupReveal() {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    var mo = new MutationObserver(function () {
      grid.querySelectorAll(".card:not(.is-visible)").forEach(function (c) { io.observe(c); });
    });
    mo.observe(grid, { childList: true });
  }

  /* ====================  STARTUP  ==================== */

  // Search box: filter as the user types.
  searchInput.addEventListener("input", function (e) {
    searchTerm = e.target.value.trim().toLowerCase();
    render();
  });

  // Friendly warning if the WhatsApp number hasn't been set yet.
  if (WHATSAPP_NUMBER.indexOf("<") !== -1) {
    console.warn(
      "Kuubera Store: WhatsApp number not set yet. " +
      "Open js/products.js and set your number."
    );
  }

  loadProducts();

})();
