"use client";

import Image from "next/image";
import "./css/header.css";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 显示确认对话框
      const result = await Swal.fire({
        title: '確認登出',
        text: '您確定要登出嗎？',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#EB9A38',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定',
        cancelButtonText: '取消'
      });

      if (result.isConfirmed) {
        // 调用登出API
        const response = await fetch("/api/base/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          // 清除前端存储的cookies
          Cookies.remove("email");
          Cookies.remove("role");
          
          // 显示成功消息
          await Swal.fire({
            icon: "success",
            title: "登出成功",
            text: "您已成功登出",
            timer: 1500,
            showConfirmButton: false
          });

          // 重定向到登录页面
          router.push("/");
        } else {
          throw new Error(data.error || '登出失敗');
        }
      }
    } catch (error) {
      console.error("Logout Error:", error);
      Swal.fire({
        icon: "error",
        title: "登出失敗",
        text: "系統錯誤，請稍後再試",
      });
    }
  };

  return (
    <div className="header">
      <button className="logout-button" onClick={handleLogout}>登出</button>
    </div>
  );
}