require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const PORT = process.env.PORT || 4000;
const DB_FILE = process.env.DATABASE_FILE || './data/db.sqlite';

async function initDb() {
  const db = await open({ filename: DB_FILE, driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      totp_secret TEXT
    );
  `);
  // สร้าง user Admin/1234 ถ้ายังไม่มี
  const admin = await db.get('SELECT * FROM users WHERE username = ?', 'Admin');
  if (!admin) {
    // สร้าง secret ใหม่สำหรับ Admin
    const secret = speakeasy.generateSecret({ name: 'MyApp (Admin)' });
    await db.run(
      'INSERT INTO users (username, password, totp_secret) VALUES (?, ?, ?);',
      'admin', '123', secret.base32
    );
    console.log('Created default Admin user with TOTP secret:', secret.base32);
  }
  return db;
}

async function start() {
  const db = await initDb();
  const app = express();
  app.use(cors());
  app.use(express.json());

  // 1. Register: สร้าง secret และ QR code สำหรับ user ใหม่
  app.post('/auth/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });

    // สร้าง secret ใหม่
    const secret = speakeasy.generateSecret({ name: `MyApp (${username})` });

    // บันทึกลง DB พร้อม password
    await db.run(
      `INSERT OR REPLACE INTO users (username, password, totp_secret) VALUES (?, ?, ?);`,
      username, password, secret.base32
    );

    // สร้าง QR code
    const otpauth_url = secret.otpauth_url;
    qrcode.toDataURL(otpauth_url, (err, data_url) => {
      if (err) return res.status(500).json({ error: 'QR code generation failed' });
      res.json({ username, secret: secret.base32, qr: data_url });
    });
  });

  // 1.5. SecretKey to QR: รับ secret และ label แล้วแปลงเป็น QR code
  app.post('/auth/secret-to-qr', async (req, res) => {
    const { secret, label } = req.body;
    if (!secret || !label) return res.status(400).json({ error: 'Missing secret or label' });
    try {
      const otpauth_url = speakeasy.otpauthURL({ secret, label, encoding: 'base32' });
      qrcode.toDataURL(otpauth_url, (err, data_url) => {
        if (err) return res.status(500).json({ error: 'QR code generation failed' });
        res.json({ qr: data_url, otpauth_url });
      });
    } catch (err) {
      res.status(500).json({ error: 'QR code generation failed' });
    }
  });

  // 2. Login: ตรวจสอบรหัส TOTP
  // 2. Login: ตรวจสอบ Username/Password และ TOTP
  app.post('/auth/login', async (req, res) => {
    const { username, password, token } = req.body;
    if (!username || !password || !token) return res.status(400).json({ error: 'Missing username, password or token' });

    const user = await db.get('SELECT * FROM users WHERE username = ?', username);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.password !== password) return res.status(401).json({ error: 'Invalid password' });

    const verified = speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: 'base32',
      token,
      window: 0 // ตรวจสอบเฉพาะช่วงเวลาปัจจุบันเท่านั้น
    });

    if (verified) {
      res.json({ success: true, message: 'Authenticated' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid token' });
    }
  });

  app.listen(PORT, () => console.log(`API running http://localhost:${PORT}`));
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});