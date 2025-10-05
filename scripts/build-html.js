const minify = require('html-minifier-terser').minify;
const fs = require('fs').promises;
const path = require('path');

async function minifyHTML() {
  const siteDir = './site';
  
  try {
    const files = await getHTMLFiles(siteDir);
    console.log(`Found ${files.length} HTML files to minify`);
    
    for (const file of files) {
      console.log(`Minifying ${file}...`);
      const html = await fs.readFile(file, 'utf8');
      
      const minified = await minify(html, {
        // Безопасные опции, которые не ломают структуру
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true, // Сохраняет пробелы вокруг элементов
        preserveLineBreaks: true,   // Сохраняет переносы строк
        minifyCSS: true,
        minifyJS: true,
        removeAttributeQuotes: false, // НЕ убираем кавычки у атрибутов
        collapseBooleanAttributes: false, // НЕ схлопываем булевы атрибуты
        removeEmptyAttributes: false, // НЕ удаляем пустые атрибуты
        removeOptionalTags: false, // НЕ удаляем опциональные теги
        removeRedundantAttributes: false, // НЕ удаляем избыточные атрибуты
        useShortDoctype: false // НЕ используем короткий doctype
      });
      
      await fs.writeFile(file, minified);
    }
    
    console.log('HTML minification completed!');
  } catch (error) {
    console.error('Error minifying HTML:', error);
  }
}

async function getHTMLFiles(dir) {
  const files = [];
  
  async function scanDirectory(directory) {
    const items = await fs.readdir(directory);
    
    for (const item of items) {
      const fullPath = path.join(directory, item);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (item.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  }
  
  await scanDirectory(dir);
  return files;
}

if (require.main === module) {
  minifyHTML();
}

module.exports = minifyHTML;