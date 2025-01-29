"use client"; // 這個檔案是 Client Component，允許使用 usePathname()

import { usePathname } from "next/navigation";
import Sidebar from "./base/sideBar";
import Header from "./base/header";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname(); // 取得當前路由
  const isHomePage = pathname === "/"; // 判斷是否為首頁

  return (
    <div className="flex w-full h-full">
      {!isHomePage && <Sidebar />} {/* 如果不是首頁，顯示 Sidebar */}
      <div className="flex flex-col w-full h-full">
        {!isHomePage && <Header />} {/* 如果不是首頁，顯示 Header */}
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
}
