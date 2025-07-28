// Carousel Navigation Controls
function prevSlide(carouselId) {
    event.preventDefault();
    event.stopPropagation();
    
    if (typeof $ !== 'undefined') {
        $('#' + carouselId).carousel('prev');
    } else {
        // Fallback for vanilla JS
        const carousel = document.getElementById(carouselId);
        const activeSlide = carousel.querySelector('.carousel-item.active');
        const prevSlide = activeSlide.previousElementSibling;
        
        if (prevSlide && prevSlide.classList.contains('carousel-item')) {
            activeSlide.classList.remove('active');
            prevSlide.classList.add('active');
            updateIndicators(carouselId);
        } else {
            // Go to last slide
            const allSlides = carousel.querySelectorAll('.carousel-item');
            if (allSlides.length > 0) {
                activeSlide.classList.remove('active');
                allSlides[allSlides.length - 1].classList.add('active');
                updateIndicators(carouselId);
            }
        }
    }
}

function nextSlide(carouselId) {
    event.preventDefault();
    event.stopPropagation();
    
    if (typeof $ !== 'undefined') {
        $('#' + carouselId).carousel('next');
    } else {
        // Fallback for vanilla JS
        const carousel = document.getElementById(carouselId);
        const activeSlide = carousel.querySelector('.carousel-item.active');
        const nextSlide = activeSlide.nextElementSibling;
        
        if (nextSlide && nextSlide.classList.contains('carousel-item')) {
            activeSlide.classList.remove('active');
            nextSlide.classList.add('active');
            updateIndicators(carouselId);
        } else {
            // Go to first slide
            const firstSlide = carousel.querySelector('.carousel-item');
            if (firstSlide) {
                activeSlide.classList.remove('active');
                firstSlide.classList.add('active');
                updateIndicators(carouselId);
            }
        }
    }
}

function goToSlide(carouselId, slideIndex) {
    event.preventDefault();
    event.stopPropagation();
    
    if (typeof $ !== 'undefined') {
        $('#' + carouselId).carousel(slideIndex);
    } else {
        // Fallback for vanilla JS
        const carousel = document.getElementById(carouselId);
        const allSlides = carousel.querySelectorAll('.carousel-item');
        
        // Remove active from all slides
        allSlides.forEach(slide => slide.classList.remove('active'));
        
        // Add active to target slide
        if (allSlides[slideIndex]) {
            allSlides[slideIndex].classList.add('active');
            updateIndicators(carouselId);
        }
    }
}

function updateIndicators(carouselId) {
    const carousel = document.getElementById(carouselId);
    const indicators = carousel.querySelector('.carousel-indicators');
    const activeSlide = carousel.querySelector('.carousel-item.active');
    const allSlides = carousel.querySelectorAll('.carousel-item');
    
    if (indicators && activeSlide) {
        const activeIndex = Array.from(allSlides).indexOf(activeSlide);
        const allIndicators = indicators.querySelectorAll('li');
        
        // Update indicators
        allIndicators.forEach((indicator, index) => {
            if (index === activeIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
}

// Prevent default scroll behavior on carousel controls
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to indicators
    document.addEventListener('click', function(e) {
        if (e.target.matches('.carousel-indicators li')) {
            e.preventDefault();
            e.stopPropagation();
            
            const indicator = e.target;
            const carouselId = indicator.getAttribute('data-target').replace('#', '');
            const slideIndex = parseInt(indicator.getAttribute('data-slide-to'));
            
            goToSlide(carouselId, slideIndex);
        }
    });
    
    // Disable auto-slide on hover
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        carousel.addEventListener('mouseenter', function() {
            if (typeof $ !== 'undefined') {
                $(this).carousel('pause');
            }
        });
        
        carousel.addEventListener('mouseleave', function() {
            if (typeof $ !== 'undefined') {
                $(this).carousel('cycle');
            }
        });
    });
});