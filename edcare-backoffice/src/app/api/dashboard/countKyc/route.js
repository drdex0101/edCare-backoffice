import { Client } from 'pg';

export async function GET(request) {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('Connecting to the database...');
    await client.connect();
    console.log('Database connected successfully.');

    // 執行查詢
    const totalCountResult = await client.query(`SELECT COUNT(*) AS total FROM kyc_info;`);
    console.log('Total Count Result:', totalCountResult.rows);

    const unWriteCountResult = await client.query(`SELECT COUNT(*) AS total FROM member WHERE kyc_id IS NULL;`);
    console.log('Unwrite Count Result:', unWriteCountResult.rows);

    const pendingCountResult = await client.query(`SELECT COUNT(*) AS total FROM kyc_info WHERE status = 'pending';`);
    console.log('Pending Count Result:', pendingCountResult.rows);

    const rejectCountResult = await client.query(`SELECT COUNT(*) AS total FROM kyc_info WHERE status = '不通過';`);
    console.log('Reject Count Result:', rejectCountResult.rows);

    const approveCountResult = await client.query(`SELECT COUNT(*) AS total FROM kyc_info WHERE status = '通過';`);
    console.log('Approve Count Result:', approveCountResult.rows);

    // 返回查詢結果
    return new Response(
      JSON.stringify({
        success: true,
        totalCount: totalCountResult.rows[0]?.total || 0,
        unWriteCount: unWriteCountResult.rows[0]?.total || 0,
        pendingCount: pendingCountResult.rows[0]?.total || 0,
        rejectCount: rejectCountResult.rows[0]?.total || 0,
        approveCount: approveCountResult.rows[0]?.total || 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('Database error:', error.message || error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Database error',
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    console.log('Closing database connection...');
    await client.end();
    console.log('Database connection closed.');
  }
}
