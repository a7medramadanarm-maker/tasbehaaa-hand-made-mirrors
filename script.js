/* =====================================================
   TASBEHAAA FOR HAND MADE MIRRORS
   MAIN WEBSITE SCRIPT
===================================================== */


const SUPABASE_URL =
    "https://nzkgjobzxgvroyzmvvdi.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_8aHDt5z7hV4Ojx69yJx8Fw_HWuFAJYJ";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =====================================================
   STATE
===================================================== */

let products = [];

let filteredProducts = [];

let cart = [];

let currentLanguage =
    localStorage.getItem("tasbehaaa_language") || "ar";

let currentModalProduct = null;

let currentModalImageIndex = 0;


/* =====================================================
   TRANSLATIONS
===================================================== */

const translations = {

    ar: {

        navHome: "الرئيسية",
        navProducts: "المنتجات",
        navAbout: "من نحن",
        navCustom: "طلب خاص",
        navContact: "تواصل معنا",

        heroEyebrow: "HANDMADE WITH LOVE",

        heroTitle:
            "تفاصيل صغيرة<br>تصنع ذكرى كبيرة",

        heroText:
            "منتجات يدوية مميزة للخطوبة والفرح، مصممة خصيصًا لتكون جزءًا من أجمل لحظاتك.",

        shopNow:
            "اكتشف المنتجات",

        customOrder:
            "اطلب تصميمك الخاص",

        feature1Title:
            "Handmade",

        feature1Text:
            "مصنوع بحب وعناية",

        feature2Title:
            "Custom Design",

        feature2Text:
            "تصميم حسب ذوقك",

        feature3Title:
            "Premium Quality",

        feature3Text:
            "خامات وجودة مميزة",

        feature4Title:
            "Wedding Collection",

        feature4Text:
            "للفرح والخطوبة",

        productsEyebrow:
            "OUR COLLECTION",

        productsTitle:
            "منتجاتنا",

        productsText:
            "اختاري القطعة التي تناسب يومك المميز.",

        searchPlaceholder:
            "ابحث باسم المنتج أو الكود...",

        allCategories:
            "كل التصنيفات",

        loading:
            "جاري تحميل المنتجات...",

        noProductsTitle:
            "لا توجد منتجات",

        noProductsText:
            "لم نجد منتجًا مطابقًا لبحثك.",

        aboutEyebrow:
            "ABOUT TASBEHAAA",

        aboutTitle:
            "نصنع تفاصيل<br>تستحق أن تُذكر",

        aboutText1:
            "Tasbehaaa For Hand Made Mirrors علامة تهتم بتقديم منتجات يدوية مميزة لمناسبات الخطوبة والفرح.",

        aboutText2:
            "من المرايات والصواني إلى البصمات والورد والتطريز، كل قطعة يتم تنفيذها بعناية لتكون ذكرى جميلة تدوم.",

        customEyebrow:
            "CUSTOM ORDER",

        customTitle:
            "عندك فكرة؟<br>خلينا ننفذها معًا.",

        customText:
            "ابعتلنا فكرتك أو صورة التصميم اللي في بالك، ونساعدك نحولها لقطعة مميزة تناسب مناسبتك.",

        contactEyebrow:
            "GET IN TOUCH",

        contactTitle:
            "تواصل معنا",

        cartTitle:
            "سلة المشتريات",

        cartTotal:
            "الإجمالي",

        checkout:
            "إتمام الطلب عبر WhatsApp",

        addToCart:
            "أضف إلى السلة",

        added:
            "تمت إضافة المنتج إلى السلة",

        emptyCart:
            "السلة فارغة",

        remove:
            "حذف",

        quantity:
            "الكمية",

        productCode:
            "كود المنتج",

        noImage:
            "لا توجد صورة",

        loadingError:
            "حدث خطأ أثناء تحميل المنتجات."

    },


    en: {

        navHome: "Home",
        navProducts: "Products",
        navAbout: "About",
        navCustom: "Custom Order",
        navContact: "Contact",

        heroEyebrow:
            "HANDMADE WITH LOVE",

        heroTitle:
            "Small Details<br>Make Big Memories",

        heroText:
            "Unique handmade products for weddings and engagements, specially created to become part of your most beautiful moments.",

        shopNow:
            "Explore Products",

        customOrder:
            "Request Custom Design",

        feature1Title:
            "Handmade",

        feature1Text:
            "Made with love and care",

        feature2Title:
            "Custom Design",

        feature2Text:
            "Designed for your taste",

        feature3Title:
            "Premium Quality",

        feature3Text:
            "Premium materials and quality",

        feature4Title:
            "Wedding Collection",

        feature4Text:
            "For weddings & engagements",

        productsEyebrow:
            "OUR COLLECTION",

        productsTitle:
            "Our Products",

        productsText:
            "Choose the piece that matches your special day.",

        searchPlaceholder:
            "Search by product name or code...",

        allCategories:
            "All Categories",

        loading:
            "Loading products...",

        noProductsTitle:
            "No Products",

        noProductsText:
            "We couldn't find a matching product.",

        aboutEyebrow:
            "ABOUT TASBEHAAA",

        aboutTitle:
            "We Create Details<br>Worth Remembering",

        aboutText1:
            "Tasbehaaa For Hand Made Mirrors creates unique handmade products specially made for weddings and engagements.",

        aboutText2:
            "From mirrors and trays to fingerprints, flowers and embroidery, every piece is carefully made to become a beautiful lasting memory.",

        customEyebrow:
            "CUSTOM ORDER",

        customTitle:
            "Have an Idea?<br>Let's Create It Together.",

        customText:
            "Send us your idea or a reference photo and we will help turn it into a unique piece for your special occasion.",

        contactEyebrow:
            "GET IN TOUCH",

        contactTitle:
            "Contact Us",

        cartTitle:
            "Shopping Cart",

        cartTotal:
            "Total",

        checkout:
            "Order via WhatsApp",

        addToCart:
            "Add to Cart",

        added:
            "Product added to cart",

        emptyCart:
            "Your cart is empty",

        remove:
            "Remove",

        quantity:
            "Quantity",

        productCode:
            "Product Code",

        noImage:
            "No Image",

        loadingError:
            "Error loading products."

    }

};


