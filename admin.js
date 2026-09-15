// ======================================================
// TASBEHAAA FOR HAND MADE MIRRORS
// ADMIN PANEL
// Prepared By: Eng Ahmad
// ======================================================


// ======================================================
// 1. SUPABASE CONFIGURATION
// ======================================================

const SUPABASE_URL =
    "https://nzkgjobzxgvroyzmvvdi.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_8aHDt5z7hV4Ojx69yJx8Fw_HWuFAJYJ";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ======================================================
// 2. GLOBAL VARIABLES
// ======================================================

let currentUser = null;
let products = [];
let selectedFiles = [];
let editingProduct = null;

let currentLanguage = "ar";


// ======================================================
// 3. DOM ELEMENTS
// ======================================================

const loginPage =
    document.getElementById("loginPage");

const adminApp =
    document.getElementById("adminApp");

const loginForm =
    document.getElementById("loginForm");

const loginError =
    document.getElementById("loginError");

const loginBtn =
    document.getElementById("loginBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const adminLanguageBtn =
    document.getElementById("adminLanguageBtn");

const loginArabicBtn =
    document.getElementById("loginArabicBtn");

const loginEnglishBtn =
    document.getElementById("loginEnglishBtn");

const productForm =
    document.getElementById("productForm");

const productImages =
    document.getElementById("productImages");

const imagePreview =
    document.getElementById("imagePreview");

const productsGrid =
    document.getElementById("productsGrid");

const emptyProducts =
    document.getElementById("emptyProducts");

const searchProducts =
    document.getElementById("searchProducts");

const filterCategory =
    document.getElementById("filterCategory");

const totalProducts =
    document.getElementById("totalProducts");

const mirrorsCount =
    document.getElementById("mirrorsCount");

const flowersCount =
    document.getElementById("flowersCount");

const otherCount =
    document.getElementById("otherCount");

const editingProductId =
    document.getElementById("editingProductId");

const formTitle =
    document.getElementById("formTitle");

const saveProductBtn =
    document.getElementById("saveProductBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");


// ======================================================
// 4. INITIALIZATION
// ======================================================

document.addEventListener("DOMContentLoaded", async () => {

    setupNavigation();

    setupLogin();

    setupImageUpload();

    setupProductForm();

    setupSearch();

    setupLanguage();

    setupLogout();

    await checkSession();

});


// ======================================================
// 5. CHECK LOGIN SESSION
// ======================================================

async function checkSession() {

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            console.error(error);
            showLogin();
            return;
        }

        if (data.session) {

            const user =
                data.session.user;

            const isAdmin =
                await checkAdmin(user.id);

            if (isAdmin) {

                currentUser = user;

                showAdmin();

                await loadProducts();

            } else {

                await supabaseClient.auth.signOut();

                showLogin();

                showLoginError(
                    "هذا الحساب ليس لديه صلاحية Admin."
                );

            }

        } else {

            showLogin();

        }

    } catch (error) {

        console.error(error);

        showLogin();

    }

}


// ======================================================
// 6. CHECK ADMIN
// ======================================================

async function checkAdmin(userId) {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("admins")
            .select("user_id")
            .eq("user_id", userId)
            .maybeSingle();

        if (error) {

            console.error(
                "Admin check error:",
                error
            );

            return false;
        }

        return !!data;

    } catch (error) {

        console.error(error);

        return false;

    }

}


// ======================================================
// 7. LOGIN
// ======================================================

function setupLogin() {

    if (!loginForm) return;

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            hideLoginError();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;

            if (!email || !password) {

                showLoginError(
                    "من فضلك أدخل البريد الإلكتروني وكلمة المرور."
                );

                return;
            }

            loginBtn.disabled = true;

            loginBtn.textContent =
                currentLanguage === "ar"
                    ? "جاري تسجيل الدخول..."
                    : "Signing in...";

            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth
                        .signInWithPassword({
                            email,
                            password
                        });

                if (error) {

                    throw error;

                }

                if (!data.user) {

                    throw new Error(
                        "Login failed."
                    );

                }

                const isAdmin =
                    await checkAdmin(
                        data.user.id
                    );

                if (!isAdmin) {

                    await supabaseClient.auth.signOut();

                    throw new Error(
                        currentLanguage === "ar"
                            ? "الحساب ليس Admin."
                            : "This account is not an admin."
                    );

                }

                currentUser =
                    data.user;

                loginForm.reset();

                showAdmin();

                await loadProducts();

            } catch (error) {

                console.error(error);

                showLoginError(
                    getFriendlyError(error)
                );

            } finally {

                loginBtn.disabled = false;

                loginBtn.textContent =
                    currentLanguage === "ar"
                        ? "تسجيل الدخول"
                        : "Login";

            }

        }
    );

}


