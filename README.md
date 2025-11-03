
# 🚀 LoginWithAuthenticator

ระบบล็อกอินด้วยรหัสผ่านและ TOTP (Two-Factor Authentication) รองรับ Google/Microsoft Authenticator

## 🛠️ การติดตั้ง

### Frontend
```bash
npm install @react-oauth/google
npm install antd @ant-design/icons
```

### Backend
```bash
npm install sqlite sqlite3 google-auth-library dotenv express cors
```

## 👤 ข้อมูลผู้ใช้เริ่มต้น

- **Username:** `Admin`
- **Password:** `1234`

## 🔑 ขั้นตอนการ Login (บัญชี Admin)
1. คัดลอก SecretKey ของ Admin ไปวางที่หน้า **GenQrcode**
2. ใช้แอป Google/Microsoft Authenticator สแกน QR Code
3. ที่หน้า Login กรอกข้อมูล:
   - Username: `Admin`
   - Password: `1234`
   - TOTP: รหัส 6 หลักจากแอป Authenticator

## 📦 โครงสร้างโปรเจกต์

```
LoginWithAuthenticator/
├── backend/
│   ├── server.js
│   └── data/db.sqlite
└── frontend/
	├── src/
	└── public/
```

## 📱 เทคโนโลยีที่ใช้

- React, Ant Design (Frontend)
- Express, SQLite, Google Auth Library (Backend)
