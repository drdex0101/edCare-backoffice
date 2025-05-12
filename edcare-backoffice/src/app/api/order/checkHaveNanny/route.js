import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(request) {
  const client = await pool.connect(); // ✅ 要先宣告在外層
  try {
    const { searchParams } = new URL(request.url);
    const order_id = searchParams.get("id");

    const orderQuery = `SELECT nannyid FROM orderinfo WHERE id = $1`;
    const orderResult = await client.query(orderQuery, [order_id]);

    const hasNannyId = !!orderResult.rows[0]?.nannyid;

    return NextResponse.json(
      { success: true, hasNannyId },
      { status: 200 }
    );

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Database error" },
      { status: 500 }
    );
  } finally {
    client.release(); // ✅ 確保不論成功或失敗都釋放連線
  }
}