// ======================================================
// 8. LOGOUT
// ======================================================

function setupLogout() {

    if (!logoutBtn) return;

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await supabaseClient.auth.signOut();

            } catch (error) {

                console.error(error);

            }

            currentUser = null;

            showLogin();

        }
    );

}


// ======================================================
// 9. SHOW LOGIN
// ======================================================

function showLogin() {

    if (loginPage)
        loginPage.style.display = "flex";

    if (adminApp)
        adminApp.style.display = "none";

}


// ======================================================
// 10. SHOW ADMIN
// ======================================================

function showAdmin() {

    if (loginPage)
        loginPage.style.display = "none";

    if (adminApp)
        adminApp.style.display = "block";

}


// ======================================================
// 11. LOGIN ERRORS
// ======================================================

function showLoginError(message) {

    if (!loginError) return;

    loginError.textContent =
        message;

    loginError.style.display =
        "block";

}


function hideLoginError() {

    if (!loginError) return;

    loginError.textContent = "";

    loginError.style.display =
        "none";

}


// ======================================================
// 12. FRIENDLY ERRORS
// ======================================================

function getFriendlyError(error) {

    if (!error)
        return "حدث خطأ غير معروف.";

    const message =
        error.message || "";

    if (
        message.includes(
            "Invalid login credentials"
        )
    ) {

        return currentLanguage === "ar"
            ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
            : "Incorrect email or password.";

    }

    if (
        message.includes(
            "Email not confirmed"
        )
    ) {

        return currentLanguage === "ar"
            ? "يجب تأكيد البريد الإلكتروني أولًا."
            : "Please confirm your email first.";

    }

    return message ||
        (
            currentLanguage === "ar"
                ? "حدث خطأ."
                : "Something went wrong."
        );

}


// ======================================================
// 13. NAVIGATION
// ======================================================

function setupNavigation() {

    const links =
        document.querySelectorAll(
            ".sidebar-link"
        );

    links.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                const section =
                    link.dataset.section;

                links.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });

                link.classList.add(
                    "active"
                );

                showSection(section);

            }
        );

    });

}


function showSection(section) {

    const sections =
        document.querySelectorAll(
            ".admin-section"
        );

    sections.forEach(item => {

        item.classList.add(
            "hidden"
        );

    });


    if (section === "dashboard") {

        document
            .getElementById(
                "dashboardSection"
            )
            ?.classList.remove("hidden");

    }


    if (section === "addProduct") {

        document
            .getElementById(
                "addProductSection"
            )
            ?.classList.remove("hidden");

    }


    if (section === "products") {

        document
            .getElementById(
                "productsSection"
            )
            ?.classList.remove("hidden");

        renderProducts();

    }

}


// ======================================================
// 14. IMAGE UPLOAD
// ======================================================

function setupImageUpload() {

    if (!productImages) return;

    productImages.addEventListener(
        "change",
        event => {

            const files =
                Array.from(
                    event.target.files
                );

            if (!files.length)
                return;


            files.forEach(file => {

                if (
                    file.type.startsWith(
                        "image/"
                    )
                ) {

                    selectedFiles.push(
                        file
                    );

                }

            });


            renderImagePreview();

            productImages.value = "";

        }
    );

}


// ======================================================
// 15. IMAGE PREVIEW
// ======================================================

function renderImagePreview() {

    if (!imagePreview)
        return;

    imagePreview.innerHTML = "";


    selectedFiles.forEach(
        (file, index) => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "preview-item";


            const img =
                document.createElement(
                    "img"
                );

            img.alt =
                "Product image";


            const remove =
                document.createElement(
                    "button"
                );

            remove.type = "button";

            remove.className =
                "preview-remove";

            remove.textContent = "×";


            remove.addEventListener(
                "click",
                () => {

                    selectedFiles.splice(
                        index,
                        1
                    );

                    renderImagePreview();

                }
            );


            item.appendChild(img);

            item.appendChild(remove);

            imagePreview.appendChild(item);


            const reader =
                new FileReader();

            reader.onload =
                event => {

                    img.src =
                        event.target.result;

                };

            reader.readAsDataURL(file);

        }
    );

}


