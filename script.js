

const WHATSAPP_NUMBER = "917510548596";


const PRODUCTS = [

    {
        id: 1,
        name: "Classic Burger",
        price: 120,
        category: "Fast Food",
        image: "images/burger.jpg",
        description: "Juicy burger with fresh vegetables."
    },

    {
        id: 2,
        name: "Cheese Pizza",
        price: 250,
        category: "Fast Food",
        image: "images/pizza.jpg",
        description: "Cheesy pizza with delicious toppings."
    },

    {
        id: 3,
        name: "French Fries",
        price: 80,
        category: "Sides",
        image: "images/fries.jpg",
        description: "Crispy golden potato fries."
    },

    {
        id: 4,
        name: "Chicken Sandwich",
        price: 140,
        category: "Fast Food",
        image: "images/sandwich.jpg",
        description: "Fresh sandwich with tasty filling."
    },

    {
        id: 5,
        name: "Cold Drink",
        price: 50,
        category: "Drinks",
        image: "images/drink.jpg",
        description: "A chilled refreshing drink."
    },

    {
        id: 6,
        name: "Chocolate Shake",
        price: 110,
        category: "Drinks",
        image: "images/shake.jpg",
        description: "Creamy chocolate milkshake."
    }

];


// ==================================
// GLOBAL VARIABLES
// ==================================

let cart = {};

let activeCategory = "All";

const productsEl = document.getElementById("products");

const categoriesEl = document.getElementById("categories");

const cartDrawer = document.getElementById("cartDrawer");

const overlay = document.getElementById("overlay");

const checkoutBackdrop =
    document.getElementById("checkoutBackdrop");


// ==================================
// PRICE FORMAT
// ==================================

function money(amount) {

    return "₹" + amount.toLocaleString("en-IN");

}


// ==================================
// DISPLAY CATEGORIES
// ==================================

function renderCategories() {

    const categories = [
        "All",
        ...new Set(PRODUCTS.map(p => p.category))
    ];

    categoriesEl.innerHTML = categories.map(category => `

        <button
            class="category-btn ${category === activeCategory ? "active" : ""}"
            data-category="${category}">

            ${category}

        </button>

    `).join("");


    categoriesEl.querySelectorAll("[data-category]")
        .forEach(button => {

            button.addEventListener("click", () => {

                activeCategory = button.dataset.category;

                renderCategories();

                renderProducts();

            });

        });

}


// ==================================
// DISPLAY PRODUCTS
// ==================================

function renderProducts() {

    const visible = activeCategory === "All"

        ? PRODUCTS

        : PRODUCTS.filter(
            p => p.category === activeCategory
        );


    productsEl.innerHTML = visible.map(product => `

        <article class="product-card">

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.style.display='none'">

            </div>

            <div class="product-info">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="product-bottom">

                    <span class="price">
                        ${money(product.price)}
                    </span>

                    <button
                        class="add-btn"
                        data-add="${product.id}">

                        + Add

                    </button>

                </div>

            </div>

        </article>

    `).join("");


    productsEl.querySelectorAll("[data-add]")
        .forEach(button => {

            button.addEventListener("click", () => {

                changeQuantity(
                    Number(button.dataset.add),
                    1
                );

            });

        });

}


// ==================================
// GET CART DETAILS
// ==================================

function getCartDetails() {

    const items = Object.entries(cart).map(
        ([id, quantity]) => {

            const product = PRODUCTS.find(
                p => p.id === Number(id)
            );

            return {
                ...product,
                quantity
            };

        }
    );

    const total = items.reduce(

        (sum, item) =>
            sum + item.price * item.quantity,

        0

    );

    return {
        items,
        total
    };

}


// ==================================
// CHANGE QUANTITY
// ==================================

function changeQuantity(id, amount) {

    cart[id] = (cart[id] || 0) + amount;

    if (cart[id] <= 0) {

        delete cart[id];

    }

    renderCart();

}


// ==================================
// DISPLAY CART
// ==================================

