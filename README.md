# PillMate – Smart Healthcare Box & AI Assistant

Hộp thuốc thông minh thế hệ mới kết hợp Trí tuệ nhân tạo (AI) và Internet of Things (IoT). Giải pháp đồng hành giúp người bệnh và người cao tuổi tuân thủ điều trị an toàn, đúng giờ và đúng liều.

## 🌟 Tính Năng Nổi Bật

- **Đèn LED chỉ dẫn đa màu**: Hướng dẫn chính xác ngăn thuốc cần uống theo từng khung giờ.
- **Chuông báo đa âm tần**: Nhắc nhở âm lượng rõ ràng, nhẹ nhàng, không gây giật mình cho người lớn tuổi.
- **Cảm biến hồng ngoại mở nắp**: Xác thực việc mở nắp lấy thuốc và gửi cảnh báo mở sai ngăn.
- **Khóa thông minh an toàn**: Tự động khóa ngăn khi phát hiện nguy cơ quá liều hoặc chưa tới giờ uống.
- **Trợ lý AI Y tế (Groq Cloud)**: Tích hợp mô hình AI siêu tốc `qwen/qwen3.8-27b` tư vấn xử lý quên liều, phân tích tương tác thuốc và dinh dưỡng chuẩn dược lâm sàng.
- **Giao diện đa thiết bị**: Tương thích hoàn hảo trên điện thoại, máy tính bảng và máy tính để bàn (Responsive Design).
- **Hỗ trợ chế độ Sáng / Tối (Light & Dark Mode)**: Chuyển đổi giao diện dễ chịu cho mắt theo thời gian ngày/đêm.

## 🚀 Hướng Dẫn Cài Đặt & Chạy Website

### Yêu cầu
- Node.js (phiên bản 18+ khuyến nghị)

### Cài đặt và khởi chạy

1. Clone repository về máy:
```bash
git clone https://github.com/PHIYEN888/PillMateSmartBox.git
cd PillMateSmartBox
```

2. Tạo tệp cấu hình `.env` từ `.env.example`:
```bash
cp .env.example .env
```
Điền `GROQ_API_KEY` của bạn vào tệp `.env` (Lấy API Key miễn phí tại [Groq Console](https://console.groq.com/keys)).

3. Khởi động server:
```bash
node server.js
```

4. Mở trình duyệt và truy cập:
```
http://localhost:5173
```

## 👥 Đội Ngũ Phát Triển Nòng Cốt

- **CEO — Project Management**: Nguyễn Quốc Hưng
- **CPO — Product Development**: Võ Thị Phi Yến
- **CTO — IoT Technology**: Doãn Nguyễn Phước Sanh
- **CFO — Financial Management**: Huỳnh Thị Thanh Tiền
- **CMO — Marketing & Brand**: Nguyễn Như Huỳnh
- **CCO — Customer Care & Relations**: Nguyễn Văn Phi

## 📄 Bản Quyền & Giấy Phép

© 2026 PillMate HealthTech Solutions. All rights reserved.
