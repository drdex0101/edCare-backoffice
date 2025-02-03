import { Pool } from "pg";

// 使用 Connection Pool 來提升效能
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(request) {
  try {
    // 取得查詢參數
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, message: "ID parameter is required" },
        { status: 400 }
      );
    }

    // 執行 SQL 查詢
    const result = await pool.query({
      text: "SELECT upload_url FROM upload WHERE id = $1;",
      values: [id],
    });

    if (result.rowCount === 0) {
      return Response.json(
        { success: false, message: "No data found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, url: result.rows[0].upload_url },
      { status: 200 }
    );

  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { success: false, error: "Database error" },
      { status: 500 }
    );
  }
}
