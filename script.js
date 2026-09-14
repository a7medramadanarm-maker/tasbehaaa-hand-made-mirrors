/* =========================================================
   TASBEHAAA FOR HAND MADE MIRRORS
   Main JavaScript
   Managed By: Tasbeh Mohamed
   Prepared By: Eng Ahmad
========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://nzkgjobzxgvroyzmvvdi.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_8aHDt5z7hV4Ojx69yJx8Fw_HWuFAJYJ";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* =========================================================
   WEBSITE SETTINGS
========================================================= */

const WHATSAPP_NUMBER = "201003089153";


/*
    These are the available sections.

    IMPORTANT:
    The ADMIN chooses one of these sections
    when adding a product.

    Products themselves are NOT written here.
*/

const CATEGORIES = [
    {
        name: "مرايات",
        icon: "fa-solid fa-gem",
        description: "Handmade Wedding Mirrors"
    },

    {
        name: "صواني الشبكة",
        icon: "fa-solid fa-ring",
        description: "Elegant Engagement Trays"
    },

    {
        name: "البصمات",
        icon: "fa-solid fa-fingerprint",
        description: "Beautiful Fingerprint Keepsakes"
    },

    {
        name: "بوكيهات الورد",
        icon: "fa-solid fa-seedling",
        description: "Handmade Flower Bouquets"
    },

    {
        name: "مرايات الديكور",
        icon: "fa-regular fa-circle",
        description: "Decorative Handmade Mirrors"
    },

    {
        name: "مرايات بنترست",
        icon: "fa-solid fa-wand-magic-sparkles",
        description: "Pinterest Inspired Mirrors"
    },

    {
        name: "بصمات كتب الكتاب",
        icon: "fa-solid fa-heart",
        description: "Katb Ketab Fingerprints"
    },

    {
        name: "Special Gift",
        icon: "fa-solid fa-gift",
        description: "Special Handmade Pieces"
    }
];


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let allProducts = [];

let cart = [];

let currentSearch = "";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const categoriesContainer =
    document.getElementById("categoriesContainer");

const productsContainer =
    document.getElementById("productsContainer");

const emptyProducts =
    document.getElementById("emptyProducts");

const cartButton =
    document.getElementById("cartButton");

const cartSidebar =
    document.getElementById("cartSidebar");

const cartOverlay =
    document.getElementById("cartOverlay");

const closeCart =
    document.getElementById("closeCart");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mobileMenu =
    document.getElementById("mobileMenu");

const searchButton =
    document.getElementById("searchButton");

const searchOverlay =
    document.getElementById("searchOverlay");

const closeSearch =
    document.getElementById("closeSearch");

const searchInput =
    document.getElementById("searchInput");

const scrollTop =
    document.getElementById("scrollTop");

const currentYear =
    document.getElementById("currentYear");


/* =========================================================
   INITIALIZE WEBSITE
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    initializeYear();

    loadCart();

    renderCategories();

    setupNavigation();

    setupSearch();

    setupCart();

    setupScrollTop();

    await loadProducts();

});


/* =========================================================
   CURRENT YEAR
========================================================= */

