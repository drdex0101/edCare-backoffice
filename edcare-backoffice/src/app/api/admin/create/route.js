import { Client } from 'pg';

export async function POST(request) {
  if (request.method === 'POST') {
    const { account, email, cellphone, is_enable, site } = await request.json();
    console.log('req.body', account, email, cellphone, is_enable, site);
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

      // 使用參數化查詢插入資料
      const query = `
        INSERT INTO admin (
          account, email, cellphone, is_enable, site
      ) VALUES (
          $1, $2, $3, $4, $5
        )
        RETURNING *;
      `;
      const values = [
        account, 
        email, 
        cellphone, 
        is_enable,
        site
      ];
      const result = await client.query(query, values);

      console.log('admin created successfully:', result.rows[0]);
      return Response.json({ success: true, admin: result.rows[0] });
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
