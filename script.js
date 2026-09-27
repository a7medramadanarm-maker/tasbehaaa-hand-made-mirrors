const SUPABASE_URL =
    "https://nzkgjobzxgvroyzmvvdi.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_8aHDt5z7hV4Ojx69yJx8Fw_HWuFAJYJ";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

const WHATSAPP_NUMBER = "201003089153";

const CATEGORIES = [
    {
        key: "mirrors",
        ar: "مرايات",
        en: "Mirrors"
    },
    {
        key: "engagement_trays",
        ar: "صوانى الشبكة",
        en: "Engagement Ring Trays"
    },
    {
        key: "fingerprint_guest_books",
        ar: "البصمات",
        en: "Fingerprint Guest Books"
    },
    {
        key: "flower_bouquets",
        ar: "بوكيهات الورد",
        en: "Flower Bouquets"
    },
    {
        key: "decorative_mirrors",
        ar: "مرايات الديكور",
        en: "Decorative Mirrors"
    },
    {
        key: "pinterest_mirrors",
        ar: "مرايات بنترست",
        en: "Pinterest Mirrors"
    },
    {
        key: "wedding_fingerprint_guest_books",
        ar: "بصمات كتب الكتاب",
        en: "Wedding Fingerprint Guest Books"
    },
    {
        key: "special_gifts",
        ar: "الهدايا المميزة",
        en: "Special Gifts"
    }
];

let currentLanguage = "ar";
let products = [];
let cart = [];
let selectedProduct = null;


/* =========================
   START
========================= */

document.addEventListener("DOMContentLoaded", async () => {

    loadCart();

    loadLanguage();

    await loadProducts();

    renderCart();

});


/* =========================
   LANGUAGE
========================= */

function loadLanguage() {

    const saved =
        localStorage.getItem(
            "tasbehaaa_language"
        );

    if (saved === "en") {
        currentLanguage = "en";
    }

    applyLanguage();
}


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

    renderProducts();

    renderCart();
}


function applyLanguage() {

    document.documentElement.lang =
        currentLanguage;

    document.documentElement.dir =
        currentLanguage === "ar"
            ? "rtl"
            : "ltr";


    document
        .querySelectorAll("[data-ar]")
        .forEach(element => {

            element.textContent =
                currentLanguage === "ar"
                    ? element.dataset.ar
                    : element.dataset.en;

        });


    document
        .querySelectorAll("[data-placeholder-ar]")
        .forEach(element => {

            element.placeholder =
                currentLanguage === "ar"
                    ? element.dataset.placeholderAr
                    : element.dataset.placeholderEn;

        });


    const button =
        document.querySelector(
            ".language-btn"
        );

    if (button) {

        button.textContent =
            currentLanguage === "ar"
                ? "EN"
                : "AR";

    }
}


/* =========================
   PRODUCTS
========================= */

async function loadProducts() {

    const container =
        document.getElementById(
            "categoriesContainer"
        );

    container.innerHTML = `
        <div class="empty-category">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <br><br>
            ${
                currentLanguage === "ar"
                    ? "جاري تحميل المنتجات..."
                    : "Loading products..."
            }
        </div>
    `;


    const { data, error } =
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

        container.innerHTML = `
            <div class="empty-category">
                ${
                    currentLanguage === "ar"
                        ? "حدث خطأ أثناء تحميل المنتجات."
                        : "An error occurred while loading products."
                }
            </div>
        `;

        return;
    }


    products = data || [];

    renderProducts();
}


/* =========================
   CATEGORY
========================= */

function getCategory(product) {

    const ar =
        String(
            product.category_ar || ""
        ).trim();

    const en =
        String(
            product.category_en || ""
        ).trim();

    const legacy =
        String(
            product.category || ""
        ).trim();


    return CATEGORIES.find(
        category =>
            category.ar === ar ||
            category.en === en ||
            category.ar === legacy ||
            category.en === legacy
    );
}


/* =========================
   IMAGES
========================= */

function getProductImages(product) {

    let images = [];


    if (
        Array.isArray(
            product.image_urls
        )
    ) {

        images =
            product.image_urls
                .filter(Boolean);

    }


    if (
        !images.length &&
        product.image_url
    ) {

        images = [
            product.image_url
        ];

    }


    if (!images.length) {

        images = [
            "images/logo.png"
        ];

    }


    return images;
}


/* =========================
   PRICE
========================= */

function getDiscountedPrice(product) {

    const price =
        Number(
            product.price || 0
        );

    const discount =
        Number(
            product.discount_percent || 0
        );


    if (
        discount <= 0
    ) {

        return price;

    }


    return Math.max(
        0,
        price -
        (
            price *
            discount /
            100
        )
    );
}


