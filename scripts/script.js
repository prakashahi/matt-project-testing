// Function to handle the room slider interactions
const handleRoomSlider = (carouselList) => {
    const carouselScrollbar = document.querySelector(".room-slider .carousel-scrollbar");
    const scrollbarThumb = carouselScrollbar.querySelector(".scrollbar-thumb");
    const carouselButtons = document.querySelectorAll(".room-slider .carousel-button");

    // Function to update scrollbar thumb position
    const updateThumbPosition = () => {
        const scrollPosition = carouselList.scrollLeft;
        const maxScrollPosition = carouselList.scrollWidth - carouselList.clientWidth;
        const thumbPosition = (scrollPosition / maxScrollPosition) * (carouselScrollbar.clientWidth - scrollbarThumb.offsetWidth);
        scrollbarThumb.style.left = `${thumbPosition}px`;
    }

    // Add mousedown event listener to scrollbar thumb
    scrollbarThumb.addEventListener("mousedown", (e) => {
        e.preventDefault();

        const startX = e.clientX;
        const thumbStartLeft = scrollbarThumb.offsetLeft;
        const scrollbarWidth = carouselScrollbar.getBoundingClientRect().width;

        // Handle carousel button clicks
        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const newThumbPosition = thumbStartLeft + deltaX;
            const maxPosition = scrollbarWidth - scrollbarThumb.offsetWidth;

            const boundedPosition = Math.max(0, Math.min(maxPosition, newThumbPosition));
            const scrollRatio = boundedPosition / maxPosition;
            const scrollPosition = scrollRatio * (carouselList.scrollWidth - carouselList.clientWidth);

            carouselList.scrollLeft = `${scrollPosition}`;
            scrollbarThumb.style.left = `${boundedPosition}px`;
        }

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mouseleave", handleMouseUp);
    });

    const handleCarouselButtons = () => {
        const maxScrollLeft = carouselList.scrollWidth - carouselList.clientWidth;
        carouselButtons[0].style.display = carouselList.scrollLeft <= 0 ? "none" : "flex";
        carouselButtons[1].style.display = carouselList.scrollLeft >= maxScrollLeft ? "none" : "flex";
    }

    // Handle carousel button clicks
    carouselButtons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.id === "prev-slide" ? -1 : 1;
            const scrollAmount = carouselList.clientWidth * direction;

            carouselList.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });
    });

    // Update thumb position and carousel buttons on scroll
    carouselList.addEventListener("scroll", () => {
        updateThumbPosition();
        handleCarouselButtons();
    });
}

// Initialize the room slider
const initRoomSlider = () => {
    const carouselList = document.querySelector(".room-slider .carousel-list");

    // Create and append carousel cards
    roomProducts.forEach(product => {
        const carouselCard = document.createElement("li");
        carouselCard.classList.add("carousel-card");

        const { imageSrc, link, label } = product;

        const cardMarkup = ` <a class="card-link" href="${link}">
                                <img class="card-image" src="${imageSrc}" alt="${label}">
                                <button class="card-button">${label}</button>
                            </a>`;

        // Create card markup and add to carousel card
        carouselCard.innerHTML = cardMarkup;
        carouselList.appendChild(carouselCard);
    });

    handleRoomSlider(carouselList);
}

// Initialize the inspiration grid
const initInspirationGrid = () => {
    const productList = document.querySelector(".inspiration-section .product-grid");
    const loadButton = document.querySelector(".inspiration-section .load-button");

    // Define constants
    const productsInitialBatch = 9;
    const productsPerBatch = 6;
    let lastLoadedIndex = 0;

    // Function to load products
    const loadProduct = (startIndex, endIndex, productsPerBatch) => {
        loadButton.closest(".content-loader").classList.remove("loading");
        const productsToLoad = inspirationProducts.slice(startIndex, endIndex);

        const createTooltip = (tooltip) => {
            const { position, title, description, price, link: tooltipLink } = tooltip;

            return `<li class="product-dot" style="top:${position.y}%; left:${position.x}%;">
                        <a class="meta-link" href="${tooltipLink}"></a>
                        <div class="product-tooltip">
                            <div class="tooltip-content">
                                <h3 class="tooltip-title">${title}</h3>
                                <span class="tooltip-category">${description}</span>
                                <h4 class="tooltip-price"><span>€</span> ${price}</h4>
                            </div>
                            <a class="tooltip-arrow" href="${tooltipLink}">
                                <span class="arrow-icon material-symbols-rounded">chevron_right</span>
                            </a>
                        </div>
                    </li>`;
        };

        const createProductCard = (product) => {
            const { imageSrc, link, tooltips } = product;

            let maxTooltips = window.innerWidth <= 767 ? [tooltips[0]] : tooltips;
            const tooltipsHTML = maxTooltips.map(createTooltip).join('');
            
            return `<a href="${link}" class="product-link">
                        <img class="product-image" src="${imageSrc}" alt="Product Image">
                    </a>
                    <ul class="product-meta">
                        ${tooltipsHTML}
                    </ul>
                    <div class="product-info">
                        <a href="#" class="author-name">John Doe</a>
                        <span class="info-icon material-symbols-rounded">info</span>
                    </div>`;
        };

        productsToLoad.forEach((product) => {
            const productCardHTML = createProductCard(product);
            const productCard = document.createElement("li");
            productCard.innerHTML = productCardHTML;
            productCard.classList.add("product-card");
            productList.appendChild(productCard);
        });

        if (endIndex >= inspirationProducts.length) {
            loadButton.disabled = true;
            loadButton.innerText = "Geen producten meer om te laden";
        }

        lastLoadedIndex += productsPerBatch;
    }
    
    loadProduct(lastLoadedIndex, lastLoadedIndex + productsInitialBatch, productsInitialBatch);
    loadButton.addEventListener("click", () => {
        loadButton.closest(".content-loader").classList.add("loading");
        setTimeout(() => loadProduct(lastLoadedIndex, lastLoadedIndex + productsPerBatch, productsPerBatch), 1500);
    });
}

// Initialize the page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    initRoomSlider();
    initInspirationGrid();
});