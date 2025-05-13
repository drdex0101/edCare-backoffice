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

    let filterStatus = searchParams.get("filterStatus") || "all";
    let period = searchParams.get("period") || "all";

    let statusParam = null;
    if (filterStatus === "onGoing" || filterStatus === "signing") {
      statusParam = filterStatus;
    }

    let periodDate = null;
    const now = new Date();
    if (period === "1month") {
      now.setMonth(now.getMonth() - 1);
      periodDate = now;
    } else if (period === "3month") {
      now.setMonth(now.getMonth() - 3);
      periodDate = now;
    } else if (period === "6month") {
      now.setMonth(now.getMonth() - 6);
      periodDate = now;
    }

    const client = await pool.connect();

    const query = `
      SELECT o.*
      FROM orderinfo o
      LEFT JOIN (
        SELECT DISTINCT ON (order_id) *
        FROM pair
        ORDER BY order_id, created_ts DESC
      ) p ON p.order_id::bigint = o.id
      LEFT JOIN nanny n ON p.nanny_id::bigint = n.id
      LEFT JOIN member m ON n.memberid::bigint = m.id
      LEFT JOIN kyc_info k ON m.kyc_id::int = k.id
      WHERE ($1::text IS NULL OR o.status = $1)
        AND ($2::timestamp IS NULL OR o.created_ts >= $2)
      ORDER BY o.id DESC
      LIMIT $3 OFFSET $4
    `;

    const values = [statusParam, periodDate, pageSize, offset];

    const countQuery = `
      SELECT COUNT(*) FROM orderinfo o
      WHERE ($1::text IS NULL OR o.status = $1)
        AND ($2::timestamp IS NULL OR o.created_ts >= $2)
    `;
    const countValues = [statusParam, periodDate];

    const [dataResult, countResult] = await Promise.all([
      client.query(query, values),
      client.query(countQuery, countValues),
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
