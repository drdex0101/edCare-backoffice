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

    const email = request.cookies.get("email")?.value || "";
    const role = request.cookies.get("role")?.value || "";
    let site = "";
    const siteResult = await pool.query(`SELECT site FROM admin WHERE email = $1`, [email]);
    if (siteResult.rows.length > 0) {
      site = siteResult.rows[0].site;
    }

    let filterStatus = searchParams.get("filterStatus") || "all";
    let period = searchParams.get("period") || "all";
    const searchTerm = searchParams.get("searchTerm") || "";

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
    let query = "";
    if (role === "member") {
      query = `
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
        AND ($3::text IS NULL OR o.nickname::text ILIKE '%' || $3 || '%')
        AND n.area = $6
      ORDER BY o.id DESC
      LIMIT $4 OFFSET $5
    `;
    }
    else {
      query = `
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
        AND ($3::text IS NULL OR o.nickname::text ILIKE '%' || $3 || '%')
      ORDER BY o.id DESC
      LIMIT $4 OFFSET $5
    `;
    }
    let values = [];
    if (role === "member") {
      values = [statusParam, periodDate, searchTerm, pageSize, offset,site];
    }
    else {
      values = [statusParam, periodDate, searchTerm, pageSize, offset];
    }
    
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
