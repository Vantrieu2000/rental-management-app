# Setup QR Code và Google AdMob

## Bước 1: Cài đặt thư viện

Chạy lệnh sau để cài đặt các thư viện cần thiết:

```bash
# QR Code
npx expo install react-native-qrcode-svg react-native-svg

# Google AdMob
npx expo install expo-ads-admob react-native-google-mobile-ads
```

## Bước 2: Cấu hình AdMob

### 2.1. Tạo tài khoản AdMob
1. Truy cập https://admob.google.com/
2. Đăng ký tài khoản
3. Tạo ứng dụng mới
4. Lấy App ID (Android và iOS)
5. Tạo Ad Unit ID cho Banner

### 2.2. Cập nhật app.json

Thêm vào `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
          "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
        }
      ]
    ]
  }
}
```

### 2.3. Cập nhật .env.development

Thêm vào file `.env.development`:

```env
# AdMob Configuration
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
EXPO_PUBLIC_ADMOB_IOS_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_ADMOB_BANNER_ID_IOS=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX

# Bank Information for QR Code
EXPO_PUBLIC_BANK_NAME=Vietcombank
EXPO_PUBLIC_BANK_ACCOUNT_NUMBER=1234567890
EXPO_PUBLIC_BANK_ACCOUNT_NAME=NGUYEN VAN A
EXPO_PUBLIC_BANK_BIN=970436
```

## Bước 3: Test với AdMob Test IDs

Trong quá trình development, sử dụng Test IDs:

- **Android Banner**: `ca-app-pub-3940256099942544/6300978111`
- **iOS Banner**: `ca-app-pub-3940256099942544/2934735716`

## Bước 4: Rebuild app

Sau khi cài đặt, cần rebuild app:

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

## Lưu ý quan trọng

1. **Test IDs**: Luôn sử dụng Test IDs khi development để tránh bị ban account
2. **Production**: Chỉ sử dụng real Ad Unit IDs khi deploy production
3. **QR Code**: Cần có thông tin ngân hàng thật để tạo QR code chuyển khoản
4. **VietQR**: QR code sử dụng chuẩn VietQR của Ngân hàng Nhà nước Việt Nam