function initializeYear() {

    if (!currentYear) {
        return;
    }

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   LOAD PRODUCTS FROM SUPABASE
========================================================= */

async function loadProducts() {

    if (!productsContainer) {
        return;
    }

    showProductsLoading();


    try {

        const { data, error } =
            await supabaseClient
                .from("products")
                .select("*")
                .order("created_at", {
                    ascending: false
                });


        if (error) {

            console.error(
                "Supabase products error:",
                error
            );

            showProductsError();

            return;
        }


        allProducts = data || [];


        renderProducts(allProducts);

    }

    catch (error) {

        console.error(
            "Unexpected products error:",
            error
        );

        showProductsError();

    }

}


/* =========================================================
   PRODUCTS LOADING
========================================================= */

function showProductsLoading() {

    productsContainer.innerHTML = `
        <div class="loading-message">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p style="margin-top:10px;">
                Loading products...
            </p>
        </div>
    `;

}


/* =========================================================
   PRODUCTS ERROR
========================================================= */

function showProductsError() {

    productsContainer.innerHTML = `
        <div class="loading-message">

            <i class="fa-solid fa-triangle-exclamation"></i>

            <p style="margin-top:10px;">
                We couldn't load the products right now.
            </p>

            <button
                type="button"
                onclick="loadProducts()"
                class="btn btn-primary"
                style="margin-top:18px;"
            >
                Try Again
            </button>

        </div>
    `;

}


/* =========================================================
   RENDER CATEGORIES
========================================================= */

function renderCategories() {

    if (!categoriesContainer) {
        return;
    }


    categoriesContainer.innerHTML = "";


    CATEGORIES.forEach((category) => {

        const card =
            document.createElement("div");

        card.className =
            "category-card";


        card.dataset.category =
            category.name;


        card.innerHTML = `

            <div class="category-icon">

                <i class="${category.icon}"></i>

            </div>


            <h3>
                ${escapeHTML(category.name)}
            </h3>


            <p>
                ${escapeHTML(category.description)}
            </p>

        `;


        card.addEventListener(
            "click",
            () => {

                scrollToCategory(
                    category.name
                );

            }
        );


        categoriesContainer.appendChild(card);

    });

}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts(products) {

    if (!productsContainer) {
        return;
    }


    productsContainer.innerHTML = "";


    if (!products || products.length === 0) {

        if (emptyProducts) {
            emptyProducts.style.display = "block";
        }

        return;
    }


    if (emptyProducts) {
        emptyProducts.style.display = "none";
    }


    /*
        Search filtering
    */

    let filteredProducts =
        filterProducts(products);


    if (filteredProducts.length === 0) {

        productsContainer.innerHTML = `

            <div class="loading-message">

                <div class="empty-icon">

                    <i class="fa-solid fa-magnifying-glass"></i>

                </div>

                <h3>
                    No Products Found
                </h3>

                <p>
                    Try another search.
                </p>

            </div>

        `;

        return;
    }


    /*
        Group products by category
    */

    const grouped =
        groupProductsByCategory(
            filteredProducts
        );


    /*
        Render every category
    */

    Object.keys(grouped).forEach(
        (categoryName) => {

            const productsInCategory =
                grouped[categoryName];


            const section =
                document.createElement("div");

            section.className =
                "product-section";


            section.id =
                createCategoryId(categoryName);


            const title =
                document.createElement("div");

            title.className =
                "product-section-title";


            title.innerHTML = `

                <h3>
                    ${escapeHTML(categoryName)}
                </h3>

                <span>
                    ${productsInCategory.length}
                    ${productsInCategory.length === 1
                        ? "Product"
                        : "Products"}
                </span>

            `;


            const grid =
                document.createElement("div");

            grid.className =
                "products-container";


            productsInCategory.forEach(
                (product) => {

                    grid.appendChild(
                        createProductCard(product)
                    );

                }
            );


            section.appendChild(title);

            section.appendChild(grid);

            productsContainer.appendChild(section);

        }
    );

}


/* =========================================================
   GROUP PRODUCTS BY CATEGORY
========================================================= */

function groupProductsByCategory(products) {

    const groups = {};


    products.forEach((product) => {

        const category =
            product.category &&
            product.category.trim()
                ? product.category.trim()
                : "Special Gift";


        if (!groups[category]) {
            groups[category] = [];
        }


        groups[category].push(product);

    });


    return groups;

}


/* =========================================================
   CREATE PRODUCT CARD
========================================================= */

function createProductCard(product) {

    const card =
        document.createElement("article");

    card.className =
        "product-card";


    const imageURL =
        product.image_url &&
        product.image_url.trim()
            ? product.image_url.trim()
            : "";


    const productName =
        product.name || "Handmade Product";


    const description =
        product.description ||
        "Beautiful handmade piece created with love.";


    const price =
        Number(product.price) || 0;


    const imageHTML =
        imageURL

            ? `
                <img
                    src="${escapeAttribute(imageURL)}"
                    alt="${escapeAttribute(productName)}"
                    loading="lazy"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                >

                <div
                    class="product-image-placeholder"
                    style="display:none;"
                >

                    <i class="fa-regular fa-gem"></i>

                    <span>
                        TASBEHAAA
                    </span>

                </div>
            `

            : `
                <div class="product-image-placeholder">

                    <i class="fa-regular fa-gem"></i>

                    <span>
                        TASBEHAAA
                    </span>

                </div>
            `;


    card.innerHTML = `

        <div class="product-image">

            ${imageHTML}

        </div>


        <div class="product-info">

            <span class="product-category">

                ${escapeHTML(
                    product.category || "Special Gift"
                )}

            </span>


            <h3 class="product-title">

                ${escapeHTML(productName)}

            </h3>


            <p class="product-description">

                ${escapeHTML(description)}

            </p>


            <div class="product-bottom">

                <div class="product-price">

                    ${formatPrice(price)}

                    <span>
                        EGP
                    </span>

                </div>


                <button
                    type="button"
                    class="add-to-cart"
                    aria-label="Add to cart"
                >

                    <i class="fa-solid fa-plus"></i>

                </button>

            </div>

        </div>

    `;


    const addButton =
        card.querySelector(".add-to-cart");


    addButton.addEventListener(
        "click",
        () => {

            addToCart(product);

        }
    );


    return card;

}


/* =========================================================
   PRICE FORMAT
========================================================= */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "en-EG",
        {
            maximumFractionDigits: 2
        }
    ).format(price);

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    if (
        !searchButton ||
        !searchOverlay ||
        !closeSearch
    ) {
        return;
    }


    searchButton.addEventListener(
        "click",
        () => {

            searchOverlay.classList.add(
                "active"
            );


            setTimeout(() => {

                if (searchInput) {
                    searchInput.focus();
                }

            }, 100);

        }
    );


    closeSearch.addEventListener(
        "click",
        closeSearchOverlay
    );


    searchOverlay.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                searchOverlay
            ) {

                closeSearchOverlay();

            }

        }
    );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                currentSearch =
                    searchInput.value.trim()
                        .toLowerCase();


                renderProducts(
                    allProducts
                );

            }
        );

    }


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeSearchOverlay();

                closeCartSidebar();

            }

        }
    );

}