function formatPrice(price) {

    return new Intl.NumberFormat(
        currentLanguage === "ar"
            ? "ar-EG"
            : "en-US"
    ).format(price);

}


/* =========================
   RENDER
========================= */

function renderProducts(
    filteredProducts = null
) {

    const container =
        document.getElementById(
            "categoriesContainer"
        );

    const list =
        filteredProducts === null
            ? products
            : filteredProducts;


    let html = "";


    CATEGORIES.forEach(
        category => {

            const categoryProducts =
                list.filter(
                    product => {

                        const productCategory =
                            getCategory(
                                product
                            );

                        return (
                            productCategory &&
                            productCategory.key ===
                            category.key
                        );

                    }
                );


            html += `
                <div
                    class="category-section"
                    data-category="${category.key}"
                >

                    <div class="category-title">

                        <h3>
                            ${
                                currentLanguage === "ar"
                                    ? category.ar
                                    : category.en
                            }
                        </h3>

                        <span>
                            ${categoryProducts.length}
                            ${
                                currentLanguage === "ar"
                                    ? "منتج"
                                    : "Products"
                            }
                        </span>

                    </div>

                    ${
                        categoryProducts.length
                            ? `
                                <div class="products-grid">
                                    ${
                                        categoryProducts
                                            .map(
                                                createProductCard
                                            )
                                            .join("")
                                    }
                                </div>
                              `
                            : `
                                <div class="empty-category">
                                    ${
                                        currentLanguage === "ar"
                                            ? "لا توجد منتجات مضافة في هذا القسم حالياً."
                                            : "No products have been added to this section yet."
                                    }
                                </div>
                              `
                    }

                </div>
            `;

        }
    );


    container.innerHTML = html;
}


/* =========================
   PRODUCT CARD
========================= */

function createProductCard(product) {

    const images =
        getProductImages(product);

    const image =
        images[0];


    const name =
        currentLanguage === "ar"
            ? (
                product.name_ar ||
                product.name ||
                "منتج"
            )
            : (
                product.name_en ||
                product.name ||
                "Product"
            );


    const description =
        currentLanguage === "ar"
            ? (
                product.description_ar ||
                product.description ||
                ""
            )
            : (
                product.description_en ||
                product.description ||
                ""
            );


    const originalPrice =
        Number(
            product.price || 0
        );


    const finalPrice =
        getDiscountedPrice(
            product
        );


    const discount =
        Number(
            product.discount_percent || 0
        );


    return `
        <article
            class="product-card"
            data-code="${escapeAttribute(
                product.product_code || ""
            ).toLowerCase()}"
        >

            <div class="product-image">

                <img
                    src="${escapeAttribute(image)}"
                    alt="${escapeAttribute(name)}"
                    loading="lazy"
                >

                ${
                    discount > 0
                        ? `
                            <div class="discount-badge">
                                -${discount}%
                            </div>
                          `
                        : ""
                }

                ${
                    product.product_code
                        ? `
                            <div class="product-code">
                                ${escapeHtml(
                                    product.product_code
                                )}
                            </div>
                          `
                        : ""
                }

            </div>


            <div class="product-info">

                <h4>
                    ${escapeHtml(name)}
                </h4>

                <p>
                    ${escapeHtml(description)}
                </p>

                <div class="price-row">

                    <span class="current-price">
                        ${formatPrice(finalPrice)}
                        EGP
                    </span>

                    ${
                        discount > 0
                            ? `
                                <span class="old-price">
                                    ${formatPrice(originalPrice)}
                                    EGP
                                </span>
                              `
                            : ""
                    }

                </div>


                <div class="product-buttons">

                    <button
                        class="details-btn"
                        onclick="openProductModal('${product.id}')"
                    >
                        <i class="fa-solid fa-eye"></i>

                        ${
                            currentLanguage === "ar"
                                ? "التفاصيل"
                                : "Details"
                        }
                    </button>


                    <button
                        class="add-btn"
                        onclick="quickAdd('${product.id}')"
                    >
                        <i class="fa-solid fa-cart-plus"></i>

                        ${
                            currentLanguage === "ar"
                                ? "أضف للسلة"
                                : "Add"
                        }
                    </button>

                </div>

            </div>

        </article>
    `;
}


/* =========================
   SEARCH
========================= */

function searchProducts() {

    const input =
        document.getElementById(
            "searchInput"
        );

    const value =
        input.value
            .trim()
            .toLowerCase();


    if (!value) {

        renderProducts();

        return;

    }


    const filtered =
        products.filter(
            product =>
                String(
                    product.product_code || ""
                )
                .toLowerCase()
                .includes(value)
        );


    renderProducts(filtered);
}


