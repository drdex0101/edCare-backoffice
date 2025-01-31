import { Client } from 'pg';

export async function PATCH(request) {
  try {
    // **解析 JSON Body**
    const body = await request.json();
    const { status, id } = body;

    // **建立資料庫連線**
    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    console.log("Connected to database");

    // **執行更新查詢**
    const query = `
      UPDATE kyc_info
      SET status = $1,
          update_ts = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const values = [status, id];
    const result = await client.query(query, values);
    // **關閉連線**
    await client.end();

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "找不到對應的kyc" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Admin updated successfully:", result.rows[0]);

    // **成功回應**
    return new Response(
      JSON.stringify({ success: true, kyc: result.rows[0] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Database error:", error.message || error);

    return new Response(
      JSON.stringify({ success: false, error: "Database error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
