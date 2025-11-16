// Product Image Gallery - исправленная версия
function initProductGallery() {
    console.log('Initializing product gallery...');

    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');
    const currentImageSpan = document.getElementById('currentImage');
    const totalImagesSpan = document.getElementById('totalImages');

    // Если нет элементов галереи - выходим тихо
    if (!mainImage || thumbnails.length === 0) {
        console.log('No gallery elements found');
        return;
    }

    // Create images array from thumbnails
    const images = Array.from(thumbnails).map(thumb => thumb.src);
    let currentIndex = 0;

    // Update total images count (с проверкой)
    if (totalImagesSpan) {
        totalImagesSpan.textContent = images.length;
    }

    // Update main image with smooth transition
    function updateMainImage(index) {
        if (index < 0 || index >= images.length) return;

        if (mainImage) {
            mainImage.style.opacity = '0';
        }

        setTimeout(() => {
            if (mainImage && thumbnails[index]) {
                mainImage.src = images[index];
                mainImage.alt = thumbnails[index].alt;
                currentIndex = index;

                if (currentImageSpan) {
                    currentImageSpan.textContent = index + 1;
                }

                // Update active thumbnail
                thumbnails.forEach((thumb, i) => {
                    if (thumb) {
                        thumb.classList.toggle('active', i === index);
                    }
                });

                mainImage.style.opacity = '1';
            }
        }, 150);
    }

    // Делегирование событий для миниатюр
    document.addEventListener('click', function(e) {
        const thumbnail = e.target.closest('.thumbnail');
        if (thumbnail && thumbnails) {
            const index = Array.from(thumbnails).indexOf(thumbnail);
            if (index !== -1) {
                updateMainImage(index);
            }
        }
    });

    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
            updateMainImage(newIndex);
        });
    }

    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
            updateMainImage(newIndex);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && prevBtn) {
            prevBtn.click();
        } else if (e.key === 'ArrowRight' && nextBtn) {
            nextBtn.click();
        }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    if (mainImage) {
        mainImage.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        mainImage.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        if (touchEndX < touchStartX - 50 && nextBtn) {
            nextBtn.click();
        }
        if (touchEndX > touchStartX + 50 && prevBtn) {
            prevBtn.click();
        }
    }

    // Size selector
    document.addEventListener('click', function(e) {
        const sizeBtn = e.target.closest('.size-btn');
        if (sizeBtn) {
            const sizeButtons = document.querySelectorAll('.size-btn');
            sizeButtons.forEach(b => {
                if (b) b.classList.remove('active');
            });
            sizeBtn.classList.add('active');
        }
    });

    // Color selector
    document.addEventListener('click', function(e) {
        const colorBtn = e.target.closest('.color-btn');
        if (colorBtn) {
            const colorButtons = document.querySelectorAll('.color-btn');
            colorButtons.forEach(b => {
                if (b) b.classList.remove('active');
            });
            colorBtn.classList.add('active');
        }
    });

    // Инициализация первой миниатюры как активной
    if (thumbnails.length > 0 && thumbnails[0]) {
        thumbnails[0].classList.add('active');
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing product gallery');
    initProductGallery();
});

// Инициализация после HTMX
if (typeof htmx !== 'undefined') {
    htmx.onLoad(function(content) {
        console.log('HTMX loaded - reinitializing product gallery');
        setTimeout(initProductGallery, 50); // Небольшая задержка для надёжности
    });
}

window.initProductGallery = initProductGallery;