/* =====================================================
   DOM
===================================================== */

const productsContainer =
    document.getElementById(
        "productsContainer"
    );


const noProducts =
    document.getElementById(
        "noProducts"
    );


const productSearch =
    document.getElementById(
        "productSearch"
    );


const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );


const languageToggle =
    document.getElementById(
        "languageToggle"
    );


const cartButton =
    document.getElementById(
        "cartButton"
    );


const cartSidebar =
    document.getElementById(
        "cartSidebar"
    );


const cartOverlay =
    document.getElementById(
        "cartOverlay"
    );


const closeCart =
    document.getElementById(
        "closeCart"
    );


const cartItems =
    document.getElementById(
        "cartItems"
    );


const cartCount =
    document.getElementById(
        "cartCount"
    );


const cartTotal =
    document.getElementById(
        "cartTotal"
    );


const checkoutButton =
    document.getElementById(
        "checkoutButton"
    );


const productModal =
    document.getElementById(
        "productModal"
    );


const closeModal =
    document.getElementById(
        "closeModal"
    );


const modalMainImage =
    document.getElementById(
        "modalMainImage"
    );


const modalPrev =
    document.getElementById(
        "modalPrev"
    );


const modalNext =
    document.getElementById(
        "modalNext"
    );


const modalThumbnails =
    document.getElementById(
        "modalThumbnails"
    );


const modalDiscount =
    document.getElementById(
        "modalDiscount"
    );


const modalCode =
    document.getElementById(
        "modalCode"
    );


const modalName =
    document.getElementById(
        "modalName"
    );


const modalCategory =
    document.getElementById(
        "modalCategory"
    );


const modalOldPrice =
    document.getElementById(
        "modalOldPrice"
    );


const modalPrice =
    document.getElementById(
        "modalPrice"
    );


const modalDescription =
    document.getElementById(
        "modalDescription"
    );


const modalAddToCart =
    document.getElementById(
        "modalAddToCart"
    );


/* =====================================================
   INIT
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        loadCart();

        applyLanguage();

        setupEvents();

        await loadProducts();

    }
);


/* =====================================================
   EVENTS
===================================================== */

