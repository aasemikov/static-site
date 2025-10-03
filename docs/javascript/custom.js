// Кастомный JavaScript для улучшения UX и функциональности
class CustomSiteEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScroll();
        this.setupReadingProgress();
        this.setupCopyButtons();
        this.setupLazyLoading();
        this.setupThemeEnhancements();
        this.setupNavigationEnhancements();
        this.setupAnalytics();
    }

    // Плавная прокрутка
    setupSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href !== '#') {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Обновляем URL без перезагрузки
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }

    // Прогресс-бар чтения
    setupReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
            progressBar.style.transform = `scaleX(${progress / 100})`;
        });
    }

    // Кнопки копирования кода
    setupCopyButtons() {
        // Добавляем кнопки копирования к блокам кода
        document.querySelectorAll('.highlight').forEach(block => {
            const button = document.createElement('button');
            button.className = 'copy-code-button';
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                <span class="copy-text">Копировать</span>
            `;
            
            button.addEventListener('click', async () => {
                const code = block.querySelector('code')?.textContent || '';
                
                try {
                    await navigator.clipboard.writeText(code);
                    button.classList.add('copied');
                    button.querySelector('.copy-text').textContent = 'Скопировано!';
                    
                    setTimeout(() => {
                        button.classList.remove('copied');
                        button.querySelector('.copy-text').textContent = 'Копировать';
                    }, 2000);
                } catch (err) {
                    console.error('Ошибка копирования:', err);
                }
            });
            
            block.style.position = 'relative';
            block.appendChild(button);
        });

        // Стили для кнопок копирования
        const copyButtonStyles = `
            .copy-code-button {
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(0, 102, 204, 0.9);
                color: white;
                border: none;
                border-radius: 4px;
                padding: 6px 12px;
                font-size: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 4px;
                transition: all 0.3s ease;
                opacity: 0;
            }
            
            .highlight:hover .copy-code-button {
                opacity: 1;
            }
            
            .copy-code-button:hover {
                background: #0066cc;
                transform: translateY(-1px);
            }
            
            .copy-code-button.copied {
                background: #00a651;
            }
            
            .copy-code-button svg {
                width: 14px;
                height: 14px;
            }
        `;
        
        this.injectStyles(copyButtonStyles);
    }

    // Ленивая загрузка изображений
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Улучшения темы
    setupThemeEnhancements() {
        // Сохраняем предпочтение темы
        const savedTheme = localStorage.getItem('md-theme');
        if (savedTheme) {
            document.body.setAttribute('data-md-color-scheme', savedTheme);
        }

        // Слушаем изменения темы
        const themeToggle = document.querySelector('.md-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', (e) => {
                const theme = e.target.checked ? 'slate' : 'default';
                localStorage.setItem('md-theme', theme);
            });
        }

        // Динамическое обновление мета-тега theme-color
        const updateThemeColor = () => {
            const theme = document.body.getAttribute('data-md-color-scheme') || 'default';
            const themeColor = theme === 'slate' ? '#1e293b' : '#0066cc';
            
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) {
                metaThemeColor.content = themeColor;
            }
        };

        // Наблюдатель за изменениями атрибутов
        const observer = new MutationObserver(updateThemeColor);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-md-color-scheme']
        });

        updateThemeColor();
    }

    // Улучшения навигации
    setupNavigationEnhancements() {
        // Подсветка активного раздела
        const sections = document.querySelectorAll('h1, h2, h3[id]');
        const navLinks = document.querySelectorAll('.md-nav__link[href^="#"]');
        
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

        sections.forEach(section => observer.observe(section));

        // Улучшение мобильной навигации
        this.enhanceMobileNavigation();
    }

    // Улучшения для мобильной навигации
    enhanceMobileNavigation() {
        const menuToggle = document.querySelector('.md-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('change', (e) => {
                document.body.style.overflow = e.target.checked ? 'hidden' : '';
            });
        }
    }

    // Базовая аналитика
    setupAnalytics() {
        // Отслеживание кликов по внешним ссылкам
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && link.hostname !== window.location.hostname) {
                this.trackEvent('outbound_click', {
                    url: link.href,
                    text: link.textContent.trim()
                });
            }
        });

        // Отслеживание скролла
        let scrollDepth = {
            25: false,
            50: false,
            75: false,
            100: false
        };

        window.addEventListener('scroll', () => {
            const scrollPercent = this.getScrollPercentage();
            
            Object.keys(scrollDepth).forEach(percent => {
                if (scrollPercent >= parseInt(percent) && !scrollDepth[percent]) {
                    this.trackEvent('scroll_depth', { depth: `${percent}%` });
                    scrollDepth[percent] = true;
                }
            });
        });
    }

    // Вспомогательные методы
    getScrollPercentage() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        return Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
    }

    trackEvent(eventName, properties = {}) {
        // Простая реализация отслеживания событий
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        console.log(`📊 Event: ${eventName}`, properties);
    }

    injectStyles(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Публичные методы для внешнего использования
    refresh() {
        this.setupCopyButtons();
        this.setupLazyLoading();
    }

    // Утилиты для работы с темой
    setTheme(theme) {
        document.body.setAttribute('data-md-color-scheme', theme);
        localStorage.setItem('md-theme', theme);
    }

    getTheme() {
        return document.body.getAttribute('data-md-color-scheme') || 'default';
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.siteEnhancer = new CustomSiteEnhancer();
    
    // Добавляем глобальные стили для анимаций
    const globalStyles = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
        }
        
        .fade-in {
            animation: fadeIn 0.6s ease-out;
        }
        
        .slide-in {
            animation: slideIn 0.4s ease-out;
        }
        
        /* Улучшения для фокуса */
        .md-nav__link:focus,
        .md-toggle:focus,
        .md-search__input:focus {
            outline: 2px solid #0066cc;
            outline-offset: 2px;
        }
        
        /* Улучшения для сниппетов кода */
        .highlight pre {
            border-radius: 8px;
            padding: 1rem;
        }
        
        /* Кастомные стили для таблиц */
        .md-typeset table:not([class]) {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);
});

// Экспорт для использования в качестве модуля
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomSiteEnhancer;
}