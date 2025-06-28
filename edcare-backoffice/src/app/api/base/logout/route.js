import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const response = NextResponse.json({
      success: true,
      message: '登出成功'
    });

    // 清除 auth_token cookie
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      maxAge: 0, // 立即过期
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      success: false, 
      error: '登出失敗' 
    }, { status: 500 });
  }
} 