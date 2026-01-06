#!/bin/bash

# Script tự động cài đặt QR Code và AdMob
# Chạy: bash install-qr-ads.sh

echo "🚀 Bắt đầu cài đặt QR Code và Google AdMob..."
echo ""

# Kiểm tra npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm chưa được cài đặt. Vui lòng cài đặt Node.js và npm trước."
    exit 1
fi

echo "📦 Bước 1: Cài đặt thư viện..."
echo ""

# Cài đặt QR Code
echo "  → Cài đặt react-native-qrcode-svg và react-native-svg..."
npx expo install react-native-qrcode-svg react-native-svg

# Cài đặt AdMob
echo "  → Cài đặt react-native-google-mobile-ads..."
npx expo install react-native-google-mobile-ads

# Cài đặt dependencies
echo "  → Cài đặt dependencies..."
npm install

echo ""
echo "✅ Đã cài đặt xong các thư viện!"
echo ""

# Kiểm tra file .env.development
if [ ! -f ".env.development" ]; then
    echo "⚠️  File .env.development không tồn tại!"
    echo "   Tạo file .env.development và thêm cấu hình..."
    echo ""
    
    cat > .env.development << 'EOF'
# ============================================
# AdMob Configuration (Test IDs - for development)
# ============================================
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID=ca-app-pub-3940256099942544~3347511713
EXPO_PUBLIC_ADMOB_IOS_APP_ID=ca-app-pub-3940256099942544~1458002511
EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID=ca-app-pub-3940256099942544/6300978111
EXPO_PUBLIC_ADMOB_BANNER_ID_IOS=ca-app-pub-3940256099942544/2934735716

# ============================================
# Bank Information for QR Code
# ============================================
# TODO: Thay đổi thông tin này thành thông tin ngân hàng thật của bạn
EXPO_PUBLIC_BANK_NAME=Vietcombank
EXPO_PUBLIC_BANK_ACCOUNT_NUMBER=1234567890
EXPO_PUBLIC_BANK_ACCOUNT_NAME=NGUYEN VAN A
EXPO_PUBLIC_BANK_BIN=970436
EOF
    
    echo "✅ Đã tạo file .env.development với cấu hình mặc định"
    echo ""
else
    echo "✅ File .env.development đã tồn tại"
    echo ""
    
    # Kiểm tra xem đã có cấu hình AdMob chưa
    if ! grep -q "EXPO_PUBLIC_ADMOB_ANDROID_APP_ID" .env.development; then
        echo "⚠️  Chưa có cấu hình AdMob trong .env.development"
        echo "   Thêm cấu hình AdMob..."
        echo ""
        
        cat >> .env.development << 'EOF'

# ============================================
# AdMob Configuration (Test IDs - for development)
# ============================================
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID=ca-app-pub-3940256099942544~3347511713
EXPO_PUBLIC_ADMOB_IOS_APP_ID=ca-app-pub-3940256099942544~1458002511
EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID=ca-app-pub-3940256099942544/6300978111
EXPO_PUBLIC_ADMOB_BANNER_ID_IOS=ca-app-pub-3940256099942544/2934735716
EOF
        
        echo "✅ Đã thêm cấu hình AdMob"
        echo ""
    fi
    
    # Kiểm tra xem đã có cấu hình Bank chưa
    if ! grep -q "EXPO_PUBLIC_BANK_NAME" .env.development; then
        echo "⚠️  Chưa có cấu hình Bank trong .env.development"
        echo "   Thêm cấu hình Bank..."
        echo ""
        
        cat >> .env.development << 'EOF'

# ============================================
# Bank Information for QR Code
# ============================================
# TODO: Thay đổi thông tin này thành thông tin ngân hàng thật của bạn
EXPO_PUBLIC_BANK_NAME=Vietcombank
EXPO_PUBLIC_BANK_ACCOUNT_NUMBER=1234567890
EXPO_PUBLIC_BANK_ACCOUNT_NAME=NGUYEN VAN A
EXPO_PUBLIC_BANK_BIN=970436
EOF
        
        echo "✅ Đã thêm cấu hình Bank"
        echo ""
    fi
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 Cài đặt hoàn tất!"
echo ""
echo "📋 Các bước tiếp theo:"
echo ""
echo "1. Cập nhật thông tin ngân hàng trong file .env.development:"
echo "   - EXPO_PUBLIC_BANK_NAME"
echo "   - EXPO_PUBLIC_BANK_ACCOUNT_NUMBER"
echo "   - EXPO_PUBLIC_BANK_ACCOUNT_NAME"
echo "   - EXPO_PUBLIC_BANK_BIN"
echo ""
echo "2. (Tùy chọn) Tạo tài khoản Google AdMob và lấy Real Ad Unit IDs"
echo "   Truy cập: https://admob.google.com/"
echo ""
echo "3. Rebuild app:"
echo "   npx expo start -c"
echo "   hoặc"
echo "   npx expo run:android"
echo ""
echo "4. Đọc hướng dẫn chi tiết trong file: INSTALL_INSTRUCTIONS.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
