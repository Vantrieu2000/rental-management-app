# Hướng dẫn cài đặt QR Code và Google AdMob

## 📦 Bước 1: Cài đặt thư viện

Chạy các lệnh sau trong terminal:

```bash
# Di chuyển vào thư mục project
cd rental-management-app

# Cài đặt QR Code libraries
npx expo install react-native-qrcode-svg react-native-svg

# Cài đặt Google AdMob
npx expo install react-native-google-mobile-ads

# Cài đặt dependencies
npm install
```

## 🔧 Bước 2: Cấu hình Google AdMob

### 2.1. Tạo tài khoản AdMob

1. Truy cập: https://admob.google.com/
2. Đăng nhập bằng tài khoản Google
3. Tạo ứng dụng mới:
   - Chọn "Apps" → "Add App"
   - Chọn platform (Android/iOS)
   - Nhập tên app: "Rental Management"
   - Lấy **App ID**

### 2.2. Tạo Ad Units

1. Trong app vừa tạo, chọn "Ad units" → "Add ad unit"
2. Chọn "Banner"
3. Nhập tên: "Main Banner"
4. Lấy **Ad Unit ID**

### 2.3. Cập nhật file .env.development

Mở file `.env.development` và thêm các dòng sau:

```env
# ============================================
# AdMob Configuration
# ============================================
# Lấy từ Google AdMob Console
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
EXPO_PUBLIC_ADMOB_IOS_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_ADMOB_BANNER_ID_IOS=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX

# ============================================
# Bank Information for QR Code
# ============================================
# Thông tin ngân hàng của chủ trọ
EXPO_PUBLIC_BANK_NAME=Vietcombank
EXPO_PUBLIC_BANK_ACCOUNT_NUMBER=1234567890
EXPO_PUBLIC_BANK_ACCOUNT_NAME=NGUYEN VAN A
EXPO_PUBLIC_BANK_BIN=970436

# Danh sách BIN code các ngân hàng Việt Nam:
# Vietcombank: 970436
# VietinBank: 970415
# BIDV: 970418
# Agribank: 970405
# Techcombank: 970407
# MB Bank: 970422
# ACB: 970416
# Sacombank: 970403
# VPBank: 970432
# TPBank: 970423
```

## 🧪 Bước 3: Test với AdMob Test IDs

**QUAN TRỌNG**: Trong quá trình development, app đã được cấu hình sử dụng Test IDs tự động.

Test IDs mặc định:
- **Android Banner**: `ca-app-pub-3940256099942544/6300978111`
- **iOS Banner**: `ca-app-pub-3940256099942544/2934735716`

Bạn **KHÔNG CẦN** thay đổi gì. App sẽ tự động:
- Sử dụng Test IDs khi `__DEV__ = true` (development mode)
- Sử dụng Real IDs khi build production

## 🏦 Bước 4: Cấu hình thông tin ngân hàng

### 4.1. Lấy thông tin ngân hàng

Bạn cần có:
1. **Tên ngân hàng**: VD: Vietcombank, VietinBank, BIDV...
2. **Số tài khoản**: Số tài khoản ngân hàng của bạn
3. **Tên chủ tài khoản**: Tên đầy đủ (VIẾT HOA, không dấu)
4. **BIN code**: Mã ngân hàng (xem danh sách ở trên)

### 4.2. Cập nhật vào .env.development

Thay thế các giá trị mẫu bằng thông tin thật của bạn:

```env
EXPO_PUBLIC_BANK_NAME=Vietcombank
EXPO_PUBLIC_BANK_ACCOUNT_NUMBER=1234567890
EXPO_PUBLIC_BANK_ACCOUNT_NAME=NGUYEN VAN A
EXPO_PUBLIC_BANK_BIN=970436
```

## 🚀 Bước 5: Rebuild và chạy app

```bash
# Clear cache
npx expo start -c

# Hoặc rebuild native code
npx expo run:android
# hoặc
npx expo run:ios
```

## ✅ Bước 6: Kiểm tra tính năng

