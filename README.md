# PillMate – Smart Healthcare Box & AI Assistant

Hộp thuốc thông minh thế hệ mới kết hợp Trí tuệ nhân tạo (AI) và Internet of Things (IoT). Giải pháp đồng hành giúp người bệnh và người cao tuổi tuân thủ điều trị an toàn, đúng giờ và đúng liều.

---

## 🌟 Tính Năng Nổi Bật

- **Đèn LED chỉ dẫn đa màu**: Hướng dẫn chính xác ngăn thuốc cần uống theo từng khung giờ.
- **Chuông báo đa âm tần**: Nhắc nhở âm lượng rõ ràng, nhẹ nhàng, phù hợp cho người lớn tuổi.
- **Trợ lý AI Y tế (Groq Cloud)**: Tích hợp mô hình AI siêu tốc tư vấn xử lý quên liều, phân tích tương tác thuốc và dinh dưỡng chuẩn dược lâm sàng.
- **Chế độ Sáng / Tối linh hoạt (Sliding Pill Switch)**: Nút gạt hiện đại chuyển đổi mượt mà giữa chế độ Ban ngày (☀️) và Ban đêm (🌙).
- **Thiết kế Responsive hoàn hảo**: Tương thích mượt mà trên Mobile, Tablet và Desktop.

---

## 🏗️ Cấu Trúc Dự Án (Refactored Architecture)

Dự án được tái cấu trúc theo mô hình module hóa sạch sẽ, tách biệt độc lập giữa HTML, CSS và JavaScript:

```
├── index.html              # Trang chủ SPA đầy đủ tính năng
├── product.html            # Trang độc lập: Chi tiết sản phẩm & thông số
├── features.html           # Trang độc lập: Hệ sinh thái tính năng IoT
├── ai.html                 # Trang độc lập: Trợ lý Y tế AI (Groq Cloud)
├── about.html              # Trang độc lập: Về chúng tôi & Đội ngũ sáng lập
│
├── sections/               # HTML Partial Components tái sử dụng
│   ├── header.html         # Thanh điều hướng & nút gạt theme
│   ├── home.html           # Banner & mô phỏng hộp thuốc
│   ├── product.html        # Chi tiết cấu tạo & thông số kỹ thuật
│   ├── features.html       # Tính năng nổi bật & quy trình
│   ├── ai.html             # Trợ lý AI chat & prompts gợi ý
│   ├── about.html          # Ban lãnh đạo & chứng chỉ y tế
│   ├── modal.html          # Hộp thoại tư vấn & đặt hàng
│   └── footer.html         # Chân trang & liên kết hỗ trợ
│
├── css/                    # Kiến trúc CSS Module hóa
│   ├── style.css           # CSS Master Entry Point
│   └── modules/
│       ├── variables.css   # Color tokens & Light/Dark Theme variables
│       ├── base.css        # Reset, typography & container
│       ├── header.css      # Header, Navigation & Sliding Pill Switch
│       ├── hero.css        # Hero banner & Interactive Pillbox Simulator
│       ├── product.css     # Product showcase & specs
│       ├── features.css    # Feature grid & timeline
│       ├── ai.css          # AI chat interface & styling
│       ├── about.css       # Team grid & testimonials
│       ├── modal.css       # Modal dialog & backdrop
│       ├── footer.css      # Footer styling
│       └── responsive.css   # Media queries & mobile navigation
│
├── js/                     # Kiến trúc JavaScript ES Module hóa
│   ├── app.js              # Master orchestrator
│   └── modules/
│       ├── theme.js        # Quản lý chế độ Sáng / Tối (Theme Mode)
│       ├── navigation.js   # Điều hướng SPA + Standalone routing
│       ├── simulator.js    # Mô phỏng tương tác 6 ngăn thuốc IoT
│       ├── ai-assistant.js # Trợ lý AI (Groq API + Local Fallback)
│       ├── faq.js          # Accordion hỏi đáp thường gặp
│       ├── modal.js        # Đăng ký tư vấn & Pre-order
│       └── toast.js        # Thông báo tương tác thời gian thực
│
├── scripts/                # Tiện ích tự động hóa
│   ├── build-pages.js      # Biên dịch các trang HTML từ sections/
│   └── test-endpoints.js   # Kiểm tra tính toàn vẹn 27 endpoints
│
├── server.js               # Node.js Web Server & Groq API Gateway
├── package.json            # Scripts & cấu hình dự án
└── .env.example            # Mẫu cấu hình API key
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu
- Node.js (phiên bản 18+ khuyến nghị)

### Các bước thực hiện

1. **Clone repository về máy**:
   ```bash
   git clone https://github.com/PHIYEN888/PillMateSmartBox.git
   cd PillMateSmartBox
   ```

2. **Cấu hình biến môi trường**:
   ```bash
   cp .env.example .env
   ```

3. **Biên dịch mã nguồn HTML từ các component (nếu có chỉnh sửa)**:
   ```bash
   npm run build
   ```

4. **Khởi động server**:
   ```bash
   npm start
   ```

5. **Mở trình duyệt và trải nghiệm**:
   ```
   http://localhost:5173

   https://pillmatesmartbox.vercel.app/
   ```

---

## 👥 Đội Ngũ Phát Triển Nòng Cốt

- **CEO — Project Management**: Nguyễn Quốc Hưng
- **CPO — Product Development**: Võ Thị Phi Yến
- **CTO — IoT Technology**: Doãn Nguyễn Phước Sanh
- **CFO — Financial Management**: Huỳnh Thị Thanh Tiền
- **CMO — Marketing & Brand Development**: Nguyễn Như Huỳnh
- **CCO — Sales & Customer Care**: Nguyễn Văn Phi

---

## 📄 Bản Quyền & Giấy Phép

© 2026 PillMate HealthTech Solutions. All rights reserved.
