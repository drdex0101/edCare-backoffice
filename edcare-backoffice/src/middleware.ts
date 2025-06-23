import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // ✅ 判斷是否為受保護的路徑
  const isProtected = ['/admin', '/dashboard', '/kyc', '/order', '/member'].some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected && !token) {
    // 🔒 導回 login 並攜帶原始網址（可選）
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next(); // ✅ 通過驗證
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/kyc/:path*', '/order/:path*', '/member/:path*'],
};
