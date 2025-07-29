class ImageZoom {
    constructor(containerId, imageId) {
        this.container = document.getElementById(containerId);
        this.image = document.getElementById(imageId);
        this.zoomInBtn = document.getElementById('zoomInBtn');
        this.zoomOutBtn = document.getElementById('zoomOutBtn');
        this.resetZoomBtn = document.getElementById('resetZoomBtn');
        this.zoomIndicator = document.getElementById('zoomIndicator');
        
        // Zoom properties
        this.scale = 1;
        this.minScale = 0.5;
        this.maxScale = 3;
        this.zoomStep = 0.25;
        
        // Pan properties
        this.translateX = 0;
        this.translateY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.lastTranslateX = 0;
        this.lastTranslateY = 0;
        
        // Touch pinch properties
        this.isPinching = false;
        this.initialDistance = 0;
        this.initialScale = 1;
        this.pinchCenter = { x: 0, y: 0 };
        this.lastTouchCenter = { x: 0, y: 0 };
        
        // Touch hint
        this.touchHintTimeout = null;
        
        this.init();
    }
    
    init() {
        if (!this.container || !this.image) return;
        
        // Button events
        this.zoomInBtn?.addEventListener('click', () => this.zoomIn());
        this.zoomOutBtn?.addEventListener('click', () => this.zoomOut());
        this.resetZoomBtn?.addEventListener('click', () => this.resetZoom());
        
        // Mouse wheel zoom
        this.container.addEventListener('wheel', (e) => this.handleWheel(e));
        
        // Mouse drag events
        this.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.container.addEventListener('mouseup', () => this.handleMouseUp());
        this.container.addEventListener('mouseleave', () => this.handleMouseUp());
        
        // Touch events
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Prevent context menu
        this.container.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Initial setup
        this.updateTransform();
        this.updateControls();
        this.createHints();
        this.updateHelpText();
        this.detectTouchDevice();
    }
    
    detectTouchDevice() {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
            this.showTouchHint();
        }
    }
    
    createHints() {
        // Create drag hint
        const dragHint = document.createElement('div');
        dragHint.className = 'drag-hint';
        dragHint.textContent = 'Klik & geser untuk menggeser peta';
        this.container.appendChild(dragHint);
        
        // Create touch gesture hint
        const touchHint = document.createElement('div');
        touchHint.className = 'touch-gesture-hint';
        touchHint.innerHTML = '👆 Sentuh dan geser untuk pan<br>🤏 Pinch untuk zoom';
        this.container.appendChild(touchHint);
        
        // Create mobile help text
        const mobileHelp = document.createElement('div');
        mobileHelp.className = 'mobile-help-text';
        mobileHelp.textContent = '🤏 Pinch zoom • 👆 Drag pan';
        this.container.appendChild(mobileHelp);
    }
    
    showTouchHint() {
        this.container.classList.add('show-touch-hint');
        this.touchHintTimeout = setTimeout(() => {
            this.container.classList.remove('show-touch-hint');
        }, 3000);
    }
    
    updateHelpText() {
        const helpText = this.container.querySelector('.zoom-help-text');
        if (helpText) {
            helpText.innerHTML = 'Scroll: zoom<br>Drag: geser peta';
        }
    }
    
    // Touch utility functions
    getTouchDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    getTouchCenter(touch1, touch2) {
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
    }
    
    getRelativePoint(clientX, clientY) {
        const rect = this.container.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    
    // Touch event handlers
    handleTouchStart(e) {
        e.preventDefault();
        
        // Clear touch hint
        if (this.touchHintTimeout) {
            clearTimeout(this.touchHintTimeout);
            this.container.classList.remove('show-touch-hint');
        }
        
        if (e.touches.length === 2) {
            // Start pinch
            this.isPinching = true;
            this.isDragging = false;
            this.container.classList.add('pinching');
            
            this.initialDistance = this.getTouchDistance(e.touches[0], e.touches[1]);
            this.initialScale = this.scale;
            
            const center = this.getTouchCenter(e.touches[0], e.touches[1]);
            this.pinchCenter = this.getRelativePoint(center.x, center.y);
            this.lastTouchCenter = center;
            
        } else if (e.touches.length === 1 && this.scale > 1) {
            // Start single touch drag (only when zoomed)
            this.isDragging = true;
            this.isPinching = false;
            this.container.classList.add('dragging');
            
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        }
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        
        if (this.isPinching && e.touches.length === 2) {
            // Handle pinch zoom
            const currentDistance = this.getTouchDistance(e.touches[0], e.touches[1]);
            const scaleChange = currentDistance / this.initialDistance;
            const newScale = this.initialScale * scaleChange;
            
            // Constrain scale
            this.scale = Math.max(this.minScale, Math.min(this.maxScale, newScale));
            
            // Handle pinch center for natural zoom
            const currentCenter = this.getTouchCenter(e.touches[0], e.touches[1]);
            const centerDelta = {
                x: currentCenter.x - this.lastTouchCenter.x,
                y: currentCenter.y - this.lastTouchCenter.y
            };
            
            // Adjust translation to keep zoom centered on pinch point
            const containerRect = this.container.getBoundingClientRect();
            const centerX = containerRect.width / 2;
            const centerY = containerRect.height / 2;
            
            const relativeCenter = this.getRelativePoint(currentCenter.x, currentCenter.y);
            const offsetX = relativeCenter.x - centerX;
            const offsetY = relativeCenter.y - centerY;
            
            this.translateX += centerDelta.x - offsetX * (this.scale - this.initialScale) * 0.1;
            this.translateY += centerDelta.y - offsetY * (this.scale - this.initialScale) * 0.1;
            
            this.lastTouchCenter = currentCenter;
            this.constrainPan();
            this.updateTransform();
            
        } else if (this.isDragging && e.touches.length === 1) {
            // Handle single touch drag
            const deltaX = e.touches[0].clientX - this.startX;
            const deltaY = e.touches[0].clientY - this.startY;
            
            this.translateX = this.lastTranslateX + deltaX;
            this.translateY = this.lastTranslateY + deltaY;
            
            this.constrainPan();
            this.updateTransform();
        }
    }
    
    handleTouchEnd(e) {
        if (this.isPinching) {
            this.isPinching = false;
            this.container.classList.remove('pinching');
            
            // Store final translation
            this.lastTranslateX = this.translateX;
            this.lastTranslateY = this.translateY;
        }
        
        if (this.isDragging) {
            this.isDragging = false;
            this.container.classList.remove('dragging');
            
            // Store final translation
            this.lastTranslateX = this.translateX;
            this.lastTranslateY = this.translateY;
        }
    }
    
    // Mouse event handlers (existing)
    handleMouseDown(e) {
        if (this.scale <= 1) return;
        
        e.preventDefault();
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.container.classList.add('dragging');
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        
        this.translateX = this.lastTranslateX + deltaX;
        this.translateY = this.lastTranslateY + deltaY;
        
        this.constrainPan();
        this.updateTransform();
    }
    
    handleMouseUp() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.lastTranslateX = this.translateX;
        this.lastTranslateY = this.translateY;
        this.container.classList.remove('dragging');
    }
    
    // Zoom functions
    zoomIn() {
        if (this.scale < this.maxScale) {
            this.scale = Math.min(this.scale + this.zoomStep, this.maxScale);
            this.updateTransform();
        }
    }
    
    zoomOut() {
        if (this.scale > this.minScale) {
            this.scale = Math.max(this.scale - this.zoomStep, this.minScale);
            this.updateTransform();
        }
    }
    
    resetZoom() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.lastTranslateX = 0;
        this.lastTranslateY = 0;
        this.updateTransform();
    }
    
    handleWheel(e) {
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? -this.zoomStep : this.zoomStep;
        const newScale = this.scale + delta;
        
        if (newScale >= this.minScale && newScale <= this.maxScale) {
            this.scale = newScale;
            this.updateTransform();
        }
    }
    
    constrainPan() {
        const containerRect = this.container.getBoundingClientRect();
        const imageRect = this.image.getBoundingClientRect();
        
        const scaledWidth = imageRect.width;
        const scaledHeight = imageRect.height;
        
        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
        
        this.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, this.translateX));
        this.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, this.translateY));
    }
    
    updateTransform() {
        const transform = `scale(${this.scale}) translate(${this.translateX / this.scale}px, ${this.translateY / this.scale}px)`;
        this.image.style.transform = transform;
        
        this.updateIndicator();
        this.updateControls();
        this.updateContainerState();
    }
    
    updateContainerState() {
        if (this.scale > 1) {
            this.container.classList.add('zoomed');
        } else {
            this.container.classList.remove('zoomed');
            this.translateX = 0;
            this.translateY = 0;
            this.lastTranslateX = 0;
            this.lastTranslateY = 0;
        }
    }
    
    updateIndicator() {
        if (this.zoomIndicator) {
            const percentage = Math.round(this.scale * 100);
            this.zoomIndicator.textContent = `${percentage}%`;
        }
    }
    
    updateControls() {
        if (this.zoomInBtn) {
            this.zoomInBtn.disabled = this.scale >= this.maxScale;
        }
        if (this.zoomOutBtn) {
            this.zoomOutBtn.disabled = this.scale <= this.minScale;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const imageZoom = new ImageZoom('imageZoomContainer', 'zoomableImage');
});