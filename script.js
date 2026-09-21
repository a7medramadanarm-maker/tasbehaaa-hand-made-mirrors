/* =========================================================
   TASBEHAAA FOR HAND MADE MIRRORS
   Main Website JavaScript
   Supabase + Products + Gallery + Cart + WhatsApp
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       SUPABASE
    ===================================================== */

    const SUPABASE_URL =
        "https://nzkgjobzxgvroyzmvvdi.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_8aHDt5z7hV4Ojx69yJx8Fw_HWuFAJYJ";

    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


    /* =====================================================
       SETTINGS
    ===================================================== */

    const WHATSAPP_NUMBER = "201003089153";

    const CATEGORIES = [
        {
            ar: "مرايات",
            en: "Mirrors"
        },
        {
            ar: "صوانى الشبكة",
            en: "Engagement Ring Trays"
        },
        {
            ar: "البصمات",
            en: "Fingerprint Guest Books"
        },
        {
            ar: "بوكيهات الورد",
            en: "Flower Bouquets"
        },
        {
            ar: "مرايات الديكور",
            en: "Decorative Mirrors"
        },
        {
            ar: "مرايات بنترست",
            en: "Pinterest Mirrors"
        },
        {
            ar: "بصمات كتب الكتاب",
            en: "Wedding Fingerprint Guest Books"
        },
        {
            ar: "الهدايا المميزة",
            en: "Special Gifts"
        }
    ];


    /* =====================================================
       STATE
    ===================================================== */

    let products = [];
    let filteredProducts = [];

    let currentCategory = "all";
    let currentSearch = "";

    let cart = [];

    let currentQuickProduct = null;
    let currentQuickImageIndex = 0;


    /* =====================================================
       DOM
    ===================================================== */

    const pageLoader =
        document.querySelector(".page-loader");

    const productsGrid =
        document.getElementById("productsGrid");

    const productsEmpty =
        document.getElementById("productsEmpty");

    const searchEmpty =
        document.getElementById("searchEmpty");

    const filters =
        document.getElementById("filters");

    const cartToggle =
        document.getElementById("cartToggle");

    const cartCount =
        document.getElementById("cartCount");

    const cartSidebar =
        document.getElementById("cartSidebar");

    const cartItems =
        document.getElementById("cartItems");

    const cartEmpty =
        document.getElementById("cartEmpty");

    const cartTotal =
        document.getElementById("cartTotal");

    const checkoutButton =
        document.getElementById("checkoutButton");

    const quickViewOverlay =
        document.getElementById("quickViewOverlay");

    const quickViewContent =
        document.getElementById("quickViewContent");

    const searchInput =
        document.getElementById("searchInput");

    const searchPanel =
        document.getElementById("searchPanel");

    const toast =
        document.getElementById("toast");


    /* =====================================================
       SAFE JSON
    ===================================================== */

    function safeJson(value, fallback = []) {

        if (Array.isArray(value)) {
            return value;
        }

        if (!value) {
            return fallback;
        }

        if (typeof value === "string") {

            try {
                const parsed = JSON.parse(value);

                return Array.isArray(parsed)
                    ? parsed
                    : fallback;

            } catch {
                return fallback;
            }
        }

        return fallback;
    }


    /* =====================================================
       NORMALIZE PRODUCT
    ===================================================== */

    function normalizeProduct(product) {

        let images = safeJson(
            product.image_urls,
            []
        );

        /*
         * Fallback for old products
         * that only have image_url
         */

        if (
            images.length === 0 &&
            product.image_url
        ) {
            images = [product.image_url];
        }

        /*
         * Remove empty / duplicate URLs
         */

        images = [
            ...new Set(
                images
                    .filter(Boolean)
                    .map(url => String(url).trim())
            )
        ];

        const discount =
            Number(product.discount_percent) || 0;

        const price =
            Number(product.price) || 0;

        const finalPrice =
            discount > 0
                ? price - (price * discount / 100)
                : price;

        return {
            ...product,

            name_ar:
                product.name_ar ||
                product.name ||
                "منتج",

            name_en:
                product.name_en ||
                product.name ||
                "Product",

            description_ar:
                product.description_ar ||
                product.description ||
                "",

            description_en:
                product.description_en ||
                product.description ||
                "",

            category_ar:
                product.category_ar ||
                product.category ||
                "",

            category_en:
                product.category_en ||
                "",

            images,

            price,

            discount,

            finalPrice
        };
    }


    /* =====================================================
       LOAD PRODUCTS
    ===================================================== */

    async function loadProducts() {

        try {

            showLoader();

            const {
                data,
                error
            } = await supabaseClient
                .from("products")
                .select("*")
                .order("created_at", {
                    ascending: false
                });

            if (error) {
                throw error;
            }

            products = (data || [])
                .map(normalizeProduct);

            filteredProducts = [...products];

            buildFilters();

            applyFilters();

        } catch (error) {

            console.error(
                "Supabase products error:",
                error
            );

            showToast(
                "حدث خطأ أثناء تحميل المنتجات"
            );

            if (productsGrid) {
                productsGrid.innerHTML = `
                    <div style="
                        grid-column:1/-1;
                        text-align:center;
                        padding:60px 20px;
                    ">
                        <h3 style="
                            font-family:var(--font-display);
                            margin-bottom:10px;
                        ">
                            تعذر تحميل المنتجات
                        </h3>

                        <p style="
                            color:var(--slate);
                        ">
                            حاول تحديث الصفحة مرة أخرى.
                        </p>
                    </div>
                `;
            }

        } finally {

            hideLoader();
        }
    }


    /* =====================================================
       BUILD CATEGORY FILTERS
    ===================================================== */

    function buildFilters() {

        if (!filters) return;

        filters.innerHTML = "";

        const allButton =
            document.createElement("button");

        allButton.type = "button";
        allButton.className =
            "filter-button active";

        allButton.dataset.category = "all";

        allButton.textContent =
            "كل المنتجات";

        filters.appendChild(allButton);

        /*
         * Show only categories that actually
         * contain products.
         */

        CATEGORIES.forEach(category => {

            const hasProducts =
                products.some(product =>
                    getProductCategory(product) === category.ar
                );

            if (!hasProducts) {
                return;
            }

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "filter-button";

            button.dataset.category =
                category.ar;

            button.textContent =
                category.ar;

            filters.appendChild(button);
        });


        filters
            .querySelectorAll(".filter-button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        currentCategory =
                            button.dataset.category;

                        filters
                            .querySelectorAll(
                                ".filter-button"
                            )
                            .forEach(btn =>
                                btn.classList.remove(
                                    "active"
                                )
                            );

                        button.classList.add("active");

                        applyFilters();

                        scrollToProducts();
                    }
                );
            });
    }


    /* =====================================================
       CATEGORY
    ===================================================== */

    function getProductCategory(product) {

        return (
            product.category_ar ||
            product.category ||
            ""
        ).trim();
    }


    /* =====================================================
       FILTER PRODUCTS
    ===================================================== */

    function applyFilters() {

        const search =
            currentSearch
                .trim()
                .toLowerCase();

        filteredProducts =
            products.filter(product => {

                const category =
                    getProductCategory(product);

                const matchesCategory =
                    currentCategory === "all" ||
                    category === currentCategory;

                if (!matchesCategory) {
                    return false;
                }

                if (!search) {
                    return true;
                }

                const searchableText = [
                    product.name_ar,
                    product.name_en,
                    product.description_ar,
                    product.description_en,
                    product.category_ar,
                    product.category_en,
                    product.product_code
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(search);
            });

        renderProducts();
    }


    /* =====================================================
       RENDER PRODUCTS
    ===================================================== */

    function renderProducts() {

        if (!productsGrid) return;

        productsGrid.innerHTML = "";

        if (
            filteredProducts.length === 0
        ) {

            if (currentSearch) {

                if (searchEmpty) {
                    searchEmpty.classList.add("show");
                }

                if (productsEmpty) {
                    productsEmpty.classList.remove("show");
                }

            } else {

                if (productsEmpty) {
                    productsEmpty.classList.add("show");
                }

                if (searchEmpty) {
                    searchEmpty.classList.remove("show");
                }
            }

            return;
        }

        if (productsEmpty) {
            productsEmpty.classList.remove("show");
        }

        if (searchEmpty) {
            searchEmpty.classList.remove("show");
        }


        filteredProducts.forEach(product => {

            const card =
                createProductCard(product);

            productsGrid.appendChild(card);
        });
    }


    /* =====================================================
       PRODUCT CARD
    ===================================================== */

    function createProductCard(product) {

        const article =
            document.createElement("article");

        article.className =
            "product-card";

        article.dataset.id =
            product.id;


        const mainImage =
            product.images[0] ||
            createPlaceholder();


        const category =
            getProductCategory(product);


        const priceHtml =
            createPriceHTML(product);


        const discountBadge =
            product.discount > 0
                ? `
                    <span class="product-badge">
                        خصم ${formatNumber(product.discount)}%
                    </span>
                  `
                : "";


        /*
         * Create every image thumbnail
         */

        const gallery =
            product.images.length > 1
                ? `
                    <div class="product-gallery">
                        ${product.images
                            .map((image, index) => `
                                <button
                                    type="button"
                                    class="product-gallery-thumb"
                                    data-product-id="${escapeAttribute(product.id)}"
                                    data-image-index="${index}"
                                    aria-label="عرض الصورة ${index + 1}"
                                >
                                    <img
                                        src="${escapeAttribute(image)}"
                                        alt="${escapeAttribute(product.name_ar)}"
                                        loading="lazy"
                                    >
                                </button>
                            `)
                            .join("")}
                    </div>
                  `
                : "";


        article.innerHTML = `

            <div class="product-image-wrap">

                <img
                    src="${escapeAttribute(mainImage)}"
                    alt="${escapeAttribute(product.name_ar)}"
                    loading="lazy"
                    data-main-image
                >

                ${discountBadge}

                <div class="product-overlay">

                    <button
                        type="button"
                        data-action="quick-view"
                        data-id="${escapeAttribute(product.id)}"
                    >
                        عرض المنتج
                    </button>

                    <button
                        type="button"
                        data-action="add-cart"
                        data-id="${escapeAttribute(product.id)}"
                    >
                        أضف للسلة
                    </button>

                </div>

            </div>

            <div class="product-category">
                ${escapeHTML(category)}
            </div>

            <h3 class="product-name">
                ${escapeHTML(product.name_ar)}
            </h3>

            ${
                product.description_ar
                    ? `
                        <p class="product-description">
                            ${escapeHTML(
                                product.description_ar
                            )}
                        </p>
                    `
                    : ""
            }

            <div class="product-price">
                ${priceHtml}
            </div>

            ${gallery}

        `;


        /*
         * Quick view
         */

        const quickViewButton =
            article.querySelector(
                '[data-action="quick-view"]'
            );

        if (quickViewButton) {

            quickViewButton.addEventListener(
                "click",
                () => {

                    openQuickView(
                        product
                    );
                }
            );
        }


        /*
         * Add to cart
         */

        const addButton =
            article.querySelector(
                '[data-action="add-cart"]'
            );

        if (addButton) {

            addButton.addEventListener(
                "click",
                () => {

                    addToCart(product);

                }
            );
        }


        /*
         * Gallery thumbnails
         */

        article
            .querySelectorAll(
                ".product-gallery-thumb"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.imageIndex
                            );

                        const image =
                            product.images[index];

                        const mainImage =
                            article.querySelector(
                                "[data-main-image]"
                            );

                        if (
                            mainImage &&
                            image
                        ) {
                            mainImage.src =
                                image;
                        }
                    }
                );
            });


        return article;
    }


    /* =====================================================
       PRICE HTML
    ===================================================== */

    function createPriceHTML(product) {

        if (product.discount <= 0) {

            return `
                <span>
                    ${formatPrice(product.price)}
                </span>
            `;
        }

        return `

            <span>
                ${formatPrice(product.finalPrice)}
            </span>

            <span class="product-old-price">
                ${formatPrice(product.price)}
            </span>

            <span class="product-discount">
                -${formatNumber(product.discount)}%
            </span>

        `;
    }


    /* =====================================================
       QUICK VIEW
    ===================================================== */

    function openQuickView(product) {

        if (
            !quickViewOverlay ||
            !quickViewContent
        ) {
            return;
        }

        currentQuickProduct =
            product;

        currentQuickImageIndex = 0;

        renderQuickView();

        quickViewOverlay.classList.add(
            "active"
        );

        document.body.classList.add(
            "no-scroll"
        );
    }


    function renderQuickView() {

        if (
            !currentQuickProduct ||
            !quickViewContent
        ) {
            return;
        }

        const product =
            currentQuickProduct;

        const images =
            product.images.length
                ? product.images
                : [createPlaceholder()];


        const currentImage =
            images[
                currentQuickImageIndex
            ] || images[0];


        quickViewContent.innerHTML = `

            <div class="quick-view-gallery">

                <div class="quick-view-main-image">

                    <img
                        src="${escapeAttribute(currentImage)}"
                        alt="${escapeAttribute(product.name_ar)}"
                        id="quickViewMainImage"
                    >

                </div>

                ${
                    images.length > 1
                        ? `
                            <div class="quick-view-thumbs">

                                ${images
                                    .map(
                                        (
                                            image,
                                            index
                                        ) => `

                                        <button
                                            type="button"
                                            class="quick-view-thumb ${
                                                index ===
                                                currentQuickImageIndex
                                                    ? "active"
                                                    : ""
                                            }"
                                            data-quick-image="${index}"
                                        >

                                            <img
                                                src="${escapeAttribute(image)}"
                                                alt="صورة ${
                                                    index + 1
                                                }"
                                            >

                                        </button>
                                    `
                                    )
                                    .join("")}

                            </div>
                          `
                        : ""
                }

            </div>


            <div class="quick-view-info">

                <div class="quick-view-category">
                    ${escapeHTML(
                        getProductCategory(product)
                    )}
                </div>

                <h2 class="quick-view-title">
                    ${escapeHTML(
                        product.name_ar
                    )}
                </h2>

                ${
                    product.description_ar
                        ? `
                            <p class="quick-view-description">
                                ${escapeHTML(
                                    product.description_ar
                                )}
                            </p>
                          `
                        : ""
                }

                <div class="quick-view-price">
                    ${createPriceHTML(product)}
                </div>

                ${
                    product.product_code
                        ? `
                            <div style="
                                color:var(--ash);
                                font-size:11px;
                                margin-bottom:20px;
                            ">
                                كود المنتج:
                                ${escapeHTML(
                                    product.product_code
                                )}
                            </div>
                          `
                        : ""
                }

                <button
                    type="button"
                    class="btn btn-primary"
                    id="quickAddToCart"
                >
                    أضف إلى السلة
                </button>

            </div>

        `;


        /*
         * Image switching
         */

        quickViewContent
            .querySelectorAll(
                "[data-quick-image]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        currentQuickImageIndex =
                            Number(
                                button.dataset
                                    .quickImage
                            );

                        renderQuickView();
                    }
                );
            });


        /*
         * Add to cart
         */

        const addButton =
            document.getElementById(
                "quickAddToCart"
            );

        if (addButton) {

            addButton.addEventListener(
                "click",
                () => {

                    addToCart(product);

                    closeQuickView();
                }
            );
        }
    }


    function closeQuickView() {

        if (!quickViewOverlay) {
            return;
        }

        quickViewOverlay.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "no-scroll"
        );

        currentQuickProduct = null;
    }


    /* =====================================================
       QUICK VIEW CLOSE
    ===================================================== */

    if (quickViewOverlay) {

        quickViewOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    quickViewOverlay
                ) {
                    closeQuickView();
                }
            }
        );
    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeQuickView();

                closeCart();
            }
        }
    );


    /* =====================================================
       CART
    ===================================================== */

    function loadCart() {

        try {

            const saved =
                localStorage.getItem(
                    "tasbehaaa_cart"
                );

            cart =
                saved
                    ? JSON.parse(saved)
                    : [];

            if (!Array.isArray(cart)) {
                cart = [];
            }

        } catch {

            cart = [];
        }

        renderCart();
    }


    function saveCart() {

        localStorage.setItem(
            "tasbehaaa_cart",
            JSON.stringify(cart)
        );

        renderCart();
    }


    function addToCart(product) {

        if (!product) return;

        const existing =
            cart.find(
                item =>
                    String(item.id) ===
                    String(product.id)
            );


        if (existing) {

            existing.quantity += 1;

        } else {

            cart.push({
                id: product.id,

                name:
                    product.name_ar,

                price:
                    product.finalPrice,

                image:
                    product.images[0] ||
                    "",

                quantity: 1
            });
        }


        saveCart();

        showToast(
            "تمت إضافة المنتج إلى السلة"
        );


        openCart();
    }


    function removeFromCart(id) {

        cart =
            cart.filter(
                item =>
                    String(item.id) !==
                    String(id)
            );

        saveCart();
    }


    function changeQuantity(id, amount) {

        const item =
            cart.find(
                item =>
                    String(item.id) ===
                    String(id)
            );

        if (!item) return;

        item.quantity += amount;

        if (item.quantity <= 0) {

            removeFromCart(id);

            return;
        }

        saveCart();
    }


    /* =====================================================
       RENDER CART
    ===================================================== */

    function renderCart() {

        if (
            !cartItems ||
            !cartCount ||
            !cartTotal
        ) {
            return;
        }


        const totalQuantity =
            cart.reduce(
                (sum, item) =>
                    sum +
                    Number(item.quantity || 0),
                0
            );


        const totalPrice =
            cart.reduce(
                (sum, item) =>
                    sum +
                    (
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                    ),
                0
            );


        cartCount.textContent =
            totalQuantity;


        cartTotal.textContent =
            formatPrice(totalPrice);


        if (cart.length === 0) {

            cartItems.innerHTML = "";

            if (cartEmpty) {
                cartEmpty.style.display =
                    "block";
            }

            return;
        }


        if (cartEmpty) {
            cartEmpty.style.display =
                "none";
        }


        cartItems.innerHTML =
            cart
                .map(item => `

                    <div class="cart-item">

                        <div class="cart-item-image">

                            <img
                                src="${escapeAttribute(
                                    item.image ||
                                    createPlaceholder()
                                )}"
                                alt="${escapeAttribute(
                                    item.name
                                )}"
                            >

                        </div>


                        <div>

                            <div class="cart-item-name">
                                ${escapeHTML(
                                    item.name
                                )}
                            </div>

                            <div class="cart-item-price">
                                ${formatPrice(
                                    item.price
                                )}
                            </div>


                            <div style="
                                display:flex;
                                align-items:center;
                                gap:8px;
                                margin-top:8px;
                            ">

                                <button
                                    type="button"
                                    class="icon-button"
                                    data-cart-minus="${escapeAttribute(
                                        item.id
                                    )}"
                                >
                                    −
                                </button>

                                <span style="
                                    font-size:12px;
                                    min-width:20px;
                                    text-align:center;
                                ">
                                    ${item.quantity}
                                </span>

                                <button
                                    type="button"
                                    class="icon-button"
                                    data-cart-plus="${escapeAttribute(
                                        item.id
                                    )}"
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        <button
                            type="button"
                            class="cart-item-remove"
                            data-cart-remove="${escapeAttribute(
                                item.id
                            )}"
                        >
                            حذف
                        </button>

                    </div>

                `)
                .join("");


        cartItems
            .querySelectorAll(
                "[data-cart-remove]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        removeFromCart(
                            button.dataset.cartRemove
                        );
                    }
                );
            });


        cartItems
            .querySelectorAll(
                "[data-cart-plus]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        changeQuantity(
                            button.dataset.cartPlus,
                            1
                        );
                    }
                );
            });


        cartItems
            .querySelectorAll(
                "[data-cart-minus]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        changeQuantity(
                            button.dataset.cartMinus,
                            -1
                        );
                    }
                );
            });
    }


    /* =====================================================
       CART OPEN / CLOSE
    ===================================================== */

    function openCart() {

        if (!cartSidebar) return;

        cartSidebar.classList.add(
            "active"
        );

        document.body.classList.add(
            "no-scroll"
        );

        createCartOverlay();
    }


    function closeCart() {

        if (!cartSidebar) return;

        cartSidebar.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "no-scroll"
        );

        const overlay =
            document.querySelector(
                ".cart-overlay"
            );

        if (overlay) {

            overlay.classList.remove(
                "active"
            );
        }
    }


    function createCartOverlay() {

        let overlay =
            document.querySelector(
                ".cart-overlay"
            );

        if (!overlay) {

            overlay =
                document.createElement(
                    "div"
                );

            overlay.className =
                "cart-overlay";

            document.body.appendChild(
                overlay
            );


            overlay.addEventListener(
                "click",
                closeCart
            );
        }


        requestAnimationFrame(() => {

            overlay.classList.add(
                "active"
            );
        });
    }


    if (cartToggle) {

        cartToggle.addEventListener(
            "click",
            () => {

                if (
                    cartSidebar &&
                    cartSidebar.classList.contains(
                        "active"
                    )
                ) {

                    closeCart();

                } else {

                    openCart();
                }
            }
        );
    }


    /* =====================================================
       WHATSAPP CHECKOUT
    ===================================================== */

    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            checkoutWhatsApp
        );
    }


    function checkoutWhatsApp() {

        if (cart.length === 0) {

            showToast(
                "السلة فارغة"
            );

            return;
        }


        let message =
            "مرحباً Tasbehaaa For Hand Made Mirrors 🌸\n\n";

        message +=
            "أرغب في طلب المنتجات التالية:\n\n";


        cart.forEach((item, index) => {

            message +=
                `${index + 1}. ${item.name}\n`;

            message +=
                `الكمية: ${item.quantity}\n`;

            message +=
                `السعر: ${formatPrice(
                    item.price
                )}\n\n`;
        });


        const total =
            cart.reduce(
                (sum, item) =>
                    sum +
                    Number(item.price || 0) *
                    Number(item.quantity || 0),
                0
            );


        message +=
            `الإجمالي: ${formatPrice(total)}\n\n`;

        message +=
            "من فضلكم أرسلوا لي تفاصيل تأكيد الطلب.";


        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                message
            )}`;


        window.open(
            whatsappURL,
            "_blank"
        );
    }


    /* =====================================================
       SEARCH
    ===================================================== */

    function setupSearch() {

        if (!searchInput) return;

        searchInput.addEventListener(
            "input",
            () => {

                currentSearch =
                    searchInput.value;

                applyFilters();
            }
        );
    }


    /* =====================================================
       SEARCH TOGGLE
    ===================================================== */

    const searchToggle =
        document.getElementById(
            "searchToggle"
        );


    if (
        searchToggle &&
        searchPanel
    ) {

        searchToggle.addEventListener(
            "click",
            () => {

                searchPanel.classList.toggle(
                    "active"
                );

                if (
                    searchPanel.classList.contains(
                        "active"
                    )
                ) {

                    setTimeout(
                        () => {
                            searchInput?.focus();
                        },
                        100
                    );
                }
            }
        );
    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );

    const navbar =
        document.getElementById(
            "navbar"
        );


    if (
        menuToggle &&
        navbar
    ) {

        menuToggle.addEventListener(
            "click",
            () => {

                navbar.classList.toggle(
                    "active"
                );

                menuToggle.classList.toggle(
                    "active"
                );
            }
        );


        navbar
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        navbar.classList.remove(
                            "active"
                        );

                        menuToggle.classList.remove(
                            "active"
                        );
                    }
                );
            });
    }


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    function scrollToProducts() {

        const section =
            document.getElementById(
                "collection"
            );

        if (!section) return;

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    /* =====================================================
       TOAST
    ===================================================== */

    let toastTimeout = null;


    function showToast(message) {

        if (!toast) return;

        toast.textContent =
            message;

        toast.classList.add(
            "show"
        );


        clearTimeout(
            toastTimeout
        );


        toastTimeout =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                2800
            );
    }


    /* =====================================================
       LOADER
    ===================================================== */

    function showLoader() {

        if (!pageLoader) return;

        pageLoader.classList.remove(
            "hidden"
        );
    }


    function hideLoader() {

        if (!pageLoader) return;

        setTimeout(
            () => {

                pageLoader.classList.add(
                    "hidden"
                );

            },
            250
        );
    }


    /* =====================================================
       FORMAT PRICE
    ===================================================== */

    function formatPrice(price) {

        const number =
            Number(price) || 0;

        return new Intl.NumberFormat(
            "ar-EG",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        ).format(number) + " جنيه";
    }


    /* =====================================================
       FORMAT NUMBER
    ===================================================== */

    function formatNumber(number) {

        return new Intl.NumberFormat(
            "ar-EG",
            {
                maximumFractionDigits: 2
            }
        ).format(
            Number(number) || 0
        );
    }


    /* =====================================================
       PLACEHOLDER
    ===================================================== */

    function createPlaceholder() {

        return `
            data:image/svg+xml;charset=UTF-8,
            ${encodeURIComponent(`
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="800"
                    height="1000"
                    viewBox="0 0 800 1000"
                >
                    <rect
                        width="800"
                        height="1000"
                        fill="#fefaef"
                    />

                    <text
                        x="400"
                        y="500"
                        text-anchor="middle"
                        fill="#a8a5a0"
                        font-size="32"
                        font-family="Arial"
                    >
                        Tasbehaaa
                    </text>
                </svg>
            `)}
        `;
    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    function escapeAttribute(value) {

        return escapeHTML(value);
    }


    /* =====================================================
       LAZY IMAGE ERROR HANDLING
    ===================================================== */

    document.addEventListener(
        "error",
        event => {

            const target =
                event.target;

            if (
                target &&
                target.tagName === "IMG"
            ) {

                if (
                    !target.dataset.fallback
                ) {

                    target.dataset.fallback =
                        "true";

                    target.src =
                        createPlaceholder();
                }
            }

        },
        true
    );


    /* =====================================================
       INIT
    ===================================================== */

    setupSearch();

    loadCart();

    loadProducts();

});
