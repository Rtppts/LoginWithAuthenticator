import React, { useState } from "react";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import type { InputProps } from "antd";
import { API_BASE } from "./authConfig";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setQr(null);
    setSecret(null);
    if (password.length < 4) {
      setError("Password ต้องมีอย่างน้อย 4 ตัวอักษร");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password และ ยืนยัน Password ไม่ตรงกัน");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Register failed");
      setQr(data.qr);
      setSecret(data.secret);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 32, border: "1px solid #1976d2", borderRadius: 16, background: "#f7faff", boxShadow: "0 2px 12px #1976d233" }}>
      <h2 style={{ color: "#1976d2", textAlign: "center", marginBottom: 24 }}>สมัครใช้งาน (Register)</h2>
      <form onSubmit={handleRegister}>
        <Input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 14, padding: 10, borderRadius: 8, border: "1px solid #bcd" }}
        />
        <div style={{ marginBottom: 14 }}>
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #bcd" }}
            iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <Input.Password
            placeholder="ยืนยัน Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #bcd" }}
            iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: 12, background: "#1976d2", color: "#fff", border: 0, borderRadius: 8, fontWeight: 600, fontSize: 16, boxShadow: "0 1px 4px #1976d233" }}>สร้าง QR Code</button>
      </form>
      {error && <div style={{ color: "#d32f2f", marginTop: 16, textAlign: "center" }}>{error}</div>}
      {qr && (
        <div style={{ marginTop: 32, textAlign: "center", background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 1px 8px #1976d211" }}>
          <div style={{ color: "#1976d2", fontWeight: 500 }}>สแกน QR นี้ด้วย Google Authenticator</div>
          <img src={qr} alt="QR Code" style={{ margin: "16px auto", width: 180, height: 180, borderRadius: 8, border: "1px solid #bcd" }} />
          <div style={{ wordBreak: "break-all", fontSize: 15, marginTop: 10, color: "#333" }}>Secret: <b>{secret}</b></div>
          <div style={{ color: '#888', fontSize: 13, marginTop: 8 }}>(หรือเพิ่มด้วยรหัส secret ด้านบนในแอป Authenticator)</div>
        </div>
      )}
    </div>
  );
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, token })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Login failed");
      setResult("เข้าสู่ระบบสำเร็จ! (Authenticated)");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 32, border: "1px solid #1976d2", borderRadius: 16, background: "#f7faff", boxShadow: "0 2px 12px #1976d233" }}>
      <h2 style={{ color: "#1976d2", textAlign: "center", marginBottom: 24 }}>เข้าสู่ระบบ (Login)</h2>
      <form onSubmit={handleLogin}>
        <Input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 14, padding: 10, borderRadius: 8, border: "1px solid #bcd" }}
        />
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 14, padding: 10, borderRadius: 8, border: "1px solid #bcd" }}
          iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
        />
        <div style={{  width: "100%", display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <Input.OTP
            length={6}
            value={token}
            onChange={setToken}
            formatter={str => str.toUpperCase()}
            style={{ width: 320, padding: 10, borderRadius: 8, border: "1px solid #bcd", letterSpacing: 4, fontSize: 18, textAlign: "center", background: "#f7faff" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: 12, background: "#1976d2", color: "#fff", border: 0, borderRadius: 8, fontWeight: 600, fontSize: 16, boxShadow: "0 1px 4px #1976d233" }}>เข้าสู่ระบบ</button>
      </form>
      {result && <div style={{ color: "green", marginTop: 16, textAlign: "center" }}>{result}</div>}
      {error && <div style={{ color: "#d32f2f", marginTop: 16, textAlign: "center" }}>{error}</div>}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<'register' | 'login' | 'qrcode'>("register");
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 24 }}>
        <button onClick={() => setPage("register")} style={{ padding: 8, background: page==="register"?"#1976d2":"#eee", color: page==="register"?"#fff":"#333", border: 0, borderRadius: 4 }}>สมัครใช้งาน</button>
        <button onClick={() => setPage("login")} style={{ padding: 8, background: page==="login"?"#1976d2":"#eee", color: page==="login"?"#fff":"#333", border: 0, borderRadius: 4 }}>เข้าสู่ระบบ</button>
        <button onClick={() => setPage("qrcode")} style={{ padding: 8, background: page==="qrcode"?"#1976d2":"#eee", color: page==="qrcode"?"#fff":"#333", border: 0, borderRadius: 4 }}>แปลง SecretKey เป็น QR</button>
      </div>
      {page === "register" ? <Register /> : page === "login" ? <Login /> : <SecretToQR />}
    </div>
  );

}

// Component สำหรับแปลง SecretKey เป็น QR Code
// ...existing code...
function SecretToQR() {
  const [secret, setSecret] = useState("");
  const [label, setLabel] = useState("MyApp");
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleGenQR = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setQr(null);
    try {
      const res = await fetch(`${API_BASE}/auth/secret-to-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, label })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "QR code generation failed");
      setQr(data.qr);
    } catch (err: any) {
      setError("ไม่สามารถสร้าง QR ได้");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 32, border: "1px solid #1976d2", borderRadius: 16, background: "#f7faff", boxShadow: "0 2px 12px #1976d233" }}>
      <h2 style={{ color: "#1976d2", textAlign: "center", marginBottom: 24 }}>แปลง SecretKey เป็น QR Code</h2>
      <form onSubmit={handleGenQR}>
        <Input
          placeholder="SecretKey (Base32)"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 14, padding: 10, borderRadius: 8, border: "1px solid #bcd" }}
        />
        <Input
          placeholder="Label (เช่น MyApp หรือชื่อผู้ใช้)"
          value={label}
          onChange={e => setLabel(e.target.value)}
          style={{ width: "100%", marginBottom: 18, padding: 10, borderRadius: 8, border: "1px solid #bcd" }}
        />
        <button type="submit" style={{ width: "100%", padding: 12, background: "#1976d2", color: "#fff", border: 0, borderRadius: 8, fontWeight: 600, fontSize: 16, boxShadow: "0 1px 4px #1976d233" }}>สร้าง QR Code</button>
      </form>
      {error && <div style={{ color: "#d32f2f", marginTop: 16, textAlign: "center" }}>{error}</div>}
      {qr && (
        <div style={{ marginTop: 32, textAlign: "center", background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 1px 8px #1976d211" }}>
          <div style={{ color: "#1976d2", fontWeight: 500 }}>สแกน QR นี้ด้วย Google Authenticator</div>
          <img src={qr} alt="QR Code" style={{ margin: "16px auto", width: 180, height: 180, borderRadius: 8, border: "1px solid #bcd" }} />
          <div style={{ wordBreak: "break-all", fontSize: 15, marginTop: 10, color: "#333" }}>Secret: <b>{secret}</b></div>
        </div>
      )}
    </div>
  );
}