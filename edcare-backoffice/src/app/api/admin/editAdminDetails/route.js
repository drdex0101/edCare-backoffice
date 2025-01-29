import { Client } from 'pg';

export async function PATCH(request) {
  try {
    // **解析 JSON Body**
    const body = await request.json();
    const { email, account, cellphone, is_enable, id } = body;

    // **檢查必要參數**
    if (typeof is_enable !== "boolean" || !id || !email || !account || !cellphone) {
      return new Response(
        JSON.stringify({ success: false, error: "缺少必要欄位或參數格式錯誤" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // **建立資料庫連線**
    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    console.log("Connected to database");

    // **執行更新查詢**
    const query = `
      UPDATE admin
      SET email = $1,
          account = $2,
          cellphone = $3,
          is_enable = $4,
          update_ts = NOW()
      WHERE id = $5
      RETURNING *;
    `;
    const values = [email, account, cellphone, is_enable, id];
    const result = await client.query(query, values);

    // **關閉連線**
    await client.end();

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "找不到對應的管理員" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Admin updated successfully:", result.rows[0]);

    // **成功回應**
    return new Response(
      JSON.stringify({ success: true, admin: result.rows[0] }),
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