// ======================================================
// 16. PRODUCT FORM
// ======================================================

function setupProductForm() {

    if (!productForm)
        return;


    productForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            await saveProduct();

        }
    );


    if (cancelEditBtn) {

        cancelEditBtn.addEventListener(
            "click",
            () => {

                resetProductForm();

            }
        );

    }

}


// ======================================================
// 17. SAVE PRODUCT
// ======================================================

async function saveProduct() {

    if (!currentUser) {

        alert(
            "يجب تسجيل الدخول أولًا."
        );

        return;

    }


    const nameAr =
        document
            .getElementById(
                "productNameAr"
            )
            .value
            .trim();


    const nameEn =
        document
            .getElementById(
                "productNameEn"
            )
            .value
            .trim();


    const descriptionAr =
        document
            .getElementById(
                "productDescriptionAr"
            )
            .value
            .trim();


    const descriptionEn =
        document
            .getElementById(
                "productDescriptionEn"
            )
            .value
            .trim();


    const category =
        document
            .getElementById(
                "productCategory"
            )
            .value;


    const price =
        Number(
            document
                .getElementById(
                    "productPrice"
                )
                .value
        );


    const discount =
        Number(
            document
                .getElementById(
                    "productDiscount"
                )
                .value
        ) || 0;


    const productId =
        editingProductId.value;


    if (!nameAr) {

        alert(
            "من فضلك اكتب اسم المنتج بالعربي."
        );

        return;

    }


    if (!category) {

        alert(
            "من فضلك اختر القسم."
        );

        return;

    }


    if (!Number.isFinite(price) || price < 0) {

        alert(
            "من فضلك أدخل سعر صحيح."
        );

        return;

    }


    if (
        !Number.isFinite(discount) ||
        discount < 0 ||
        discount > 100
    ) {

        alert(
            "الخصم يجب أن يكون بين 0 و100."
        );

        return;

    }


    saveProductBtn.disabled = true;

    saveProductBtn.textContent =
        productId
            ? "جاري تحديث المنتج..."
            : "جاري حفظ المنتج...";


    try {

        let imageUrls = [];


        // ------------------------------------------
        // Existing images when editing
        // ------------------------------------------

        if (editingProduct) {

            imageUrls =
                normalizeImageUrls(
                    editingProduct.image_urls
                );

        }


        // ------------------------------------------
        // Upload new images
        // ------------------------------------------

        if (selectedFiles.length > 0) {

            const uploadedUrls =
                await uploadImages(
                    selectedFiles
                );

            imageUrls =
                imageUrls.concat(
                    uploadedUrls
                );

        }


        // ------------------------------------------
        // Product object
        // ------------------------------------------

        const productData = {

            name:
                nameAr,

            name_ar:
                nameAr,

            name_en:
                nameEn || nameAr,

            description:
                descriptionAr,

            description_ar:
                descriptionAr,

            description_en:
                descriptionEn,

            price:
                price,

            discount_percent:
                discount,

            category:
                category,

            image_urls:
                imageUrls,

            image_url:
                imageUrls.length
                    ? imageUrls[0]
                    : null

        };


        // ------------------------------------------
        // UPDATE
        // ------------------------------------------

        if (productId) {

            const {
                error
            } =
                await supabaseClient
                    .from("products")
                    .update(productData)
                    .eq(
                        "id",
                        productId
                    );


            if (error)
                throw error;


            alert(
                "تم تحديث المنتج بنجاح."
            );

        }

        // ------------------------------------------
        // INSERT
        // ------------------------------------------

        else {

            const {
                error
            } =
                await supabaseClient
                    .from("products")
                    .insert(
                        productData
                    );


            if (error)
                throw error;


            alert(
                "تم إضافة المنتج بنجاح."
            );

        }


        resetProductForm();

        await loadProducts();

        showSection("products");


        const links =
            document.querySelectorAll(
                ".sidebar-link"
            );

        links.forEach(link => {

            link.classList.remove(
                "active"
            );

            if (
                link.dataset.section ===
                "products"
            ) {

                link.classList.add(
                    "active"
                );

            }

        });


    } catch (error) {

        console.error(
            "Save product error:",
            error
        );


        alert(
            "حدث خطأ أثناء حفظ المنتج:\n\n" +
            getFriendlyError(error)
        );

    } finally {

        saveProductBtn.disabled =
            false;

        saveProductBtn.textContent =
            productId
                ? "حفظ التعديلات"
                : "حفظ المنتج";

    }

}


