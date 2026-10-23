// InkVerse - Checkout & Payment Processing Engine (Simple & Sweet Student Edition)

class CheckoutController {
  constructor() {
    this.currentMethod = "card";
    this.appliedCoupon = null;
    this.isProcessing = false;
    this.initListeners();
  }

  initListeners() {
    // Card inputs
    const cardNumberInput = document.getElementById("card-number-input");
    const cardHolderInput = document.getElementById("card-holder-input");
    const cardExpiryInput = document.getElementById("card-expiry-input");

    if (cardNumberInput) {
      cardNumberInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, "").slice(0, 16);
        let formatted = val.replace(/(\d{4})/g, "$1 ").trim();
        e.target.value = formatted;
      });
    }

    if (cardExpiryInput) {
      cardExpiryInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, "").slice(0, 4);
        if (val.length >= 3) {
          val = val.slice(0, 2) + "/" + val.slice(2);
        }
        e.target.value = val;
      });
    }

    // Payment method selector pills
    const paymentPills = document.querySelectorAll(".payment-method-pill");
    paymentPills.forEach(pill => {
      pill.addEventListener("click", () => {
        const method = pill.dataset.method;
        this.selectPaymentMethod(method);
      });
    });

    // Coupon button
    const applyCouponBtn = document.getElementById("apply-coupon-btn");
    const couponInput = document.getElementById("coupon-input");
    if (applyCouponBtn && couponInput) {
      applyCouponBtn.addEventListener("click", () => {
        this.applyCoupon(couponInput.value.trim().toUpperCase());
      });
    }

    // Checkout form submission
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.processPayment();
      });
    }
  }

  selectPaymentMethod(method) {
    this.currentMethod = method;
    
    // Toggle active styles on buttons
    document.querySelectorAll(".payment-method-pill").forEach(pill => {
      if (pill.dataset.method === method) {
        pill.className = "payment-method-pill p-2.5 rounded-xl border border-indigo-600 bg-indigo-50 text-indigo-700 flex flex-col items-center justify-center gap-1 transition";
      } else {
        pill.className = "payment-method-pill p-2.5 rounded-xl border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 flex flex-col items-center justify-center gap-1 transition";
      }
    });

    // Toggle method sections
    const cardSection = document.getElementById("payment-card-section");
    const upiSection = document.getElementById("payment-upi-section");
    const paypalSection = document.getElementById("payment-paypal-section");
    const codSection = document.getElementById("payment-cod-section");

    if (cardSection) cardSection.classList.toggle("hidden", method !== "card");
    if (upiSection) upiSection.classList.toggle("hidden", method !== "upi");
    if (paypalSection) paypalSection.classList.toggle("hidden", method !== "paypal");
    if (codSection) codSection.classList.toggle("hidden", method !== "cod");
  }

  applyCoupon(code) {
    const couponFeedback = document.getElementById("coupon-feedback");
    if (!code) {
      if (couponFeedback) {
        couponFeedback.textContent = "Please enter a coupon code.";
        couponFeedback.className = "text-[11px] text-amber-600 mt-1";
      }
      return;
    }

    if (PROMO_CODES[code]) {
      this.appliedCoupon = code;
      if (couponFeedback) {
        couponFeedback.textContent = `Applied! ${PROMO_CODES[code].description}`;
        couponFeedback.className = "text-[11px] text-emerald-600 font-semibold mt-1";
      }
      this.updateCheckoutSummary();
      app.showToast(`Coupon "${code}" applied! 🎉`, "success");
    } else {
      if (couponFeedback) {
        couponFeedback.textContent = "Invalid code. Try OTAKU20 or WELCOME10.";
        couponFeedback.className = "text-[11px] text-rose-600 mt-1";
      }
    }
  }

  updateCheckoutSummary() {
    const totals = store.getCartTotals(this.appliedCoupon);
    
    const subtotalEl = document.getElementById("checkout-subtotal");
    const discountEl = document.getElementById("checkout-discount");
    const shippingEl = document.getElementById("checkout-shipping");
    const totalEl = document.getElementById("checkout-total");
    const discountRow = document.getElementById("checkout-discount-row");

    if (subtotalEl) subtotalEl.textContent = store.formatPrice(totals.subtotal);
    if (discountEl) discountEl.textContent = `-${store.formatPrice(totals.discount)}`;
    if (discountRow) discountRow.classList.toggle("hidden", totals.discount === 0);
    if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? "FREE" : store.formatPrice(totals.shipping);
    if (totalEl) totalEl.textContent = store.formatPrice(totals.total);

    const submitBtnTotal = document.getElementById("submit-pay-total");
    if (submitBtnTotal) submitBtnTotal.textContent = store.formatPrice(totals.total);
  }

  async processPayment() {
    if (this.isProcessing) return;
    const cart = store.getCart();
    if (cart.length === 0) {
      app.showToast("Your cart is empty!", "error");
      return;
    }

    const nameInput = document.getElementById("checkout-name");
    const emailInput = document.getElementById("checkout-email");
    const phoneInput = document.getElementById("checkout-phone");
    const addressInput = document.getElementById("checkout-address");
    const cityInput = document.getElementById("checkout-city");
    const postalInput = document.getElementById("checkout-postal");

    if (!nameInput?.value.trim() || !emailInput?.value.trim()) {
      app.showToast("Please provide your name and email.", "error");
      return;
    }

    if (this.currentMethod === "card") {
      const cardNum = document.getElementById("card-number-input")?.value.replace(/\s/g, "");
      const cardExp = document.getElementById("card-expiry-input")?.value;
      const cardCvv = document.getElementById("card-cvv-input")?.value;
      if (!cardNum || cardNum.length < 15 || !cardExp || !cardCvv) {
        app.showToast("Please fill in standard card details (or test 4242 4242...).", "error");
        return;
      }
    } else if (this.currentMethod === "upi") {
      const upiId = document.getElementById("upi-id-input")?.value.trim();
      if (!upiId || !upiId.includes("@")) {
        app.showToast("Please enter a valid UPI ID (e.g. arnav@okhdfcbank)", "error");
        return;
      }
    }

    this.isProcessing = true;
    const submitBtn = document.getElementById("checkout-submit-btn");
    const originalText = submitBtn ? submitBtn.innerHTML : "Confirm & Pay";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Processing payment...</span>`;
    }

    await new Promise(res => setTimeout(res, 1200));

    const totals = store.getCartTotals(this.appliedCoupon);
    const hasRentals = cart.some(i => i.purchaseType === "rent");
    const hasBuys = cart.some(i => i.purchaseType === "buy");
    const orderType = (hasRentals && !hasBuys) ? "rent" : (hasBuys && !hasRentals ? "buy" : "mixed");

    const orderItems = cart.map(item => {
      const isRental = item.purchaseType === "rent";
      const now = new Date();
      const rentalDuration = item.rentalDays || 7;
      const end = new Date(now.getTime() + rentalDuration * 24 * 60 * 60 * 1000);

      return {
        id: item.id,
        title: item.title,
        type: item.type,
        cover: item.cover,
        price: item.price,
        quantity: item.quantity,
        edition: item.edition,
        purchaseType: item.purchaseType,
        rentalDurationDays: isRental ? rentalDuration : null,
        rentalStartDate: isRental ? now.toISOString() : null,
        rentalEndDate: isRental ? end.toISOString() : null,
        rentalStatus: isRental ? "Active" : null,
        daysRemaining: isRental ? rentalDuration : null
      };
    });

    const newOrder = store.addOrder({
      orderType,
      items: orderItems,
      customer: {
        fullName: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput?.value.trim() || "+91 98765 43210",
        address: addressInput?.value.trim() || "Sakura Residency, Sector 4",
        city: cityInput?.value.trim() || "Mumbai",
        postalCode: postalInput?.value.trim() || "400001",
        country: "India"
      },
      payment: {
        method: this.currentMethod,
        cardBrand: this.currentMethod === "card" ? "Visa" : null,
        last4: this.currentMethod === "card" ? (document.getElementById("card-number-input")?.value.slice(-4) || "4242") : null,
        upiId: this.currentMethod === "upi" ? document.getElementById("upi-id-input")?.value : null,
        status: "Paid",
        transactionId: "TXN-" + Math.floor(100000 + Math.random() * 900000)
      },
      subtotal: totals.subtotal,
      discount: totals.discount,
      couponCode: this.appliedCoupon,
      tax: totals.tax,
      shipping: totals.shipping,
      total: totals.total,
      status: orderType === "rent" ? "Active Rental" : "Processing",
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    if (typeof confetti === "function") {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }

    store.clearCart();
    this.appliedCoupon = null;
    this.isProcessing = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }

    app.closeModal("checkout-modal");
    app.updateCartBadges();
    app.renderOrders();
    this.showReceiptModal(newOrder);
  }

  showReceiptModal(order) {
    const modal = document.getElementById("receipt-modal");
    const container = document.getElementById("receipt-content-container");
    if (!modal || !container) return;

    container.innerHTML = `
      <div id="printable-receipt" class="bg-white rounded-2xl p-6 sm:p-8 space-y-5 border border-slate-200 shadow-xl text-slate-800">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
              📚
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">InkVerse Library</h3>
              <p class="text-xs text-slate-500">Order &amp; Rental Invoice</p>
            </div>
          </div>
          <div class="text-right">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ✓ Paid Successfully
            </span>
            <p class="text-xs text-slate-500 font-mono mt-1">ID: ${order.id}</p>
          </div>
        </div>

        <!-- Meta -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div>
            <span class="text-slate-400 block text-[10px]">Date</span>
            <span class="font-semibold text-slate-800">${new Date(order.date).toLocaleDateString()}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px]">Method</span>
            <span class="font-semibold text-slate-800 uppercase">${order.payment.method}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px]">Customer</span>
            <span class="font-semibold text-slate-800 truncate block">${order.customer.fullName}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px]">Txn ID</span>
            <span class="font-mono text-indigo-600 font-semibold block truncate">${order.payment.transactionId}</span>
          </div>
        </div>

        <!-- Table -->
        <div class="border-t border-b border-slate-200 divide-y divide-slate-100 text-xs">
          <div class="py-2 font-bold text-slate-500 grid grid-cols-12 uppercase">
            <div class="col-span-7">Title / Edition</div>
            <div class="col-span-2 text-center">Type</div>
            <div class="col-span-3 text-right">Price</div>
          </div>
          ${order.items.map(item => `
            <div class="py-2.5 grid grid-cols-12 items-center">
              <div class="col-span-7">
                <p class="font-bold text-slate-900">${item.title}</p>
                <p class="text-[10px] text-slate-500">${item.edition}</p>
              </div>
              <div class="col-span-2 text-center">
                <span class="text-[10px] px-1.5 py-0.5 rounded ${item.purchaseType === 'rent' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'}">
                  ${item.purchaseType || (item.rentalDurationDays ? 'Rent' : 'Buy')}
                </span>
              </div>
              <div class="col-span-3 text-right font-bold text-slate-900">
                ${store.formatPrice(item.price * (item.quantity || 1))}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Totals -->
        <div class="flex justify-end text-xs">
          <div class="w-56 space-y-1">
            <div class="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span class="font-semibold text-slate-900">${store.formatPrice(order.subtotal)}</span>
            </div>
            ${order.discount > 0 ? `
              <div class="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span class="font-semibold">-${store.formatPrice(order.discount)}</span>
              </div>
            ` : ''}
            <div class="flex justify-between text-slate-600">
              <span>Shipping:</span>
              <span class="font-semibold text-slate-900">${order.shipping === 0 ? 'FREE' : store.formatPrice(order.shipping)}</span>
            </div>
            <div class="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-1.5">
              <span>Grand Total:</span>
              <span class="text-indigo-600">${store.formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-200 no-print">
          <button onclick="window.print()" class="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition">
            <i data-lucide="printer" class="w-3.5 h-3.5"></i> Print Receipt
          </button>
          <button onclick="app.closeModal('receipt-modal'); app.showView('orders')" class="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition">
            View My Orders
          </button>
        </div>
      </div>
    `;

    lucide.createIcons();
    app.openModal("receipt-modal");
  }
}

const checkout = new CheckoutController();
