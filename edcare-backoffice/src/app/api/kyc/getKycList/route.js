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

    let query = `
      SELECT k.*, m.job, m.line_id,m.account
      FROM kyc_info k
      JOIN member m ON m.kyc_id = CAST(k.id AS VARCHAR)
      WHERE 1=1
    `;
    let values = [];

    if (search) {
      query += ` AND (k.email ILIKE $1 OR k.account ILIKE $1 OR k.cellphone ILIKE $1 OR k.name ILIKE $1 OR k.identityCard ILIKE $1 OR k.welfareCertNo ILIKE $1)`;
      values.push(`%${search}%`);
    }

    query += ` ORDER BY k.id DESC LIMIT 10 OFFSET $${values.length + 1}`;
    values.push((page - 1) * 10);

    const result = await client.query(query, values);

    await client.end();

    return NextResponse.json({ success: true, kycList: result.rows }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ success: false, error: error.message || "Database error" }, { status: 500 });
  }
}
