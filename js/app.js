/* =====================================================================
   KUUBERA STORE — APP LOGIC
   ---------------------------------------------------------------------
   You normally DON'T need to touch this file. It reads the data from
   products.js and draws the catalog, filtering, search and the popup.
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

  /* ---- Build the category filter buttons from the products ---- */
  function buildFilters() {
    // Collect unique categories in the order they first appear.
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

    var firstImage = (product.images && product.images[0]) || "logo.svg";

    card.innerHTML =
      '<div class="card__media">' +
        '<img src="images/' + firstImage + '" alt="' + escapeHtml(product.name) + '"' +
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

    // Open the popup when the card is clicked or activated by keyboard.
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
      // We pass the ORIGINAL index so the modal always shows the right item.
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

    var images = product.images && product.images.length ? product.images : ["logo.svg"];

    // Thumbnail strip (only if more than one image)
    var thumbs = "";
    if (images.length > 1) {
      thumbs = '<div class="gallery__thumbs">' +
        images.map(function (img, i) {
          return '<button type="button" class="thumb' + (i === 0 ? ' is-active' : '') +
                 '" data-img="images/' + img + '">' +
                 '<img src="images/' + img + '" alt="View ' + (i + 1) +
                 '" loading="lazy" width="80" height="107"></button>';
        }).join("") +
      '</div>';
    }

    // Size selector (only if sizes exist)
    var sizeBlock = "";
    if (product.sizes && product.sizes.length) {
      sizeBlock =
        '<div class="size-block">' +
          '<p class="field-label">Size</p>' +
          '<div class="size-options" role="group" aria-label="Choose a size">' +
            product.sizes.map(function (s, i) {
              return '<button type="button" class="size-pill' + (i === 0 ? ' is-active' : '') +
                     '" data-size="' + escapeHtml(s) + '">' + escapeHtml(s) + '</button>';
            }).join("") +
          '</div>' +
        '</div>';
    }

    var stockTag = product.inStock
      ? '<span class="badge badge--stock">Available</span>'
      : '<span class="badge badge--soldout">Sold Out</span>';

    modalContent.innerHTML =
      '<button type="button" class="modal__close" id="modal-close" aria-label="Close">&times;</button>' +
      '<div class="modal__grid">' +
        '<div class="gallery">' +
          '<div class="gallery__main">' +
            '<img id="gallery-main-img" src="images/' + images[0] + '" alt="' +
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
          '<a id="order-btn" class="btn-whatsapp" href="' +
              whatsAppLink(product, product.sizes && product.sizes[0]) +
              '" target="_blank" rel="noopener">' +
            whatsAppIcon() + 'Order on WhatsApp' +
          '</a>' +
          '<p class="modal__note">You\'ll be taken to WhatsApp with your order pre-filled.</p>' +
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
    var orderBtn = document.getElementById("order-btn");
    modalContent.querySelectorAll(".size-pill").forEach(function (pill) {
      pill.addEventListener("click", function () {
        modalContent.querySelectorAll(".size-pill").forEach(function (x) { x.classList.remove("is-active"); });
        pill.classList.add("is-active");
        orderBtn.href = whatsAppLink(product, pill.getAttribute("data-size"));
      });
    });

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

  /* Escape user-entered text so it can't break the HTML. */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
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
      "Open js/products.js and replace <your number> with 918887805697."
    );
  }

  buildFilters();
  render();

  // Reveal-on-scroll fade-in for cards (gentle micro-interaction).
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    // Observe cards as they are added.
    var mo = new MutationObserver(function () {
      grid.querySelectorAll(".card:not(.is-visible)").forEach(function (c) { io.observe(c); });
    });
    mo.observe(grid, { childList: true });
    grid.querySelectorAll(".card").forEach(function (c) { io.observe(c); });
  }

})();
