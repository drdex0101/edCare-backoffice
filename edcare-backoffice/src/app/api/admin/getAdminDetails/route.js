import { Client } from "pg";
import { NextResponse } from "next/server";

// 建立資料庫連線函數
async function connectToDB() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    return client;
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to database");
  }
}

// 驗證 ID 是否有效
function validateId(id) {
  if (!id || isNaN(id) || id <= 0) {
    throw new Error("Invalid ID parameter");
  }
}

export async function GET(request) {
  try {
    // 解析請求的 Query String
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id"), 10);

    // 檢查 id 是否有效
    validateId(id);

    // 連接資料庫
    const client = await connectToDB();

    // 執行 SQL 查詢
    const query = `SELECT * FROM admin WHERE id = $1;`;
    const values = [id];
    const result = await client.query(query, values);

    // 關閉資料庫連線
    await client.end();

    // 回應結果
    return NextResponse.json(
      {
        success: true,
        adminDetails: result.rows.length > 0 ? result.rows[0] : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error.message || error);

    return NextResponse.json(
      { success: false, error: error.message || "Database error" },
      { status: 500 }
    );
  }
}
