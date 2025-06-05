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
    const { address,communicateaddress, id } = body;


    // ✅ 取得資料庫連線
    const client = await pool.connect();

    // ✅ 執行更新查詢
    const query = `
      UPDATE kyc_info
        SET address = $1,
            communicateaddress = $2,
          update_ts = NOW()
      WHERE id = $3
      RETURNING id, address, communicateaddress, update_ts;
    `;
    const values = [address,communicateaddress, id];
    const result = await client.query(query, values);

    // ✅ 釋放連線回到連線池
    client.release();

    // ✅ 檢查是否有更新
    if (result.rowCount === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "找不到對應的 KYC" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("KYC updated successfully:", result.rows[0]);

    // ✅ 成功回應
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
