import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/base/sideBar";
import Header from "../components/base/header";
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex w-full h-full">
          <Sidebar />
          <div className="flex flex-col w-full h-full">
            <Header />
            <div className="flex flex-col">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
