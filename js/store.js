// InkVerse - Persistent State Store (LocalStorage)

class Store {
  constructor() {
    this.STORAGE_KEYS = {
      CATALOG: "inkverse_catalog_v1",
      CART: "inkverse_cart_v1",
      WISHLIST: "inkverse_wishlist_v1",
      ORDERS: "inkverse_orders_v1",
      USER: "inkverse_user_v1",
      CURRENCY: "inkverse_currency_v1"
    };

    this.init();
  }

  init() {
    // Initialize Catalog
    if (!localStorage.getItem(this.STORAGE_KEYS.CATALOG)) {
      localStorage.setItem(this.STORAGE_KEYS.CATALOG, JSON.stringify(INITIAL_CATALOG));
    }

    // Initialize Orders with realistic sample data
    if (!localStorage.getItem(this.STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }

    // Initialize Cart
    if (!localStorage.getItem(this.STORAGE_KEYS.CART)) {
      localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify([]));
    }

    // Initialize Wishlist
    if (!localStorage.getItem(this.STORAGE_KEYS.WISHLIST)) {
      localStorage.setItem(this.STORAGE_KEYS.WISHLIST, JSON.stringify(["solo-leveling", "berserk"]));
    }

    // Initialize User
    if (!localStorage.getItem(this.STORAGE_KEYS.USER)) {
      const defaultUser = {
        name: "Arnav Vaidya",
        email: "vaidyaarnav182@gmail.com",
        phone: "+91 98765 43210",
        address: "42 Otaku Boulevard, Neo Tokyo District",
        city: "Mumbai",
        postalCode: "400001",
        country: "India",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
      };
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(defaultUser));
    }

