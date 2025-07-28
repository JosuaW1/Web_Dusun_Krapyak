// Simple Navbar Functionality
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.getElementById('navbar-burger');
    const mobileMenu = document.getElementById('navbar-mobile-menu');
    const mobileItems = document.querySelectorAll('.navbar-mobile-item');
    const desktopItems = document.querySelectorAll('.navbar-menu .navbar-item');
    
    console.log('Navbar elements found:', {
        burger: !!burger,
        mobileMenu: !!mobileMenu,
        mobileItems: mobileItems.length,
        desktopItems: desktopItems.length
    });
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        if (!burger || !mobileMenu) return;
        
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        console.log('Menu toggled:', mobileMenu.classList.contains('active'));
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        if (!burger || !mobileMenu) return;
        
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        console.log('Menu closed');
    }
    
    // Smooth scroll to section
    function smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            console.log('Scrolling to:', targetId);
        }
    }
    
    // Burger click handler
    if (burger) {
        burger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
        console.log('Burger click handler attached');
    } else {
        console.error('Burger button not found!');
    }
    
    // Mobile menu item clicks
    mobileItems.forEach(function(item, index) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            console.log('Mobile menu item clicked:', href);
            closeMobileMenu();
            
            // Small delay to allow menu close animation
            setTimeout(function() {
                smoothScrollTo(href);
            }, 300);
        });
    });
    console.log('Mobile menu items handlers attached:', mobileItems.length);
    
    // Desktop menu item clicks
    desktopItems.forEach(function(item, index) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            console.log('Desktop menu item clicked:', href);
            smoothScrollTo(href);
        });
    });
    console.log('Desktop menu items handlers attached:', desktopItems.length);
    
    // Close menu on outside click
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu on window resize (if switching to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024 && mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Add active state to current section
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active from all items
                document.querySelectorAll('.navbar-item').forEach(function(item) {
                    item.classList.remove('active');
                });
                
                // Add active to current section's nav item
                const activeItem = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeItem) {
                    activeItem.classList.add('active');
                }
            }
        });
    }
    
    // Update active nav on scroll (debounced)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNav, 10);
    });
    
    // Initial active nav update
    setTimeout(updateActiveNav, 100);
    
    // Ensure navbar is visible
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.display = 'block';
        console.log('Navbar visibility ensured');
    }
});

// Add active state styles
const activeNavStyles = document.createElement('style');
activeNavStyles.innerHTML = `
    .navbar-item.active {
        background: var(--secondary-green) !important;
        color: var(--text-light) !important;
    }
    
    .navbar-mobile-item.active {
        background: var(--primary-blue) !important;
        border-color: var(--primary-blue) !important;
        color: var(--text-light) !important;
        transform: translateY(-3px) !important;
        box-shadow: 0 8px 25px var(--shadow-blue) !important;
    }
    
    .navbar-mobile-item.active i {
        color: var(--text-light) !important;
    }
    
    /* Responsive navbar styling */
    @media (max-width: 1024px) {
        .navbar-burger {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        .navbar-menu {
            display: none !important;
        }
    }
    
    @media (min-width: 1025px) {
        .navbar-burger {
            display: none !important;
        }
        
        .navbar-menu {
            display: flex !important;
        }
        
        .navbar-mobile-menu {
            display: none !important;
        }
    }
`;
document.head.appendChild(activeNavStyles);