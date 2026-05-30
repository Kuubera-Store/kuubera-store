/* =====================================================================
   KUUBERA STORE — PRODUCT DATA FILE
   ---------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO MANAGE YOUR SHOP.
   You can edit it directly on GitHub.com (pencil icon) while logged in.
   No coding knowledge required — just follow the comments below.

   There are TWO sections:
     1) SETTINGS  -> your WhatsApp number + Instagram link  (edit once)
     2) PRODUCTS  -> the list of items in your shop          (edit often)
   ===================================================================== */


/* ---------------------------------------------------------------------
   1) SETTINGS  —  EDIT THESE ONCE
   --------------------------------------------------------------------- */

/* 👉 YOUR WHATSAPP NUMBER 👈
   Replace <your number> below with your real number in COUNTRY-CODE
   format, with NO spaces, NO "+", NO dashes.
   For India the country code is 91, so your number becomes:  918887805697
   Example (after editing):   const WHATSAPP_NUMBER = "918887805697";          */
const WHATSAPP_NUMBER = "918887805697";

/* 👉 YOUR INSTAGRAM 👈  (used in the footer link). Put your full URL here. */
const INSTAGRAM_URL = "https://instagram.com/kuubera_store";

/* Currency symbol shown before every price (₹ for Indian Rupees). */
const CURRENCY = "₹";


/* ---------------------------------------------------------------------
   2) PRODUCTS  —  ADD / EDIT / DELETE YOUR ITEMS HERE
   ---------------------------------------------------------------------
   HOW TO USE:
     • To ADD a product  : copy one whole block { ... }, paste it, edit it.
     • To DELETE a product: remove its whole block { ... }, including the
                            comma at the end.
     • To EDIT a product  : just change the text between the quotes.

   ⚠️  RULES (very important, the site breaks if these are wrong):
     • Keep the quotes "  " around every piece of text.
     • Keep the comma , after every line and after every closing }
       (except you may leave off the very last comma — but keeping it is OK).
     • Image filenames must EXACTLY match a file inside the /images folder
       (capital letters matter!). Upload your photos there first.

   THE FIELDS (every product has these):
     name        -> Product name shown on the card and in the popup.
     price       -> A number only (no symbol, no commas). e.g. 4999
     category    -> Used by the filter buttons. Use "Sarees" or "Kurtis".
                    (If you add a NEW category here, a filter button for it
                     appears automatically.)
     sizes       -> A list of sizes. Use ["Free Size"] for sarees, or
                    ["S", "M", "L", "XL"] for kurtis. Use [] for none.
     description -> Full description shown in the popup.
     images      -> A list of one or more image filenames from /images.
                    The first one is shown on the card.
     inStock     -> true if available, false if sold out.
   --------------------------------------------------------------------- */

const PRODUCTS = [

  // ===== EXAMPLE / TEMPLATE PRODUCT =================================
  // Copy this whole block to create a new product, then edit the values.
  {
    name: "Royal Kanjivaram Silk Saree",
    price: 4999,
    category: "Sarees",
    sizes: ["Free Size"],
    description:
      "A timeless Kanjivaram silk saree in deep maroon with a contrast " +
      "gold zari border and a richly woven pallu. Comes with an unstitched " +
      "blouse piece. Perfect for weddings and festive occasions.",
    images: ["saree-kanjivaram-1.svg", "saree-kanjivaram-2.svg"],
    inStock: true,
  },
  // ===== END EXAMPLE — real products follow ========================

  {
    name: "Banarasi Silk Saree",
    price: 6499,
    category: "Sarees",
    sizes: ["Free Size"],
    description:
      "Handwoven Banarasi silk in regal indigo with intricate gold brocade " +
      "motifs across the body and an opulent pallu. A heirloom-worthy drape " +
      "with an unstitched blouse piece included.",
    images: ["saree-banarasi-1.svg", "saree-banarasi-2.svg"],
    inStock: true,
  },

  {
    name: "Chanderi Cotton Saree",
    price: 2799,
    category: "Sarees",
    sizes: ["Free Size"],
    description:
      "Lightweight Chanderi cotton-silk saree in emerald green with a subtle " +
      "shimmer and delicate gold border. Breathable and elegant — ideal for " +
      "daytime functions and office festivities.",
    images: ["saree-chanderi-1.svg"],
    inStock: true,
  },

  {
    name: "Embroidered Anarkali Kurti",
    price: 1499,
    category: "Kurtis",
    sizes: ["S", "M", "L", "XL"],
    description:
      "Flowing mustard Anarkali kurti with fine thread embroidery on the " +
      "yoke and a flared silhouette that flatters every figure. Pairs " +
      "beautifully with leggings or palazzos.",
    images: ["kurti-anarkali-1.svg"],
    inStock: true,
  },

  {
    name: "Straight Cotton Kurti",
    price: 999,
    category: "Kurtis",
    sizes: ["S", "M", "L", "XL"],
    description:
      "Easy everyday straight-cut kurti in soft teal cotton with a clean " +
      "neckline and side slits. A versatile wardrobe staple for work and home.",
    images: ["kurti-straight-1.svg"],
    inStock: false, // sold out — shows a 'Sold Out' badge automatically
  },

  {
    name: "A-Line Embroidered Kurti",
    price: 1799,
    category: "Kurtis",
    sizes: ["S", "M", "L", "XL"],
    description:
      "Wine-toned A-line kurti with gold mirror-work detailing along the " +
      "neckline and hem. A festive-ready piece that transitions effortlessly " +
      "from celebrations to evenings out.",
    images: ["kurti-aline-1.svg"],
    inStock: true,
  },

]; // <-- do not remove this closing bracket