### 6.1. Kiểm tra Banner Ads

1. Mở app
2. Vào màn **Login** → Bạn sẽ thấy banner quảng cáo ở trên cùng
3. Vào màn **Tra Cứu Thanh Toán** → Bạn sẽ thấy banner quảng cáo
4. Vào màn **Chi Tiết Thanh Toán** → Bạn sẽ thấy banner quảng cáo

### 6.2. Kiểm tra QR Code

1. Đăng nhập vào app (hoặc dùng tra cứu)
2. Vào màn **Chi Tiết Thanh Toán** của một phòng có tiền chưa thanh toán
3. Scroll xuống → Bạn sẽ thấy card **"Quét mã QR để chuyển khoản"**
4. QR code hiển thị với:
   - Mã QR có thể quét
   - Thông tin ngân hàng
   - Số tiền cần thanh toán
   - Nội dung chuyển khoản

### 6.3. Test QR Code

1. Mở app ngân hàng trên điện thoại
2. Chọn chức năng "Quét QR"
3. Quét mã QR trên màn hình
4. Kiểm tra thông tin chuyển khoản có đúng không

## 🔒 Bước 7: Deploy Production

### 7.1. Cập nhật Real Ad Unit IDs

Khi sẵn sàng deploy production:

1. Lấy Real Ad Unit IDs từ AdMob Console
2. Cập nhật vào `.env.production`:

```env
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID=ca-app-pub-YOUR_REAL_ID~XXXXXXXXXX
EXPO_PUBLIC_ADMOB_IOS_APP_ID=ca-app-pub-YOUR_REAL_ID~XXXXXXXXXX
EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID=ca-app-pub-YOUR_REAL_ID/XXXXXXXXXX
EXPO_PUBLIC_ADMOB_BANNER_ID_IOS=ca-app-pub-YOUR_REAL_ID/XXXXXXXXXX
```

### 7.2. Build Production

```bash
# Build Android
eas build --platform android --profile production

# Build iOS
eas build --platform ios --profile production
```

## ⚠️ Lưu ý quan trọng

### AdMob

1. **KHÔNG BAO GIỜ** click vào quảng cáo của chính mình
2. **KHÔNG BAO GIỜ** yêu cầu người khác click vào quảng cáo
3. **LUÔN LUÔN** sử dụng Test IDs khi development
4. Chỉ sử dụng Real IDs khi deploy production
5. Vi phạm có thể dẫn đến **BAN ACCOUNT** vĩnh viễn

### QR Code

1. Kiểm tra kỹ thông tin ngân hàng trước khi deploy
2. Test QR code với app ngân hàng thật
3. Đảm bảo BIN code đúng với ngân hàng của bạn
4. Tên chủ tài khoản phải VIẾT HOA, không dấu

### Bảo mật

1. **KHÔNG** commit file `.env.development` lên Git
2. **KHÔNG** chia sẻ Ad Unit IDs công khai
3. **KHÔNG** chia sẻ thông tin ngân hàng công khai
4. Sử dụng `.gitignore` để bảo vệ thông tin nhạy cảm

## 🆘 Troubleshooting

### Lỗi: "AdMob not initialized"

```bash
# Rebuild app
npx expo run:android
```

### Lỗi: "QR Code not showing"

1. Kiểm tra đã cài đặt `react-native-svg`
2. Rebuild app
3. Kiểm tra thông tin ngân hàng trong `.env.development`

### Lỗi: "Banner not showing"

1. Kiểm tra internet connection
2. Đợi vài giây (ads cần thời gian load)
3. Kiểm tra Ad Unit IDs trong `.env.development`
4. Kiểm tra console logs

### QR Code không quét được

1. Kiểm tra BIN code có đúng không
2. Kiểm tra số tài khoản có đúng không
3. Thử với app ngân hàng khác
4. Liên hệ ngân hàng để xác nhận thông tin

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Đọc kỹ hướng dẫn này
2. Kiểm tra console logs
3. Kiểm tra file `.env.development`
4. Rebuild app sau khi thay đổi config
