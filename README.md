# Product Carousel Case

This project implements a **product carousel component** for the **ebebek homepage**, mimicking the one currently displayed on the website. The carousel is dynamic, interactive, and responsive across devices.

## 🧩 User Story & Features

- ✅ **Homepage Restriction**:  
  The script runs **only** on the homepage (`/`). If the user is on a different page, it logs:  
  `console.log("wrong page");`

- ✅ **Product Fetching & Caching**:  
  - Product list is fetched via a `GET` request from:  
    [`products.json`](https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json)
  - The result is cached in `localStorage` to avoid redundant requests.

- ✅ **Carousel Title**:  
  Displayed at the top:  
  `"Beğenebileceğinizi Düşündüklerimiz"`

- ✅ **Clickable Products**:  
  Clicking a product opens its detailed page in a **new browser tab**.

- ✅ **Price Display & Discounts**:  
  If `price !== original_price`:
  - Shows both prices
  - Calculates and displays the **discount percentage**

- ✅ **Favorites Feature**:  
  - Users can click a **heart icon** to mark favorites.
  - Marked items turn **orange** and are stored in `localStorage` under `"favorite-products"`.
  - Favorite states persist on reload.



## 📌 How It Works

- On load, it:
  1. Checks if on the homepage.
  2. Loads product list from `localStorage` (or fetches if not cached).
  3. Builds the carousel dynamically using DOM manipulation.
  4. Binds interaction events (hearts, scroll buttons, resize, etc).
