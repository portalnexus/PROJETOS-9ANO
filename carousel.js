document.getElementById("currentYear").textContent = new Date().getFullYear();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('carouselSlider');
    const prevButton = document.getElementById('carouselPrev');
    const nextButton = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (!slider) return;

    const items = Array.from(slider.children).filter(child => child.classList.contains('carousel-item'));
    if (!items.length) {
        if(prevButton) prevButton.style.display = 'none';
        if(nextButton) nextButton.style.display = 'none';
        if(dotsContainer) dotsContainer.style.display = 'none';
        return;
    }

    const itemsPerView = 1;
    const totalItems = items.length;
    let itemWidth = 0;
    let currentItemIndex = 0;

    function updateItemWidthAndSlider() {
        const wrapper = document.querySelector('.carousel-slider-wrapper');
        if (wrapper) {
            console.log("Carousel debug: wrapper.offsetWidth =", wrapper.offsetWidth, "totalItems =", totalItems);
            itemWidth = wrapper.clientWidth; // Largura do item é a largura do wrapper
            console.log("Carousel debug: itemWidth (from clientWidth) =", itemWidth);
            if (itemWidth <= 0) { console.warn("Carousel warning: itemWidth is 0 or less. Carousel may not display correctly."); return; }
            // Ajusta a largura de cada item do carrossel para 100% do wrapper
            items.forEach(item => {
                item.style.minWidth = `${itemWidth}px`;
                item.style.maxWidth = `${itemWidth}px`; // Garante que não ultrapasse
                item.style.flex = `0 0 ${itemWidth}px`;
            });
            // Ajusta a largura total do slider
            slider.style.width = `${itemWidth * totalItems}px`;
        }
    }

    function createDots() {
        dotsContainer.innerHTML = '';
        const numDots = totalItems;
        if (numDots <= 1) {
            dotsContainer.style.display = 'none';
            return;
        }
        dotsContainer.style.display = 'block';

        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('span');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => {
                currentItemIndex = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }
         updateDotsStatus();
    }

    function updateDotsStatus() {
        const allDots = dotsContainer.querySelectorAll('.carousel-dot');
        if(!allDots.length) return;
        allDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentItemIndex);
        });
    }

    function updateCarouselControls() {
         prevButton.disabled = currentItemIndex === 0;
         nextButton.disabled = currentItemIndex >= totalItems - 1;
    }

    function updateCarousel() {
        // A largura do item (itemWidth) já foi definida para ser a largura do wrapper
        const newTransformValue = -currentItemIndex * itemWidth;
        slider.style.transform = `translateX(${newTransformValue}px)`;
        updateCarouselControls();
        updateDotsStatus();
    }

    prevButton.addEventListener('click', () => {
        if (currentItemIndex > 0) {
            currentItemIndex--;
            updateCarousel();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentItemIndex < totalItems - 1) {
            currentItemIndex++;
            updateCarousel();
        }
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateItemWidthAndSlider(); // Atualiza larguras e o slider
            updateCarousel();
        }, 250);
    });

    // Inicialização
    updateItemWidthAndSlider();
    createDots();
    updateCarousel();
});
