// Product Image Gallery
document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');
    const currentImageSpan = document.getElementById('currentImage');
    const totalImagesSpan = document.getElementById('totalImages');

    // Create images array from thumbnails
    const images = Array.from(thumbnails).map(thumb => thumb.src);

    let currentIndex = 0;

    // Update total images count
    totalImagesSpan.textContent = images.length;

    // Update main image with smooth transition
    function updateMainImage(index) {
        if (index < 0 || index >= images.length) return;

        mainImage.style.opacity = '0';

        setTimeout(() => {
            mainImage.src = images[index];
            mainImage.alt = thumbnails[index].alt;
            currentIndex = index;
            currentImageSpan.textContent = index + 1;

            // Update active thumbnail
            thumbnails.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
            });

            mainImage.style.opacity = '1';
        }, 150);
    }

    // Thumbnail click handlers
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            updateMainImage(index);
        });
    });

    // Previous button
    prevBtn.addEventListener('click', () => {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        updateMainImage(newIndex);
    });

    // Next button
    nextBtn.addEventListener('click', () => {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        updateMainImage(newIndex);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    mainImage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    mainImage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextBtn.click();
        }
        if (touchEndX > touchStartX + 50) {
            prevBtn.click();
        }
    }

    // Size selector
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Color selector
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            colorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const originalText = addToCartBtn.textContent;
            addToCartBtn.textContent = 'ДОБАВЛЕНО ✓';
            addToCartBtn.style.background = '#4CAF50';
            addToCartBtn.style.borderColor = '#4CAF50';

            setTimeout(() => {
                addToCartBtn.textContent = originalText;
                addToCartBtn.style.background = '#000';
                addToCartBtn.style.borderColor = '#000';
            }, 2000);
        });
    }

    // Wishlist button
    const wishlistBtn = document.querySelector('.wishlist');
    if (wishlistBtn) {
        let isInWishlist = false;

        wishlistBtn.addEventListener('click', () => {
            isInWishlist = !isInWishlist;

            if (isInWishlist) {
                wishlistBtn.style.background = '#000';
                wishlistBtn.style.color = '#fff';
                const svg = wishlistBtn.querySelector('svg');
                if (svg) svg.style.fill = '#fff';
            } else {
                wishlistBtn.style.background = '#fff';
                wishlistBtn.style.color = '#000';
                const svg = wishlistBtn.querySelector('svg');
                if (svg) svg.style.fill = 'none';
            }
        });
    }
});
