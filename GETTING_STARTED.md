# Getting Started - Rental Management App

## 🚀 Khởi động ứng dụng

### 1. Cài đặt dependencies (nếu chưa cài)
```bash
npm install
```

### 2. Khởi động development server
```bash
npm start
```

### 3. Chạy trên thiết bị/emulator
- **Android**: Nhấn `a` trong terminal hoặc chạy `npm run android`
- **iOS**: Nhấn `i` trong terminal hoặc chạy `npm run ios`
- **Web**: Nhấn `w` trong terminal hoặc chạy `npm run web`

## 📱 Luồng ứng dụng hiện tại

### Authentication Flow
1. **Màn hình Login** (mặc định khi chưa đăng nhập)
   - Email: `demo@example.com` (đã điền sẵn)
   - Password: `password` (đã điền sẵn)
   - Nhấn "Login" để vào ứng dụng

2. **Main App** (sau khi đăng nhập)
   - Bottom tabs với 5 tabs:
     - 📊 Dashboard
     - 🏠 Rooms (đã implement search & filter)
     - 💰 Payments
     - 📄 Reports
     - ⚙️ Settings

### Tính năng đã hoàn thành

#### ✅ Task 1-10: Core Infrastructure
- React Native + Expo setup
- TypeScript configuration
- Navigation (React Navigation)
- State management (Zustand + TanStack Query)
- Authentication system
- API client với retry logic
- Internationalization (i18n)
- UI components library
- Property management
- Room management

#### ✅ Task 11: Search & Filter (Mới hoàn thành!)
- **Search**: Tìm kiếm theo room code, room name, tenant name
- **Debounced search**: Tự động delay 300ms
- **Filters**: 
  - Room status (Vacant, Occupied, Maintenance)
  - Payment status (Paid, Unpaid)
  - Price range (Min/Max)
- **Highlight**: Text matching được highlight màu vàng
- **Performance**: Tối ưu cho dataset lên đến 1000 rooms

## 🎯 Cách test Search & Filter

1. Đăng nhập vào app
2. Vào tab "Rooms" (icon nhà)
3. Bạn sẽ thấy:
   - Search bar ở trên cùng
   - 3 room cards mẫu (A101, A102, B201)
   - Filter FAB (nút tròn với icon filter)
   - Add Room FAB (nút tròn với icon +)

4. **Test Search**:
   - Gõ "A101" → Chỉ hiện room A101
   - Gõ "Nguyen" → Hiện room có tenant tên Nguyen
   - Gõ "Deluxe" → Hiện room có tên chứa Deluxe

5. **Test Filter**:
   - Nhấn nút Filter (FAB phía dưới bên phải)
   - Chọn status: Vacant/Occupied/Maintenance
   - Chọn payment status: Paid/Unpaid
   - Nhập price range
   - Nhấn "Apply Filters"

6. **Test Highlight**:
   - Gõ search query
   - Text matching sẽ được highlight màu vàng

## 🔧 Troubleshooting

### App không khởi động được
```bash
# Clear cache và restart
npm start -- --clear
```

### Lỗi "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### App hiển thị màn hình trắng
- Kiểm tra terminal có lỗi không
- Reload app: Nhấn `r` trong terminal hoặc shake device → Reload

### Thay đổi code không cập nhật
- Fast Refresh đang bật mặc định
- Nếu không work: Nhấn `r` để reload

## 📝 Next Steps

Các task tiếp theo cần làm:
- [ ] Task 12: Tenant management
- [ ] Task 13: Fee calculation system
- [ ] Task 14: Payment management
- [ ] Task 15: Checkpoint - Ensure all tests pass
- [ ] Task 16: Notification system
- [ ] Task 17: Reminder system
- [ ] Task 18: Maintenance management
- [ ] Task 19: Dashboard screen
- [ ] Task 20: Report generation

## 🐛 Known Issues

1. **Offline support (Task 7)** - Chưa hoàn thành hoàn toàn
   - Realm integration đang pending
   - Sync service cần hoàn thiện

2. **Tests** - Một số tests có thể fail
   - Property-based tests đã implement
   - Unit tests cần update

## 📚 Documentation

- [API Contract](./src/features/rooms/API_CONTRACT.md)
- [Mock Data Guide](./MOCK_DATA_GUIDE.md)
- [Navigation Types](./src/shared/types/navigation.ts)
- [Design Spec](./.kiro/specs/rental-management-app/design.md)
- [Requirements](./.kiro/specs/rental-management-app/requirements.md)

## 💡 Tips

- Sử dụng TypeScript để có type safety
- Tất cả navigation đều type-safe
- Mock data đã được setup sẵn
- i18n support Vietnamese và English
- Dark mode sẽ được implement sau

---

**Happy Coding! 🎉**
