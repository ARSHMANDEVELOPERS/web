
const products = [
  {
    id: 1, name: "Noir Intense", category: "Men",
    notes: "Oud · Amber · Woods", price: 89,
    tag: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2, name: "Rose Élégance", category: "Women",
    notes: "Rose · Vanilla · Musk", price: 95,
    tag: "SIGNATURE",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3, name: "Oud Royale", category: "Unisex",
    notes: "Oud · Saffron · Amber", price: 120,
    tag: "EXCLUSIVE",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4, name: "Golden Aura", category: "Women",
    notes: "Jasmine · Citrus · Musk", price: 79,
    tag: "",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5, name: "Midnight Oud", category: "Men",
    notes: "Leather · Oud · Spice", price: 105,
    tag: "POPULAR",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6, name: "Velvet Bloom", category: "Women",
    notes: "Peony · Rose · Vanilla", price: 85,
    tag: "",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7, name: "Amber Soul", category: "Unisex",
    notes: "Amber · Sandalwood · Musk", price: 99,
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8, name: "Royal Essence", category: "Men",
    notes: "Bergamot · Cedar · Amber", price: 115,
    tag: "PREMIUM",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=80"
  }
];

const $ = (selector) => document.querySelector(selector);

let activeFilter = "All";
let searchTerm = "";
let cart = [];
let wishlist = new Set();

const money = (amount) => "$" + amount.toFixed(2);

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

// Product rendering and search
function renderProducts() {
  const grid = $("#productGrid");

  const filtered = products.filter((product) => {
    const matchesCategory =
      activeFilter === "All" || product.category === activeFilter;

    const text = `${product.name} ${product.category} ${product.notes}`
      .toLowerCase();

    return matchesCategory && text.includes(searchTerm.toLowerCase());
  });

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state">
        No fragrances found. Try another search.
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((product, index) => `
    <article class="product-card" style="animation-delay:${index * 50}ms">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}"
             loading="lazy">
        ${product.tag
          ? `<span class="product-tag">${product.tag}</span>`
          : ""}
        <button class="wish-btn ${wishlist.has(product.id) ? "active" : ""}"
          data-wish="${product.id}"
          aria-label="Toggle ${product.name} wishlist"
          aria-pressed="${wishlist.has(product.id)}">
          ${wishlist.has(product.id) ? "♥" : "♡"}
        </button>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p>${product.notes}</p>
        <div class="product-bottom">
          <span class="price">${money(product.price)}</span>
          <button class="add-btn" data-add="${product.id}">
            ADD TO BAG +
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

$("#filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  activeFilter = button.dataset.filter;

  document.querySelectorAll(".filter").forEach((filter) => {
    filter.classList.toggle("active", filter === button);
  });

  renderProducts();
});

$("#search").addEventListener("input", (event) => {
  searchTerm = event.target.value.trim();
  renderProducts();
});

// Wishlist
$("#productGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-wish]");
  if (!button) return;

  const id = Number(button.dataset.wish);

  if (wishlist.has(id)) {
    wishlist.delete(id);
    showToast("Removed from wishlist");
  } else {
    wishlist.add(id);
    showToast("Added to wishlist ♥");
  }

  renderProducts();
});

// Shopping cart
function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  showToast(`${product.name} added to your bag`);
}

$("#productGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

function renderCart() {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  $("#cartCount").textContent = totalItems;
  $("#drawerCount").textContent = `(${totalItems})`;
  $("#cartTotal").textContent = money(
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  if (!cart.length) {
    $("#cartItems").innerHTML = `
      <div class="cart-empty">
        <p style="font-size:32px">✧</p>
        <p>Your bag is waiting for something special.</p>
      </div>`;
    return;
  }

  $("#cartItems").innerHTML = cart.map((item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h3>${item.name}</h3>
        <p>${money(item.price)}</p>
        <div class="quantity">
          <button data-change="${item.id}" data-delta="-1"
            aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button data-change="${item.id}" data-delta="1"
            aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="remove-btn" data-remove="${item.id}">
        Remove
      </button>
    </div>
  `).join("");
}

$("#cartItems").addEventListener("click", (event) => {
  const change = event.target.closest("[data-change]");
  const remove = event.target.closest("[data-remove]");

  if (change) {
    const id = Number(change.dataset.change);
    const item = cart.find((product) => product.id === id);
    if (!item) return;

    item.quantity += Number(change.dataset.delta);

    if (item.quantity <= 0) {
      cart = cart.filter((product) => product.id !== id);
    }

    renderCart();
  }

  if (remove) {
    const id = Number(remove.dataset.remove);
    cart = cart.filter((item) => item.id !== id);
    renderCart();
    showToast("Item removed");
  }
});

// Open and close cart drawer
function setCartOpen(open) {
  $("#cartDrawer").classList.toggle("open", open);
  $("#overlay").classList.toggle("open", open);
  document.body.classList.toggle("cart-open", open);
  $("#cartDrawer").setAttribute("aria-hidden", String(!open));

  if (open) $("#closeCart").focus();
}

$("#openCart").addEventListener("click", () => setCartOpen(true));
$("#closeCart").addEventListener("click", () => setCartOpen(false));
$("#overlay").addEventListener("click", () => setCartOpen(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setCartOpen(false);
});

// Mobile navigation
$("#menuToggle").addEventListener("click", () => {
  const nav = $("#nav");
  const isOpen = nav.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
});

$("#nav").addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    $("#nav").classList.remove("open");
    $("#menuToggle").setAttribute("aria-expanded", "false");
  }
});

// Demo checkout: no payment processing is connected
$("#checkout").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Your bag is empty");
    return;
  }

  showToast("Demo checkout: connect a payment provider to accept orders.");
});

// Contact form: front-end demonstration
$("#contactForm").addEventListener("submit", (event) => {
  event.preventDefault();

  $("#contactStatus").textContent =
    "Demo only: connect a form service or backend to deliver your message.";

  $("#contactForm").reset();
});

// Newsletter form: front-end demonstration
$("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();

  $("#newsletterMessage").textContent =
    "Demo only: connect an email marketing service to save subscriptions.";

  $("#newsletterForm").reset();
});

// Footer year
$("#year").textContent = new Date().getFullYear();

// Initial render
renderProducts();
renderCart();
