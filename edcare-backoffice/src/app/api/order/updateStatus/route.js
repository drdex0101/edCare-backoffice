import { Pool } from "pg";

// ✅ 使用 `Pool` 提高效能，減少連線開銷
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function PATCH(request) {
  try {
    // **解析 JSON Body**
    const body = await request.json();
    const { status, id } = body;

    // ✅ 驗證 `id` 和 `status`
    if (!id || isNaN(id) || id <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!status || typeof status !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid status" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ 取得資料庫連線
    const client = await pool.connect();

    // ✅ 執行更新查詢
    const query = `
      UPDATE pair
      SET status = $1,
          created_time = NOW()
      WHERE id = $2
      RETURNING id, status, created_time;
    `;
    const values = [status, id];
    const result = await client.query(query, values);

    // ✅ 釋放連線回到連線池
    client.release();

    // ✅ 檢查是否有更新
    if (result.rowCount === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "找不到對應的 order" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("KYC updated successfully:", result.rows[0]);

    // ✅ 成功回應
    return new Response(
      JSON.stringify({ success: true, order: result.rows[0] }),
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