// ======================================================
// 18. UPLOAD MULTIPLE IMAGES
// ======================================================

async function uploadImages(files) {

    const urls = [];


    for (
        let i = 0;
        i < files.length;
        i++
    ) {

        const file =
            files[i];


        const extension =
            getFileExtension(
                file.name
            );


        const fileName =
            `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 10)}-${i}.${extension}`;


        const filePath =
            `products/${fileName}`;


        const {
            error
        } =
            await supabaseClient
                .storage
                .from("product-images")
                .upload(
                    filePath,
                    file,
                    {
                        cacheControl:
                            "3600",

                        upsert:
                            false,

                        contentType:
                            file.type
                    }
                );


        if (error)
            throw error;


        const {
            data
        } =
            supabaseClient
                .storage
                .from("product-images")
                .getPublicUrl(
                    filePath
                );


        if (
            data &&
            data.publicUrl
        ) {

            urls.push(
                data.publicUrl
            );

        }

    }


    return urls;

}


// ======================================================
// 19. FILE EXTENSION
// ======================================================

function getFileExtension(
    fileName
) {

    const parts =
        fileName.split(".");

    return (
        parts.length > 1
            ? parts.pop()
            : "jpg"
    ).toLowerCase();

}


// ======================================================
// 20. LOAD PRODUCTS
// ======================================================

async function loadProducts() {

    try {

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
                        ascending:
                            false
                    }
                );


        if (error)
            throw error;


        products =
            data || [];


        updateStatistics();

        renderProducts();

    } catch (error) {

        console.error(
            "Load products error:",
            error
        );

        products = [];

        updateStatistics();

        renderProducts();

    }

}


// ======================================================
// 21. NORMALIZE IMAGE URLS
// ======================================================

function normalizeImageUrls(
    value
) {

    if (
        Array.isArray(value)
    ) {

        return value.filter(
            item =>
                typeof item ===
                "string" &&
                item.trim()
        );

    }


    if (
        typeof value ===
        "string"
    ) {

        try {

            const parsed =
                JSON.parse(value);

            if (
                Array.isArray(parsed)
            ) {

                return parsed;

            }

        } catch (error) {

            if (value.trim())
                return [value];

        }

    }


    return [];

}


// ======================================================
// 22. RENDER PRODUCTS
// ======================================================

