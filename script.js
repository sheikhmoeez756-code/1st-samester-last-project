// ============================================
//  BagBag — Luxury Redesign  (script.js)
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ---------- PRODUCT DATA ----------
    const products = [
        // Men
        { id: 101, name: 'Urban Explorer Sling', category: 'messenger', gender: 'men',   price: 55.00,  brand: 'Apex',      spec: 'A sleek cross-body design in water-resistant fabric — perfect for the daily commute.', img: 'img/menproducts/men-1.jpg' },
        { id: 102, name: 'Travel Pro Backpack',  category: 'backpacks', gender: 'men',   price: 99.00,  brand: 'DurableCo', spec: 'Water-resistant shell, hidden security pockets and a generous 30L capacity.',        img: 'img/menproducts/men-2.jpg' },
        { id: 103, name: 'Professional Briefcase',category: 'bags',      gender: 'men',   price: 210.00, brand: 'Acme',      spec: 'Full-grain premium leather with a padded 17" laptop compartment.',                   img: 'img/menproducts/men-3.jpg' },
        { id: 104, name: 'Weekend Duffel',        category: 'bags',      gender: 'men',   price: 45.00,  brand: 'Nomad',     spec: 'Spacious main compartment with a ventilated shoe pocket for the gym or travel.',      img: 'img/menproducts/men-4.jpg' },

        // Women
        { id: 201, name: 'Classic Business Tote', category: 'totes',     gender: 'women', price: 120.50, brand: 'Vogue',     spec: 'Structured vegan leather tote with dedicated 14" laptop space.',                       img: 'img/womenproducts/women-1.jpg' },
        { id: 202, name: 'Everyday Elegant Handbag',category: 'handbags',gender: 'women', price: 110.00, brand: 'Chic',      spec: 'A timeless silhouette with secure zip-top closure and polished metal feet.',          img: 'img/womenproducts/women-2.jpg' },
        { id: 203, name: 'Mini Crossbody Sparkle',category: 'handbags',  gender: 'women', price: 45.99,  brand: 'Lumière',   spec: 'Compact and playful, with an adjustable strap and a jewel-tone finish.',              img: 'img/womenproducts/women-3.jpg' },
        { id: 204, name: 'Weekend Travel Backpack',category: 'backpacks',gender: 'women', price: 79.99,  brand: 'Explorer',  spec: 'Lightweight everyday backpack with a discreet anti-theft zipper.',                    img: 'img/womenproducts/women-4.jpg' },
    ];

    // ---------- CART STATE ----------
    const cart = [];               // { id, qty }
    const cartCountEl   = document.getElementById('cart-count');
    const cartListEl    = document.getElementById('cart-items-list');
    const cartEmptyEl   = document.getElementById('cart-empty');
    const cartFooterEl  = document.getElementById('cart-footer');
    const cartSubtotalEl= document.getElementById('cart-subtotal');

    const productModal = new bootstrap.Modal(document.getElementById('productDetailModal'));

    const money = (n) => n.toFixed(2);
    const cap   = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    // ---------- CART LOGIC ----------
    const addToCart = (id) => {
        const line = cart.find(l => l.id === id);
        if (line) line.qty++;
        else cart.push({ id, qty: 1 });
        renderCart();
    };

    const changeQty = (id, delta) => {
        const line = cart.find(l => l.id === id);
        if (!line) return;
        line.qty += delta;
        if (line.qty <= 0) cart.splice(cart.indexOf(line), 1);
        renderCart();
    };

    const removeLine = (id) => {
        const line = cart.find(l => l.id === id);
        if (line) cart.splice(cart.indexOf(line), 1);
        renderCart();
    };

    const renderCart = () => {
        const totalQty = cart.reduce((s, l) => s + l.qty, 0);
        cartCountEl.textContent = totalQty;
        cartCountEl.style.display = totalQty > 0 ? 'inline-flex' : 'none';

        if (cart.length === 0) {
            cartEmptyEl.classList.remove('d-none');
            cartFooterEl.classList.add('d-none');
            cartListEl.innerHTML = '';
            return;
        }

        cartEmptyEl.classList.add('d-none');
        cartFooterEl.classList.remove('d-none');

        cartListEl.innerHTML = cart.map(line => {
            const p = products.find(pr => pr.id === line.id);
            return `
                <div class="cart-item">
                    <img src="${p.img}" alt="${p.name}">
                    <div class="cart-item-info">
                        <h6>${p.name}</h6>
                        <span class="price">$${money(p.price)}</span>
                        <div class="cart-qty">
                            <button data-action="dec" data-id="${p.id}" aria-label="Decrease">&minus;</button>
                            <span>${line.qty}</span>
                            <button data-action="inc" data-id="${p.id}" aria-label="Increase">+</button>
                        </div>
                    </div>
                    <button class="cart-remove" data-action="remove" data-id="${p.id}" aria-label="Remove"><i class="bi bi-trash3"></i></button>
                </div>`;
        }).join('');

        const subtotal = cart.reduce((s, l) => {
            const p = products.find(pr => pr.id === l.id);
            return s + p.price * l.qty;
        }, 0);
        cartSubtotalEl.textContent = money(subtotal);
    };

    // Event delegation for cart controls
    cartListEl.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const id = parseInt(btn.dataset.id, 10);
        if (btn.dataset.action === 'inc') changeQty(id, 1);
        if (btn.dataset.action === 'dec') changeQty(id, -1);
        if (btn.dataset.action === 'remove') removeLine(id);
    });

    // ---------- PRODUCT RENDERING ----------
    const cardHTML = (p) => `
        <div class="col product-item" data-category="${p.category}">
            <div class="product-card">
                <div class="product-media">
                    <span class="product-cat-badge">${cap(p.category)}</span>
                    <img src="${p.img}" alt="${p.name}" loading="lazy">
                    <div class="quick-view"><span data-action="view" data-id="${p.id}">Quick View</span></div>
                </div>
                <div class="product-body">
                    <p class="product-brand">${p.brand}</p>
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-foot">
                        <span class="product-price">$${money(p.price)}</span>
                        <button class="add-btn" data-action="add" data-id="${p.id}" aria-label="Add ${p.name} to cart">
                            <i class="bi bi-bag-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

    const renderProducts = (gender, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = products.filter(p => p.gender === gender).map(cardHTML).join('');
    };

    // Delegated clicks on each product list (add + quick view)
    const wireProductList = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.addEventListener('click', (e) => {
            const el = e.target.closest('[data-action]');
            if (!el) return;
            const id = parseInt(el.dataset.id, 10);
            const product = products.find(p => p.id === id);
            if (!product) return;

            if (el.dataset.action === 'add') {
                addToCart(id);
                const btn = el.closest('.add-btn');
                btn.classList.add('added');
                btn.innerHTML = '<i class="bi bi-check-lg"></i>';
                setTimeout(() => {
                    btn.classList.remove('added');
                    btn.innerHTML = '<i class="bi bi-bag-plus"></i>';
                }, 1300);
            }
            if (el.dataset.action === 'view') {
                showProductDetails(product);
            }
        });
    };

    // ---------- PRODUCT MODAL ----------
    let modalCurrentId = null;
    const showProductDetails = (p) => {
        modalCurrentId = p.id;
        document.getElementById('modal-product-img').src = p.img;
        document.getElementById('modal-product-img').alt = p.name;
        document.getElementById('modal-product-name').textContent = p.name;
        document.getElementById('modal-product-brand').textContent = p.brand;
        document.getElementById('modal-product-category').textContent = cap(p.category);
        document.getElementById('modal-product-price').textContent = money(p.price);
        document.getElementById('modal-product-spec').textContent = p.spec;
        productModal.show();
    };
    document.getElementById('modal-add-to-cart-btn').addEventListener('click', () => {
        if (modalCurrentId != null) {
            addToCart(modalCurrentId);
            productModal.hide();
            new bootstrap.Offcanvas(document.getElementById('cartDrawer')).show();
        }
    });

    // ---------- FILTERS ----------
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function () {
            const category = this.dataset.category;
            const containerId = `${this.dataset.gender}-product-list`;
            const container = document.getElementById(containerId);
            if (!container) return;

            this.closest('.filter-bar').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            container.querySelectorAll('.product-item').forEach(card => {
                const show = category === 'all' || card.dataset.category === category;
                card.style.display = show ? 'block' : 'none';
            });
        });
    });

    // ---------- FEEDBACK FORM ----------
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackSuccess = document.getElementById('feedback-success');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (e) {
            e.preventDefault();
            feedbackForm.reset();
            feedbackSuccess.classList.remove('d-none');
            setTimeout(() => feedbackSuccess.classList.add('d-none'), 4000);
        });
    }

    // ---------- CHECKOUT (demo) ----------
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const total = cartSubtotalEl.textContent;
            checkoutBtn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i> Order Placed!';
            setTimeout(() => {
                cart.length = 0;
                renderCart();
                checkoutBtn.innerHTML = '<i class="bi bi-lock-fill me-2"></i> Checkout';
                bootstrap.Offcanvas.getInstance(document.getElementById('cartDrawer'))?.hide();
                alert(`Thank you! Your order of $${total} has been placed. 🛍️`);
            }, 1200);
        });
    }

    // ---------- SMOOTH SCROLL + MOBILE NAV CLOSE ----------
    document.querySelectorAll('.navbar-nav a[href^="#"], a.footer-brand[href^="#"], .footer a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            const nav = document.getElementById('navbarNav');
            bootstrap.Collapse.getInstance(nav)?.hide();
        });
    });

    // ---------- NAVBAR SCROLL STATE + ACTIVE LINK ----------
    const nav = document.getElementById('mainNav');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.glass-nav .nav-link');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
        backToTop.classList.toggle('show', window.scrollY > 500);

        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    });

    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ---------- SCROLL REVEAL ----------
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ---------- ACCOUNT STATE ----------
    const renderAccount = () => {
        const area = document.getElementById('account-area');
        if (!area || !window.BagBagAuth) return;
        const user = window.BagBagAuth.currentUser();
        if (!user) return; // leave default "Login" link

        const firstName = user.name.split(' ')[0];
        area.classList.add('account-menu', 'dropdown');
        area.innerHTML = `
            <button class="btn btn-cart dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-check"></i>
                <span>${firstName}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li class="dropdown-header">Signed in as<strong>${user.email}</strong></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-bag-check me-2"></i>My Orders</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-heart me-2"></i>Wishlist</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="logout-link"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
            </ul>`;
        document.getElementById('logout-link').addEventListener('click', (e) => {
            e.preventDefault();
            window.BagBagAuth.logout();
        });
    };
    renderAccount();

    // ---------- INIT ----------
    renderProducts('men', 'men-product-list');
    renderProducts('women', 'women-product-list');
    wireProductList('men-product-list');
    wireProductList('women-product-list');
    renderCart();

    new bootstrap.Carousel(document.getElementById('bagCarousel'), { interval: 6000, ride: 'carousel' });
});
