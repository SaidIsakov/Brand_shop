// Глобальная функция инициализации
function initializeApp() {
    console.log('Initializing app...');

    // Инициализируем все модули
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initAnimations();
    initScrollEffects();
    initCart();
}

// Мобильное меню
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        // Удаляем старые обработчики
        const newToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newToggle, menuToggle);

        newToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const spans = newToggle.querySelectorAll('span');

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
        document.addEventListener('click', function(e) {
            if (e.target.closest('.nav-menu a')) {
                navMenu.classList.remove('active');
                const spans = newToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// Плавная прокрутка
function initSmoothScroll() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('a[href^="#"]')) {
            e.preventDefault();
            const href = e.target.closest('a').getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
}

// Форма обратной связи
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            console.log('Форма отправлена:', Object.fromEntries(formData));
            alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
            contactForm.reset();
        });
    }
}

// Анимации при скролле
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Эффекты при скролле
function initScrollEffects() {
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) {
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }
}

// Корзина
function initCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Функции корзины
    function updateCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (e) {
            console.warn('LocalStorage недоступен');
        }

        // Обновляем счетчик в шапке
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalCount;
        }

        renderCartItems();
    }

    function renderCartItems() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (!cartItems) return;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
            if (cartTotal) cartTotal.textContent = '0 ₽';
            return;
        }

        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="/api/placeholder/80/80" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)} ₽</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase">+</button>
                        <button class="remove-btn">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');

        if (cartTotal) {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `${formatPrice(total)} ₽`;
        }
    }

    function formatPrice(price) {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0';
    }

    // Делегирование событий для корзины
    document.addEventListener('click', function(e) {
        // Открытие корзины
        if (e.target.closest('#cartBtn')) {
            const sidebar = document.getElementById('cartSidebar');
            const overlay = document.getElementById('cartOverlay');
            if (sidebar) sidebar.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Закрытие корзины
        if (e.target.closest('#cartClose') || e.target.closest('#cartOverlay')) {
            const sidebar = document.getElementById('cartSidebar');
            const overlay = document.getElementById('cartOverlay');
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Добавление в корзину
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const productCard = btn.closest('.product-card');
            if (productCard) {
                const productId = productCard.dataset.productId;
                const productName = productCard.dataset.productName;
                const productPrice = parseInt(productCard.dataset.productPrice);

                const existingItem = cart.find(item => item.id === productId);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        quantity: 1
                    });
                }

                updateCart();

                // Показываем сообщение
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
                `;
                document.body.appendChild(message);
                setTimeout(() => message.remove(), 2000);
            }
        }

        // Управление количеством в корзине
        if (e.target.closest('.increase')) {
            const item = e.target.closest('.cart-item');
            const productId = item.dataset.productId;
            const cartItem = cart.find(i => i.id === productId);
            if (cartItem) {
                cartItem.quantity++;
                updateCart();
            }
        }

        if (e.target.closest('.decrease')) {
            const item = e.target.closest('.cart-item');
            const productId = item.dataset.productId;
            const cartItem = cart.find(i => i.id === productId);
            if (cartItem) {
                cartItem.quantity--;
                if (cartItem.quantity <= 0) {
                    cart = cart.filter(i => i.id !== productId);
                }
                updateCart();
            }
        }

        if (e.target.closest('.remove-btn')) {
            const item = e.target.closest('.cart-item');
            const productId = item.dataset.productId;
            cart = cart.filter(i => i.id !== productId);
            updateCart();
        }

        // Оформление заказа
        if (e.target.closest('.checkout-btn')) {
            if (cart.length === 0) {
                alert('Корзина пуста');
                return;
            }
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alert(`Заказ оформлен! Сумма: ${formatPrice(total)} ₽`);
            cart = [];
            updateCart();

            // Закрываем корзину
            const sidebar = document.getElementById('cartSidebar');
            const overlay = document.getElementById('cartOverlay');
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Закрытие корзины по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('cartSidebar');
            const overlay = document.getElementById('cartOverlay');
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Инициализация корзины
    updateCart();
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initializeApp);

// Инициализация после HTMX
if (typeof htmx !== 'undefined') {
    htmx.onLoad(function(content) {
        console.log('HTMX content loaded, reinitializing...');
        initializeApp();
    });
}

// Глобальная функция для вызова извне
window.initializeApp = initializeApp;
