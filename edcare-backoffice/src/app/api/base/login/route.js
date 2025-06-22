import { NextResponse } from 'next/server';
import { Client } from 'pg';
import crypto from 'crypto';

export async function POST(request) {
  const { email, password } = await request.json();

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();

    const checkEmailQuery = `
      SELECT id, email, role FROM admin WHERE email = $1 AND password = $2;
    `;
    const emailCheckResult = await client.query(checkEmailQuery, [email, password]);

    if (emailCheckResult.rows.length > 0) {
      const token = crypto.randomBytes(64).toString('hex');

      const response = NextResponse.json({
        success: true,
        role: emailCheckResult.rows[0].role,
        token, // optional: front-end display
      });

      // 設定 cookie，2 小時過期
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        maxAge: 2 * 60 * 60, // 2 hours in seconds
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Email not exists' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await client.end();
  }
}
