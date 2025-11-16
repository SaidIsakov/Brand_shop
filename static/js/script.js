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

// Вспомогательные функции
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#000' : '#ff4444'};
        color: #fff;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 3000;
        font-family: inherit;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function updateHeaderCartCount(count) {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = count;
    }
}

// Корзина
function initCart() {
    // Переменные для управления размерами
    let selectedSizeId = null;

    // Функция обновления выбранного размера
    function updateSelectedSize() {
        const selectedSizeElement = document.querySelector('.size-option.selected');
        if (selectedSizeElement) {
            selectedSizeId = selectedSizeElement.dataset.sizeId;
        } else {
            selectedSizeId = null;
        }
    }

    // Глобальная функция добавления в корзину
    window.addToCart = function() {
        // Получаем productSlug из глобальной переменной или из другого места
        const productSlug = '{{ product.slug }}'
        console.log('Product Slug:', productSlug);

        if (!productSlug) {
            console.error('Product slug not found');
            showNotification('Ошибка: не найден идентификатор товара', 'error');
            return;
        }

        console.log('Product Slug:', productSlug);

        // Обновляем выбранный размер перед отправкой
        updateSelectedSize();
        console.log('Selected Size ID:', selectedSizeId);

        if (!selectedSizeId) {
            showNotification('Пожалуйста, выберите размер', 'error');
            return;
        }

        // Формируем URL для добавления в корзину
        const cartUrl = `/cart/add/${productSlug}/`;

        let formData = new FormData();
        formData.append('size_id', selectedSizeId);
        formData.append('quantity', '1');

        fetch(cartUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            console.log('Response Status:', response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response Data:', data);
            if (data.error) {
                showNotification(data.error, 'error');
            } else {
                updateHeaderCartCount(data.total_items || data.cart_count);
                showNotification(data.message || 'Товар добавлен в корзину');

                // Обновляем модальное окно корзины через HTMX если доступно
                if (typeof htmx !== 'undefined') {
                    htmx.ajax('GET', '/cart/modal/', {
                        target: '.cart-sidebar',
                        swap: 'innerHTML'
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Ошибка при добавлении в корзину', 'error');
        });
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

        // Добавление в корзину (новый функционал)
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const productCard = btn.closest('.product-card');
            const productSlug = btn.dataset.productSlug || productCard?.dataset.productSlug;

            if (productSlug) {
                addToCart(productSlug);
            } else {
                console.error('Product slug not found');
                showNotification('Ошибка: не найден идентификатор товара', 'error');
            }
        }

        // Выбор размера
        if (e.target.closest('.size-option')) {
            const sizeOption = e.target.closest('.size-option');
            const allSizeOptions = document.querySelectorAll('.size-option');

            // Убираем выделение со всех вариантов
            allSizeOptions.forEach(option => option.classList.remove('selected'));

            // Выделяем выбранный вариант
            sizeOption.classList.add('selected');
            selectedSizeId = sizeOption.dataset.sizeId;

            console.log('Size selected:', selectedSizeId);
        }

        // Управление количеством в корзине
        if (e.target.closest('.increase')) {
            const item = e.target.closest('.cart-item');
            const productId = item.dataset.productId;

        }

        if (e.target.closest('.decrease')) {
            const item = e.target.closest('.cart-item');
            const productId = item.dataset.productId;
            // Здесь можно добавить логику для уменьшения количества через AJAX
        }

        if (e.target.closest('.remove-btn')) {
            const item = e.target.closest('.cart-item');
            const productId = item.dataset.productId;
            // Здесь можно добавить логику для удаления через AJAX
        }

        // Оформление заказа
        if (e.target.closest('.checkout-btn')) {
            // Логика оформления заказа
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

    // Инициализация выбранного размера при загрузке
    const defaultSize = document.querySelector('.size-option.selected') ||
                       document.querySelector('.size-option:not(.out-of-stock)');
    if (defaultSize) {
        defaultSize.classList.add('selected');
        selectedSizeId = defaultSize.dataset.sizeId;
    }
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
window.addToCart = function(productSlug) {
    // Глобальная функция для ручного вызова добавления в корзину
    const initCartFunction = window.initCart;
    if (initCartFunction && typeof initCartFunction.addToCart === 'function') {
        initCartFunction.addToCart(productSlug);
    }
};
