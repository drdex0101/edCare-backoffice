"use client"
import Image from "next/image";
import "./home.css";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Swal from "sweetalert2";
export default function Home() {
  const [email, setEmail] = useState(""); // ✅ 儲存輸入的 Email
  const [password, setPassword] = useState(""); // ✅ 儲存輸入的密碼
  const [error, setError] = useState("");
  const router = useRouter();
  const handleLogin = async () => {
    setError(""); // 清除錯誤訊息
    if (!email || !password) {
      setError("請輸入電子信箱和密碼");
      return;
    }

    try {
      const response = await fetch("/api/base/login", { // ✅ 修改成你的 API 路徑
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data.success);
      if (data.success) {
        Cookies.set("authToken", data.token, {
          expires: 1 / 12, // 2 小時 = 1/12 天
        });
        Cookies.set("email", email, { expires: 1 / 12 });
        Cookies.set("role", data.role, { expires: 1 / 12 });
        router.push("/dashboard"); // ✅ 登入成功導向到 `dashboard`
      } else {
        Swal.fire({
          icon: "error",
          title: "登入失敗",
          text: "請檢查您的帳號和密碼",
        });
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("系統錯誤，請稍後再試");
    }
  };

  return (
    <div className="home">
      <div className="home-header">
        <Image src="/logo.png" alt="logo" width={167} height={50} />
      </div>
      <div className="login-layout">
        <Image src="/logo.png" alt="logo" width={167} height={50} />
        <div className="sub-title">
          <p className="sub-title-text">
              托育媒合服務系統
          </p>
        </div>
        <div className="login-input-layout">
          <div className="login-input-layout-for-title">
            <span className="login-input-title-text">登入</span>
            <span className="login-input-label-text-required">歡迎使用，請輸入您的帳號</span>
          </div>
          <div className="login-input-layout-for-text">
            <div className="login-input-label-text-layout">
              <span className="login-input-label-text-required">帳號</span>
              <input
                className="login-input"
                type="text"
                placeholder="請輸入電子信箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="login-input-label-text-layout">
              <span className="login-input-label-text-required">密碼</span>
              <input
                className="login-input"
                type="password"
                placeholder="請輸入密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="login-button-layout">
          <button className="login-button" onClick={handleLogin}>登入</button>
        </div>
      </div>
    </div>
  );
}
