import Image from "next/image";
import "./home.css";

export default function Home() {
  return (
    <div className="home">
      <div className="home-header">
        <Image src="/logo.png" alt="logo" width={167} height={50} />
        <div className="sub-title">
          <p className="sub-title-text">
              托育媒合服務系統
          </p>
        </div>
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
              <input className="login-input" type="text" placeholder="請輸入電子信箱" />
            </div>
            <div className="login-input-label-text-layout">
              <span className="login-input-label-text-required">密碼</span>
              <input className="login-input" type="password" placeholder="請輸入密碼" />
            </div>
          </div>
        </div>
        <div className="login-button-layout">
          <button className="login-button">登入</button>
        </div>
      </div>
    </div>
  );
}
