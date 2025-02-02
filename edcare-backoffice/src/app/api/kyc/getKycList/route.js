import { Pool } from "pg";
import { NextResponse } from "next/server";

// ✅ 使用 `Pool` 提高效能，減少連線開銷
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page"), 10) || 1;
    const search = searchParams.get("search")?.trim() || "";

    // ✅ 設定每頁顯示筆數
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    // ✅ 取得資料庫連線
    const client = await pool.connect();

    // ✅ 改進 SQL 查詢效能
    let query = `
      SELECT k.*, m.job, m.line_id, m.account
      FROM kyc_info k
      JOIN member m ON m.kyc_id = CAST(k.id AS VARCHAR)
      WHERE 1=1
    `;
    let values = [];

    if (search) {
      query += ` AND (m.account ILIKE $1 OR k.name ILIKE $1 OR k.identityCard ILIKE $1 OR k.welfareCertNo ILIKE $1)`;
      values.push(`%${search}%`);
    }

    query += ` ORDER BY k.id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(pageSize, offset);

    // ✅ 同時取得 `kycList` 和 `totalItems`
    const [dataResult, countResult] = await Promise.all([
      client.query(query, values),
      client.query(`SELECT COUNT(*) FROM kyc_info k JOIN member m ON m.kyc_id = CAST(k.id AS VARCHAR) WHERE 1=1 ${search ? `AND (m.account ILIKE $1 OR k.name ILIKE $1 OR k.identityCard ILIKE $1 OR k.welfareCertNo ILIKE $1)` : ""}`, search ? [`%${search}%`] : []),
    ]);

    // ✅ 釋放連線回到連線池
    client.release();

    // ✅ 總筆數
    const totalItems = parseInt(countResult.rows[0]?.count || "0", 10);

    return NextResponse.json(
      { success: true, kycList: dataResult.rows, totalItems },
      { status: 200 }
    );

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Database error" },
      { status: 500 }
    );
  }
}
