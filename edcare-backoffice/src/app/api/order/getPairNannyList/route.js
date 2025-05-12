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
    const order_id = searchParams.get("id");

    const client = await pool.connect();

    // ✅ 先查出該 order 是否有指定 nannyid
    const orderQuery = `SELECT nannyid FROM orderinfo WHERE id = $1`;
    const orderResult = await client.query(orderQuery, [order_id]);
    const hasNannyId = orderResult.rows[0]?.nannyid;
    console.log(hasNannyId);
    // Set pairStatus to "ongoing" if hasNannyId is null, otherwise "signing"
    const pairStatus = hasNannyId === null ? "signing" : "onGoing";
    console.log(pairStatus);
    const query = `
      SELECT 
        p.id as pair_id,
        p.nanny_id,
        p.order_id,
        p.status,
        p.created_time,
        k.name AS nanny_name,
        o.nickname AS order_nickname,
        o.id AS order_id,
        m.cellphone AS nanny_cellphone,
        pm.cellphone AS parent_cellphone,
        o.*,
        cd.*
      FROM pair p
      LEFT JOIN nanny n ON p.nanny_id::bigint = n.id
      LEFT JOIN member m ON n.memberid::bigint = m.id
      LEFT JOIN kyc_info k ON m.kyc_id::int = k.id
      LEFT JOIN orderinfo o ON p.order_id::bigint = o.id
      LEFT JOIN member pm ON o.parentlineid = pm.line_id 
      LEFT JOIN care_data cd ON o.caretypeid = cd.id
      WHERE p.order_id = $1
      AND p.status = $2
      ORDER BY p.id DESC
      LIMIT $3 OFFSET $4
    `;

    const values = [order_id, pairStatus, pageSize, offset];

    const countQuery = `
      SELECT COUNT(*) FROM pair 
      WHERE order_id = $1 AND status = $2
    `;

    const [dataResult, countResult] = await Promise.all([
      client.query(query, values),
      client.query(countQuery, [order_id, pairStatus]),
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

