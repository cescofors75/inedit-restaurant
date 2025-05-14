const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Directory containing images
const imageDir = path.join(__dirname, '../public/images');

// Function to check if a file is an image
function isImage(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
}

// Function to optimize JPEG images
function optimizeJpeg(filePath) {
  try {
    // Create a backup of the original image
    const backupPath = `${filePath}.backup`;
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
    }
    
    // Use imagemin to optimize the image (you'll need imagemin installed)
    console.log(`Optimizing ${filePath}...`);
    
    // Get file size before optimization
    const statsBefore = fs.statSync(filePath);
    const fileSizeBefore = statsBefore.size / 1024 / 1024; // Convert to MB
    
    // Run optimization command (requires imagemagick)
    execSync(`convert "${filePath}" -strip -quality 80 -resize '2000x2000>' "${filePath}"`);
    
    // Get file size after optimization
    const statsAfter = fs.statSync(filePath);
    const fileSizeAfter = statsAfter.size / 1024 / 1024; // Convert to MB
    
    console.log(`Reduced ${path.basename(filePath)} from ${fileSizeBefore.toFixed(2)}MB to ${fileSizeAfter.toFixed(2)}MB (${((1 - fileSizeAfter/fileSizeBefore) * 100).toFixed(1)}% reduction)`);
  } catch (error) {
    console.error(`Error optimizing ${filePath}:`, error.message);
  }
}

// Function to optimize PNG images
function optimizePng(filePath) {
  try {
    // Create a backup of the original image
    const backupPath = `${filePath}.backup`;
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
    }
    
    // Use imagemin to optimize the image
    console.log(`Optimizing ${filePath}...`);
    
    // Get file size before optimization
    const statsBefore = fs.statSync(filePath);
    const fileSizeBefore = statsBefore.size / 1024 / 1024; // Convert to MB
    
    // Run optimization command (requires pngquant)
    execSync(`pngquant --force --output "${filePath}" "${filePath}"`);
    
    // Get file size after optimization
    const statsAfter = fs.statSync(filePath);
    const fileSizeAfter = statsAfter.size / 1024 / 1024; // Convert to MB
    
    console.log(`Reduced ${path.basename(filePath)} from ${fileSizeBefore.toFixed(2)}MB to ${fileSizeAfter.toFixed(2)}MB (${((1 - fileSizeAfter/fileSizeBefore) * 100).toFixed(1)}% reduction)`);
  } catch (error) {
    console.error(`Error optimizing ${filePath}:`, error.message);
  }
}

// Function to process a directory of images
function processDirectory(dir) {
  // Read all files in the directory
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    // Check if it's a directory
    if (fs.statSync(filePath).isDirectory()) {
      // Recursively process subdirectories
      processDirectory(filePath);
    } else if (isImage(file)) {
      // Optimize image based on its type
      const ext = path.extname(file).toLowerCase();
      
      if (['.jpg', '.jpeg'].includes(ext)) {
        optimizeJpeg(filePath);
      } else if (ext === '.png') {
        optimizePng(filePath);
      }
    }
  });
}

// Create scripts directory if it doesn't exist
if (!fs.existsSync(path.dirname(__dirname, 'scripts'))) {
  fs.mkdirSync(path.dirname(__dirname, 'scripts'));
}

console.log('Starting image optimization...');
processDirectory(imageDir);
console.log('Image optimization complete!');

/*
To use this script:
1. Install required dependencies:
   - npm install -g pngquant-bin
   - Install ImageMagick (for convert command)
     - On macOS: brew install imagemagick
     - On Linux: apt-get install imagemagick
     - On Windows: download from imagemagick.org

2. Run this script:
   - node scripts/optimize-images.js

The script will:
1. Backup original images
2. Compress JPEGs by reducing quality and stripping metadata
3. Optimize PNGs using pngquant
4. Report file size savings for each image
*/

