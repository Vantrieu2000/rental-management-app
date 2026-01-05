/**
 * Get Local IP Address
 * Script này giúp tìm IP address của máy tính để dùng cho thiết bị thật
 */

const os = require('os');

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Bỏ qua internal (loopback) và non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return 'localhost';
}

const ip = getLocalIpAddress();
console.log('\n📱 Để kết nối từ thiết bị thật, dùng IP này:');
console.log(`   API_URL=http://${ip}:3000\n`);
console.log('🔧 Cập nhật file .env.development với IP này\n');

module.exports = { getLocalIpAddress };
