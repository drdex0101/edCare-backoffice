import { Client } from 'pg';

export async function GET(request) {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    // 建立資料庫連線
    await client.connect();

    // 查詢總數
    const totalCountResult = await client.query(`SELECT COUNT(*) AS total FROM member;`);
    const totalCount = parseInt(totalCountResult.rows[0].total, 10);

    // 查詢最近 7 天每日新增用戶數
    const newApplyCounts = [];
    for (let i = 0; i < 7; i++) {
      const result = await client.query(
        `SELECT COUNT(*) AS count 
         FROM member 
         WHERE DATE(created_ts) = DATE(NOW() - INTERVAL $1 DAY);`,
        [i]
      );
      newApplyCounts.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: parseInt(result.rows[0].count, 10),
      });
    }

    // 關閉資料庫連線
    await client.end();

    // 返回查詢結果
    return new Response(
      JSON.stringify({
        success: true,
        totalCount,
        data: newApplyCounts,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('Database error:', error);

    // 返回錯誤響應
    return new Response(
      JSON.stringify({ success: false, error: 'Database error' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    // 確保連線被關閉
    if (!client.ended) {
      await client.end();
    }
  }
}