function setupEvents() {

    productSearch.addEventListener(
        "input",
        filterProducts
    );


    categoryFilter.addEventListener(
        "change",
        filterProducts
    );


    languageToggle.addEventListener(
        "click",
        toggleLanguage
    );


    cartButton.addEventListener(
        "click",
        openCart
    );


    closeCart.addEventListener(
        "click",
        closeCartSidebar
    );


    cartOverlay.addEventListener(
        "click",
        closeCartSidebar
    );


    closeModal.addEventListener(
        "click",
        closeProductModal
    );


    modalPrev.addEventListener(
        "click",
        function() {

            changeModalImage(-1);

        }
    );


    modalNext.addEventListener(
        "click",
        function() {

            changeModalImage(1);

        }
    );


    modalAddToCart.addEventListener(
        "click",
        function() {

            if (!currentModalProduct) {
                return;
            }

            addToCart(
                currentModalProduct
            );

            closeProductModal();

        }
    );


    checkoutButton.addEventListener(
        "click",
        checkoutWhatsApp
    );


    document
    .getElementById("menuButton")
    .addEventListener(
        "click",
        function() {

            document
            .getElementById("mobileMenu")
            .classList.toggle("open");

        }
    );


    document
    .querySelectorAll(".mobile-menu a")
    .forEach(link => {

        link.addEventListener(
            "click",
            function() {

                document
                .getElementById("mobileMenu")
                .classList.remove("open");

            }
        );

    });


    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape"
            ) {

                closeProductModal();

                closeCartSidebar();

            }

        }
    );

}


/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {

    productsContainer.innerHTML = `

        <div class="products-loading">

            <div class="loader"></div>

            <p>
                ${
                    translations[currentLanguage]
                    .loading
                }
            </p>

        </div>

    `;


    const {
        data,
        error
    } =
    await supabaseClient
        .from("products")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Supabase Error:",
            error
        );


        productsContainer.innerHTML = `

            <div class="products-error">

                <h3>
                    ${
                        translations[currentLanguage]
                        .loadingError
                    }
                </h3>

                <button
                    onclick="loadProducts()"
                >
                    Retry
                </button>

            </div>

        `;

        return;

    }


    products =
        data || [];


    filteredProducts =
        [...products];


    buildCategories();

    renderProducts();

}


/* =====================================================
   BUILD CATEGORIES DYNAMICALLY
===================================================== */

function buildCategories() {

    const categories =
        [
            ...new Set(
                products
                .map(
                    product =>
                        product.category
                )
                .filter(Boolean)
            )
        ];


    categoryFilter.innerHTML = `

        <option value="">
            ${
                translations[currentLanguage]
                .allCategories
            }
        </option>

    `;


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category;

            option.textContent =
                category;

            categoryFilter.appendChild(
                option
            );

        }
    );

}


/* =====================================================
   FILTER
===================================================== */

