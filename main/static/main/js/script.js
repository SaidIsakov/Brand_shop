// Мобильное меню
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Анимация гамбургера
    const spans = menuToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Закрытие меню при клике на ссылку
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Обработка формы
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const message = contactForm.querySelector('textarea').value;

    // Здесь можно добавить отправку данных на сервер
    console.log('Форма отправлена:', { name, email, message });

    alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
    contactForm.reset();
});

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применяем анимацию к карточкам товаров
document.querySelectorAll('.product-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Изменение навигации при скролле
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ========== РЕАЛИЗАЦИЯ КОРЗИНЫ ==========

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Элементы корзины
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

// Открытие корзины
cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Закрытие корзины
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Добавление товара в корзину
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const productCard = button.closest('.product-card');
        const productId = productCard.dataset.productId;
        const productName = productCard.dataset.productName;
        const productPrice = parseInt(productCard.dataset.productPrice);

        addToCart(productId, productName, productPrice);
    });
});

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCart();
    showAddToCartMessage(name);
}

function showAddToCartMessage(productName) {
    // Создаем временное сообщение о добавлении
    const message = document.createElement('div');
    message.textContent = `${productName} добавлен в корзину`;
    message.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #000;
        color: #fff;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 3000;
        font-weight: bold;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Обновление корзины
function updateCart() {
    // Сохраняем корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Обновляем счетчик
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;

    // Обновляем содержимое корзины
    renderCartItems();

    // Обновляем общую сумму
    updateCartTotal();
}

// Рендер товаров в корзине
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <img src="/placeholder.svg?height=80&width=80" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">${formatPrice(item.price)} ₽</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-btn">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-btn">+</button>
                    <button class="cart-item-remove">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Добавляем обработчики событий для кнопок
    addCartItemEventListeners();
}

// Добавление обработчиков событий для элементов корзины
function addCartItemEventListeners() {
    // Увеличение количества
    document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('.cart-item').dataset.productId;
            changeQuantity(productId, 1);
        });
    });

    // Уменьшение количества
    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('.cart-item').dataset.productId;
            changeQuantity(productId, -1);
        });
    });

    // Удаление товара
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('.cart-item').dataset.productId;
            removeFromCart(productId);
        });
    });
}

// Изменение количества товара
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Удаление товара из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Обновление общей суммы
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `${formatPrice(total)} ₽`;
}

// Форматирование цены
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Обработка кнопки оформления заказа
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Корзина пуста');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Заказ оформлен! Общая сумма: ${formatPrice(total)} ₽\nСпасибо за покупку!`);

    // Очищаем корзину после оформления
    cart = [];
    updateCart();
    closeCart();
});

// Закрытие корзины при нажатии Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
        closeCart();
    }
});

// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
});

// Добавляем CSS для анимации сообщения
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
