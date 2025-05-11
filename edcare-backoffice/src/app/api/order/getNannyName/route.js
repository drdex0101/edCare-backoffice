import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nannyId = searchParams.get("nannyId");

    const client = await pool.connect();

    // ✅ 主查詢，JOIN member → kyc、orderinfo
    const query = `
    SELECT 
      k.name AS nanny_name
    FROM nanny n
    LEFT JOIN member m ON n.memberid::bigint = m.id
    LEFT JOIN kyc_info k ON m.kyc_id::int = k.id
    WHERE n.id = $1
  `;

    const values = [nannyId];

    const [dataResult] = await Promise.all([
      client.query(query, values),
    ]);

    client.release();

    const totalItems = parseInt(dataResult.rows[0]?.count || "0", 10);

    return NextResponse.json(
      { success: true, nannyName: dataResult.rows[0]?.nanny_name || "無資料" },
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