function filterProducts() {

    const search =
        productSearch.value
        .trim()
        .toLowerCase();


    const selectedCategory =
        categoryFilter.value;


    filteredProducts =
        products.filter(
            product => {

                const searchableText =
                    [

                        product.product_code,

                        product.name,

                        product.name_ar,

                        product.name_en,

                        product.description,

                        product.description_ar,

                        product.description_en,

                        product.category

                    ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchableText.includes(
                        search
                    );


                const matchesCategory =
                    !selectedCategory ||
                    product.category ===
                        selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    renderProducts();

}


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts() {

    if (!filteredProducts.length) {

        productsContainer.innerHTML = "";

        noProducts.classList.remove(
            "hidden"
        );

        return;

    }


    noProducts.classList.add(
        "hidden"
    );


    productsContainer.innerHTML =
        filteredProducts
        .map(
            product =>
                createProductCard(
                    product
                )
        )
        .join("");


    attachProductEvents();

}


/* =====================================================
   PRODUCT CARD
===================================================== */

function createProductCard(product) {

    const images =
        getProductImages(
            product
        );


    const firstImage =
        images.length
        ? images[0]
        : "";


    const price =
        Number(
            product.price
        ) || 0;


    const discount =
        Number(
            product.discount_percent
        ) || 0;


    const finalPrice =
        calculateFinalPrice(
            price,
            discount
        );


    const name =
        getProductName(
            product
        );


    const description =
        getProductDescription(
            product
        );


    return `

        <article
            class="product-card"
            data-product-id="${product.id}"
        >

            <div class="product-card-image">

                ${
                    firstImage
                    ?

                    `

                    <img
                        src="${escapeAttribute(firstImage)}"
                        alt="${escapeAttribute(name)}"
                        loading="lazy"
                    >

                    `

                    :

                    `

                    <div class="card-no-image">
                        ${
                            translations[
                                currentLanguage
                            ].noImage
                        }
                    </div>

                    `
                }


                ${
                    discount > 0

                    ?

                    `

                    <span class="discount-badge">

                        -${formatNumber(discount)}%

                    </span>

                    `

                    :

                    ""
                }


                ${
                    images.length > 1

                    ?

                    `

                    <span class="image-count">

                        ${images.length} 📷

                    </span>

                    `

                    :

                    ""
                }


                <button
                    class="quick-view-button"
                    data-action="view"
                    data-id="${product.id}"
                >
                    👁
                </button>

            </div>


            <div class="product-card-body">

                <span class="product-code-badge">

                    ${escapeHtml(
                        product.product_code ||
                        ""
                    )}

                </span>


                <h3 class="product-card-title">

                    ${escapeHtml(name)}

                </h3>


                <p class="product-card-category">

                    ${escapeHtml(
                        product.category ||
                        ""
                    )}

                </p>


                ${
                    description

                    ?

                    `

                    <p class="product-card-description">

                        ${escapeHtml(
                            truncateText(
                                description,
                                85
                            )
                        )}

                    </p>

                    `

                    :

                    ""
                }


                <div class="product-price-row">

                    ${
                        discount > 0

                        ?

                        `

                        <span class="old-price">

                            ${formatPrice(price)}

                        </span>

                        `

                        :

                        ""
                    }


                    <strong class="new-price">

                        ${formatPrice(finalPrice)}

                    </strong>

                </div>


                <button
                    class="add-cart-button"
                    data-action="cart"
                    data-id="${product.id}"
                >

                    🛒

                    ${
                        translations[
                            currentLanguage
                        ].addToCart
                    }

                </button>

            </div>

        </article>

    `;

}


/* =====================================================
   ATTACH PRODUCT EVENTS
===================================================== */

function attachProductEvents() {

    document
    .querySelectorAll(
        "[data-action='view']"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                const product =
                    findProduct(
                        this.dataset.id
                    );

                if (product) {

                    openProductModal(
                        product
                    );

                }

            }
        );

    });


    document
    .querySelectorAll(
        "[data-action='cart']"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                const product =
                    findProduct(
                        this.dataset.id
                    );

                if (product) {

                    addToCart(
                        product
                    );

                }

            }
        );

    });


    document
    .querySelectorAll(
        ".product-card"
    )
    .forEach(card => {

        card.addEventListener(
            "click",
            function(event) {

                if (
                    event.target.closest(
                        "button"
                    )
                ) {
                    return;
                }


                const product =
                    findProduct(
                        this.dataset.productId
                    );


                if (product) {

                    openProductModal(
                        product
                    );

                }

            }
        );

    });

}


/* =====================================================
   PRODUCT HELPERS
===================================================== */

function findProduct(id) {

    return products.find(
        product =>
            String(product.id) ===
            String(id)
    );

}


function getProductImages(product) {

    if (
        Array.isArray(
            product.image_urls
        ) &&
        product.image_urls.length
    ) {

        return product.image_urls
            .filter(Boolean);

    }


    if (
        product.image_url
    ) {

        return [
            product.image_url
        ];

    }


    return [];

}


function getProductName(product) {

    if (
        currentLanguage === "en"
    ) {

        return (
            product.name_en ||
            product.name_ar ||
            product.name ||
            product.product_code ||
            "Product"
        );

    }


    return (
        product.name_ar ||
        product.name_en ||
        product.name ||
        product.product_code ||
        "منتج"
    );

}


function getProductDescription(product) {

    if (
        currentLanguage === "en"
    ) {

        return (
            product.description_en ||
            product.description_ar ||
            product.description ||
            ""
        );

    }


    return (
        product.description_ar ||
        product.description_en ||
        product.description ||
        ""
    );

}


function calculateFinalPrice(
    price,
    discount
) {

    if (
        !discount ||
        discount <= 0
    ) {

        return price;

    }


    return (
        price -
        (
            price *
            discount /
            100
        )
    );

}


/* =====================================================
   PRODUCT MODAL
===================================================== */

