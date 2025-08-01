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
    const pageSize = 20;
    const offset = (page - 1) * pageSize;

    const email = request.cookies.get("email")?.value || "";
    const role = request.cookies.get("role")?.value || "";
    let site = "";
    const siteResult = await pool.query(`SELECT site FROM admin WHERE email = $1`, [email]);
    if (siteResult.rows.length > 0) {
      site = siteResult.rows[0].site;
    }

    const mountainAreas = ['斗六', '古坑', '斗南', '林內', '莿桐', '西螺', '二崙', '崙背'];
    const seaAreas = ['虎尾', '土庫', '元長', '褒忠', '大埤', '麥寮', '北港', '水林', '東勢', '口湖', '四湖', '台西'];

    let areaConditions = '';
    let areaValues = [];

    if (site === '山線居托中心') {
      // 將起始索引從 6 改為 7
      // highlight-next-line
      areaConditions = mountainAreas.map((area, index) => `array_to_string(cd.location, ', ') ILIKE $${7 + index}`).join(' OR ');
      areaValues = mountainAreas.map(area => `%${area}%`);
    } else if (site === '海線居托中心') {
      // 將起始索引從 6 改為 7
      // highlight-next-line
      areaConditions = seaAreas.map((area, index) => `array_to_string(cd.location, ', ') ILIKE $${7 + index}`).join(' OR ');
      areaValues = seaAreas.map(area => `%${area}%`);
    }

    let filterStatus = searchParams.get("filterStatus") || "all";
    let period = searchParams.get("period") || "all";
    let filterSituation = searchParams.get("filterSituation") || "all";
    const searchTerm = searchParams.get("searchTerm") || "";

    let statusParam = null;
    if (filterStatus === "matchPending") {
      statusParam = ["matchByParent", "matchByNanny"];
    } else if (filterStatus !== "all") {
      statusParam = [filterStatus]; // create, signing, onGoing, ...
    }
    let situationParam = null;
    if (filterSituation === "longTern" || filterSituation === "suddenly") {
      situationParam = filterSituation;
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
        SELECT o.*,p.status as status_name
        FROM orderinfo o
        LEFT JOIN (
          SELECT DISTINCT ON (order_id) *
          FROM pair
          ORDER BY order_id, created_ts DESC
        ) p ON p.order_id::bigint = o.id
        LEFT JOIN nanny n ON p.nanny_id::bigint = n.id
        LEFT JOIN member m ON n.memberid::bigint = m.id
        LEFT JOIN kyc_info k ON m.kyc_id::int = k.id
        LEFT JOIN care_data cd ON o.caretypeid::bigint = cd.id
        WHERE (
          $1::text[] IS NULL
          OR (
            $1::text[] IS NOT NULL AND (
              (
                'create' = ANY($1) AND o.status = 'create' and p.status is null
              )
              OR (
                'create' != ALL($1) AND (
                  o.status = ANY($1) OR p.status = ANY($1)
                )
              )
            )
          )
        )
        AND ($2::timestamp IS NULL OR o.created_ts >= $2)
        AND ($3::text IS NULL OR o.nickname::text ILIKE '%' || $3 || '%')
         AND ($6::text IS NULL OR cd.care_type = $6::text)
        ${areaConditions ? `AND (${areaConditions})` : ''}
        ORDER BY o.id DESC
        LIMIT $4 OFFSET $5
      `;
    }
    else {
      query = `
      SELECT o.*,p.status as status_name
      FROM orderinfo o
      LEFT JOIN (
        SELECT DISTINCT ON (order_id) *
        FROM pair
        ORDER BY order_id, created_ts DESC
      ) p ON p.order_id::bigint = o.id
      LEFT JOIN nanny n ON p.nanny_id::bigint = n.id
      LEFT JOIN member m ON n.memberid::bigint = m.id
      LEFT JOIN kyc_info k ON m.kyc_id::int = k.id
      LEFT JOIN care_data cd ON o.caretypeid::bigint = cd.id
     WHERE (
        $1::text[] IS NULL
        OR (
          $1::text[] IS NOT NULL AND (
            (
              'create' = ANY($1) AND o.status = 'create' and p.status is null
            )
            OR (
              'create' != ALL($1) AND (
                o.status = ANY($1) OR p.status = ANY($1)
              )
            )
          )
        )
      )
        AND ($2::timestamp IS NULL OR o.created_ts >= $2)
        AND ($3::text IS NULL OR o.nickname::text ILIKE '%' || $3 || '%')
        AND ($6::text IS NULL OR cd.care_type = $6::text)
      ORDER BY o.id DESC
      LIMIT $4 OFFSET $5
    `;
    }
    let values = [];
    if (role === "member") {
      values = [statusParam, periodDate, searchTerm, pageSize, offset, situationParam, ...areaValues];
    }
    else {
      values = [statusParam, periodDate, searchTerm, pageSize, offset,situationParam];
    }
    
    const countQuery = `
      SELECT COUNT(*) FROM orderinfo o
      LEFT JOIN care_data cd ON o.caretypeid = cd.id
      LEFT JOIN (
        SELECT DISTINCT ON (order_id) *
        FROM pair
        ORDER BY order_id, created_ts DESC
      ) p ON p.order_id::bigint = o.id
        WHERE (
          $1::text[] IS NULL
          OR (
            $1::text[] IS NOT NULL AND (
              (
                'create' = ANY($1) AND o.status = 'create' and p.status is null
              )
              OR (
                'create' != ALL($1) AND (
                  o.status = ANY($1) OR p.status = ANY($1)
                )
              )
            )
          )
        )
        AND ($2::timestamp IS NULL OR o.created_ts >= $2)
        AND ($3::text IS NULL OR o.nickname::text ILIKE '%' || $3 || '%')
        AND ($4::text IS NULL OR cd.care_type = $4::text)
    `;
    const countValues = [statusParam, periodDate, searchTerm, situationParam];

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
