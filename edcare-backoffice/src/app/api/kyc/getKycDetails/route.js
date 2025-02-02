import { Pool } from "pg";
import { NextResponse } from "next/server";

// ✅ 使用 `Pool` 來管理連線池，提高效能
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ 驗證 ID
function validateId(id) {
  return id && !isNaN(id) && id > 0;
}

// ✅ 改進 API 效能
export async function GET(request) {
  try {
    // 解析 Query String
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id"), 10);

    // ✅ 若 ID 無效，回傳 400
    if (!validateId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID parameter" },
        { status: 400 }
      );
    }

    // ✅ 使用 `Pool` 取得資料庫連線
    const client = await pool.connect();

    // ✅ 使用 `LIMIT 1` 提升查詢效能
    const query = `SELECT * FROM kyc_info WHERE id = $1 LIMIT 1;`;
    const result = await client.query(query, [id]);

    // ✅ 釋放連線回到池中，避免不必要的 `client.end()`
    client.release();

    // ✅ 回應結果
    return NextResponse.json({
      success: true,
      kycDetails: result.rows.length > 0 ? result.rows[0] : null,
    });

  } catch (error) {
    console.error("API error:", error.message || error);
    return NextResponse.json(
      { success: false, error: "Database error" },
      { status: 500 }
    );
  }
}