function openProductModal(product) {

    currentModalProduct =
        product;


    currentModalImageIndex =
        0;


    updateModal();


    productModal.classList.add(
        "open"
    );


    document.body.classList.add(
        "modal-open"
    );

}


function updateModal() {

    if (!currentModalProduct) {
        return;
    }


    const product =
        currentModalProduct;


    const images =
        getProductImages(
            product
        );


    const price =
        Number(
            product.price
        ) || 0;


    const discount =
        Number(
            product.discount_percent
        ) || 0;


    const finalPrice =
        calculateFinalPrice(
            price,
            discount
        );


    const name =
        getProductName(
            product
        );


    const description =
        getProductDescription(
            product
        );


    modalCode.textContent =
        product.product_code
        ?

        `${
            translations[
                currentLanguage
            ].productCode
        }: ${product.product_code}`

        :

        "";


    modalName.textContent =
        name;


    modalCategory.textContent =
        product.category || "";


    modalDescription.textContent =
        description;


    modalPrice.textContent =
        formatPrice(
            finalPrice
        );


    if (discount > 0) {

        modalOldPrice.textContent =
            formatPrice(
                price
            );

        modalOldPrice.style.display =
            "inline";


        modalDiscount.textContent =
            `-${formatNumber(discount)}%`;

        modalDiscount.classList.remove(
            "hidden"
        );

    }

    else {

        modalOldPrice.textContent =
            "";

        modalOldPrice.style.display =
            "none";


        modalDiscount.classList.add(
            "hidden"
        );

    }


    if (images.length) {

        modalMainImage.src =
            images[
                currentModalImageIndex
            ];

        modalMainImage.alt =
            name;

    }

    else {

        modalMainImage.removeAttribute(
            "src"
        );

    }


    renderModalThumbnails(
        images
    );


    modalPrev.style.display =
        images.length > 1
        ? "flex"
        : "none";


    modalNext.style.display =
        images.length > 1
        ? "flex"
        : "none";

}


function renderModalThumbnails(
    images
) {

    modalThumbnails.innerHTML =
        images
        .map(
            (image,index) => `

                <button
                    class="
                        modal-thumbnail
                        ${
                            index ===
                            currentModalImageIndex
                            ?
                            "active"
                            :
                            ""
                        }
                    "
                    data-index="${index}"
                >

                    <img
                        src="${escapeAttribute(image)}"
                        alt=""
                    >

                </button>

            `
        )
        .join("");


    modalThumbnails
    .querySelectorAll(
        ".modal-thumbnail"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                currentModalImageIndex =
                    Number(
                        this.dataset.index
                    );

                updateModal();

            }
        );

    });

}


function changeModalImage(
    direction
) {

    if (!currentModalProduct) {
        return;
    }


    const images =
        getProductImages(
            currentModalProduct
        );


    if (images.length <= 1) {
        return;
    }


    currentModalImageIndex +=
        direction;


    if (
        currentModalImageIndex < 0
    ) {

        currentModalImageIndex =
            images.length - 1;

    }


    if (
        currentModalImageIndex >=
        images.length
    ) {

        currentModalImageIndex =
            0;

    }


    updateModal();

}


function closeProductModal() {

    productModal.classList.remove(
        "open"
    );

    document.body.classList.remove(
        "modal-open"
    );

    currentModalProduct =
        null;

}


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
            ?
            JSON.parse(saved)
            :
            [];

    }

    catch {

        cart = [];

    }


    updateCartUI();

}


function saveCart() {

    localStorage.setItem(
        "tasbehaaa_cart",
        JSON.stringify(cart)
    );


    updateCartUI();

}


function addToCart(product) {

    const existing =
        cart.find(
            item =>
                String(item.id) ===
                String(product.id)
        );


    if (existing) {

        existing.quantity += 1;

    }

    else {

        cart.push({

            id:
                product.id,

            product_code:
                product.product_code,

            name_ar:
                product.name_ar,

            name_en:
                product.name_en,

            price:
                Number(product.price) || 0,

            discount_percent:
                Number(
                    product.discount_percent
                ) || 0,

            image_url:
                getProductImages(
                    product
                )[0] || "",

            quantity:
                1

        });

    }


    saveCart();

    openCart();

    showTemporaryMessage(
        translations[
            currentLanguage
        ].added
    );

}


