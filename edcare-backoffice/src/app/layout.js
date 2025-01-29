import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper"; // 將 Sidebar/Header 放入這個 Client Component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "托育媒合服務系統",
  description: "托育媒合服務系統",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
