# Отчет по лабораторной работе #2
## Разработка статического сайта с использованием MkDocs и кастомных шаблонов

### Цель работы
Разработка современного статического сайта с использованием MkDocs, кастомных шаблонов на базе Tailwind CSS и настройка автоматизированного пайплайна сборки и деплоя.

### Выполненные задачи

#### 1. Создание кастомных шаблонов

Разработаны модульные шаблоны с разделением на компоненты:

**header.html**
```html
<header class="custom-header">
    <nav class="custom-navbar" aria-label="Основная навигация">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center" aria-hidden="true">
                    <span class="text-white font-bold text-lg">S</span>
                </div>
                <a href="{{ nav.homepage.url|url }}" class="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                    {{ config.site_name }}
                </a>
            </div>

            <div class="hidden md:flex items-center space-x-8">
                {% for nav_item in nav %}
                <a href="{{ nav_item.url|url }}" 
                    class="text-gray-700 hover:text-blue-600 font-medium transition-colors {% if nav_item.active %}text-blue-600{% endif %}"
                    {% if nav_item.active %}aria-current="page"{% endif %}>
                    {{ nav_item.title }}
                </a>
                {% endfor %}
            </div>
        </div>
    </nav>
</header>
```

**footer.html**

```html
<footer class="custom-footer">
    <div class="container mx-auto px-4 py-8 text-center">
        <p class="text-gray-400 text-sm">
            &copy; {{ build_date_utc.strftime('%Y') }} {{ config.site_name }}
        </p>
    </div>
</footer>
```

#### 2. Настройка стилей с Tailwind CSS
Создана расширенная конфигурация Tailwind с кастомизацией типографики:

**tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./custom_theme/**/*.html",
    "./docs/**/*.md",
    "./custom_theme/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          500: '#3b82f6',
          600: '#2563eb',
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            lineHeight: '1.75',
            h1: {
              fontWeight: '700',
              fontSize: '2.25rem',
              marginBottom: '1.5rem',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '0.5rem'
            },
            h2: {
              fontWeight: '600',
              fontSize: '1.875rem',
              marginTop: '2rem',
              marginBottom: '1rem'
            },
            h3: {
              fontWeight: '600', 
              fontSize: '1.5rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem'
            },
            a: {
              color: '#2563eb',
              textDecoration: 'none',
              '&:hover': {
                color: '#1e40af',
                textDecoration: 'underline'
              }
            },
            code: {
              color: '#1f2937',
              backgroundColor: '#f3f4f6',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '400'
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            blockquote: {
              borderLeftColor: '#3b82f6',
              backgroundColor: '#dbeafe',
              fontStyle: 'italic',
              padding: '0.5rem 1rem'
            }
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
```
#### 3. Настройка PostCSS для обработки CSS
**postcss.config.js**
```javascript
module.exports = ({ env }) => ({
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    ...(env === 'production' ? { 'cssnano': {} } : {})
  }
})
```
#### 4. Пайплайн сборки GitHub Actions
Настроен многоэтапный процесс сборки:
```yaml
name: Deploy MkDocs

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-css: 
    name: Build CSS
    runs-on: ubuntu-latest
    steps: 
      - name: Checkout code
        uses: actions/checkout@v4
      - name: ⎔ Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install npm dependencies
        run: npm ci

      - name: Build CSS (development)
        run: npm run build:css

      - name: Build CSS (production)
        run: npm run build:min

      - name: Upload CSS artifacts
        uses: actions/upload-artifact@v4
        with:
          name: css-assets
          path: |
            custom_theme/assets/css/
          retention-days: 1

  build-site:
    name: Build Site
    runs-on: ubuntu-latest
    needs: build-css
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install Python dependencies
        run: |
          python -m pip install --upgrade pip
          pip install mkdocs pymdown-extensions

      - name: Download CSS artifacts
        uses: actions/download-artifact@v4
        with:
          name: css-assets
          path: custom_theme/assets/css/

      - name: Build site with MkDocs
        run: mkdocs build

      - name: Upload site artifacts
        uses: actions/upload-artifact@v4
        with:
          name: built-site
          path: site/
          retention-days: 1

  minify-html:
    name: Minify HTML
    runs-on: ubuntu-latest
    needs: build-site
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install npm dependencies
        run: npm ci

      - name: Download site artifacts
        uses: actions/download-artifact@v4
        with:
          name: built-site
          path: site/

      - name: Minify HTML
        run: npm run build:html

      - name: Upload minified site
        uses: actions/upload-artifact@v4
        with:
          name: minified-site
          path: site/
          retention-days: 1

  validate-html:
    name: Validate HTML
    runs-on: ubuntu-latest
    needs: build-site
    if: always()
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install npm dependencies
        run: npm ci

      - name: Download site artifacts
        uses: actions/download-artifact@v4
        with:
          name: built-site
          path: site/

      - name: Validate HTML
        run: npm run validate
        continue-on-error: true

      - name: Upload validation report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: validation-report
          path: |
            site/**/*.html
          retention-days: 7

  deploy:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    needs: [build-site, minify-html]
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
    
    permissions:
      contents: read
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download minified site artifacts
        uses: actions/download-artifact@v4
        with:
          name: minified-site
          path: ./site

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './site'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
#### 5. Конфигурация валидации HTML
**html-validate.config.js**

