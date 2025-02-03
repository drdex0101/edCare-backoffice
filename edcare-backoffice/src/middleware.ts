import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken');

  // **🔹 如果 `token` 不存在，則導向首頁 `/`**
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url)); // 🚀 直接導向首頁
  }

  return NextResponse.next(); // ✅ 讓請求繼續執行
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/kyc/:path*'], // 🔹 確保這些路徑受保護
};
