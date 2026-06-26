# 🛍️ Kuubera Store — Catalog Website

A fast, elegant, **static** catalog website for a women's Indian ethnic-wear
boutique. Customers browse sarees, kurtis and more, then **order on WhatsApp**
(or buy on **Amazon** if you add a link). There is **no checkout, no database,
and no admin panel** — you manage everything by editing **one spreadsheet file**.

Built with plain **HTML + CSS + JavaScript**. It runs for **free on GitHub Pages**
with no build step.

---

## 📑 Table of contents

1. [What's in this folder](#1-whats-in-this-folder)
2. [⭐ Your WhatsApp number & Instagram (set once)](#2--your-whatsapp-number--instagram-set-once)
3. [Preview the site on your computer](#3-preview-the-site-on-your-computer)
4. [Put it on GitHub & turn on GitHub Pages](#4-put-it-on-github--turn-on-github-pages)
5. [Connect your custom domain](#5-connect-your-custom-domain)
6. [🗂️ How to manage your products (the CSV)](#6-️-how-to-manage-your-products-the-csv)
7. [🛒 Adding an Amazon "Buy" link](#7--adding-an-amazon-buy-link)
8. [🖼️ How to upload your real photos](#8-️-how-to-upload-your-real-photos)
9. [Tips & troubleshooting](#9-tips--troubleshooting)

---

## 1. What's in this folder

```
Kuubera Store Website/
├── index.html          ← the home page (you rarely touch this)
├── products.csv        ← ⭐ YOUR SHOP — open in Excel/Sheets to manage products
├── 404.html            ← friendly "page not found" page
├── .nojekyll           ← tells GitHub Pages to serve files as-is (leave it)
├── css/
│   └── styles.css      ← all the styling / colours
├── js/
│   ├── products.js     ← your SETTINGS (WhatsApp number + Instagram) — set once
│   └── app.js          ← the engine that draws the site (don't touch)
├── images/             ← all product photos + logo live here
│   ├── logo.png        ← full logo (transparent background)
│   ├── logo-mark.png   ← the round horse emblem (used in the header)
│   └── ... your product photos ...
└── README.md           ← this guide
```

👉 **You will spend 99% of your time in just two places:**
the file **`products.csv`** and the **`images/`** folder.

---

## 2. ⭐ Your WhatsApp number & Instagram (set once)

Open **`js/products.js`**. Near the top you'll see your settings — already filled in:

```js
const WHATSAPP_NUMBER = "919082573485";              // 91 = India, then the 10-digit number
const INSTAGRAM_URL   = "https://instagram.com/kuubera_store";
```

- **WhatsApp number** must be in country-code format with **no `+`, spaces or dashes**.
  `+91 90825 73485` becomes `919082573485`.
- Set your real **Instagram** URL too.

Every product's **"Order on WhatsApp"** button opens a chat to you with the product
name (and size) already typed in, e.g.:

> *Hi Kuubera Store, I'd like to order: Banarasi Silk Saree (Size: Free Size)*

---

## 3. Preview the site on your computer

You already have **Python** installed, so this is easy.

1. Open a terminal **in this folder**.
2. Run:
   ```powershell
   python -m http.server 8000
   ```
3. Open your browser to **http://localhost:8000**
4. Press **Ctrl + C** in the terminal to stop the preview when done.

> ⚠️ Don't just double-click `index.html`. The product list is loaded from
> `products.csv`, and browsers block that for double-clicked files. Always open it
> through **http://localhost:8000** (locally) — on your live GitHub Pages site it
> just works.

---

## 4. Put it on GitHub & turn on GitHub Pages

> **Note:** Git is installed and this project is **already a git repository**. You
> just need to create the GitHub repo and push (Step 4A). Prefer no command line?
> Upload the files through GitHub's website instead (Step 4B).

### Step 4A — Using git (recommended)

1. Go to <https://github.com/new>, create an **empty** repo named **`kuubera-store`**
   (Public, **don't** add a README/licence), and copy its URL.
2. Open a terminal **in this folder** and run — replacing `YOUR-USERNAME`:

   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/kuubera-store.git
   git push -u origin main
   ```

> Already pushed once? For future changes just run:
> `git add . && git commit -m "Update products" && git push`

### Step 4B — Without git (upload through the website)

1. Go to <https://github.com/new> and create a repository named **`kuubera-store`**
   (Public). Don't add a README.
2. On the new repo page, click **"uploading an existing file"**.
3. Drag **all the files and folders** from this folder into the browser and click
   **Commit changes**.

### Turn on GitHub Pages (both options)

1. In your repo, go to **Settings → Pages** (left sidebar).
2. Under **Source**, choose **Deploy from a branch**.
3. Set **Branch** to **`main`** and folder to **`/ (root)`**, then **Save**.
4. Wait ~1 minute, refresh, and GitHub shows your live link:
   **`https://YOUR-USERNAME.github.io/kuubera-store/`** 🎉

---

## 5. Connect your custom domain

You can point your own domain (e.g. `kuuberastore.com`) at the site for free.

### A) Tell GitHub your domain
1. In your repo: **Settings → Pages → Custom domain**.
2. Type your domain (e.g. `www.kuuberastore.com`) and click **Save**.
   GitHub automatically creates a file called **`CNAME`** in your repo — leave it.

### B) Add DNS records at your domain provider
Log in to wherever you bought the domain (GoDaddy, Namecheap, etc.) and add:

**If using a `www` subdomain (recommended):**
| Type  | Name / Host | Value                        |
|-------|-------------|------------------------------|
| CNAME | `www`       | `YOUR-USERNAME.github.io`    |

**If using the root/apex domain (`kuuberastore.com` with no www)** add four A records:
| Type | Name / Host | Value             |
|------|-------------|-------------------|
| A    | `@`         | `185.199.108.153` |
| A    | `@`         | `185.199.109.153` |
| A    | `@`         | `185.199.110.153` |
| A    | `@`         | `185.199.111.153` |

3. DNS changes can take from a few minutes to a few hours.
4. Back in **Settings → Pages**, tick **"Enforce HTTPS"** once it becomes available.

---

## 6. 🗂️ How to manage your products (the CSV)

All your products live in **`products.csv`**. A CSV is just a simple spreadsheet —
open it in **Microsoft Excel** or **Google Sheets** (or even Notepad). **Each row is
one product.** The first row is the column headings — don't rename or reorder them.

### The columns

| Column        | What to put                                                                 | Example |
|---------------|------------------------------------------------------------------------------|---------|
| `name`        | Product name shown on the card & popup                                       | `Banarasi Silk Saree` |
| `category`    | Used for the filter buttons. A new value makes a new filter button appear.   | `Sarees` |
| `price`       | Numbers only — no symbol, no commas                                          | `6499` |
| `sizes`       | Sizes separated by a **`|`** (pipe). See **size availability** below.        | `S\|M\|L\|XL` |
| `description` | The full description shown in the popup                                      | `Handwoven Banarasi silk…` |
| `images`      | Photo filename(s) from the `images/` folder, separated by **`|`**            | `saree-1.jpg\|saree-2.jpg` |
| `amazon_url`  | (Optional) a link to buy on Amazon. Leave blank if you don't have one.       | `https://amzn.to/abc123` |

### ⭐ Size availability (which sizes are in stock)

Each size can be **in stock or sold out individually** — e.g. `S` and `L` available
but `M` sold out. You control this right inside the `sizes` column:

- **Just list a size** → it's **available**: `S|M|L|XL`
- **Add `:no` after a size** → that size is **sold out** (shown crossed-out, can't be ordered):
  `S|M:no|L|XL`  ← here only **M** is sold out.
- For sarees, use `Free Size` (or `Free Size:no` if that item is sold out).

The card shows a **"Sold Out"** badge automatically only when **every** size is sold out.
If at least one size is available, the product stays orderable (for the in-stock sizes).

### To ADD a product
Add a **new row** at the bottom and fill in the columns. Save the file.

### To EDIT a product
Change the cells in that product's row (e.g. update `price`, or mark a size sold out by
adding `:no` to it in the `sizes` column). Save.

### To DELETE a product
Delete that whole **row**. Save.

> **Editing on GitHub.com (no software):** open `products.csv` in your repo, click the
> pencil ✏️ icon, edit the text, and **Commit changes**. Your site updates in ~1 minute.

> 💡 **Important CSV rules**
> - If your **description contains a comma**, wrap the whole description in
>   **double quotes**: `"A breezy saree, perfect for summer."` (Excel/Sheets do this
>   for you automatically when you save as CSV.)
> - For **multiple sizes or multiple images**, separate them with a `|` (pipe),
>   **not** a comma.
> - Keep the header row exactly as it is.

---

## 7. 🛒 Adding an Amazon "Buy" link

If you also sell a product on Amazon, paste the Amazon product link into the
**`amazon_url`** column for that row. A **"Buy on Amazon"** button then appears in the
product popup, next to the WhatsApp button.

Leave the cell **blank** for products that aren't on Amazon — no button shows. You can
fill these in any time later.

---

## 8. 🖼️ How to upload your real photos

1. In your repo, click the **`images`** folder.
2. Click **Add file → Upload files**, drag your photos in, then **Commit changes**.
3. In **`products.csv`**, put the filename(s) in that product's **`images`** column:
   ```
   my-red-saree.jpg|my-red-saree-back.jpg
   ```
   The **first** image shows on the card; extra ones appear as thumbnails in the popup.

**Photo tips for fast loading & a premium look:**
- Use **portrait** photos (taller than wide) — ideally around **800 × 1066 px**.
- Save as **`.jpg`** for photos (or **`.webp`** for smaller files). Keep each under ~300 KB.
- Use **simple lowercase filenames with no spaces**: `kanjivaram-red.jpg` ✅, not `IMG 001.JPG` ❌.
- The site already lazy-loads images, so adding many products stays fast.

---

## 9. Tips & troubleshooting

- **The page says "Couldn't load the product list."** You probably double-clicked
  `index.html`. Use the local server instead (see [Section 3](#3-preview-the-site-on-your-computer)).
  On the live GitHub Pages site this never happens.

- **A product looks broken or a column shifted.** A description with a comma wasn't
  quoted. Open `products.csv`, wrap that description in `"double quotes"`, and save.
  GitHub keeps a history (Commits tab) so you can undo any change.

- **An image shows blank.** The filename in `products.csv` must match the file in
  `/images` **exactly**, including capital letters: `Saree.JPG` ≠ `saree.jpg`.

- **WhatsApp button opens an empty/invalid chat.** Check `WHATSAPP_NUMBER` in
  `js/products.js` — it must look like `919082573485` (no `+`, spaces or dashes).

- **Changes aren't showing on the live site.** Wait a minute, then do a hard refresh
  (**Ctrl + F5**). GitHub Pages can take ~1 minute to rebuild.

- **I want to change colours or fonts.** They're all at the top of `css/styles.css`
  under `:root` — change a value there and it updates everywhere.

---

Made with care for **Kuubera Store** — *where tradition meets timeless grace.* ✦
