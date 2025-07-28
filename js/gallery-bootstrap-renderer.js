// Gallery Bootstrap Carousel Renderer
document.addEventListener('DOMContentLoaded', function() {
    console.log('Gallery Bootstrap Renderer loaded');
    
    function renderGalleryBootstrap() {
        console.log('Rendering Gallery Bootstrap Carousel...');
        
        const carouselInner = document.getElementById('gallery-carousel-inner');
        const indicators = document.getElementById('gallery-indicators');
        
        if (!carouselInner || typeof galleryData === 'undefined') {
            console.error('Gallery carousel container or data not found');
            return;
        }
        
        // Clear existing content
        carouselInner.innerHTML = '';
        indicators.innerHTML = '';
        
        // Group gallery data into slides
        const itemsPerSlide = getItemsPerSlide();
        const slides = [];
        
        for (let i = 0; i < galleryData.length; i += itemsPerSlide) {
            slides.push(galleryData.slice(i, i + itemsPerSlide));
        }
        
        console.log(`Creating ${slides.length} gallery slides with ${itemsPerSlide} items each`);
        
        slides.forEach((slide, slideIndex) => {
            // Create slide
            const slideDiv = document.createElement('div');
            slideDiv.className = `carousel-item ${slideIndex === 0 ? 'active' : ''}`;
            
            const rowDiv = document.createElement('div');
            rowDiv.className = 'row';
            
            slide.forEach(item => {
                const colDiv = document.createElement('div');
                colDiv.className = getColumnClass();
                
                colDiv.innerHTML = `
                    <div class="card h-100">
                        <div class="card-img-top gallery-item" onclick="openModal('${item.gambarBesar}', '${item.judul}')" style="cursor: pointer;">
                            <img src="${item.gambar}" class="card-img-top" alt="${item.judul}" style="height: 200px; object-fit: cover;">
                        </div>
                        <div class="card-body">
                            <h6 class="card-title text-center">${item.judul}</h6>
                            <p class="card-text text-center small">${item.deskripsi}</p>
                        </div>
                    </div>
                `;
                
                rowDiv.appendChild(colDiv);
            });
            
            slideDiv.appendChild(rowDiv);
            carouselInner.appendChild(slideDiv);
            
            // Create indicator
            const indicator = document.createElement('li');
            indicator.setAttribute('data-target', '#galleryCarousel');
            indicator.setAttribute('data-slide-to', slideIndex);
            indicator.onclick = function(e) {
                e.preventDefault();
                goToSlide('galleryCarousel', slideIndex);
            };
            if (slideIndex === 0) indicator.className = 'active';
            indicators.appendChild(indicator);
        });
        
        console.log('Gallery Bootstrap Carousel rendering completed');
    }
    
    function getItemsPerSlide() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1024) return 2;
        return 3;
    }
    
    function getColumnClass() {
        const width = window.innerWidth;
        if (width <= 768) return 'col-12';
        if (width <= 1024) return 'col-6';
        return 'col-4';
    }
    
    // Try to render with retry mechanism
    function attemptRender(attempts = 0) {
        if (attempts > 10) {
            console.error('Failed to render Gallery after 10 attempts');
            return;
        }
        
        if (typeof galleryData === 'undefined' || !galleryData || galleryData.length === 0) {
            console.log(`Attempt ${attempts + 1}: Gallery data not ready, retrying...`);
            setTimeout(() => attemptRender(attempts + 1), 200);
            return;
        }
        
        renderGalleryBootstrap();
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (typeof galleryData !== 'undefined' && galleryData.length > 0) {
            renderGalleryBootstrap();
        }
    });
    
    // Start rendering
    attemptRender();
    
    // Make function globally available
    window.renderGalleryBootstrap = renderGalleryBootstrap;
});