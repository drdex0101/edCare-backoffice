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

    // Modify the SELECT clause to get all columns from kyc_info (k.*) and only job from member (m.job)
    const query = `SELECT k.*, m.*
     FROM kyc_info as k LEFT JOIN member as m ON k.id = m.kyc_id::bigint WHERE k.id = $1 LIMIT 1;`;
    const values = [id];
    const result = await client.query(query, values);

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