/* =========================
   MODAL
========================= */

function openProductModal(id) {

    selectedProduct =
        products.find(
            product =>
                String(product.id) ===
                String(id)
        );


    if (!selectedProduct) {
        return;
    }


    const images =
        getProductImages(
            selectedProduct
        );


    const name =
        currentLanguage === "ar"
            ? (
                selectedProduct.name_ar ||
                selectedProduct.name ||
                ""
            )
            : (
                selectedProduct.name_en ||
                selectedProduct.name ||
                ""
            );


    const description =
        currentLanguage === "ar"
            ? (
                selectedProduct.description_ar ||
                selectedProduct.description ||
                ""
            )
            : (
                selectedProduct.description_en ||
                selectedProduct.description ||
                ""
            );


    const originalPrice =
        Number(
            selectedProduct.price || 0
        );


    const finalPrice =
        getDiscountedPrice(
            selectedProduct
        );


    document.getElementById(
        "modalImage"
    ).src = images[0];


    document.getElementById(
        "modalName"
    ).textContent = name;


    document.getElementById(
        "modalDescription"
    ).textContent =
        description;


    document.getElementById(
        "modalPrice"
    ).textContent =
        `${formatPrice(finalPrice)} EGP`;


    const oldPrice =
        document.getElementById(
            "modalOldPrice"
        );


    oldPrice.textContent =
        Number(
            selectedProduct.discount_percent || 0
        ) > 0
            ? `${formatPrice(originalPrice)} EGP`
            : "";


    const dateField =
        document.getElementById(
            "dateField"
        );


    dateField.style.display =
        selectedProduct.allow_custom_date
            ? "block"
            : "none";


    document.getElementById(
        "customNames"
    ).value = "";


    document.getElementById(
        "customDate"
    ).value = "";


    document.getElementById(
        "customNotes"
    ).value = "";


    document.getElementById(
        "productModal"
    ).classList.add("active");
}


function closeProductModal() {

    document
        .getElementById(
            "productModal"
        )
        .classList.remove(
            "active"
        );

    selectedProduct = null;
}


/* =========================
   ADD
========================= */

function quickAdd(id) {

    const product =
        products.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!product) {
        return;
    }


    addToCart(
        product,
        {
            names: "",
            date: "",
            notes: ""
        }
    );
}


function addFromModal() {

    if (!selectedProduct) {
        return;
    }


    const names =
        document.getElementById(
            "customNames"
        ).value.trim();


    const date =
        document.getElementById(
            "customDate"
        ).value;


    const notes =
        document.getElementById(
            "customNotes"
        ).value.trim();


    addToCart(
        selectedProduct,
        {
            names,
            date,
            notes
        }
    );


    closeProductModal();
}


/* =========================
   CART
========================= */

function addToCart(
    product,
    customization
) {

    cart.push({

        cartId:
            Date.now() +
            Math.random(),

        productId:
            product.id,

        productCode:
            product.product_code || "",

        name:
            currentLanguage === "ar"
                ? (
                    product.name_ar ||
                    product.name ||
                    ""
                )
                : (
                    product.name_en ||
                    product.name ||
                    ""
                ),

        image:
            getProductImages(
                product
            )[0],

        price:
            getDiscountedPrice(
                product
            ),

        names:
            customization.names || "",

        date:
            customization.date || "",

        notes:
            customization.notes || ""

    });


    saveCart();

    renderCart();

    showToast(
        currentLanguage === "ar"
            ? "تمت إضافة المنتج للسلة"
            : "Product added to cart"
    );
}


function removeFromCart(cartId) {

    cart =
        cart.filter(
            item =>
                item.cartId !==
                cartId
        );


    saveCart();

    renderCart();
}


