// Кастомный JavaScript для улучшения UX
document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка для якорных ссылок
    const smoothScroll = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // Подсветка текущего раздела в навигации
    const highlightCurrentSection = () => {
        const sections = document.querySelectorAll('h1, h2, h3');
        const navLinks = document.querySelectorAll('.md-nav__link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => {
            if (section.getAttribute('id')) {
                observer.observe(section);
            }
        });
    };

    // Анимация появления элементов при скролле
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.custom-card, .admonition');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    };

    // Инициализация всех функций
    smoothScroll();
    highlightCurrentSection();
    animateOnScroll();

    // Добавление кастомного логотипа ИТМО
    const addCustomLogo = () => {
        const header = document.querySelector('.md-header');
        if (header) {
            const logo = document.createElement('div');
            logo.className = 'itmo-logo';
            logo.innerHTML = `
                <style>
                    .itmo-logo {
                        display: flex;
                        align-items: center;
                        margin-right: 1rem;
                        font-weight: bold;
                        color: var(--itmo-blue);
                    }
                    .itmo-logo::before {
                        content: "🎓";
                        margin-right: 0.5rem;
                        font-size: 1.2rem;
                    }
                </style>
                ИТМО
            `;
            header.insertBefore(logo, header.firstChild);
        }
    };

    addCustomLogo();
});