function updateCartUI() {

    const totalQuantity =
        cart.reduce(
            (
                total,
                item
            ) =>
                total +
                Number(
                    item.quantity
                ),
            0
        );


    cartCount.textContent =
        totalQuantity;


    renderCart();

}


function renderCart() {

    if (!cart.length) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div>
                    🛒
                </div>

                <p>
                    ${
                        translations[
                            currentLanguage
                        ].emptyCart
                    }
                </p>

            </div>

        `;


        cartTotal.textContent =
            "0";


        return;

    }


    cartItems.innerHTML =
        cart
        .map(
            item =>
                createCartItem(
                    item
                )
        )
        .join("");


    cartItems
    .querySelectorAll(
        "[data-cart-action]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                const action =
                    this.dataset.cartAction;

                const id =
                    this.dataset.id;


                if (
                    action ===
                    "increase"
                ) {

                    changeCartQuantity(
                        id,
                        1
                    );

                }


                if (
                    action ===
                    "decrease"
                ) {

                    changeCartQuantity(
                        id,
                        -1
                    );

                }


                if (
                    action ===
                    "remove"
                ) {

                    removeFromCart(
                        id
                    );

                }

            }
        );

    });


    calculateCartTotal();

}


function createCartItem(item) {

    const discount =
        Number(
            item.discount_percent
        ) || 0;


    const originalPrice =
        Number(
            item.price
        ) || 0;


    const finalPrice =
        calculateFinalPrice(
            originalPrice,
            discount
        );


    const name =
        currentLanguage === "en"

        ?

        (
            item.name_en ||
            item.name_ar ||
            item.product_code
        )

        :

        (
            item.name_ar ||
            item.name_en ||
            item.product_code
        );


    return `

        <div class="cart-item">

            <div class="cart-item-image">

                ${
                    item.image_url

                    ?

                    `<img
                        src="${escapeAttribute(item.image_url)}"
                        alt="${escapeAttribute(name)}"
                    >`

                    :

                    "♡"
                }

            </div>


            <div class="cart-item-info">

                <strong>
                    ${escapeHtml(name)}
                </strong>

                <small>
                    ${escapeHtml(
                        item.product_code ||
                        ""
                    )}
                </small>


                <span class="cart-item-price">

                    ${formatPrice(
                        finalPrice
                    )}

                </span>


                <div class="quantity-controls">

                    <button
                        data-cart-action="decrease"
                        data-id="${item.id}"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        data-cart-action="increase"
                        data-id="${item.id}"
                    >
                        +
                    </button>

                </div>


                <button
                    class="remove-cart-item"
                    data-cart-action="remove"
                    data-id="${item.id}"
                >

                    ${
                        translations[
                            currentLanguage
                        ].remove
                    }

                </button>

            </div>

        </div>

    `;

}


function changeCartQuantity(
    id,
    amount
) {

    const item =
        cart.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!item) {
        return;
    }


    item.quantity +=
        amount;


    if (
        item.quantity <= 0
    ) {

        cart =
            cart.filter(
                item =>
                    String(item.id) !==
                    String(id)
            );

    }


    saveCart();

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


function calculateCartTotal() {

    const total =
        cart.reduce(
            (
                sum,
                item
            ) => {

                const price =
                    Number(
                        item.price
                    ) || 0;


                const discount =
                    Number(
                        item.discount_percent
                    ) || 0;


                const finalPrice =
                    calculateFinalPrice(
                        price,
                        discount
                    );


                return (
                    sum +
                    (
                        finalPrice *
                        item.quantity
                    )
                );

            },
            0
        );


    cartTotal.textContent =
        formatPrice(
            total,
            false
        );

}


function openCart() {

    cartSidebar.classList.add(
        "open"
    );

    cartOverlay.classList.add(
        "open"
    );

    document.body.classList.add(
        "cart-open"
    );

}


function closeCartSidebar() {

    cartSidebar.classList.remove(
        "open"
    );

    cartOverlay.classList.remove(
        "open"
    );

    document.body.classList.remove(
        "cart-open"
    );

}


/* =====================================================
   WHATSAPP CHECKOUT
===================================================== */

function checkoutWhatsApp() {

    if (!cart.length) {

        showTemporaryMessage(
            translations[
                currentLanguage
            ].emptyCart
        );

        return;

    }


    let message =
        currentLanguage === "en"

        ?

        "Hello Tasbehaaa, I would like to order:%0A%0A"

        :

        "مرحبًا Tasbehaaa، أريد طلب:%0A%0A";


    cart.forEach(
        (
            item,
            index
        ) => {

            const name =
                currentLanguage === "en"

                ?

                (
                    item.name_en ||
                    item.name_ar ||
                    item.product_code
                )

                :

                (
                    item.name_ar ||
                    item.name_en ||
                    item.product_code
                );


            const price =
                calculateFinalPrice(
                    Number(
                        item.price
                    ) || 0,
                    Number(
                        item.discount_percent
                    ) || 0
                );


            message +=
                `${index + 1}. ${name}%0A`;


            message +=
                `${
                    translations[
                        currentLanguage
                    ].productCode
                }: ${item.product_code || "-"}%0A`;


            message +=
                `${
                    translations[
                        currentLanguage
                    ].quantity
                }: ${item.quantity}%0A`;


            message +=
                `Price: ${formatPrice(price)}%0A%0A`;

        }
    );


    const total =
        cart.reduce(
            (
                sum,
                item
            ) => {

                const price =
                    calculateFinalPrice(
                        Number(
                            item.price
                        ) || 0,
                        Number(
                            item.discount_percent
                        ) || 0
                    );


                return (
                    sum +
                    (
                        price *
                        item.quantity
                    )
                );

            },
            0
        );


    message +=
        `Total: ${formatPrice(total)}`;


    const whatsappURL =
        `https://wa.me/201003089153?text=${message}`;


    window.open(
        whatsappURL,
        "_blank"
    );

}


