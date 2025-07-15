(function () {
    if (window.location.pathname !== "/") {
      console.log("wrong page");
      return;
    }
  
    const PRODUCT_API =
      "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";
    const STORAGE_KEY = "carousel-products";
    const FAVORITES_KEY = "favorite-products";
  

    //retrieve products from the url
    async function getProducts() {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) return JSON.parse(cached);
      const res = await fetch(PRODUCT_API);
      const data = await res.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  
    //check and update favorite products
    function getFavorites() {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    }
  
    function saveFavorite(id) {
      const favs = getFavorites();
      if (!favs.includes(id)) {
        favs.push(id);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
      }
    }
  
    function removeFavorite(id) {
      const favs = getFavorites().filter((fid) => fid !== id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    }
  
    //calculate the discount
    function getPriceHtml(p) {
      if (p.price === p.original_price) {
        return `<strong style="color: #7d7d7d; font-size: 2.2rem;">${p.price.toFixed(2)} TL</strong>`;
      }
      const discount = Math.round(((p.original_price - p.price) / p.original_price) * 100);
      return `
        <span style="text-decoration: line-through; color: #7d7d7d; font-size: 1.4rem;">${p.original_price.toFixed(2)} TL</span><br>
        <strong style="color: #00a365; font-size: 2.2rem;">${p.price.toFixed(2)} TL (-${discount}%)</strong>
      `;
    }
  
    //create the carousel
    function createCarousel(products) {
      const favorites = getFavorites();
  
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.margin = "20px auto";
      wrapper.style.maxWidth = "100%";
      wrapper.style.overflow = "visible";
      wrapper.style.borderRadius = "16px";
      wrapper.style.padding = "16px";
      wrapper.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
  
      //create title container for design
      const titleContainer = document.createElement("div");
      titleContainer.style.background = "#fef6eb";
      titleContainer.style.padding = "25px 40px";
      titleContainer.style.borderTopLeftRadius = "35px";
      titleContainer.style.borderTopRightRadius = "35px";
      titleContainer.style.display = "flex";
      titleContainer.style.width = "100%";
      titleContainer.style.justifyContent = "space-between";
      titleContainer.style.marginBottom = "20px";
  
      
      const title = document.createElement("h2");
      title.textContent = "Beğenebileceğinizi Düşündüklerimiz";
      title.style.fontSize = "2.5rem";
      title.style.fontWeight = "700";
      title.style.color = "#f28e00";
      title.style.margin = 0;
  
      //add title
      titleContainer.appendChild(title);
      wrapper.appendChild(titleContainer);
  
      const viewport = document.createElement("div");
      viewport.style.overflow = "hidden";
      viewport.style.position = "relative";
      viewport.style.width = "100%";
  
      const carousel = document.createElement("div");
      carousel.style.display = "flex";
      carousel.style.transition = "transform 0.4s ease";
      carousel.style.gap = "16px";
  
      let itemsPerView = getItemsPerView();
      let currentIndex = 0;
      let cardWidth = getCardWidth(); 
      const gap = 16;
  
      function getItemsPerView() {
        const w = window.innerWidth;
        if (w < 600) return 1;
        if (w < 900) return 2;
        if (w < 1200) return 3;
        return 4;
      }
  
      //for responsivity
      function getCardWidth() {
        const w = window.innerWidth;
        if (w < 600) return window.innerWidth - 40;
        if (w < 900) return (window.innerWidth - 64) / 2;
        if (w < 1200) return (window.innerWidth - 96) / 3;
        return 220;
      }
  
      function updateDimensions() {
        itemsPerView = getItemsPerView();
        cardWidth = getCardWidth();
        carousel.childNodes.forEach((item) => {
          item.style.width = `${cardWidth}px`;
        });
        updateScroll();
      }
  
      products.forEach((product) => {
        const item = document.createElement("div");
        item.style.width = `${cardWidth}px`;
        item.style.flex = "0 0 auto";
        item.style.border = "1px solid #eee";
        item.style.borderRadius = "12px";
        item.style.padding = "12px";
        item.style.backgroundColor = "#fff";
        item.style.position = "relative";
        item.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
        item.style.display = "flex";
        item.style.flexDirection = "column";
        item.style.justifyContent = "space-between";
  
        //fav icon
        const heart = document.createElement("span");
        heart.innerHTML = "❤";
        heart.style.position = "absolute";
        heart.style.top = "10px";
        heart.style.right = "10px";
        heart.style.fontSize = "2.2rem";
        heart.style.cursor = "pointer";
        heart.style.color = favorites.includes(product.id) ? "orange" : "#ccc";
        heart.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (favorites.includes(product.id)) {
            removeFavorite(product.id);
            heart.style.color = "#ccc";
          } else {
            saveFavorite(product.id);
            heart.style.color = "orange";
          }
        });
  
        //stars
        const stars = document.createElement("div");
        stars.innerHTML = "★ ★ ★ ★ ★";
        stars.style.color = "#e9e9e9";
        stars.style.fontSize = "1.6rem";
        stars.style.marginBottom = "4px";
        stars.style.fontWeight = "900";
  
        const link = document.createElement("a");
        link.href = product.url;
        link.target = "_blank";
  
        const img = document.createElement("img");
        img.src = product.img;
        img.alt = product.name;
        img.style.width = "100%";
        img.style.borderRadius = "10px";
        img.style.marginBottom = "12px";
        link.appendChild(img);
  
        const name = document.createElement("p");
        name.innerHTML = `<strong>${product.brand}</strong> - ${product.name}`;
        name.style.fontSize = "1.2rem";
        name.style.marginBottom = "8px";
        name.style.minHeight = "40px";
        name.style.color = "#7d7d7d";
  
        const price = document.createElement("div");
        price.innerHTML = getPriceHtml(product);
        price.style.marginBottom = "12px";
  
        const button = document.createElement("button");
        button.textContent = "Sepete Ekle";
        button.style.padding = "8px 12px";
        button.style.border = "none";
        button.style.borderRadius = "20px";
        button.style.backgroundColor = "#fff7ec";
        button.style.color = "#f28e00";
        button.style.cursor = "pointer";
        button.style.fontWeight = "700";
        button.style.fontSize = "1.4rem";
  
        item.appendChild(heart);
        item.appendChild(link);
        item.appendChild(name);
        item.appendChild(stars);
        item.appendChild(price);
        item.appendChild(button);
        carousel.appendChild(item);
      });
  
      //navigation
      const prevBtn = document.createElement("button");
      const nextBtn = document.createElement("button");
  
      [prevBtn, nextBtn].forEach((btn) => {
        btn.style.position = "absolute";
        btn.style.top = "50%";
        btn.style.transform = "translateY(-50%)";
        btn.style.zIndex = "10";
        btn.style.background = "#fef6eb";
        btn.style.border = "none";
        btn.style.borderRadius = "50%";
        btn.style.width = "40px";
        btn.style.height = "40px";
        btn.style.fontSize = "2rem";
        btn.style.fontWeight = "700";
        btn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        btn.style.cursor = "pointer";
        btn.style.color = "#f28e00";
      });
  
      prevBtn.textContent = "‹";
      nextBtn.textContent = "›";
      prevBtn.style.left = "0";
      nextBtn.style.right = "0";
  
      prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateScroll();
        }
      });
  
      nextBtn.addEventListener("click", () => {
        if (currentIndex < products.length - itemsPerView) {
          currentIndex++;
          updateScroll();
        }
      });
  
      function updateScroll() {
        const offset = (cardWidth + gap) * currentIndex;
        carousel.style.transform = `translateX(-${offset}px)`;
      }
  
      viewport.appendChild(carousel);
      wrapper.appendChild(prevBtn);
      wrapper.appendChild(viewport);
      wrapper.appendChild(nextBtn);
  

      //locate card after the story
      const section1 = document.querySelector(".Section1.has-components");
      if (section1 && section1.parentNode) {
        section1.parentNode.insertBefore(wrapper, section1.nextSibling);
      } else {
        document.body.appendChild(wrapper);
      }
  
      window.addEventListener("resize", () => {
        updateDimensions();
      });
    }
  
    (async function init() {
      try {
        const products = await getProducts();
        createCarousel(products);
      } catch (error) {
        console.error("Error loading carousel:", error);
      }
    })();
  })();
  
