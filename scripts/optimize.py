#!/usr/bin/env python3
"""
Скрипт для оптимизации изображений
"""
import os
from PIL import Image
from pathlib import Path

def optimize_images():
    """Оптимизирует все изображения в директории docs"""
    image_extensions = {'.jpg', '.jpeg', '.png', '.webp'}
    docs_dir = Path('docs')
    
    for image_path in docs_dir.rglob('*'):
        if image_path.suffix.lower() in image_extensions:
            try:
                with Image.open(image_path) as img:
                    # Конвертируем в современные форматы
                    if image_path.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                        output_path = image_path.with_suffix('.webp')
                        img.save(output_path, 'WEBP', quality=85, optimize=True)
                        print(f"✅ Оптимизировано: {image_path} -> {output_path}")
            except Exception as e:
                print(f"❌ Ошибка при обработке {image_path}: {e}")

if __name__ == '__main__':
    optimize_images()