// Функция для мобильного меню
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
}

// Закрытие мобильного меню при клике на ссылку
document.addEventListener('DOMContentLoaded', function() {
    const mobileLinks = document.querySelectorAll('#mobileMenu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobileMenu');
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Добавляем классы для контента markdown
    const content = document.querySelector('.main-content');
    if (content) {
        content.classList.add('prose', 'max-w-none');
    }
});