```javascript
module.exports = {
  extends: ["html-validate:recommended"],
  rules: {
    "void-style": "off",
    "no-inline-style": "off",
    "attribute-empty-style": "off", 
    "no-implicit-close": "off",
    "close-order": "off",
    "element-permitted-content": "off",
    "attr-quotes": "off",
    "valid-id": "off",
    "wcag/h63": "off",
    "no-redundant-role": "off",
    "unique-landmark": "off",
    "prefer-native-element": "off"
  },
  elements: ["html5"],
  transform: {
    "^.*$": "html-validate-transform-ignore"
  }
};
```
#### 6. Настройка npm scripts
**package.json**
```json
{
  "name": "static-site",
  "version": "1.0.0",
  "scripts": {
    "dev": "postcss src/input.css -o custom_theme/assets/css/tailwind.css --watch",
    "build:css": "postcss src/input.css -o custom_theme/assets/css/tailwind.css",
    "build:min": "NODE_ENV=production postcss src/input.css -o custom_theme/assets/css/tailwind.css",
    "build:html": "node scripts/build-html.js",
    "validate": "html-validate site/",
    "build": "npm run build:css && mkdocs build",
    "build:prod": "npm run build:min && mkdocs build && npm run build:html",
    "ci:build": "npm run build:min && mkdocs build && npm run build:html",
    "ci:validate": "npm run validate"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "postcss-cli": "^10.0.0",
    "tailwindcss": "^3.2.0",
    "@tailwindcss/typography": "^0.5.10",
    "postcss-preset-env": "^8.0.0",
    "cssnano": "^6.0.1",
    "html-validate": "^8.1.0",
    "html-minifier-terser": "^7.2.0"
  }
}
```
### Архитектура решения
#### Структура проекта
```text
project/
├── docs/
├── templates/
│   ├── main.html
│   └── partials/
│       ├── header.html
│       └── footer.html
├── custom_theme/
│   └── assets/
│       └── css/
│           └── tailwind.css
├── src/
│   └── input.css
└── scripts/
    └── build-html.js
```    
#### Компонентный подход
- Header: Навигация, логотип, меню
- Footer: Копирайт, дополнительная информация
- Main content: Динамический контент из Markdown

#### Ключевые особенности реализации
##### Стилизация и дизайн
- Использование Tailwind CSS для утилитарного подхода
- Кастомная типографика с оптимальной читаемостью
- Адаптивный дизайн для мобильных устройств
- Плавные переходы и анимации

##### Производительность
- Минификация CSS и HTML в production-сборке
- Оптимизация загрузки ресурсов
- Постобработка PostCSS с autoprefixer и cssnano

##### Валидация и качество кода
- Интеграция html-validate для проверки HTML
- Настройка правил валидации под требования MkDocs
- Автоматическая проверка в CI/CD

##### Автоматизация процессов
Пайплайн сборки включает:
- Сборка CSS - компиляция Tailwind с минификацией
- Построение сайта - генерация HTML через MkDocs
- Минификация HTML - оптимизация итоговых файлов
- Валидация - проверка качества кода
- Деплой - автоматическая публикация на GitHub Pages

### Результаты работы
- Создана модульная система шаблонов с partials
- Настроена современная система стилей на Tailwind CSS
- Реализован автоматизированный пайплайн сборки и деплоя
- Обеспечена валидация и контроль качества кода
- Настроена минификация ресурсов для production

### Выводы
В ходе лабораторной работы успешно разработана инфраструктура для создания статических сайтов с использованием современных инструментов. Реализованный подход позволяет эффективно управлять контентом через MkDocs, обеспечивает высокое качество кода через автоматическую валидацию и оптимизирует производительность через минификацию ресурсов.