/* =====================================================
   LANGUAGE
===================================================== */

function toggleLanguage() {

    currentLanguage =
        currentLanguage === "ar"
        ? "en"
        : "ar";


    localStorage.setItem(
        "tasbehaaa_language",
        currentLanguage
    );


    applyLanguage();


    buildCategories();

    filterProducts();

    renderCart();


    if (currentModalProduct) {

        updateModal();

    }

}


function applyLanguage() {

    document.documentElement.lang =
        currentLanguage;


    document.documentElement.dir =
        currentLanguage === "ar"
        ? "rtl"
        : "ltr";


    languageToggle.textContent =
        currentLanguage === "ar"
        ? "EN"
        : "عربي";


    document
    .querySelectorAll(
        "[data-i18n]"
    )
    .forEach(element => {

        const key =
            element.dataset.i18n;


        if (
            translations[
                currentLanguage
            ][key]
        ) {

            element.innerHTML =
                translations[
                    currentLanguage
                ][key];

        }

    });


    document
    .querySelectorAll(
        "[data-i18n-placeholder]"
    )
    .forEach(element => {

        const key =
            element.dataset
                .i18nPlaceholder;


        element.placeholder =
            translations[
                currentLanguage
            ][key];

    });

}


/* =====================================================
   UTILITY
===================================================== */

function formatPrice(
    value,
    includeCurrency = true
) {

    const number =
        Number(value) || 0;


    const formatted =
        new Intl.NumberFormat(
            "en-US",
            {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0
            }
        ).format(
            number
        );


    return includeCurrency
        ? `${formatted} EGP`
        : formatted;

}


function formatNumber(
    value
) {

    return new Intl.NumberFormat(
        "en-US",
        {
            maximumFractionDigits: 2
        }
    ).format(
        Number(value) || 0
    );

}


function truncateText(
    text,
    length
) {

    if (
        text.length <= length
    ) {

        return text;

    }


    return (
        text.substring(
            0,
            length
        ) + "..."
    );

}


function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


function escapeAttribute(
    value
) {

    return escapeHtml(
        value
    );

}


function showTemporaryMessage(
    message
) {

    let notification =
        document.getElementById(
            "siteNotification"
        );


    if (!notification) {

        notification =
            document.createElement(
                "div"
            );

        notification.id =
            "siteNotification";

        notification.className =
            "site-notification";

        document.body.appendChild(
            notification
        );

    }


    notification.textContent =
        message;


    notification.classList.add(
        "show"
    );


    clearTimeout(
        notification.timer
    );


    notification.timer =
        setTimeout(
            function() {

                notification.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =====================================================
   GLOBAL
===================================================== */

window.loadProducts =
    loadProducts;
