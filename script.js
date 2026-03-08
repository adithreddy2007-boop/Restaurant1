/* ========= MENU DATA ========= */
const menuItems = [
    { id:1,  name:"Veg Thali",       cat:"lunch",  price:120, desc:"Complete meal with rice, roti, curry & dal.",      img:"image/thali.jpeg",          emoji:"🍱" },
    { id:2,  name:"Paneer Curry",    cat:"lunch",  price:140, desc:"Soft paneer cooked in rich Indian gravy.",         img:"image/panner.jpeg",         emoji:"🍛" },
    { id:3,  name:"Fried Rice",      cat:"lunch",  price:110, desc:"Rice stir-fried with vegetables & spices.",        img:"image/friedrice.jpeg",      emoji:"🍚" },
    { id:4,  name:"Dal Tadka",       cat:"lunch",  price:100, desc:"Yellow lentils tempered with garlic & spices.",    img:"image/daltadka.jpeg",       emoji:"🫕" },
    { id:5,  name:"Chapati Set",     cat:"lunch",  price:80,  desc:"Soft wheat chapatis served fresh & hot.",          img:"image/chapatiset.jpeg",     emoji:"🫓" },
    { id:6,  name:"Lemon Rice",      cat:"lunch",  price:85,  desc:"South Indian rice with lemon & peanuts.",          img:"image/lemonrice.jpeg",      emoji:"🍋" },
    { id:7,  name:"Butter Naan",     cat:"dinner", price:40,  desc:"Soft tandoor bread brushed with butter.",          img:"image/butternaan.jpeg",     emoji:"🫓" },
    { id:8,  name:"Veg Biryani",     cat:"dinner", price:150, desc:"Aromatic basmati rice with fresh vegetables.",     img:"image/vegbiryani.jpeg",     emoji:"🍚" },
    { id:9,  name:"Soup",            cat:"dinner", price:70,  desc:"Warm & comforting vegetable soup.",                img:"image/Soup.jpeg",           emoji:"🍜" },
    { id:10, name:"Salad",           cat:"dinner", price:60,  desc:"Fresh seasonal vegetables with light dressing.",   img:"image/Salad.jpeg",          emoji:"🥗" },
    { id:11, name:"Gobi Manchurian", cat:"dinner", price:130, desc:"Crispy cauliflower tossed in spicy sauce.",        img:"image/gobimanchurian.jpeg", emoji:"🌸" },
    { id:12, name:"Jeera Rice",      cat:"dinner", price:120, desc:"Fragrant basmati rice tempered with cumin.",       img:"image/jeerarice.jpeg",      emoji:"🍚" },
];

/* ========= STATE ========= */
let cart = {};
let currentCat = 'all';
let selectedPayment = 'Cash on Pickup';

/* ========= RENDER MENU ========= */
function renderMenu() {
    const container = document.getElementById('menu-items-container');
    const filtered = currentCat === 'all' ? menuItems : menuItems.filter(i => i.cat === currentCat);
    container.innerHTML = '';
    filtered.forEach(item => {
        const qty = cart[item.id] || 0;
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <img class="item-img" src="${item.img}" alt="${item.name}"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="item-img-placeholder" style="display:none">${item.emoji}</div>
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-desc">${item.desc}</div>
                <div class="item-price">₹${item.price}</div>
            </div>
            <div class="item-actions">
                ${qty === 0
                    ? `<button class="add-btn" onclick="addItem(${item.id})">Add +</button>`
                    : `<button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
                       <span class="qty-display">${qty}</span>
                       <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>`
                }
            </div>`;
        container.appendChild(card);
    });
}

/* ========= ADD / CHANGE / REMOVE ========= */
function addItem(id) {
    cart[id] = 1;
    updateAll();
}

function changeQty(id, delta) {
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    updateAll();
}

function removeItem(id) {
    delete cart[id];
    updateAll();
}

function updateAll() {
    renderMenu();
    renderCart();
}

/* ========= RENDER CART ========= */
function renderCart() {
    const list     = document.getElementById('cart-items-list');
    const summary  = document.getElementById('cart-summary');
    const checkout = document.getElementById('checkout-section');
    const badge    = document.getElementById('cart-count');
    const ids      = Object.keys(cart);

    if (ids.length === 0) {
        list.innerHTML = '<div class="cart-empty-msg">Your cart is empty.<br>Add items from the menu!</div>';
        summary.classList.remove('cart-summary-visible');
        checkout.classList.remove('checkout-visible');
        badge.textContent = '0';
        return;
    }

    let totalQty = 0, subtotal = 0, html = '';
    ids.forEach(id => {
        const item      = menuItems.find(m => m.id == id);
        const qty       = cart[id];
        const lineTotal = item.price * qty;
        subtotal  += lineTotal;
        totalQty  += qty;
        html += `
            <div class="cart-item-row">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-qty">x${qty}</span>
                <span class="cart-item-price">₹${lineTotal}</span>
                <button class="remove-btn" onclick="removeItem(${id})">✕</button>
            </div>`;
    });

    list.innerHTML = html;
    badge.textContent = totalQty;
    document.getElementById('subtotal').textContent = '₹' + subtotal;
    document.getElementById('total').textContent    = '₹' + (subtotal + 10);
    summary.classList.add('cart-summary-visible');
    checkout.classList.add('checkout-visible');
}

/* ========= FILTER CATEGORY ========= */
function filterCategory(cat, btn) {
    currentCat = cat;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('menu-heading').textContent =
        { all: 'All Items', lunch: 'Lunch Menu', dinner: 'Dinner Menu' }[cat];
    renderMenu();
}

/* ========= PAYMENT SELECTION ========= */
function selectPay(btn, method) {
    document.querySelectorAll('.pay-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedPayment = method;
}

/* ========= PLACE ORDER ========= */
function placeOrder() {
    const name  = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();

    if (!name)                        { alert('Please enter your name.');                     return; }
    if (!/^[0-9]{10}$/.test(phone))  { alert('Please enter a valid 10-digit phone number.');  return; }
    if (Object.keys(cart).length===0) { alert('Your cart is empty!');                         return; }

    const orderId = '#PSH' + Math.floor(Math.random() * 90000 + 10000);
    document.getElementById('order-id-display').textContent = 'Order ' + orderId;
    document.getElementById('success-overlay').classList.add('show');
    cart = {};
}

/* ========= INIT ========= */
renderMenu();