function renderProducts() {

    if (!productsGrid)
        return;


    let filtered =
        [...products];


    const search =
        (
            searchProducts?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const category =
        filterCategory?.value ||
        "";


    if (search) {

        filtered =
            filtered.filter(
                product => {

                    const text =
                        [
                            product.name,
                            product.name_ar,
                            product.name_en,
                            product.description_ar,
                            product.description_en,
                            product.category
                        ]
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase();

                    return text.includes(
                        search
                    );

                }
            );

    }


    if (category) {

        filtered =
            filtered.filter(
                product =>
                    product.category ===
                    category
            );

    }


    productsGrid.innerHTML = "";


    if (!filtered.length) {

        emptyProducts
            ?.classList
            .remove("hidden");

        return;

    }


    emptyProducts
        ?.classList
        .add("hidden");


    filtered.forEach(
        product => {

            productsGrid.appendChild(
                createProductCard(
                    product
                )
            );

        }
    );

}


// ======================================================
// 23. CREATE PRODUCT CARD
// ======================================================

function createProductCard(
    product
) {

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "product-card";


    const images =
        normalizeImageUrls(
            product.image_urls
        );


    const image =
        images.length
            ? images[0]
            : product.image_url;


    const imageContainer =
        document.createElement(
            "div"
        );

    imageContainer.className =
        "product-card-image";


    if (image) {

        const img =
            document.createElement(
                "img"
            );

        img.src = image;

        img.alt =
            product.name_ar ||
            product.name ||
            "Product";

        img.loading =
            "lazy";

        imageContainer.appendChild(
            img
        );

    }


    const categoryBadge =
        document.createElement(
            "span"
        );

    categoryBadge.className =
        "category-badge";

    categoryBadge.textContent =
        product.category ||
        "—";


    imageContainer.appendChild(
        categoryBadge
    );


    const discount =
        Number(
            product.discount_percent
        ) || 0;


    if (discount > 0) {

        const badge =
            document.createElement(
                "span"
            );

        badge.className =
            "discount-badge";

        badge.textContent =
            `-${discount}%`;

        imageContainer.appendChild(
            badge
        );

    }


    const body =
        document.createElement(
            "div"
        );

    body.className =
        "product-card-body";


    const title =
        document.createElement(
            "h3"
        );

    title.textContent =
        product.name_ar ||
        product.name ||
        "بدون اسم";


    const description =
        document.createElement(
            "p"
        );

    description.textContent =
        product.description_ar ||
        product.description ||
        "";


    const priceBox =
        document.createElement(
            "div"
        );


    const originalPrice =
        Number(
            product.price
        ) || 0;


    const finalPrice =
        originalPrice -
        (
            originalPrice *
            discount /
            100
        );


    const price =
        document.createElement(
            "span"
        );

    price.className =
        "price";

    price.textContent =
        `${formatPrice(finalPrice)} ج.م`;


    priceBox.appendChild(
        price
    );


    if (discount > 0) {

        const oldPrice =
            document.createElement(
                "span"
            );

        oldPrice.className =
            "old-price";

        oldPrice.textContent =
            `${formatPrice(originalPrice)} ج.م`;

        priceBox.appendChild(
            oldPrice
        );

    }


    const actions =
        document.createElement(
            "div"
        );

    actions.className =
        "card-actions";


    const editButton =
        document.createElement(
            "button"
        );

    editButton.type =
        "button";

    editButton.className =
        "edit-btn";

    editButton.textContent =
        "✏️ تعديل";


    editButton.addEventListener(
        "click",
        () => {

            editProduct(
                product
            );

        }
    );


    const deleteButton =
        document.createElement(
            "button"
        );

    deleteButton.type =
        "button";

    deleteButton.className =
        "delete-btn";

    deleteButton.textContent =
        "🗑️ حذف";


    deleteButton.addEventListener(
        "click",
        () => {

            deleteProduct(
                product
            );

        }
    );


    actions.appendChild(
        editButton
    );

    actions.appendChild(
        deleteButton
    );


    body.appendChild(
        title
    );

    body.appendChild(
        description
    );

    body.appendChild(
        priceBox
    );

    body.appendChild(
        actions
    );


    card.appendChild(
        imageContainer
    );

    card.appendChild(
        body
    );


    return card;

}


// ======================================================
// 24. EDIT PRODUCT
// ======================================================

function editProduct(
    product
) {

    editingProduct =
        product;


    editingProductId.value =
        product.id;


    document
        .getElementById(
            "productNameAr"
        )
        .value =
        product.name_ar ||
        product.name ||
        "";


    document
        .getElementById(
            "productNameEn"
        )
        .value =
        product.name_en ||
        "";


    document
        .getElementById(
            "productDescriptionAr"
        )
        .value =
        product.description_ar ||
        product.description ||
        "";


    document
        .getElementById(
            "productDescriptionEn"
        )
        .value =
        product.description_en ||
        "";


    document
        .getElementById(
            "productCategory"
        )
        .value =
        product.category ||
        "";


    document
        .getElementById(
            "productPrice"
        )
        .value =
        product.price ||
        0;


    document
        .getElementById(
            "productDiscount"
        )
        .value =
        product.discount_percent ||
        0;


    selectedFiles =
        [];


    renderImagePreview();


    formTitle.textContent =
        "تعديل المنتج";


    saveProductBtn.textContent =
        "حفظ التعديلات";


    cancelEditBtn.style.display =
        "block";


    showSection(
        "addProduct"
    );


    const links =
        document.querySelectorAll(
            ".sidebar-link"
        );


    links.forEach(link => {

        link.classList.remove(
            "active"
        );


        if (
            link.dataset.section ===
            "addProduct"
        ) {

            link.classList.add(
                "active"
            );

        }

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ======================================================
// 25. DELETE PRODUCT
// ======================================================

async function deleteProduct(
    product
) {

    const name =
        product.name_ar ||
        product.name ||
        "هذا المنتج";


    const confirmed =
        confirm(
            `هل أنت متأكد من حذف:\n\n${name}\n\nسيتم حذف المنتج من المتجر.`
        );


    if (!confirmed)
        return;


    try {

        const {
            error
        } =
            await supabaseClient
                .from("products")
                .delete()
                .eq(
                    "id",
                    product.id
                );


        if (error)
            throw error;


        alert(
            "تم حذف المنتج بنجاح."
        );


        await loadProducts();


    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );


        alert(
            "حدث خطأ أثناء حذف المنتج:\n\n" +
            getFriendlyError(error)
        );

    }

}


// ======================================================
// 26. RESET PRODUCT FORM
// ======================================================

function resetProductForm() {

    editingProduct =
        null;


    editingProductId.value =
        "";


    productForm.reset();


    document
        .getElementById(
            "productDiscount"
        )
        .value = "0";


    selectedFiles =
        [];


    renderImagePreview();


    formTitle.textContent =
        "إضافة منتج جديد";


    saveProductBtn.textContent =
        "حفظ المنتج";


    cancelEditBtn.style.display =
        "none";

}


// ======================================================
// 27. STATISTICS
// ======================================================

function updateStatistics() {

    const total =
        products.length;


    const mirrors =
        products.filter(
            product =>
                product.category ===
                    "مرايات" ||
                product.category ===
                    "مرايات الديكور" ||
                product.category ===
                    "مرايات بنترست"
        ).length;


    const flowers =
        products.filter(
            product =>
                product.category ===
                "بوكيهات الورد"
        ).length;


    const other =
        total -
        mirrors -
        flowers;


    if (totalProducts)
        totalProducts.textContent =
            total;


    if (mirrorsCount)
        mirrorsCount.textContent =
            mirrors;


    if (flowersCount)
        flowersCount.textContent =
            flowers;


    if (otherCount)
        otherCount.textContent =
            Math.max(
                0,
                other
            );

}


// ======================================================
// 28. SEARCH
// ======================================================

function setupSearch() {

    searchProducts?.addEventListener(
        "input",
        renderProducts
    );


    filterCategory?.addEventListener(
        "change",
        renderProducts
    );

}


// ======================================================
// 29. LANGUAGE
// ======================================================

function setupLanguage() {

    loginArabicBtn?.addEventListener(
        "click",
        () => {

            setLanguage("ar");

        }
    );


    loginEnglishBtn?.addEventListener(
        "click",
        () => {

            setLanguage("en");

        }
    );


    adminLanguageBtn?.addEventListener(
        "click",
        () => {

            setLanguage(
                currentLanguage ===
                    "ar"
                    ? "en"
                    : "ar"
            );

        }
    );

}


function setLanguage(
    language
) {

    currentLanguage =
        language;


    document.documentElement.lang =
        language;


    document.documentElement.dir =
        language === "ar"
            ? "rtl"
            : "ltr";


    if (loginArabicBtn) {

        loginArabicBtn.classList.toggle(
            "active",
            language === "ar"
        );

    }


    if (loginEnglishBtn) {

        loginEnglishBtn.classList.toggle(
            "active",
            language === "en"
        );

    }


    if (adminLanguageBtn) {

        adminLanguageBtn.textContent =
            language === "ar"
                ? "🇬🇧 English"
                : "🇪🇬 عربي";

    }


    const emailLabel =
        document.querySelector(
            'label[for="email"]'
        );


    const passwordLabel =
        document.querySelector(
            'label[for="password"]'
        );


    if (emailLabel) {

        emailLabel.textContent =
            language === "ar"
                ? "البريد الإلكتروني"
                : "Email";

    }


    if (passwordLabel) {

        passwordLabel.textContent =
            language === "ar"
                ? "كلمة المرور"
                : "Password";

    }


    if (loginBtn) {

        loginBtn.textContent =
            language === "ar"
                ? "تسجيل الدخول"
                : "Login";

    }

}


// ======================================================
// 30. PRICE FORMAT
// ======================================================

function formatPrice(
    price
) {

    return Number(
        price
    ).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );

}


// ======================================================
// 31. AUTH STATE LISTENER
// ======================================================

supabaseClient.auth.onAuthStateChange(
    async (
        event,
        session
    ) => {

        if (
            event ===
            "SIGNED_OUT"
        ) {

            currentUser =
                null;

            showLogin();

        }


        if (
            event ===
                "SIGNED_IN" &&
            session
        ) {

            const isAdmin =
                await checkAdmin(
                    session.user.id
                );


            if (isAdmin) {

                currentUser =
                    session.user;

                showAdmin();

            }

        }

    }
);


// ======================================================
// END
// ======================================================
