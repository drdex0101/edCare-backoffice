import { Client } from 'pg';

export async function GET(request)  {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();

    const totalCountResult = await client.query(`SELECT COUNT(*) AS total FROM orderInfo;`);
    const pendingCountResult = await client.query(`SELECT COUNT(*) AS total FROM orderInfo WHERE status = 'create';`);
    const finishCountResult = await client.query(`SELECT COUNT(*) AS total FROM orderInfo WHERE status = 'finish';`);

    return new Response(JSON.stringify({
      success: true,
      totalCount: parseInt(totalCountResult.rows[0].total, 10),
      pendingCount: parseInt(pendingCountResult.rows[0].total, 10),
      finishCount: parseInt(finishCountResult.rows[0].total, 10),
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
