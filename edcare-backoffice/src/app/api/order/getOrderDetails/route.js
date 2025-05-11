import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id"), 10);
    const page = parseInt(searchParams.get("page"), 10) || 1;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    const client = await pool.connect();

    // ✅ 主查詢，JOIN member → kyc、orderinfo
    const query = `
    SELECT 
      o.*
    FROM orderinfo o
    LEFT JOIN (
      SELECT DISTINCT ON (order_id)
        *
      FROM pair
      ORDER BY order_id, created_time DESC
    ) p ON p.order_id::bigint = o.id
    LEFT JOIN nanny n ON p.nanny_id::bigint = n.id
    LEFT JOIN member m ON n.memberid::bigint = m.id
    LEFT JOIN kyc_info k ON m.kyc_id::int = k.id
    WHERE o.id = $1::bigint
    ORDER BY o.id DESC
    LIMIT $2::integer OFFSET $3::integer
  `;

    const values = [id, pageSize, offset];

    const countQuery = `SELECT COUNT(*) FROM orderinfo as o`;

    const [dataResult, countResult] = await Promise.all([
      client.query(query, values),
      client.query(countQuery),
    ]);

    client.release();

    const totalItems = parseInt(countResult.rows[0]?.count || "0", 10);

    return NextResponse.json(
      { success: true, orderList: dataResult.rows, totalItems },
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
