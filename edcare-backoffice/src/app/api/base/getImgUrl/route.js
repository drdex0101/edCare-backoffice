import { Client } from 'pg';

export async function GET(request) {
  // 取得查詢參數
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json(
      { success: false, message: "ID parameter is required" },
      { status: 400 }
    );
  }

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const query = `
      SELECT upload_url FROM upload WHERE id = $1;
    `;

    const nannyId = parseInt(id, 10); // 確保 ID 是數字
    const result = await client.query(query, [nannyId]);

    console.log("Database result:", result.rows);

    if (result.rowCount === 0) {
      return Response.json(
        { success: false, message: "No data found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, url: result.rows[0].upload_url, pageCount: result.rowCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { success: false, error: "Database error" },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}
