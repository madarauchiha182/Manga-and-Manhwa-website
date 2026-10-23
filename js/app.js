// InkVerse - Master Application Controller (Simple & Sweet Student Edition)

class App {
  constructor() {
    this.currentView = "catalog"; // 'catalog', 'orders', 'wishlist'
    this.selectedType = "all"; // 'all', 'manga', 'manhwa'
    this.selectedGenre = "all";
    this.sortBy = "popularity";
    this.searchQuery = "";
    this.selectedItem = null;
    this.selectedOrderTab = "all"; // 'all', 'buys', 'rentals'

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderCatalog();
    this.updateCartBadges();
    this.renderOrders();
    this.initCurrencySelector();
  }

  setupEventListeners() {
    // Navigation Links
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        this.showView(view);
      });
    });

    // Type Filter Tabs (All, Manga, Manhwa)
    document.querySelectorAll(".type-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".type-filter-btn").forEach(b => {
          b.classList.remove("bg-indigo-600", "text-white", "shadow-sm");
          b.classList.add("text-slate-600");
        });
        btn.classList.add("bg-indigo-600", "text-white", "shadow-sm");
        btn.classList.remove("text-slate-600");

        this.selectedType = btn.dataset.type;
        this.renderCatalog();
      });
    });

    // Genre Filter Pills
    document.querySelectorAll(".genre-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".genre-pill").forEach(p => {
          p.classList.remove("bg-indigo-100", "text-indigo-700", "border-indigo-200");
          p.classList.add("bg-white", "text-slate-600", "border-slate-200");
        });
        pill.classList.add("bg-indigo-100", "text-indigo-700", "border-indigo-200");
        pill.classList.remove("bg-white", "text-slate-600");

        this.selectedGenre = pill.dataset.genre;
        this.renderCatalog();
      });
    });

    // Sort Dropdown
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.renderCatalog();
      });
    }

    // Search Input
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      let timeout = null;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.searchQuery = e.target.value.trim().toLowerCase();
          this.renderCatalog();
        }, 200);
      });
    }

    // Cart Button Trigger
    const cartToggleBtns = document.querySelectorAll(".cart-toggle-btn");
    cartToggleBtns.forEach(btn => {
      btn.addEventListener("click", () => this.toggleCartDrawer(true));
    });

    const closeCartDrawerBtn = document.getElementById("close-cart-drawer");
    if (closeCartDrawerBtn) {
      closeCartDrawerBtn.addEventListener("click", () => this.toggleCartDrawer(false));
    }

    // Checkout Modal Open from Cart
    const checkoutBtn = document.getElementById("cart-checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        const cart = store.getCart();
        if (cart.length === 0) {
          this.showToast("Your cart is empty!", "error");
          return;
        }
        this.toggleCartDrawer(false);
        this.openCheckoutModal();
      });
    }

    // Order Filter Tabs (All, Buys, Rentals)
    document.querySelectorAll(".order-filter-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".order-filter-pill").forEach(p => {
          p.classList.remove("bg-indigo-600", "text-white");
          p.classList.add("text-slate-600");
        });
        pill.classList.add("bg-indigo-600", "text-white");
        pill.classList.remove("text-slate-600");

        this.selectedOrderTab = pill.dataset.tab;
        this.renderOrders();
      });
    });

    // Add Manga Form submit
    const addMangaForm = document.getElementById("add-manga-form");
    if (addMangaForm) {
      addMangaForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleAddNewManga();
      });
    }
  }

  showView(viewName) {
    this.currentView = viewName;

    // Toggle views
    const catalogView = document.getElementById("catalog-view");
    const ordersView = document.getElementById("orders-view");
    const wishlistView = document.getElementById("wishlist-view");

    if (catalogView) catalogView.classList.toggle("hidden", viewName !== "catalog");
    if (ordersView) ordersView.classList.toggle("hidden", viewName !== "orders");
    if (wishlistView) wishlistView.classList.toggle("hidden", viewName !== "wishlist");

    // Update active nav styling
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.dataset.view === viewName) {
        link.classList.add("text-indigo-600", "border-b-2", "border-indigo-600");
        link.classList.remove("text-slate-600");
      } else {
        link.classList.remove("text-indigo-600", "border-b-2", "border-indigo-600");
        link.classList.add("text-slate-600");
      }
    });

    if (viewName === "orders") {
      this.renderOrders();
    } else if (viewName === "wishlist") {
      this.renderWishlist();
    } else {
      this.renderCatalog();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  initCurrencySelector() {
    const selector = document.getElementById("currency-selector");
    if (selector) {
      selector.value = store.getCurrency();
      selector.addEventListener("change", (e) => {
        store.setCurrency(e.target.value);
        this.renderCatalog();
        this.renderCart();
        this.renderOrders();
        this.updateCartBadges();
        this.showToast(`Currency updated to ${e.target.value}`, "info");
      });
    }
  }

  // --- CATALOG RENDERING ---
  renderCatalog() {
    const grid = document.getElementById("manga-grid");
    if (!grid) return;

    let items = store.getCatalog();

    // Filter by Type
    if (this.selectedType !== "all") {
      items = items.filter(item => item.type === this.selectedType);
    }

    // Filter by Genre
    if (this.selectedGenre !== "all") {
      items = items.filter(item => item.genres.some(g => g.toLowerCase() === this.selectedGenre.toLowerCase()));
    }

    // Filter by Search Query
    if (this.searchQuery) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(this.searchQuery) ||
        (item.originalTitle && item.originalTitle.toLowerCase().includes(this.searchQuery)) ||
        item.author.toLowerCase().includes(this.searchQuery) ||
        item.genres.some(g => g.toLowerCase().includes(this.searchQuery))
      );
    }

    // Sort Items
    if (this.sortBy === "popularity") {
      items.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (this.sortBy === "rating") {
      items.sort((a, b) => b.rating - a.rating);
    } else if (this.sortBy === "price-low") {
      items.sort((a, b) => a.buyPrice - b.buyPrice);
    } else if (this.sortBy === "price-high") {
      items.sort((a, b) => b.buyPrice - a.buyPrice);
    } else if (this.sortBy === "newest") {
      items.sort((a, b) => b.releaseYear - a.releaseYear);
    }

    const countEl = document.getElementById("results-count");
    if (countEl) countEl.textContent = `Showing ${items.length} titles`;

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <p class="text-3xl mb-2">🔍</p>
          <h3 class="text-base font-bold text-slate-800">No manga or manhwa found</h3>
          <p class="text-xs text-slate-500 mt-1">Try another search keyword or clear your genre filters.</p>
          <button onclick="app.resetFilters()" class="mt-3 px-3.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
            Reset Filters
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = items.map(item => {
      const isWishlisted = store.isWishlisted(item.id);
      return `
        <div class="student-card overflow-hidden flex flex-col justify-between">
          <!-- Book Cover Header -->
          <div class="relative aspect-[3/4] bg-slate-100 cursor-pointer overflow-hidden" onclick="app.openDetailModal('${item.id}')">
            <img src="${item.cover}" alt="${item.title}" class="w-full h-full object-cover hover:scale-105 transition duration-300" loading="lazy">
            
            <!-- Type Tag -->
            <div class="absolute top-2.5 left-2.5">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm ${
                item.type === 'manhwa' 
                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                  : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
              }">
                ${item.type === 'manhwa' ? '🇰🇷 MANHWA' : '🇯🇵 MANGA'}
              </span>
            </div>

            <!-- Wishlist Heart -->
            <button onclick="event.stopPropagation(); app.toggleWishlist('${item.id}')" class="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 shadow flex items-center justify-center transition">
              <i data-lucide="heart" class="w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}"></i>
            </button>

            <!-- Quick Read Overlay Pill -->
            <button onclick="event.stopPropagation(); app.openReader('${item.id}')" class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 hover:bg-slate-900 text-[10px] text-white font-medium flex items-center gap-1 shadow">
              <i data-lucide="book-open" class="w-3 h-3"></i> Read Preview
            </button>
          </div>

          <!-- Book Info Body -->
          <div class="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
            <div>
              <div class="flex items-center gap-1 text-[11px] text-amber-600 font-bold mb-0.5">
                <span>⭐ ${item.rating.toFixed(2)}</span>
                <span class="text-slate-400 font-normal">(${item.reviewsCount})</span>
                <span class="text-slate-300 mx-1">•</span>
                <span class="text-slate-500 font-normal">${item.chapters} Ch.</span>
              </div>
              <h3 onclick="app.openDetailModal('${item.id}')" class="font-bold text-slate-900 text-sm leading-snug line-clamp-1 hover:text-indigo-600 cursor-pointer">
                ${item.title}
              </h3>
              <p class="text-[11px] text-slate-500 line-clamp-1">by ${item.author}</p>
            </div>

            <!-- Pricing Box & Action Buttons -->
            <div class="pt-2 border-t border-slate-100">
              <div class="flex items-center justify-between text-xs mb-2.5">
                <div>
                  <span class="text-[10px] text-slate-400 block">Buy</span>
                  <span class="font-bold text-slate-900">${store.formatPrice(item.buyPrice)}</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-amber-600 block font-medium">Rent from</span>
                  <span class="font-bold text-amber-700">${store.formatPrice(item.rentPricePerWeek)}<span class="text-[10px] font-normal text-slate-500">/wk</span></span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="grid grid-cols-2 gap-1.5">
                <button onclick="app.quickAction('${item.id}', 'rent')" class="w-full py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 transition flex items-center justify-center gap-1">
                  <span>Rent</span> ⏳
                </button>
                <button onclick="app.quickAction('${item.id}', 'buy')" class="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1">
                  <span>Order</span> 🛒
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons();
  }

  resetFilters() {
    this.selectedType = "all";
    this.selectedGenre = "all";
    this.searchQuery = "";
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";
    this.renderCatalog();
  }

  // --- DETAIL MODAL ---
  openDetailModal(itemId) {
    const item = store.getItemById(itemId);
    if (!item) return;
    this.selectedItem = item;

    const modal = document.getElementById("detail-modal");
    const container = document.getElementById("detail-modal-container");
    if (!modal || !container) return;

    const isWishlisted = store.isWishlisted(item.id);

    container.innerHTML = `
      <div class="bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 text-slate-800">
        <!-- Modal Top Bar -->
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold px-2 py-0.5 rounded ${
              item.type === 'manhwa' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
            }">
              ${item.type === 'manhwa' ? '🇰🇷 Manhwa' : '🇯🇵 Manga'}
            </span>
            <span class="text-xs text-slate-500">${item.status} • ${item.chapters} Chapters</span>
          </div>
          <button onclick="app.closeModal('detail-modal')" class="p-1 rounded-lg hover:bg-slate-200 text-slate-500">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Body Details -->
        <div class="p-5 sm:p-6 space-y-4">
          <div class="flex flex-col sm:flex-row gap-4 items-start">
            <img src="${item.cover}" class="w-28 h-40 object-cover rounded-xl shadow-md border border-slate-200 flex-shrink-0">
            <div class="space-y-1">
              <h2 class="text-xl font-bold text-slate-900">${item.title}</h2>
              <p class="text-xs text-indigo-600 font-medium">${item.originalTitle || ''}</p>
              <p class="text-xs text-slate-500">By <strong>${item.author}</strong></p>
              <div class="flex items-center gap-2 text-xs text-amber-600 font-bold pt-1">
                <span>⭐ ${item.rating} rating</span>
                <span class="text-slate-400 font-normal">(${item.reviewsCount} customer reviews)</span>
              </div>
              <div class="flex flex-wrap gap-1 pt-2">
                ${item.genres.map(g => `<span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">${g}</span>`).join('')}
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <h4 class="text-xs font-bold text-slate-700 uppercase mb-1">Story Synopsis</h4>
            <p class="text-xs text-slate-600 leading-relaxed">${item.description}</p>
          </div>

          <!-- Order vs Rent Choice Box -->
          <div class="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-3">
            <div class="flex border-b border-indigo-200 pb-2 gap-4">
              <button id="modal-tab-buy" onclick="app.switchModalPurchaseMode('buy')" class="text-xs font-bold pb-1 border-b-2 border-indigo-600 text-indigo-700 flex items-center gap-1.5">
                <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
                Purchase To Own (${store.formatPrice(item.buyPrice)})
              </button>
              <button id="modal-tab-rent" onclick="app.switchModalPurchaseMode('rent')" class="text-xs font-bold pb-1 text-slate-500 hover:text-slate-800 flex items-center gap-1.5">
                <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                Rent Temporarily (${store.formatPrice(item.rentPricePerWeek)}/wk)
              </button>
            </div>

            <!-- BUY SECTION -->
            <div id="modal-buy-section" class="space-y-2">
              <label class="text-[11px] text-slate-600 font-bold block">Choose Book Edition:</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <label class="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-indigo-300 cursor-pointer">
                  <input type="radio" name="edition-choice" value="Paperback Edition" checked class="text-indigo-600">
                  <div>
                    <p class="font-bold text-slate-800">Paperback</p>
                    <p class="text-[10px] text-slate-500">${store.formatPrice(item.buyPrice)}</p>
                  </div>
                </label>
                <label class="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input type="radio" name="edition-choice" value="Deluxe Collector's Hardcover" class="text-indigo-600">
                  <div>
                    <p class="font-bold text-slate-800">Hardcover</p>
                    <p class="text-[10px] text-indigo-600">+${store.formatPrice(8.00)} Extra</p>
                  </div>
                </label>
                <label class="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input type="radio" name="edition-choice" value="Digital e-Book Edition" class="text-indigo-600">
                  <div>
                    <p class="font-bold text-slate-800">Digital e-Book</p>
                    <p class="text-[10px] text-emerald-600">Save 30%</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- RENT SECTION -->
            <div id="modal-rent-section" class="space-y-2 hidden">
              <label class="text-[11px] text-slate-600 font-bold block">Select Rental Period:</label>
              <div class="grid grid-cols-3 gap-2 text-xs">
                <label class="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-amber-300 cursor-pointer">
                  <input type="radio" name="rental-duration" value="7" checked class="text-amber-600">
                  <div>
                    <p class="font-bold text-slate-800">7 Days</p>
                    <p class="text-[10px] text-amber-700">${store.formatPrice(item.rentPricePerWeek)}</p>
                  </div>
                </label>
                <label class="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input type="radio" name="rental-duration" value="14" class="text-amber-600">
                  <div>
                    <p class="font-bold text-slate-800">14 Days</p>
                    <p class="text-[10px] text-amber-700">${store.formatPrice(item.rentPricePerWeek * 2 * 0.9)}</p>
                  </div>
                </label>
                <label class="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input type="radio" name="rental-duration" value="30" class="text-amber-600">
                  <div>
                    <p class="font-bold text-slate-800">30 Days</p>
                    <p class="text-[10px] text-amber-700">${store.formatPrice(item.rentPricePerWeek * 4 * 0.75)}</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Modal Action Buttons -->
            <div class="flex items-center justify-between gap-3 pt-3 border-t border-indigo-200">
              <button onclick="app.openReader('${item.id}')" class="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 flex items-center gap-1.5 transition">
                <i data-lucide="book-open" class="w-3.5 h-3.5 text-indigo-600"></i>
                Sample Preview
              </button>

              <div class="flex items-center gap-2">
                <button onclick="app.toggleWishlist('${item.id}')" class="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-rose-500 border border-slate-300 transition">
                  <i data-lucide="heart" class="w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}"></i>
                </button>
                <button onclick="app.submitFromModal(false)" class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition">
                  Add to Cart
                </button>
                <button id="modal-submit-now-btn" onclick="app.submitFromModal(true)" class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    this.openModal("detail-modal");
  }

  switchModalPurchaseMode(mode) {
    const buyBtn = document.getElementById("modal-tab-buy");
    const rentBtn = document.getElementById("modal-tab-rent");
    const buySection = document.getElementById("modal-buy-section");
    const rentSection = document.getElementById("modal-rent-section");
    const submitNowBtn = document.getElementById("modal-submit-now-btn");

    if (mode === "buy") {
      buyBtn.className = "text-xs font-bold pb-1 border-b-2 border-indigo-600 text-indigo-700 flex items-center gap-1.5";
      rentBtn.className = "text-xs font-bold pb-1 text-slate-500 hover:text-slate-800 flex items-center gap-1.5";
      buySection.classList.remove("hidden");
      rentSection.classList.add("hidden");
      if (submitNowBtn) submitNowBtn.textContent = "Buy Now";
    } else {
      rentBtn.className = "text-xs font-bold pb-1 border-b-2 border-amber-500 text-amber-700 flex items-center gap-1.5";
      buyBtn.className = "text-xs font-bold pb-1 text-slate-500 hover:text-slate-800 flex items-center gap-1.5";
      buySection.classList.add("hidden");
      rentSection.classList.remove("hidden");
      if (submitNowBtn) submitNowBtn.textContent = "Rent Now";
    }
  }

  submitFromModal(instantCheckout = false) {
    if (!this.selectedItem) return;
    const isRent = !document.getElementById("modal-rent-section").classList.contains("hidden");
    const purchaseType = isRent ? "rent" : "buy";

    let edition = "Paperback Edition";
    let rentalDays = 7;

    if (isRent) {
      const selectedRentRadio = document.querySelector('input[name="rental-duration"]:checked');
      rentalDays = selectedRentRadio ? Number(selectedRentRadio.value) : 7;
      edition = `${rentalDays} Days Rental`;
    } else {
      const selectedEditionRadio = document.querySelector('input[name="edition-choice"]:checked');
      edition = selectedEditionRadio ? selectedEditionRadio.value : "Paperback Edition";
    }

    store.addToCart(this.selectedItem, purchaseType, { edition, rentalDays });
    this.updateCartBadges();
    this.closeModal("detail-modal");

    if (instantCheckout) {
      this.openCheckoutModal();
    } else {
      this.showToast(`Added "${this.selectedItem.title}" to cart!`, "success");
      this.toggleCartDrawer(true);
    }
  }

  quickAction(itemId, type) {
    const item = store.getItemById(itemId);
    if (!item) return;
    store.addToCart(item, type, {
      rentalDays: 7,
      edition: type === "rent" ? "7 Days Rental" : "Paperback Edition"
    });
    this.updateCartBadges();
    this.showToast(`Added ${type === "rent" ? "Rental for" : "Copy of"} "${item.title}" to cart!`, "success");
    this.toggleCartDrawer(true);
  }

  // --- CART DRAWER ---
  toggleCartDrawer(open) {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-backdrop");
    if (!drawer) return;

    if (open) {
      this.renderCart();
      drawer.classList.remove("translate-x-full");
      backdrop?.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    } else {
      drawer.classList.add("translate-x-full");
      backdrop?.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  renderCart() {
    const container = document.getElementById("cart-items-container");
    const cart = store.getCart();
    const totals = store.getCartTotals();

    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="py-12 text-center text-slate-500 space-y-2">
          <p class="text-3xl">🛒</p>
          <p class="font-bold text-slate-800 text-sm">Your cart is empty</p>
          <p class="text-xs">Browse the library to buy or rent manga & manhwa!</p>
        </div>
      `;
    } else {
      container.innerHTML = cart.map(item => `
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <img src="${item.cover}" class="w-12 h-16 object-cover rounded-lg shadow-sm" alt="${item.title}">
          <div class="flex-1 min-w-0">
            <span class="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
              item.purchaseType === 'rent' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
            }">
              ${item.purchaseType}
            </span>
            <h4 class="font-bold text-xs text-slate-900 truncate mt-0.5">${item.title}</h4>
            <p class="text-[10px] text-slate-500">${item.edition}</p>
            <p class="text-xs font-bold text-indigo-600 mt-1">${store.formatPrice(item.price)}</p>
          </div>

          <div class="flex flex-col items-end gap-1.5">
            <button onclick="app.removeCartItem('${item.cartItemId}')" class="text-slate-400 hover:text-rose-500 p-0.5">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
            <div class="flex items-center border border-slate-300 rounded bg-white text-xs">
              <button onclick="app.updateCartQty('${item.cartItemId}', -1)" class="px-1.5 text-slate-500 hover:text-slate-900">-</button>
              <span class="px-1.5 font-bold text-slate-800">${item.quantity}</span>
              <button onclick="app.updateCartQty('${item.cartItemId}', 1)" class="px-1.5 text-slate-500 hover:text-slate-900">+</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    const subtotalEl = document.getElementById("cart-subtotal");
    const shippingEl = document.getElementById("cart-shipping");
    const totalEl = document.getElementById("cart-total");

    if (subtotalEl) subtotalEl.textContent = store.formatPrice(totals.subtotal);
    if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? "FREE" : store.formatPrice(totals.shipping);
    if (totalEl) totalEl.textContent = store.formatPrice(totals.total);

    lucide.createIcons();
  }

  updateCartQty(cartItemId, delta) {
    store.updateCartQuantity(cartItemId, delta);
    this.renderCart();
    this.updateCartBadges();
  }

  removeCartItem(cartItemId) {
    store.removeFromCart(cartItemId);
    this.renderCart();
    this.updateCartBadges();
    this.showToast("Item removed from cart", "info");
  }

  updateCartBadges() {
    const totals = store.getCartTotals();
    document.querySelectorAll(".cart-count-badge").forEach(badge => {
      badge.textContent = totals.itemCount;
      badge.classList.toggle("hidden", totals.itemCount === 0);
    });
  }

  openCheckoutModal() {
    checkout.updateCheckoutSummary();
    const user = store.getUser();
    if (user) {
      const nameInput = document.getElementById("checkout-name");
      const emailInput = document.getElementById("checkout-email");
      const phoneInput = document.getElementById("checkout-phone");
      const addressInput = document.getElementById("checkout-address");
      const cityInput = document.getElementById("checkout-city");
      const postalInput = document.getElementById("checkout-postal");

      if (nameInput) nameInput.value = user.name || "";
      if (emailInput) emailInput.value = user.email || "";
      if (phoneInput) phoneInput.value = user.phone || "";
      if (addressInput) addressInput.value = user.address || "";
      if (cityInput) cityInput.value = user.city || "";
      if (postalInput) postalInput.value = user.postalCode || "";
    }
    this.openModal("checkout-modal");
  }

  // --- ORDERS & RENTALS DASHBOARD ---
  renderOrders() {
    const container = document.getElementById("orders-list-container");
    if (!container) return;

    let orders = store.getOrders();

    if (this.selectedOrderTab === "buys") {
      orders = orders.filter(o => o.orderType === "buy" || o.items.some(i => !i.rentalDurationDays));
    } else if (this.selectedOrderTab === "rentals") {
      orders = orders.filter(o => o.orderType === "rent" || o.items.some(i => i.rentalDurationDays));
    }

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="py-12 text-center bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <p class="text-3xl mb-1">📦</p>
          <h3 class="text-sm font-bold text-slate-800">No orders or rentals yet</h3>
          <p class="text-xs text-slate-500 mt-1">When you buy or rent manga, your records and active rental trackers appear here!</p>
          <button onclick="app.showView('catalog')" class="mt-3 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold">
            Browse Catalog
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(order => {
      const isRentalOrder = order.orderType === "rent" || order.items.some(i => i.rentalDurationDays);

      return `
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <!-- Order Header -->
          <div class="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 text-sm font-mono">${order.id}</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded ${
                  order.orderType === 'rent' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                }">
                  ${order.orderType === 'rent' ? 'Rental Record' : 'Purchase Order'}
                </span>
              </div>
              <p class="text-[11px] text-slate-500 mt-0.5">Date: ${new Date(order.date).toLocaleDateString()}</p>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="checkout.showReceiptModal(${JSON.stringify(order).replace(/"/g, '&quot;')})" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 border border-slate-200 flex items-center gap-1 transition">
                <i data-lucide="file-text" class="w-3.5 h-3.5"></i> Receipt
              </button>
              <div class="text-right pl-2 border-l border-slate-200">
                <span class="text-[10px] text-slate-400 block">Total</span>
                <span class="text-sm font-bold text-indigo-600">${store.formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <!-- Items -->
          <div class="space-y-2.5">
            ${order.items.map(item => `
              <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 gap-3">
                <div class="flex items-center gap-3">
                  <img src="${item.cover}" class="w-12 h-16 object-cover rounded shadow-sm" alt="${item.title}">
                  <div>
                    <h4 class="font-bold text-slate-900 text-xs">${item.title}</h4>
                    <p class="text-[11px] text-slate-500">${item.edition || 'Standard Edition'}</p>
                    
                    ${item.rentalDurationDays ? `
                      <div class="flex items-center gap-1.5 mt-1">
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.rentalStatus === 'Returned' 
                            ? 'bg-slate-200 text-slate-600' 
                            : (item.daysRemaining > 0 ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-rose-100 text-rose-800')
                        }">
                          ⏳ ${item.rentalStatus === 'Returned' ? 'Returned' : `${item.daysRemaining} Days Left`}
                        </span>
                        <span class="text-[10px] text-slate-400 font-mono">Due: ${new Date(item.rentalEndDate).toLocaleDateString()}</span>
                      </div>
                    ` : ''}
                  </div>
                </div>

                <div class="flex items-center gap-1.5">
                  <button onclick="app.openReader('${item.id}')" class="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition">
                    Read
                  </button>
                  ${item.rentalDurationDays && item.rentalStatus === 'Active' ? `
                    <button onclick="app.handleExtendRental('${order.id}', '${item.id}')" class="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 transition">
                      +7d
                    </button>
                    <button onclick="app.handleReturnRental('${order.id}', '${item.id}')" class="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-xs text-rose-700 transition">
                      Return
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Physical Delivery Tracker -->
          ${!isRentalOrder ? `
            <div class="pt-2 border-t border-slate-100 text-xs">
              <div class="flex justify-between text-slate-500 mb-1.5 text-[11px]">
                <span>Status: <strong class="text-emerald-700">${order.status || 'In Transit'}</strong></span>
                <span>Delivery by: <strong>${order.estimatedDelivery || 'In 3 Days'}</strong></span>
              </div>
              <div class="flex items-center gap-1">
                <div class="order-step completed"></div>
                <div class="order-step ${order.status === 'Packed' || order.status === 'Shipped' || order.status === 'Delivered' ? 'completed' : ''}"></div>
                <div class="order-step ${order.status === 'Shipped' || order.status === 'Delivered' ? 'completed' : ''}"></div>
                <div class="order-step ${order.status === 'Delivered' ? 'completed' : ''}"></div>
              </div>
              <div class="flex justify-between text-[9px] text-slate-400 mt-1">
                <span>Placed</span>
                <span>Packed</span>
                <span>In Transit</span>
                <span>Delivered</span>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    lucide.createIcons();
  }

  handleExtendRental(orderId, itemId) {
    store.extendRental(orderId, itemId, 7);
    this.renderOrders();
    this.showToast("Rental extended by 7 days! ⏳", "success");
  }

  handleReturnRental(orderId, itemId) {
    if (confirm("Return this rented volume?")) {
      store.returnRental(orderId, itemId);
      this.renderOrders();
      this.showToast("Rental returned successfully.", "info");
    }
  }

  // --- WISHLIST VIEW ---
  renderWishlist() {
    const grid = document.getElementById("wishlist-grid");
    if (!grid) return;

    const wishlistIds = store.getWishlist();
    const items = store.getCatalog().filter(item => wishlistIds.includes(item.id));

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <p class="text-3xl mb-1">❤️</p>
          <h3 class="text-sm font-bold text-slate-800">Your wishlist is empty</h3>
          <p class="text-xs text-slate-500 mt-1">Click the heart button on any title to save it for later!</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = items.map(item => `
      <div class="bg-white rounded-xl border border-slate-200 p-3 flex gap-3 items-center shadow-sm">
        <img src="${item.cover}" class="w-16 h-22 object-cover rounded-lg shadow-sm" alt="${item.title}">
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-slate-900 text-xs truncate">${item.title}</h4>
          <p class="text-[11px] text-slate-500">${item.author}</p>
          <p class="text-xs font-bold text-indigo-600 mt-1">${store.formatPrice(item.buyPrice)}</p>
          <div class="flex items-center gap-1.5 mt-2">
            <button onclick="app.quickAction('${item.id}', 'rent')" class="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">Rent</button>
            <button onclick="app.quickAction('${item.id}', 'buy')" class="px-2 py-0.5 rounded bg-indigo-600 text-white text-[11px] font-semibold">Order</button>
            <button onclick="app.toggleWishlist('${item.id}')" class="text-slate-400 hover:text-rose-500 ml-auto p-1">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    lucide.createIcons();
  }

  toggleWishlist(itemId) {
    store.toggleWishlist(itemId);
    this.renderCatalog();
    if (this.currentView === "wishlist") {
      this.renderWishlist();
    }
  }

  // --- ADD CUSTOM MANGA ---
  handleAddNewManga() {
    const title = document.getElementById("new-manga-title")?.value.trim();
    const type = document.getElementById("new-manga-type")?.value || "manga";
    const author = document.getElementById("new-manga-author")?.value.trim() || "Student Creator";
    const genresInput = document.getElementById("new-manga-genres")?.value.trim() || "Action, Fantasy";
    const buyPrice = Number(document.getElementById("new-manga-price")?.value) || 12.99;
    const rentPrice = Number(document.getElementById("new-manga-rent-price")?.value) || 2.49;
    const cover = document.getElementById("new-manga-cover")?.value.trim() || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80";
    const synopsis = document.getElementById("new-manga-synopsis")?.value.trim() || "A custom manga/manhwa entry added to the student library.";

    if (!title) {
      this.showToast("Please enter a title.", "error");
      return;
    }

    const genres = genresInput.split(",").map(g => g.trim()).filter(Boolean);

    store.addCustomItem({
      title,
      originalTitle: title,
      type,
      author,
      artist: author,
      genres,
      buyPrice,
      rentPricePerWeek: rentPrice,
      cover,
      banner: cover,
      description: synopsis,
      chapters: 15,
      status: "Ongoing",
      releaseYear: 2026,
      country: type === "manhwa" ? "South Korea" : "Japan"
    });

    this.closeModal("add-manga-modal");
    document.getElementById("add-manga-form")?.reset();
    this.renderCatalog();
    this.showToast(`"${title}" added to your library! 📚`, "success");
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  openReader(itemId) {
    const item = store.getItemById(itemId);
    if (item) {
      reader.open(item, 1);
    }
  }

  // Sweet Clean Toast Notification
  showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `p-3 px-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 transform translate-y-3 opacity-0 transition duration-200 pointer-events-auto ${
      type === 'success' 
        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
        : (type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-indigo-50 text-indigo-800 border-indigo-300')
    }`;

    toast.innerHTML = `
      <span class="w-2 h-2 rounded-full ${type === 'success' ? 'bg-emerald-500' : (type === 'error' ? 'bg-rose-500' : 'bg-indigo-500')}"></span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-3", "opacity-0");
    });

    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }
}

const app = new App();