function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );

    const count =
        document.getElementById(
            "cartCount"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    count.textContent =
        cart.length;


    if (!cart.length) {

        container.innerHTML = `
            <div class="empty-category">
                <i class="fa-solid fa-bag-shopping"></i>
                <br><br>
                ${
                    currentLanguage === "ar"
                        ? "السلة فارغة"
                        : "Your cart is empty"
                }
            </div>
        `;

        totalElement.textContent =
            "0 EGP";

        return;
    }


    container.innerHTML =
        cart.map(
            item => `

                <div class="cart-item">

                    <img
                        src="${escapeAttribute(item.image)}"
                        alt=""
                    >

                    <div class="cart-item-info">

                        <strong>
                            ${escapeHtml(item.name)}
                        </strong>

                        ${
                            item.productCode
                                ? `
                                    <small>
                                        ${escapeHtml(
                                            item.productCode
                                        )}
                                    </small>
                                  `
                                : ""
                        }

                        ${
                            item.names
                                ? `
                                    <small>
                                        ${
                                            currentLanguage === "ar"
                                                ? "الأسماء: "
                                                : "Names: "
                                        }
                                        ${escapeHtml(
                                            item.names
                                        )}
                                    </small>
                                  `
                                : ""
                        }

                        ${
                            item.date
                                ? `
                                    <small>
                                        ${
                                            currentLanguage === "ar"
                                                ? "التاريخ: "
                                                : "Date: "
                                        }
                                        ${escapeHtml(
                                            item.date
                                        )}
                                    </small>
                                  `
                                : ""
                        }

                        ${
                            item.notes
                                ? `
                                    <small>
                                        ${
                                            currentLanguage === "ar"
                                                ? "الملاحظات: "
                                                : "Notes: "
                                        }
                                        ${escapeHtml(
                                            item.notes
                                        )}
                                    </small>
                                  `
                                : ""
                        }

                        <span class="cart-item-price">
                            ${formatPrice(
                                item.price
                            )} EGP
                        </span>

                    </div>

                    <button
                        class="remove-item"
                        onclick="removeFromCart(${item.cartId})"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>
            `
        ).join("");


    const sum =
        cart.reduce(
            (total,item) =>
                total +
                Number(item.price || 0),
            0
        );


    totalElement.textContent =
        `${formatPrice(sum)} EGP`;
}


function saveCart() {

    localStorage.setItem(
        "tasbehaaa_cart",
        JSON.stringify(cart)
    );
}


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
}


/* =========================
   CART OPEN/CLOSE
========================= */

function openCart() {

    document
        .getElementById(
            "cartSidebar"
        )
        .classList.add(
            "active"
        );


    document
        .getElementById(
            "cartOverlay"
        )
        .classList.add(
            "active"
        );
}


function closeCart() {

    document
        .getElementById(
            "cartSidebar"
        )
        .classList.remove(
            "active"
        );


    document
        .getElementById(
            "cartOverlay"
        )
        .classList.remove(
            "active"
        );
}


/* =========================
   WHATSAPP
========================= */

function checkoutWhatsApp() {

    if (!cart.length) {

        showToast(
            currentLanguage === "ar"
                ? "السلة فارغة"
                : "Your cart is empty"
        );

        return;
    }


    let message =
        currentLanguage === "ar"
            ? "مرحباً Tasbehaaa، أريد طلب المنتجات التالية:\n\n"
            : "Hello Tasbehaaa, I would like to order the following products:\n\n";


    cart.forEach(
        (item,index) => {

            message +=
                `${index + 1}. ${item.name}\n`;


            if (item.productCode) {

                message +=
                    currentLanguage === "ar"
                        ? `كود المنتج: ${item.productCode}\n`
                        : `Product Code: ${item.productCode}\n`;

            }


            message +=
                currentLanguage === "ar"
                    ? `السعر: ${formatPrice(item.price)} جنيه\n`
                    : `Price: ${formatPrice(item.price)} EGP\n`;


            if (item.names) {

                message +=
                    currentLanguage === "ar"
                        ? `الأسماء: ${item.names}\n`
                        : `Names: ${item.names}\n`;

            }


            if (item.date) {

                message +=
                    currentLanguage === "ar"
                        ? `التاريخ: ${item.date}\n`
                        : `Date: ${item.date}\n`;

            }


            if (item.notes) {

                message +=
                    currentLanguage === "ar"
                        ? `ملاحظات: ${item.notes}\n`
                        : `Notes: ${item.notes}\n`;

            }


            message += "\n";

        }
    );


    const total =
        cart.reduce(
            (sum,item) =>
                sum +
                Number(item.price || 0),
            0
        );


    message +=
        currentLanguage === "ar"
            ? `الإجمالي: ${formatPrice(total)} جنيه`
            : `Total: ${formatPrice(total)} EGP`;


    const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            message
        )}`;


    window.open(
        url,
        "_blank"
    );
}


/* =========================
   TOAST
========================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );
}


/* =========================
   SECURITY
========================= */

function escapeHtml(value) {

    return String(
        value ?? ""
    ).replace(
        /[&<>"']/g,
        char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char])
    );
}


function escapeAttribute(value) {

    return escapeHtml(value);
}


/* =========================
   MODAL BACKDROP
========================= */

const productModal =
    document.getElementById(
        "productModal"
    );

if (productModal) {

    productModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                productModal
            ) {

                closeProductModal();

            }

        }
    );

   }
