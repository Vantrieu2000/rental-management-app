# Ứng Dụng Quản Lý Cho Thuê

Ứng dụng di động quản lý bất động sản cho thuê được xây dựng với React Native và Expo.

## 🚀 Bắt Đầu Nhanh

### Cài Đặt
```bash
npm install
```

### Chạy Ứng Dụng
```bash
npm start
```

Sau đó:
- Nhấn `a` để mở trên Android
- Nhấn `i` để mở trên iOS
- Quét QR code bằng Expo Go app

### Đăng Nhập
Thông tin đăng nhập đã được điền sẵn:
- **Email**: admin@gmail.com
- **Password**: password123

## 🔧 Cấu Hình

### API Backend
- **URL**: https://rental-api.melidev.id.vn
- **Ngôn ngữ**: Tiếng Việt (mặc định)
- **Tiền tệ**: VND (mặc định)

### Kiểm Tra Cấu Hình
```bash
node test-env-config.js
```

## 📁 Cấu Trúc Dự Án

```
rental-management-app/
├── src/
│   ├── features/          # Các tính năng (auth, properties, tenants, etc.)
│   ├── shared/            # Code dùng chung
│   ├── infrastructure/    # API clients, database
│   └── store/            # State management (Zustand)
├── .env.development      # Cấu hình development
├── .env.production       # Cấu hình production
└── app.config.js         # Cấu hình Expo
```

## 🧪 Testing

```bash
# Chạy tất cả tests
npm test

# Chạy tests với watch mode
npm run test:watch

# Chạy tests với coverage
npm run test:coverage
```

## 📚 Tài Liệu

- [Hướng Dẫn Tích Hợp](./HUONG_DAN_TICH_HOP.md) - Chi tiết về tích hợp API
- [Backend Integration](./BACKEND_INTEGRATION.md) - API documentation (English)

## 🛠️ Scripts Hữu Ích

```bash
npm start              # Khởi động Metro bundler
npm run android        # Chạy trên Android
npm run ios            # Chạy trên iOS
npm test               # Chạy tests
npm run lint           # Kiểm tra code style
npm run lint:fix       # Tự động fix code style
npm run type-check     # Kiểm tra TypeScript
```

## 🌐 API Endpoints

### Xác Thực
- `POST /auth/login` - Đăng nhập ✅
- `POST /auth/register` - Đăng ký
- `POST /auth/refresh` - Làm mới token
- `POST /auth/logout` - Đăng xuất

### Bất Động Sản
- `GET /properties` - Danh sách bất động sản
- `POST /properties` - Tạo mới
- `GET /properties/:id` - Chi tiết
- `PUT /properties/:id` - Cập nhật
- `DELETE /properties/:id` - Xóa

### Người Thuê
- `GET /tenants` - Danh sách người thuê
- `POST /tenants` - Tạo mới
- `GET /tenants/:id` - Chi tiết
- `PUT /tenants/:id` - Cập nhật
- `DELETE /tenants/:id` - Xóa

## 🔐 Bảo Mật

- JWT tokens với thời gian hết hạn
- Secure storage cho tokens
- HTTPS cho tất cả API calls
- Biometric authentication (tùy chọn)

## 📱 Tính Năng

- ✅ Đăng nhập/Đăng xuất
- ✅ Quản lý bất động sản
- ✅ Quản lý người thuê
- ✅ Quản lý phòng
- ✅ Quản lý thanh toán
- ✅ Thông báo
- ✅ Offline mode
- ✅ Đa ngôn ngữ (Vi/En)

## 🐛 Xử Lý Sự Cố

### App không kết nối API
1. Kiểm tra file `.env.development`
2. Chạy `node test-env-config.js`
3. Khởi động lại Metro: `npm start -- --reset-cache`

### Lỗi đăng nhập
1. Kiểm tra kết nối internet
2. Xác minh thông tin đăng nhập
3. Xem console logs để biết chi tiết

## 📞 Hỗ Trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Console logs trong terminal
2. React Native Debugger
3. File `HUONG_DAN_TICH_HOP.md`

## 📄 License

Private - All rights reserved