function closeSearchOverlay() {

    if (!searchOverlay) {
        return;
    }

    searchOverlay.classList.remove(
        "active"
    );

}


/* =========================================================
   FILTER PRODUCTS
========================================================= */

function filterProducts(products) {

    if (!currentSearch) {
        return products;
    }


    return products.filter(
        (product) => {

            const searchableText = [

                product.name,

                product.description,

                product.category

            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


            return searchableText.includes(
                currentSearch
            );

        }
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    if (
        !mobileMenuButton ||
        !mobileMenu
    ) {
        return;
    }


    mobileMenuButton.addEventListener(
        "click",
        () => {

            mobileMenu.classList.toggle(
                "active"
            );


            const icon =
                mobileMenuButton.querySelector(
                    "i"
                );


            if (
                mobileMenu.classList.contains(
                    "active"
                )
            ) {

                icon.className =
                    "fa-solid fa-xmark";

            }

            else {

                icon.className =
                    "fa-solid fa-bars";

            }

        }
    );


    const mobileLinks =
        mobileMenu.querySelectorAll("a");


    mobileLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                () => {

                    mobileMenu.classList.remove(
                        "active"
                    );


                    const icon =
                        mobileMenuButton.querySelector(
                            "i"
                        );


                    icon.className =
                        "fa-solid fa-bars";

                }
            );

        }
    );

}


/* =========================================================
   CART
========================================================= */

function setupCart() {

    if (cartButton) {

        cartButton.addEventListener(
            "click",
            openCartSidebar
        );

    }


    if (closeCart) {

        closeCart.addEventListener(
            "click",
            closeCartSidebar
        );

    }


    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            closeCartSidebar
        );

    }

}


