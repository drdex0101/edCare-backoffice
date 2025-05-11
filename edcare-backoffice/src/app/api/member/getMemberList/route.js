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
    const job = searchParams.get("job") || "";
    const status = searchParams.get("status") || "";
    // ✅ 設定每頁顯示筆數
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    // ✅ 取得資料庫連線
    const client = await pool.connect();

    // ✅ 改進 SQL 查詢效能
    let query = `
      SELECT m.id,m.account,m.cellphone,m.email,m.job,m.created_ts,k.*,m.line_id
      FROM member m 
      LEFT JOIN kyc_info k ON m.kyc_id::bigint = k.id
      WHERE 1=1
    `;
    let values = [];
    let countValues = [];

    if (search) {
      query += ` AND (m.account ILIKE $${values.length + 1} )`;
      values.push(`%${search}%`);
      countValues.push(`%${search}%`);
    }

    if (job === '0') {
      query += ` AND m.job = $${values.length + 1}`;
      values.push('保母');
      countValues.push('保母');
    } else if (job === '1') {
      query += ` AND m.job != $${values.length + 1}`;
      values.push('保母');
      countValues.push('保母');
    }

    if (status === 'approve') {
      query += ` AND k.status = $${values.length + 1}`;
      values.push('approve');
      countValues.push('approve');
    } else if (status === 'fail') {
      query += ` AND k.status = $${values.length + 1}`;
      values.push('fail');
      countValues.push('fail');
    } else if (status === 'pending') {
      query += ` AND k.status = $${values.length + 1}`;
      values.push('pending');
      countValues.push('pending');
    }

    query += ` ORDER BY m.id DESC LIMIT $${values.length + 1}::integer OFFSET $${values.length + 2}::integer`;
    values.push(pageSize, offset);

    let countQuery = 'SELECT COUNT(*) FROM member m WHERE 1=1';
    let countQueryValues = [];

    if (search) {
      countQuery += ` AND (m.account ILIKE $${countQueryValues.length + 1})`;
      countQueryValues.push(`%${search}%`);
    }
    if (job === '0') {
      countQuery += ` AND m.job = $${countQueryValues.length + 1}`;
      countQueryValues.push('保母');
    } else if (job === '1') {
      countQuery += ` AND m.job != $${countQueryValues.length + 1}`;
      countQueryValues.push('保母');
    }

    // ✅ 同時取得 `kycList` 和 `totalItems`
    const [dataResult, countResult] = await Promise.all([
      client.query(query, values),
      client.query(countQuery, countQueryValues), // <-- 用正確的 countQueryValues
    ]);

    // ✅ 釋放連線回到連線池
    client.release();

    // ✅ 總筆數
    const totalItems = parseInt(countResult.rows[0]?.count || "0", 10);

    return NextResponse.json(
      { success: true, memberList: dataResult.rows, totalItems },
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
