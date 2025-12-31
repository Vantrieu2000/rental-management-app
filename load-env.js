/**
 * Load Environment Variables
 * Script này load các biến môi trường từ file .env vào process.env
 */

const fs = require('fs');
const path = require('path');

// Xác định file .env nào sẽ load
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.development';

const envPath = path.resolve(__dirname, envFile);

console.log('📋 Loading environment from:', envFile);

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Parse file .env
  envContent.split('\n').forEach(line => {
    // Bỏ qua comment và dòng trống
    if (line.trim() === '' || line.trim().startsWith('#')) {
      return;
    }
    
    // Parse key=value
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      
      // Set vào process.env nếu chưa có
      if (!process.env[key]) {
        process.env[key] = value;
        console.log(`  ✓ ${key}=${value.substring(0, 30)}${value.length > 30 ? '...' : ''}`);
      }
    }
  });
  
  console.log('✅ Environment variables loaded successfully!\n');
} else {
  console.warn(`⚠️  Warning: ${envFile} not found\n`);
}
