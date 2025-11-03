npm install @react-oauth/google

npm install sqlite sqlite3 google-auth-library dotenv express cors

npm install antd @ant-design/icons

Project LoginWithAuthenticator

-มีการสร้าง User ไว้แล้ว 1 คน ใน Database 
Username = Admin   Password = 1234

ขั้นตอนการ Login บัญชี Admin
1. ให้ทำการ Copy SecretKey ของ Admin ไปวางที่หน้า GenQrcode
2. ใช้ Mobile App  Google/Microsoft Authenticator  สแกน Qrcode
3. ที่หน้า Login ให้กรอกข้อมูล Username = Admin   Password = 1234  TOTP = เลข 6 หลักที่แสดงในแอป Authenticator
