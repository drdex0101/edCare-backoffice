import { Client } from 'pg';

export async function POST(request) {
  if (request.method === 'POST') {
    const { email, password } = await request.json();
    // 創建 PostgreSQL 客戶端
    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    try {
        // 連接資料庫
        await client.connect();
        // 檢查電子郵件是否已存在
        const checkEmailQuery = `
            SELECT id, email, role FROM admin WHERE email = $1  AND password = $2;
        `;
        const emailCheckResult = await client.query(checkEmailQuery, [email, password]);

        if (emailCheckResult.rows.length > 0) {
            // Return a token along with the existing error message
            const crypto = require('crypto');
            const secret = crypto.randomBytes(64).toString('hex');

            return Response.json({ success: true, error: 'Email already exists', token: secret, role: emailCheckResult.rows[0].role });
        }
        return Response.json({ success: false, error: 'Email not exists' });

    } catch (error) {
      console.error('Database error:', error);
      return Response.json({ error: 'Database error' });
    } finally {
      // 關閉連接
      await client.end();
    }
  } else {
    // 不支援的 HTTP 方法
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