function renderCart() {

    const { items, total } = getCartDetails();


    const count = items.reduce(

        (sum, item) =>
            sum + item.quantity,

        0

    );


    document.getElementById("cartCount")
        .textContent = count;


    document.getElementById("cartTotal")
        .textContent = money(total);


    document.getElementById("cartItems").innerHTML =

        items.length

        ? items.map(item => `

            <div class="cart-row">

                <div>

                    <h4>${item.name}</h4>

                    <small>
                        ${money(item.price)} × ${item.quantity}
                    </small>

                </div>

                <div class="qty-controls">

                    <button data-minus="${item.id}">
                        −
                    </button>

                    <strong>${item.quantity}</strong>

                    <button data-plus="${item.id}">
                        +
                    </button>

                </div>

            </div>

        `).join("")

        : `

            <div class="empty-cart">

                Your cart is empty.

                <br>

                Add something delicious!

            </div>

        `;


    // DECREASE QUANTITY

    document.querySelectorAll("[data-minus]")
        .forEach(button => {

            button.addEventListener("click", () => {

                changeQuantity(
                    Number(button.dataset.minus),
                    -1
                );

            });

        });


    // INCREASE QUANTITY

    document.querySelectorAll("[data-plus]")
        .forEach(button => {

            button.addEventListener("click", () => {

                changeQuantity(
                    Number(button.dataset.plus),
                    1
                );

            });

        });

}


// ==================================
// OPEN CART
// ==================================

function openCart() {

    cartDrawer.classList.add("open");

    overlay.classList.add("show");

}


// ==================================
// CLOSE CART
// ==================================

function closeCart() {

    cartDrawer.classList.remove("open");

    overlay.classList.remove("show");

}


document.getElementById("cartOpen")
    .addEventListener("click", openCart);


document.getElementById("cartClose")
    .addEventListener("click", closeCart);


overlay.addEventListener("click", closeCart);


// ==================================
// CHECKOUT
// ==================================

document.getElementById("checkoutBtn")
    .addEventListener("click", () => {

        if (Object.keys(cart).length === 0) {

            alert("Please add food to your cart first.");

            return;

        }

        closeCart();

        checkoutBackdrop.classList.add("show");

    });


// CLOSE CHECKOUT

document.getElementById("checkoutClose")
    .addEventListener("click", () => {

        checkoutBackdrop.classList.remove("show");

    });


checkoutBackdrop.addEventListener("click", event => {

    if (event.target === checkoutBackdrop) {

        checkoutBackdrop.classList.remove("show");

    }

});


// ==================================
// WHATSAPP ORDER SYSTEM
// ==================================

document.getElementById("checkoutForm")
    .addEventListener("submit", event => {

        event.preventDefault();


        // CHECK WHATSAPP NUMBER

        if (!/^91[0-9]{10}$/.test(WHATSAPP_NUMBER)) {

            alert(
                "Please enter the correct restaurant WhatsApp number in script.js"
            );

            return;

        }


        // CUSTOMER DETAILS

        const name = document
            .getElementById("customerName")
            .value.trim();

        const phone = document
            .getElementById("customerPhone")
            .value.trim();

        const address = document
            .getElementById("customerAddress")
            .value.trim();

        const note = document
            .getElementById("orderNote")
            .value.trim();


        if (!name || !phone || !address) {

            alert("Please fill in all required details.");

            return;

        }


        // GET ORDER

        const { items, total } = getCartDetails();


        // CREATE WHATSAPP MESSAGE

        const message = [

            "🍔 *NEW QUICKBITE ORDER*",

            "",

            "*ORDER DETAILS*",

            ...items.map(item =>

                `${item.name} x ${item.quantity} = ${money(
                    item.price * item.quantity
                )}`

            ),

            "",

            `*TOTAL: ${money(total)}*`,

            "",

            "*CUSTOMER DETAILS*",

            `Name: ${name}`,

            `Phone: ${phone}`,

            `Address: ${address}`,

            `Note: ${note || "None"}`,

            "",

            "Please confirm this order."

        ].join("\n");


        // CREATE WHATSAPP LINK

        const whatsappURL =

            "https://wa.me/" +

            WHATSAPP_NUMBER +

            "?text=" +

            encodeURIComponent(message);


        // OPEN WHATSAPP USING HTTPS NAVIGATION

        window.location.href = whatsappURL;


    });


// ==================================
// FOOTER YEAR
// ==================================

document.getElementById("year")
    .textContent = new Date().getFullYear();


// ==================================
// INITIALIZE WEBSITE
// ==================================

renderCategories();

renderProducts();

renderCart();