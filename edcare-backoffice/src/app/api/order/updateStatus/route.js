import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { status, id, nannyId } = body; // ← 加入 `nannyId`

    if (!id || isNaN(id) || id <= 0) {
      return new Response(JSON.stringify({ success: false, error: "Invalid ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!status || typeof status !== "string") {
      return new Response(JSON.stringify({ success: false, error: "Invalid status" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!nannyId || isNaN(nannyId)) {
      return new Response(JSON.stringify({ success: false, error: "Invalid nannyId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN"); // ✅ 交易開始

      // 1. 更新 orderinfo
      const updateOrderQuery = `
        UPDATE orderinfo
        SET status = $1,
            created_ts = NOW(),
            update_ts = NOW(),
            nannyid = $2
        WHERE id = $3
        RETURNING id, status, created_ts, update_ts, nannyid;
      `;
      const orderRes = await client.query(updateOrderQuery, [status, nannyId, id]);

      // 2. 將對應的 pair 設為 ongoing
      const updatePairQuery = `
        UPDATE pair
        SET status = 'onGoing'
        WHERE order_id = $1 AND nanny_id = $2;
      `;
      await client.query(updatePairQuery, [id, nannyId]);

      // 3. 刪除其他非此配對的 pair 記錄
      const deleteOtherPairsQuery = `
        DELETE FROM pair
        WHERE order_id = $1 AND nanny_id <> $2;
      `;
      await client.query(deleteOtherPairsQuery, [id, nannyId]);

      await client.query("COMMIT"); // ✅ 提交交易

      client.release();

      if (orderRes.rowCount === 0) {
        return new Response(
          JSON.stringify({ success: false, error: "找不到對應的訂單" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify({ success: true, order: orderRes.rows[0] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (innerError) {
      await client.query("ROLLBACK"); // ❌ 發生錯誤時回滾
      throw innerError;
    }

  } catch (error) {
    console.error("Database error:", error.message || error);
    return new Response(JSON.stringify({ success: false, error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
