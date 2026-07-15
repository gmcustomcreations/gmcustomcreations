const fs = require('fs');
const path = require('path');

const IMAGE_BASE = './images';
const CATEGORIES = ['furniture', 'cabinets', 'workspaces', 'utilities', 'woodart', 'general'];
const OUTPUT_FILE = './index.html';

function getImagesForCategory(category) {
    const dir = path.join(IMAGE_BASE, category);
    if (!fs.existsSync(dir)) return [];
    
    return fs.readdirSync(dir)
        .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
        .map((file, index) => {
            const fullPath = path.join(IMAGE_BASE, category, file).replace(/\\/g, '/');
            const title = file.replace(/\.[^/.]+$/, "")
                .replace(/-/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
            return {
                id: Date.now() + index, // unique-ish
                category: category,
                img: fullPath,
                title: title,
                desc: `Custom ${category} piece.`
            };
        });
}

function generatePortfolioData() {
    let allItems = [];
    CATEGORIES.forEach(cat => {
        const items = getImagesForCategory(cat);
        allItems = allItems.concat(items);
    });
    return allItems;
}

// Simple string replacement to update the JS array in index.html
function updateHtmlWithNewData(newItems) {
    let htmlContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
    
    const dataString = JSON.stringify(newItems, null, 4);
    
    // Find and replace the portfolioItems array
    const arrayRegex = /let portfolioItems = \[[\s\S]*?\];/m;
    const replacement = `let portfolioItems = ${dataString};`;
    
    if (arrayRegex.test(htmlContent)) {
        htmlContent = htmlContent.replace(arrayRegex, replacement);
        fs.writeFileSync(OUTPUT_FILE, htmlContent);
        console.log(`✅ Updated portfolio with ${newItems.length} images!`);
    } else {
        console.error('❌ Could not find portfolioItems array in index.html');
    }
}

const items = generatePortfolioData();
updateHtmlWithNewData(items);

console.log('Gallery generation complete. Refresh index.html to see changes.');