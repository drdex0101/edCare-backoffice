import { Client } from "pg";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page"), 10) || 1;
    const search = searchParams.get("search") || "";

    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    let query = `SELECT * FROM admin WHERE 1=1`;
    let values = [];

    if (search) {
      query += ` AND (email ILIKE $1 OR account ILIKE $1 OR cellphone ILIKE $1)`;
      values.push(`%${search}%`);
    }

    query += ` ORDER BY id DESC LIMIT 10 OFFSET $${values.length + 1}`;
    values.push((page - 1) * 10);

    const result = await client.query(query, values);

    await client.end();

    return NextResponse.json({ success: true, adminList: result.rows }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ success: false, error: error.message || "Database error" }, { status: 500 });
  }
}
