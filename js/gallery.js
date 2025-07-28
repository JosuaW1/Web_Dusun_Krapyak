// Gallery modal functionality
function openModal(imageSrc) {
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    modalImage.src = imageSrc;
    modal.classList.add('is-active');
}

function closeModal() {
    const modal = document.getElementById('gallery-modal');
    modal.classList.remove('is-active');
}

// Close modal with ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});