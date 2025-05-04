import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page"), 10) || 1;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    const client = await pool.connect();

    // ✅ 主查詢，JOIN member → kyc、orderinfo
    const query = `
    SELECT 
      p.id,
      p.nanny_id,
      p.order_id,
      p.status,
      p.created_time,
      k.name AS nanny_name,
      o.nickname AS order_nickname
    FROM pair p
    LEFT JOIN nanny n ON p.nanny_id::bigint = n.id
    LEFT JOIN member m ON n.memberid::bigint = m.id
    LEFT JOIN kyc_info k ON m.kyc_id::int = k.id
    LEFT JOIN orderinfo o ON p.order_id::bigint = o.id
    WHERE p.status = 'signing'
    ORDER BY p.id DESC
    LIMIT $1::integer OFFSET $2::integer
  `;
  
    const values = [pageSize, offset];

    const countQuery = `SELECT COUNT(*) FROM pair as p WHERE p.status = 'signing'`;

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