function openCartSidebar() {

    if (!cartSidebar) {
        return;
    }


    cartSidebar.classList.add(
        "active"
    );


    if (cartOverlay) {

        cartOverlay.classList.add(
            "active"
        );

    }


    document.body.classList.add(
        "cart-open"
    );

}


function closeCartSidebar() {

    if (cartSidebar) {

        cartSidebar.classList.remove(
            "active"
        );

    }


    if (cartOverlay) {

        cartOverlay.classList.remove(
            "active"
        );

    }


    document.body.classList.remove(
        "cart-open"
    );

}


/* =========================================================
   ADD TO CART
========================================================= */

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

            id: product.id,

            name: product.name,

            price: Number(product.price) || 0,

            image_url:
                product.image_url || "",

            quantity: 1

        });

    }


    saveCart();

    renderCart();

    openCartSidebar();

}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                String(item.id) !==
                String(productId)
        );


    saveCart();

    renderCart();

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(
    productId,
    change
) {

    const item =
        cart.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (!item) {
        return;
    }


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;

    }


    saveCart();

    renderCart();

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    if (!cartItems) {
        return;
    }


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-bag-shopping"></i>

                <h3>
                    Your bag is empty
                </h3>

                <p>
                    Add your favorite handmade pieces here.
                </p>

            </div>

        `;


        updateCartSummary();

        return;
    }


    cartItems.innerHTML = "";


    cart.forEach((item) => {

        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";


        const imageHTML =
            item.image_url

                ? `
                    <img
                        src="${escapeAttribute(item.image_url)}"
                        alt="${escapeAttribute(item.name)}"
                    >
                `

                : `
                    <div
                        style="
                            width:100%;
                            height:100%;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            color:var(--gold);
                        "
                    >
                        <i class="fa-regular fa-gem"></i>
                    </div>
                `;


        cartItem.innerHTML = `

            <div class="cart-item-image">

                ${imageHTML}

            </div>


            <div class="cart-item-info">

                <h4>
                    ${escapeHTML(item.name)}
                </h4>

                <span>
                    ${formatPrice(item.price)} EGP
                </span>


                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:8px;
                        margin-top:7px;
                    "
                >

                    <button
                        type="button"
                        class="cart-quantity-btn"
                        data-action="minus"
                        style="
                            width:23px;
                            height:23px;
                            border:1px solid var(--border);
                            background:var(--cream);
                            border-radius:50%;
                        "
                    >
                        -
                    </button>


                    <strong
                        style="
                            font-size:11px;
                        "
                    >
                        ${item.quantity}
                    </strong>


                    <button
                        type="button"
                        class="cart-quantity-btn"
                        data-action="plus"
                        style="
                            width:23px;
                            height:23px;
                            border:1px solid var(--border);
                            background:var(--cream);
                            border-radius:50%;
                        "
                    >
                        +
                    </button>

                </div>

            </div>


            <button
                type="button"
                class="cart-remove"
                aria-label="Remove product"
            >

                <i class="fa-solid fa-trash"></i>

            </button>

        `;


        const removeButton =
            cartItem.querySelector(
                ".cart-remove"
            );


        removeButton.addEventListener(
            "click",
            () => {

                removeFromCart(
                    item.id
                );

            }
        );


        const quantityButtons =
            cartItem.querySelectorAll(
                ".cart-quantity-btn"
            );


        quantityButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const action =
                            button.dataset.action;


                        changeQuantity(

                            item.id,

                            action === "plus"
                                ? 1
                                : -1

                        );

                    }
                );

            }
        );


        cartItems.appendChild(
            cartItem
        );

    });


    updateCartSummary();

}


/* =========================================================
   CART SUMMARY
========================================================= */

function updateCartSummary() {

    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const totalPrice =
        cart.reduce(
            (total, item) =>
                total +
                (item.price * item.quantity),
            0
        );


    if (cartCount) {

        cartCount.textContent =
            totalQuantity;

    }


    if (cartTotal) {

        cartTotal.textContent =
            `${formatPrice(totalPrice)} EGP`;

    }

}


/* =========================================================
   LOCAL STORAGE CART
========================================================= */

function saveCart() {

    try {

        localStorage.setItem(
            "tasbehaaa_cart",
            JSON.stringify(cart)
        );

    }

    catch (error) {

        console.error(
            "Could not save cart:",
            error
        );

    }

}


function loadCart() {

    try {

        const savedCart =
            localStorage.getItem(
                "tasbehaaa_cart"
            );


        if (savedCart) {

            cart =
                JSON.parse(savedCart);

        }

    }

    catch (error) {

        console.error(
            "Could not load cart:",
            error
        );

        cart = [];

    }


    renderCart();

}


/* =========================================================
   WHATSAPP ORDER
========================================================= */

document.addEventListener(
    "click",
    (event) => {

        const whatsappButton =
            event.target.closest(
                "#cartWhatsapp"
            );


        if (!whatsappButton) {
            return;
        }


        event.preventDefault();


        if (cart.length === 0) {

            alert(
                "Your shopping bag is empty."
            );

            return;

        }


        let message =
            "Hello Tasbehaaa 👋%0A%0A";

        message +=
            "I would like to order:%0A%0A";


        cart.forEach(
            (item, index) => {

                message +=
                    `${index + 1}. ${item.name}%0A`;

                message +=
                    `Quantity: ${item.quantity}%0A`;

                message +=
                    `Price: ${formatPrice(item.price)} EGP%0A%0A`;

            }
        );


        const total =
            cart.reduce(
                (sum, item) =>
                    sum +
                    item.price * item.quantity,
                0
            );


        message +=
            `Total: ${formatPrice(total)} EGP%0A%0A`;

        message +=
            "Please confirm my order. Thank you ❤️";


        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


        window.open(
            whatsappURL,
            "_blank"
        );

    }
);


/* =========================================================
   SCROLL TO CATEGORY
========================================================= */

function scrollToCategory(categoryName) {

    const id =
        createCategoryId(
            categoryName
        );


    const element =
        document.getElementById(id);


    if (element) {

        element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return;

    }


    /*
        If the category has no products,
        scroll to products section.
    */

    const productsSection =
        document.getElementById(
            "products"
        );


    if (productsSection) {

        productsSection.scrollIntoView({
            behavior: "smooth"
        });

    }


    /*
        Show a small message if category
        currently has no products.
    */

    if (typeof categoryName === "string") {

        setTimeout(() => {

            const hasProducts =
                allProducts.some(
                    product =>
                        String(
                            product.category || ""
                        ).trim() ===
                        categoryName
                );


            if (!hasProducts) {

                alert(
                    `${categoryName} currently has no products.`
                );

            }

        }, 500);

    }

}


/* =========================================================
   CREATE CATEGORY ID
========================================================= */

function createCategoryId(
    categoryName
) {

    return (
        "category-" +
        String(categoryName)
            .toLowerCase()
            .replace(
                /[^a-z0-9\u0600-\u06ff]+/gi,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            )
    );

}


/* =========================================================
   SCROLL TO TOP
========================================================= */

function setupScrollTop() {

    if (!scrollTop) {
        return;
    }


    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 500) {

                scrollTop.classList.add(
                    "active"
                );

            }

            else {

                scrollTop.classList.remove(
                    "active"
                );

            }

        }
    );


    scrollTop.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* =========================================================
   HTML SECURITY HELPERS
========================================================= */

function escapeHTML(value) {

    return String(value)
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


function escapeAttribute(value) {

    return escapeHTML(value);

}


/* =========================================================
   SMOOTH INTERNAL LINKS
========================================================= */

document.addEventListener(
    "click",
    (event) => {

        const link =
            event.target.closest(
                'a[href^="#"]'
            );


        if (!link) {
            return;
        }


        const targetID =
            link.getAttribute("href");


        if (
            !targetID ||
            targetID === "#"
        ) {
            return;
        }


        const target =
            document.querySelector(
                targetID
            );


        if (!target) {
            return;
        }


        event.preventDefault();


        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


/* =========================================================
   END
========================================================= */
