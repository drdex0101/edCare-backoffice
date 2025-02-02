import { Pool } from "pg";
import { NextResponse } from "next/server";

// ✅ 使用連線池提高效能
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page"), 10) || 1;
    const search = searchParams.get("search") || "";
    const limit = 5; // ✅ 每頁筆數
    const offset = (page - 1) * limit; // ✅ 計算 OFFSET

    // ✅ 建立條件查詢
    let baseQuery = `SELECT * FROM admin WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) FROM admin WHERE 1=1`;
    let values = [];

    if (search) {
      baseQuery += ` AND (email ILIKE $1 OR account ILIKE $1 OR cellphone ILIKE $1)`;
      countQuery += ` AND (email ILIKE $1 OR account ILIKE $1 OR cellphone ILIKE $1)`;
      values.push(`%${search}%`);
    }

    // ✅ 加入排序、分頁
    baseQuery += ` ORDER BY id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    // ✅ 同時執行 2 個查詢，提高效能
    const client = await pool.connect();
    const [result, countResult] = await Promise.all([
      client.query(baseQuery, values),
      client.query(countQuery, values.slice(0, values.length - 2)), // `countQuery` 只需要搜尋條件
    ]);
    client.release(); // ✅ 釋放連線，避免記憶體洩漏

    return NextResponse.json({
      success: true,
      totalItems: parseInt(countResult.rows[0].count, 10), // ✅ 回傳總筆數
      totalPages: Math.ceil(parseInt(countResult.rows[0].count, 10) / limit), // ✅ 計算總頁數
      currentPage: page,
      adminList: result.rows,
    }, { status: 200 });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ success: false, error: error.message || "Database error" }, { status: 500 });
  }
}
