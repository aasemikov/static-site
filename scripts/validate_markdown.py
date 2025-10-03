#!/usr/bin/env python3
"""
Скрипт для валидации Markdown файлов
"""

import os
import re
from pathlib import Path

def validate_markdown_files():
    """Проверка Markdown файлов на основные ошибки"""
    docs_dir = Path('docs')
    errors = []
    warnings = []
    
    for md_file in docs_dir.rglob('*.md'):
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
                
            # Проверка на незакрытые код-блоки
            code_block_count = content.count('```')
            if code_block_count % 2 != 0:
                errors.append(f"❌ Незакрытый код-блок в {md_file}")
                
            # Проверка на корректность заголовков
            for i, line in enumerate(lines, 1):
                if line.startswith('#'):
                    # Проверка пробела после #
                    if not re.match(r'^#+ ', line):
                        errors.append(f"❌ Неверный формат заголовка в {md_file}:{i} - '{line}'")
                
                # Проверка на нераспознанные ссылки
                if '](' in line and 'http' in line:
                    if 'TODO' in line or 'FIXME' in line:
                        warnings.append(f"⚠️  Возможная незавершенная ссылка в {md_file}:{i} - '{line}'")
                        
        except Exception as e:
            errors.append(f"❌ Ошибка чтения {md_file}: {e}")
    
    # Вывод результатов
    if warnings:
        for warning in warnings:
            print(warning)
    
    if errors:
        for error in errors:
            print(error)
        return False
    else:
        print("✅ Все Markdown файлы прошли валидацию")
        return True

if __name__ == '__main__':
    exit(0 if validate_markdown_files() else 1)