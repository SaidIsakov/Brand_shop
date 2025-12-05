// Глобальная функция инициализации
function initializeApp() {
    console.log('Initializing app...');
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initAnimations();
    initScrollEffects();
    initCart();
}

// Мобильное меню (без изменений)
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
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

// Плавная прокрутка (без изменений)
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

// Форма обратной связи (без изменений)
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

// Анимации при скролле (без изменений)
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

// Эффекты при скролле (без изменений)
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

let selectedSize = null
let selectedSizeId = null

function updateSelectedSize() {
        const sizeRadios = document.querySelectorAll('.size-btn');
        const checkedRadio = Array.from(sizeRadios).find(radio => radio.checked && !radio.disabled);
        if (checkedRadio) {
            selectedSize = checkedRadio.dataset.size;
            selectedSizeId = checkedRadio.value;
            console.log('Updated Selected Size:', selectedSize, 'ID:', selectedSizeId);
        } else {
            selectedSize = null;
            selectedSizeId = null;
            console.log('No valid size selected');
        }
    }


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

// Корзина
function initCart() {

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

        // Выбор размера через радио-кнопки
        if (e.target.closest('.size-btn') || e.target.closest('.label-size')) {
            const radio = e.target.closest('.size-btn') ||
                         document.getElementById(e.target.closest('.label-size').getAttribute('for'));
            if (radio && !radio.disabled) {
                radio.checked = true;
                updateSelectedSize();

                // Обновляем визуальное выделение
                document.querySelectorAll('.label-size').forEach(label => {
                    label.classList.remove('selected');
                });
                const label = document.querySelector(`label[for="${radio.id}"]`);
                if (label) label.classList.add('selected');
            }
        }

        // Остальные обработчики...
        if (e.target.closest('.increase')) {
            const item = e.target.closest('.cart-item');
            const productId = item.dataset.productId;
        }

        if (e.target.closest('.decrease')) {
            const item = e.target.closest('.cart-item');
            const productId = item.dataset.productId;
        }

        if (e.target.closest('.remove-btn')) {
            const item = e.target.closest('.cart-item');
            const productId = item.dataset.productId;
        }

        if (e.target.closest('.checkout-btn')) {
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
    const defaultSize = document.querySelector('.size-btn:checked') ||
                       document.querySelector('.size-btn:not(:disabled)');
    if (defaultSize) {
        defaultSize.checked = true;
        updateSelectedSize();
        const label = document.querySelector(`label[for="${defaultSize.id}"]`);
        if (label) label.classList.add('selected');
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
