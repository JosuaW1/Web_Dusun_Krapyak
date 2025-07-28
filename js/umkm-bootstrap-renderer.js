// UMKM Bootstrap Carousel Renderer - Enhanced Responsive
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced Responsive UMKM Bootstrap Renderer loaded');
    
    function renderUMKMBootstrap() {
        console.log('Rendering Enhanced Responsive UMKM Bootstrap Carousel...');
        
        const carouselInner = document.getElementById('umkm-carousel-inner');
        const indicators = document.getElementById('umkm-indicators');
        
        if (!carouselInner || typeof umkmData === 'undefined') {
            console.error('Carousel container or data not found');
            return;
        }
        
        // Clear existing content
        carouselInner.innerHTML = '';
        indicators.innerHTML = '';
        
        // Group UMKM data into slides with better responsive logic
        const itemsPerSlide = getItemsPerSlide();
        const slides = [];
        
        for (let i = 0; i < umkmData.length; i += itemsPerSlide) {
            slides.push(umkmData.slice(i, i + itemsPerSlide));
        }
        
        console.log(`Creating ${slides.length} slides with ${itemsPerSlide} items each`);
        
        slides.forEach((slide, slideIndex) => {
            // Create slide
            const slideDiv = document.createElement('div');
            slideDiv.className = `carousel-item ${slideIndex === 0 ? 'active' : ''}`;
            
            const rowDiv = document.createElement('div');
            rowDiv.className = 'row justify-content-center';
            
            slide.forEach(umkm => {
                const colDiv = document.createElement('div');
                colDiv.className = getColumnClass();
                
                colDiv.innerHTML = `
                    <div class="card umkm-card h-100 shadow-sm">
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-2">
                                <h5 class="card-title mb-1 mb-sm-0">${umkm.nama}</h5>
                                <span class="umkm-type-badge">${umkm.jenis}</span>
                            </div>
                            
                            <div class="umkm-info-section mb-3">
                                <div class="umkm-info-item">
                                    <i class="fas fa-user text-info"></i>
                                    <small><strong>Pemilik:</strong> ${umkm.pemilik}</small>
                                </div>
                                <div class="umkm-info-item">
                                    <i class="fas fa-clock text-success"></i>
                                    <small><strong>Jam:</strong> ${umkm.jamOperasional}</small>
                                </div>
                                <div class="umkm-info-item">
                                    <i class="fas fa-phone text-warning"></i>
                                    <small><strong>Kontak:</strong> ${umkm.kontak}</small>
                                </div>
                            </div>
                            
                            <p class="card-text flex-grow-1 text-muted">${umkm.deskripsi}</p>
                        </div>
                        <div class="card-footer bg-light">
                            <a href="${umkm.lokasi}" 
                               target="_blank" 
                               class="btn btn-outline-primary btn-block btn-sm">
                                <i class="fas fa-map-marker-alt"></i> Lihat Lokasi
                            </a>
                        </div>
                    </div>
                `;
                
                rowDiv.appendChild(colDiv);
            });
            
            slideDiv.appendChild(rowDiv);
            carouselInner.appendChild(slideDiv);
            
            // Create indicator
            const indicator = document.createElement('li');
            indicator.setAttribute('data-target', '#umkmCarousel');
            indicator.setAttribute('data-slide-to', slideIndex);
            indicator.onclick = function(e) {
                e.preventDefault();
                goToSlide('umkmCarousel', slideIndex);
            };
            if (slideIndex === 0) indicator.className = 'active';
            indicators.appendChild(indicator);
        });
        
        console.log('Enhanced Responsive UMKM Bootstrap Carousel rendering completed');
    }
    
    function getItemsPerSlide() {
        const width = window.innerWidth;
        if (width <= 576) return 1;        // Extra small devices
        if (width <= 768) return 1;        // Small devices
        if (width <= 992) return 2;        // Medium devices
        return 3;                          // Large devices and up
    }
    
    function getColumnClass() {
        const width = window.innerWidth;
        if (width <= 576) return 'col-12 mb-3';
        if (width <= 768) return 'col-12 mb-3';
        if (width <= 992) return 'col-6 mb-3';
        return 'col-4 mb-3';
    }
    
    // Debounced resize handler for better performance
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (typeof umkmData !== 'undefined' && umkmData.length > 0) {
                renderUMKMBootstrap();
            }
        }, 250);
    }
    
    // Try to render with retry mechanism
    function attemptRender(attempts = 0) {
        if (attempts > 10) {
            console.error('Failed to render UMKM after 10 attempts');
            return;
        }
        
        if (typeof umkmData === 'undefined' || !umkmData || umkmData.length === 0) {
            console.log(`Attempt ${attempts + 1}: UMKM data not ready, retrying...`);
            setTimeout(() => attemptRender(attempts + 1), 200);
            return;
        }
        
        renderUMKMBootstrap();
    }
    
    // Handle window resize with debouncing
    window.addEventListener('resize', handleResize);
    
    // Start rendering
    attemptRender();
    
    // Make function globally available
    window.renderUMKMBootstrap = renderUMKMBootstrap;
});