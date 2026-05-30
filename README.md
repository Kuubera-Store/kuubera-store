# 🛍️ Kuubera Store — Catalog Website

A fast, elegant, **static** catalog website for a women's Indian ethnic-wear
boutique. Customers browse sarees, kurtis and more, then **order on WhatsApp**.
There is **no checkout, no database, and no admin panel** — you manage everything
by editing one simple file on GitHub.com.

Built with plain **HTML + CSS + JavaScript**. It runs for **free on GitHub Pages**
with no build step.

---

## 📑 Table of contents

1. [What's in this folder](#1-whats-in-this-folder)
2. [⭐ Where to paste your WhatsApp number (do this first)](#2--where-to-paste-your-whatsapp-number-do-this-first)
3. [Preview the site on your computer](#3-preview-the-site-on-your-computer)
4. [Put it on GitHub & turn on GitHub Pages](#4-put-it-on-github--turn-on-github-pages)
5. [Connect your custom domain](#5-connect-your-custom-domain)
6. [➕ How to ADD a product](#6--how-to-add-a-product)
7. [✏️ How to EDIT a product](#7-️-how-to-edit-a-product)
8. [🗑️ How to DELETE a product](#8-️-how-to-delete-a-product)
9. [🖼️ How to upload your real photos](#9-️-how-to-upload-your-real-photos)
10. [Tips & troubleshooting](#10-tips--troubleshooting)

---

## 1. What's in this folder

```
Kuubera Store Website/
├── index.html          ← the home page (you rarely touch this)
├── 404.html            ← friendly "page not found" page
├── .nojekyll           ← tells GitHub Pages to serve files as-is (leave it)
├── css/
│   └── styles.css      ← all the styling / colours
├── js/
│   ├── products.js     ← ⭐ YOUR SHOP — edit THIS to manage products
│   └── app.js          ← the engine that draws the site (don't touch)
├── images/             ← all product photos + logo live here
│   ├── logo.svg
│   ├── saree-kanjivaram-1.svg   (placeholder — replace with real photos)
│   └── ... more placeholders ...
└── README.md           ← this guide
```

👉 **You will spend 99% of your time in just two places:**
the file **`js/products.js`** and the **`images/`** folder.

---

## 2. ⭐ Where to paste your WhatsApp number (do this first)

Open **`js/products.js`**. Near the top you'll see:

```js
const WHATSAPP_NUMBER = "<your number>";
```

Replace `<your number>` with your real number in **country-code format**
(no `+`, no spaces, no dashes). For your India number this is:

```js
const WHATSAPP_NUMBER = "918887805697";
```

> `91` is India's country code, followed by your 10-digit number `8887805697`.

While you're there, also set your Instagram link in the same file:

```js
const INSTAGRAM_URL = "https://instagram.com/your_handle";
```

That's the only setup needed. Every product's **"Order on WhatsApp"** button will
now open a chat to you with the product name (and size) already typed in, e.g.:

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

> ⚠️ Don't just double-click `index.html`. Open it through the address above so the
> images and scripts load correctly.

---

## 4. Put it on GitHub & turn on GitHub Pages

> **Note:** Git is installed and this project is **already a git repository** with an
> initial commit made for you. You just need to create the GitHub repo and push (Step 4A).
> Prefer no command line at all? You can also upload the files through GitHub's website
> (Step 4B).

### Step 4A — Using git (recommended)

The repo is already initialised and committed locally. To publish it:

1. Go to <https://github.com/new>, create an **empty** repo named **`kuubera-store`**
   (Public, **don't** add a README/licence), and copy its URL.
2. Open a terminal **in this folder** (Git Bash, or a *new* PowerShell window so git is
   on the PATH) and run — replacing `YOUR-USERNAME`:

   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/kuubera-store.git
   git push -u origin main
   ```

> Already pushed once? For future changes just run:
> `git add . && git commit -m "Update products" && git push`

> Have the GitHub CLI? You can replace the last three lines with:
> `gh repo create kuubera-store --public --source=. --push`

### Step 4B — Without git (upload through the website)

1. Go to <https://github.com/new> and create a repository named **`kuubera-store`**
   (Public). Don't add a README.
2. On the new repo page, click **“uploading an existing file”**.
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
4. Back in **Settings → Pages**, tick **“Enforce HTTPS”** once it becomes available.

---

## 6. ➕ How to ADD a product

You can do this entirely on **GitHub.com** (no software needed):

1. **Upload the photo first** — see [Section 9](#9-️-how-to-upload-your-real-photos).
2. In your repo open **`js/products.js`** and click the **pencil ✏️ (Edit)** icon.
3. Find the product list. **Copy one whole block** — everything from `{` to `},` —
   and paste it just below an existing one. Then change the values:

   ```js
   {
     name: "Floral Georgette Saree",      // shown on card + popup
     price: 3299,                          // numbers only, no symbol/commas
     category: "Sarees",                   // "Sarees" or "Kurtis" (or a new one!)
     sizes: ["Free Size"],                 // sarees: ["Free Size"]
                                           // kurtis: ["S", "M", "L", "XL"]
     description: "A breezy georgette saree with delicate floral prints.",
     images: ["saree-floral-1.jpg"],       // filename(s) from the /images folder
     inStock: true,                        // true = available, false = sold out
   },
   ```

4. Scroll down and click **Commit changes**. Your site updates in about a minute.

> 💡 Adding a brand-new `category` (e.g. `"Lehengas"`) automatically creates a new
> filter button — no other change needed.

---

## 7. ✏️ How to EDIT a product

1. Open **`js/products.js`** on GitHub and click the **pencil ✏️** icon.
2. Change the text between the quotes (e.g. update `price` or `description`).
   To mark something sold out, set `inStock: false`.
3. Click **Commit changes**.

---

## 8. 🗑️ How to DELETE a product

1. Open **`js/products.js`** and click the **pencil ✏️** icon.
2. Delete the product's **entire block**, from its opening `{` down to its
   closing `},` (including that comma).
3. Click **Commit changes**.

---

## 9. 🖼️ How to upload your real photos

The placeholder pictures (the maroon/indigo SVG cards) are there so the site looks
complete offline. Replace them with your own photos:

1. In your repo, click the **`images`** folder.
2. Click **Add file → Upload files**, drag your photos in, then **Commit changes**.
3. In **`js/products.js`**, set the product's `images` to your filename(s):
   ```js
   images: ["my-red-saree.jpg", "my-red-saree-back.jpg"],
   ```
   The **first** image shows on the card; extra ones appear as thumbnails in the popup.

**Photo tips for fast loading & a premium look:**
- Use **portrait** photos (taller than wide) — ideally around **800 × 1066 px**.
- Save as **`.jpg`** for photos (or **`.webp`** for smaller files). Keep each under ~300 KB.
- Use **simple lowercase filenames with no spaces**: `kanjivaram-red.jpg` ✅, not `IMG 001.JPG` ❌.
- The site already lazy-loads images, so adding many products stays fast.

---

## 10. Tips & troubleshooting

- **A product disappeared / the page looks broken after editing.**
  You probably removed a quote `"`, a comma `,`, or a bracket `}`. Open
  `js/products.js`, check the block you last edited, and make sure it matches the
  example exactly. GitHub keeps a history (Commits tab) so you can undo any change.

- **An image shows blank.** The filename in `products.js` must match the file in
  `/images` **exactly**, including capital letters: `Saree.JPG` ≠ `saree.jpg`.

- **WhatsApp button opens an empty/invalid chat.** You haven't replaced
  `<your number>` in `js/products.js` (see [Section 2](#2--where-to-paste-your-whatsapp-number-do-this-first)),
  or you added a `+`/spaces. It must look like `918887805697`.

- **Changes aren't showing on the live site.** Wait a minute, then do a hard refresh
  (**Ctrl + F5**). GitHub Pages can take ~1 minute to rebuild.

- **I want to change colours or fonts.** They're all at the top of `css/styles.css`
  under `:root` — change a value there and it updates everywhere.

---

Made with care for **Kuubera Store** — *where tradition meets timeless grace.* ✦
