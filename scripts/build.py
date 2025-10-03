#!/usr/bin/env python3
"""
Кастомный скрипт сборки для расширенной функциональности MkDocs
"""

import os
import json
import shutil
import hashlib
from datetime import datetime
from pathlib import Path
import yaml

class CustomBuilder:
    def __init__(self, config_path="mkdocs.yml"):
        self.config_path = config_path
        self.config = self.load_config()
        self.build_dir = Path("dist")
        self.docs_dir = Path("docs")
        
    def load_config(self):
        """Загрузка конфигурации MkDocs"""
        with open(self.config_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    
    def create_build_info(self):
        """Создание файла с информацией о сборке"""
        build_info = {
            "build_date": datetime.utcnow().isoformat(),
            "build_timestamp": int(datetime.utcnow().timestamp()),
            "site_name": self.config.get('site_name', ''),
            "site_url": self.config.get('site_url', ''),
            "python_version": os.popen('python --version').read().strip(),
            "git_commit": self.get_git_commit(),
            "git_branch": self.get_git_branch()
        }
        
        # Сохраняем в JSON
        build_info_path = self.build_dir / "build-info.json"
        with open(build_info_path, 'w', encoding='utf-8') as f:
            json.dump(build_info, f, indent=2, ensure_ascii=False)
        
        # Сохраняем в JS для использования в шаблонах
        js_content = f"const BUILD_INFO = {json.dumps(build_info, ensure_ascii=False)};"
        js_path = self.build_dir / "assets" / "javascripts" / "build-info.js"
        js_path.parent.mkdir(parents=True, exist_ok=True)
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
            
        print("✅ Информация о сборке создана")
    
    def get_git_commit(self):
        """Получение текущего коммита Git"""
        try:
            return os.popen('git rev-parse --short HEAD').read().strip()
        except:
            return "unknown"
    
    def get_git_branch(self):
        """Получение текущей ветки Git"""
        try:
            return os.popen('git rev-parse --abbrev-ref HEAD').read().strip()
        except:
            return "unknown"
    
    def optimize_assets(self):
        """Оптимизация статических ресурсов"""
        assets_dir = self.build_dir / "assets"
        
        if not assets_dir.exists():
            return
            
        # Создание файлов с хешами для кэширования
        for file_path in assets_dir.rglob('*'):
            if file_path.is_file() and file_path.suffix in ['.css', '.js']:
                self.add_asset_hash(file_path)
    
    def add_asset_hash(self, file_path):
        """Добавление хеша к имени файла для кэширования"""
        # Читаем содержимое файла
        with open(file_path, 'rb') as f:
            content = f.read()
        
        # Создаем хеш
        file_hash = hashlib.md5(content).hexdigest()[:8]
        
        # Новое имя файла с хешем
        new_name = f"{file_path.stem}.{file_hash}{file_path.suffix}"
        new_path = file_path.parent / new_name
        
        # Копируем файл с новым именем
        shutil.copy2(file_path, new_path)
        
        print(f"✅ Хеш добавлен: {file_path.name} -> {new_name}")
    
    def create_sitemap(self):
        """Создание кастомной карты сайта"""
        sitemap_path = self.build_dir / "sitemap.xml"
        
        urls = []
        for file_path in self.build_dir.rglob('*.html'):
            if file_path.name != '404.html':
                relative_path = file_path.relative_to(self.build_dir)
                urls.append(f"https://aasemikov.github.io/my-static-site/{relative_path}")
        
        sitemap_content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
"""
        for url in urls:
            sitemap_content += f"""  <url>
    <loc>{url}</loc>
    <lastmod>{datetime.utcnow().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
"""
        sitemap_content += "</urlset>"
        
        with open(sitemap_path, 'w', encoding='utf-8') as f:
            f.write(sitemap_content)
        
        print("✅ Карта сайта создана")
    
    def create_robots_txt(self):
        """Создание robots.txt"""
        robots_path = self.build_dir / "robots.txt"
        
        robots_content = """User-agent: *
Allow: /

Sitemap: https://aasemikov.github.io/my-static-site/sitemap.xml
"""
        with open(robots_path, 'w', encoding='utf-8') as f:
            f.write(robots_content)
        
        print("✅ robots.txt создан")
    
    def validate_build(self):
        """Валидация собранного сайта"""
        required_files = [
            self.build_dir / "index.html",
            self.build_dir / "assets" / "javascripts" / "build-info.js",
            self.build_dir / "sitemap.xml",
            self.build_dir / "robots.txt"
        ]
        
        for file_path in required_files:
            if not file_path.exists():
                print(f"❌ Отсутствует обязательный файл: {file_path}")
                return False
        
        print("✅ Сборка успешно валидирована")
        return True
    
    def build(self):
        """Основной процесс сборки"""
        print("🚀 Запуск кастомной сборки...")
        
        # Создаем директорию для сборки
        self.build_dir.mkdir(exist_ok=True)
        
        # Запускаем стандартную сборку MkDocs
        print("📦 Запуск MkDocs build...")
        os.system("mkdocs build --site-dir dist --strict")
        
        # Дополнительные шаги сборки
        self.create_build_info()
        self.optimize_assets()
        self.create_sitemap()
        self.create_robots_txt()
        
        # Финальная валидация
        if self.validate_build():
            print("🎉 Кастомная сборка завершена успешно!")
        else:
            print("⚠️ Сборка завершена с предупреждениями")

def main():
    """Точка входа"""
    builder = CustomBuilder()
    builder.build()

if __name__ == "__main__":
    main()