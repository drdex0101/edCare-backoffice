import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { kycId, richMenuId } = body;

  try {
    const res = await fetch(`https://api.line.me/v2/bot/user/${kycId}/richmenu/${richMenuId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Line API Error:', errText);
      return NextResponse.json({ error: 'Failed to change Rich Menu' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Rich Menu changed successfully!' });
  } catch (error) {
    console.error('Fetch Error:', error.message);
    return NextResponse.json({ error: 'Server error while changing Rich Menu' }, { status: 500 });
  }
}
