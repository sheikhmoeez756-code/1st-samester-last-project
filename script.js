// Custom JavaScript for BagBag Website (script.js)

document.addEventListener('DOMContentLoaded', function () {

    // --- GLOBAL STATE ---
    let cartItems = 0;
    const cartCountElement = document.getElementById('cart-count');
    // Initialize the Bootstrap Modal component
    const productDetailModal = new bootstrap.Modal(document.getElementById('productDetailModal'));
    
    // --- SAMPLE PRODUCT DATA ---
    const products = [
        // Men's Products
        { id: 101, name: 'Urban Explorer Sling', category: 'messenger', gender: 'men', price: 55.00, brand: 'Apex', spec: 'Cross-body design, water-resistant.', img: './img/menproducts/Louis Backpack.jpeg' },
        { id: 102, name: 'Travel Pro BackPack', category: 'backpacks', gender: 'men', price: 99.00, brand: 'DurableCo', spec: 'Water-resistant fabric, hidden pockets, 30L capacity.', img: '/img/menproducts/Lo zaino monospalla avenue nm, realizzato in tela….jpeg' },
        { id: 103, name: 'Professional Briefcase', category: 'bags', gender: 'men', price: 210.00, brand: 'Acme', spec: 'Premium leather, 17" laptop compartment.', img: '/img/menproducts/Luxury travel beautifully blends elegance with….jpeg' },
        { id: 104, name: 'Workout Gym Duffel', category: 'bags', gender: 'men', price: 45.00, brand: 'Fitness', spec: 'Ventilated shoe pocket, large capacity.', img: '/img/menproducts/Something urban and funky for the designer junkie_….jpeg' },

        // Women's Products
        { id: 201, name: 'Classic Business Tote', category: 'totes', gender: 'women', price: 120.50, brand: 'Vogue', spec: 'Vegan leather, 14" laptop space.', img: '/img/womenproducts/Louis Vuitton Millefeuille Bag _ Bragmybag.jpeg' },
        { id: 202, name: 'Everyday Elegant Handbag', category: 'handbags', gender: 'women', price: 110.00, brand: 'Chic Bags', spec: 'Secure zip top closure, metal feet.', img: '/img/womenproducts/Louis Vuitton Beaubourg Bag _ Bragmybag.jpeg' },
        { id: 203, name: 'Mini Crossbody Sparkle', category: 'handbags', gender: 'women', price: 45.99, brand: 'Sparkle', spec: 'Small size, adjustable strap, bright colors.', img: '/img/womenproducts/Louis Vuitton Victoire Bag _ Bragmybag.jpeg' },
        { id: 204, name: 'Weekend Travel Backpack', category: 'backpacks', gender: 'women', price: 79.99, brand: 'Explorer', spec: 'Anti-theft zipper, lightweight material.', img: '/img/womenproducts/photo-1606522754091-a3bbf9ad4cb3.jpg' },
    ];
    
    // --- UTILITY FUNCTIONS ---

    const updateCartDisplay = () => {
        if (cartCountElement) {
            cartCountElement.textContent = cartItems;
            // Show/hide badge if cart is empty
            cartCountElement.style.display = cartItems > 0 ? 'inline-block' : 'none';
        }
    };
    
    const addToCart = (productId) => {
        cartItems++;
        updateCartDisplay();
        console.log(`Product ID ${productId} successfully added to cart. Total items: ${cartItems}`);
    };
    
    const showProductDetails = (product) => {
        // Populate modal with product data
        document.getElementById('modal-product-img').src = product.img;
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-product-brand').textContent = `Brand: ${product.brand}`;
        document.getElementById('modal-product-category').textContent = `Category: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}`;
        document.getElementById('modal-product-price').textContent = product.price.toFixed(2);
        document.getElementById('modal-product-spec').textContent = product.spec;

        // Set up the modal's Add to Cart button
        const modalCartBtn = document.getElementById('modal-add-to-cart-btn');
        // Clear old listener by cloning the node
        modalCartBtn.replaceWith(modalCartBtn.cloneNode(true));
        const newModalCartBtn = document.getElementById('modal-add-to-cart-btn');
        
        // Add new listener to the new button instance
        newModalCartBtn.addEventListener('click', () => {
            addToCart(product.id);
            alert(`${product.name} added to cart!`);
            productDetailModal.hide(); // Hide modal after adding
        });

        productDetailModal.show();
    };

    // --- CORE CARD RENDERING FUNCTION ---
    const renderProducts = (gender, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        const genderProducts = products.filter(p => p.gender === gender);

        genderProducts.forEach(product => {
            const cardHTML = `
                <div class="col product-item" data-category="${product.category}" data-product-id="${product.id}">
                    <div class="card h-100 product-card shadow-sm clickable-card">
                        <img src="${product.img}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text text-muted mb-2">${product.category.charAt(0).toUpperCase() + product.category.slice(1)} | Brand: ${product.brand}</p>
                            <p class="card-text fw-bold fs-4 text-primary">$${product.price.toFixed(2)}</p>
                            <p class="card-text small">**Specification:** ${product.spec}</p>
                            <button class="btn btn-outline-primary mt-auto add-to-cart-btn" data-product-id="${product.id}">Quick Add</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });

        // Attach listeners for both Quick Add and Card Click
        attachListeners(containerId);
    };

    // --- LISTENER ATTACHMENT ---
    const attachListeners = (containerId) => {
        const container = document.getElementById(containerId);

        // 1. Quick Add Button (Immediate add to cart from the main list)
        container.querySelectorAll('.add-to-cart-btn').forEach(button => {
            // Remove previous listeners (essential for dynamic content)
            button.replaceWith(button.cloneNode(true));
        });
        document.querySelectorAll(`#${containerId} .add-to-cart-btn`).forEach(button => {
             button.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevents card click event from firing
                const productId = parseInt(this.getAttribute('data-product-id'));
                addToCart(productId);

                // Visual feedback
                this.textContent = 'Added!';
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-success');

                setTimeout(() => {
                    this.textContent = 'Quick Add';
                    this.classList.remove('btn-success');
                    this.classList.add('btn-outline-primary');
                }, 1500);
            });
        });

        // 2. Card Click (Open Modal)
        container.querySelectorAll('.clickable-card').forEach(card => {
            card.addEventListener('click', function() {
                const productId = parseInt(this.closest('.product-item').getAttribute('data-product-id'));
                const product = products.find(p => p.id === productId);
                if (product) {
                    showProductDetails(product);
                }
            });
        });
    };
    
    // --- FILTERING LOGIC ---
    const attachFilterListeners = () => {
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', function () {
                const gender = this.getAttribute('data-gender');
                const category = this.getAttribute('data-category');
                const containerId = `${gender}-product-list`;
                const container = document.getElementById(containerId);

                if (!container) return;

                // Update active button state
                const parentGroup = this.closest('.btn-group');
                parentGroup.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter the displayed cards by category
                container.querySelectorAll('.product-item').forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    if (category === 'all' || cardCategory === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    };

    // --- NAVIGATION FIX (Shop By Category) ---
    const fixNavLinks = () => {
        document.querySelectorAll('.navbar-nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                // Only prevent default if it's NOT a dropdown toggle itself
                if (!this.classList.contains('dropdown-toggle')) {
                    e.preventDefault();
                    
                    // Collapse the navbar menu on mobile after click
                    const navbarCollapse = document.getElementById('navbarNav');
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                         bsCollapse.hide();
                    }

                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    };


    // --- FEEDBACK FORM HANDLER (Unchanged) ---
    const feedbackFormHandler = () => {
        const feedbackForm = document.getElementById('feedbackForm');
        const feedbackSuccess = document.getElementById('feedback-success');

        if (feedbackForm) {
            feedbackForm.addEventListener('submit', function (e) {
                e.preventDefault();
                setTimeout(() => {
                    feedbackForm.reset();
                    feedbackSuccess.classList.remove('d-none');
                    setTimeout(() => {
                        feedbackSuccess.classList.add('d-none');
                    }, 4000);
                    alert('Feedback Submitted! Thank you.');
                }, 500);
            });
        }
    }


    // --- INITIALIZE PAGE ---

    // 1. Render initial product lists and attach card/button listeners
    renderProducts('men', 'men-product-list');
    renderProducts('women', 'women-product-list');

    // 2. Attach filter event listeners
    attachFilterListeners();
    
    // 3. Fix Navigation Links (Dropdown category links)
    fixNavLinks();

    // 4. Initialize Bootstrap Carousel
    const bagCarousel = document.getElementById('bagCarousel');
    if (bagCarousel) {
        new bootstrap.Carousel(bagCarousel, {
            interval: 5000,
            wrap: true
        });
    }

    // 5. Initialize Feedback Form
    feedbackFormHandler();
    
    // 6. Initialize Cart Display
    updateCartDisplay();
});