    // Initialize Currency preference
    if (!localStorage.getItem(this.STORAGE_KEYS.CURRENCY)) {
      localStorage.setItem(this.STORAGE_KEYS.CURRENCY, "USD");
    }
  }

  // --- CATALOG ---
  getCatalog() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CATALOG)) || INITIAL_CATALOG;
    } catch (e) {
      return INITIAL_CATALOG;
    }
  }

  getItemById(id) {
    const catalog = this.getCatalog();
    return catalog.find(item => item.id === id);
  }

  addCustomItem(itemData) {
    const catalog = this.getCatalog();
    const id = itemData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);
    const newItem = {
      id,
      ...itemData,
      rating: itemData.rating || 4.8,
      reviewsCount: 1,
      stock: itemData.stock || 20,
      previewPanels: itemData.previewPanels || [itemData.cover]
    };
    catalog.unshift(newItem);
    localStorage.setItem(this.STORAGE_KEYS.CATALOG, JSON.stringify(catalog));
    return newItem;
  }

  // --- CART ---
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CART)) || [];
    } catch (e) {
      return [];
    }
  }

  addToCart(item, purchaseType = "buy", options = {}) {
    const cart = this.getCart();
    const rentalDays = options.rentalDays || 7;
    const edition = options.edition || (purchaseType === "rent" ? "Digital Rental" : "Paperback Edition");

    // Calculate item unit price
    let unitPrice = purchaseType === "rent" 
      ? (item.rentPricePerWeek * (rentalDays / 7)).toFixed(2)
      : item.buyPrice;

    if (options.edition === "Deluxe Collector's Hardcover") {
      unitPrice = (Number(unitPrice) + 8.00).toFixed(2);
    } else if (options.edition === "Digital e-Book Edition") {
      unitPrice = Math.max(3.99, (Number(unitPrice) * 0.7)).toFixed(2);
    }

    // Unique cart item identifier (depends on id + type + edition + rental duration)
    const cartItemId = `${item.id}-${purchaseType}-${edition}-${rentalDays}`;
    const existingIndex = cart.findIndex(c => c.cartItemId === cartItemId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        cartItemId,
        id: item.id,
        title: item.title,
        originalTitle: item.originalTitle,
        type: item.type,
        cover: item.cover,
        purchaseType, // 'buy' or 'rent'
        edition,
        rentalDays: purchaseType === "rent" ? rentalDays : null,
        price: Number(unitPrice),
        quantity: 1
      });
    }

    localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
  }

  updateCartQuantity(cartItemId, delta) {
    let cart = this.getCart();
    const item = cart.find(c => c.cartItemId === cartItemId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        cart = cart.filter(c => c.cartItemId !== cartItemId);
      }
    }
    localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
  }

  removeFromCart(cartItemId) {
    const cart = this.getCart().filter(c => c.cartItemId !== cartItemId);
    localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
  }

  clearCart() {
    localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify([]));
  }

  getCartTotals(couponCode = null) {
    const cart = this.getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Check coupon
    let discount = 0;
    let couponDetails = null;
    let freeShipping = false;

    if (couponCode && PROMO_CODES[couponCode]) {
      couponDetails = PROMO_CODES[couponCode];
      if (couponDetails.discountPercent) {
        discount = (subtotal * couponDetails.discountPercent) / 100;
      } else if (couponDetails.discountFixed) {
        discount = Math.min(subtotal, couponDetails.discountFixed);
      }
      if (couponDetails.freeShipping) {
        freeShipping = true;
      }
    }

    const hasPhysicalItems = cart.some(item => item.purchaseType === "buy" && item.edition !== "Digital e-Book Edition");
    const shipping = (hasPhysicalItems && !freeShipping && subtotal < 50 && subtotal > 0) ? 4.99 : 0.00;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.08; // 8% sales tax
    const total = Math.max(0, taxableAmount + shipping + tax);

    return {
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      itemCount: cart.reduce((acc, cur) => acc + cur.quantity, 0),
      couponDetails
    };
  }

  // --- WISHLIST ---
  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.WISHLIST)) || [];
    } catch (e) {
      return [];
    }
  }

  toggleWishlist(itemId) {
    let wishlist = this.getWishlist();
    if (wishlist.includes(itemId)) {
      wishlist = wishlist.filter(id => id !== itemId);
    } else {
      wishlist.push(itemId);
    }
    localStorage.setItem(this.STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    return wishlist;
  }

  isWishlisted(itemId) {
    return this.getWishlist().includes(itemId);
  }

  // --- ORDERS & RENTALS ---
  getOrders() {
    try {
      const orders = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.ORDERS)) || [];
      // Recalculate remaining rental days dynamically based on now
      const now = new Date();
      orders.forEach(order => {
        if (order.orderType === "rent" || order.items.some(i => i.rentalDurationDays)) {
          order.items.forEach(item => {
            if (item.rentalEndDate && item.rentalStatus === "Active") {
              const diffMs = new Date(item.rentalEndDate) - now;
              item.daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
              if (item.daysRemaining === 0) {
                item.rentalStatus = "Expired";
              }
            }
          });
        }
      });
      return orders;
    } catch (e) {
      return [];
    }
  }

  addOrder(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      id: "ORD-" + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString(),
      ...orderData
    };
    orders.unshift(newOrder);
    localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
  }

  returnRental(orderId, itemId) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const item = order.items.find(i => i.id === itemId);
      if (item) {
        item.rentalStatus = "Returned";
        item.returnedDate = new Date().toISOString();
        item.daysRemaining = 0;
      }
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
    return orders;
  }

  extendRental(orderId, itemId, extraDays = 7) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const item = order.items.find(i => i.id === itemId);
      if (item) {
        const currentEnd = new Date(item.rentalEndDate || Date.now());
        const newEnd = new Date(currentEnd.getTime() + extraDays * 24 * 60 * 60 * 1000);
        item.rentalEndDate = newEnd.toISOString();
        item.rentalDurationDays = (item.rentalDurationDays || 7) + extraDays;
        item.rentalStatus = "Active";
        item.daysRemaining = Math.max(0, Math.ceil((newEnd - new Date()) / (1000 * 60 * 60 * 24)));
      }
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
    return orders;
  }

  // --- USER PROFILE ---
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USER));
    } catch (e) {
      return {};
    }
  }

  saveUser(userData) {
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(userData));
  }

  // --- CURRENCY ---
  getCurrency() {
    return localStorage.getItem(this.STORAGE_KEYS.CURRENCY) || "USD";
  }

  setCurrency(curr) {
    localStorage.setItem(this.STORAGE_KEYS.CURRENCY, curr);
  }

  formatPrice(amountInUSD) {
    const curr = this.getCurrency();
    const num = Number(amountInUSD);
    if (curr === "INR") {
      const inrAmount = Math.round(num * 84);
      return `₹${inrAmount.toLocaleString("en-IN")}`;
    }
    return `$${num.toFixed(2)}`;
  }

  // --- BACKUP & RESTORE ---
  exportBackup() {
    const backupData = {
      catalog: this.getCatalog(),
      cart: this.getCart(),
      wishlist: this.getWishlist(),
      orders: this.getOrders(),
      user: this.getUser(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backupData, null, 2);
  }

  importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.catalog) localStorage.setItem(this.STORAGE_KEYS.CATALOG, JSON.stringify(data.catalog));
      if (data.cart) localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(data.cart));
      if (data.wishlist) localStorage.setItem(this.STORAGE_KEYS.WISHLIST, JSON.stringify(data.wishlist));
      if (data.orders) localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(data.orders));
      if (data.user) localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(data.user));
      return true;
    } catch (e) {
      console.error("Failed to import backup:", e);
      return false;
    }
  }

  resetToDefaults() {
    localStorage.setItem(this.STORAGE_KEYS.CATALOG, JSON.stringify(INITIAL_CATALOG));
    localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify([]));
    localStorage.setItem(this.STORAGE_KEYS.WISHLIST, JSON.stringify(["solo-leveling", "berserk"]));
  }
}

const store = new Store();
