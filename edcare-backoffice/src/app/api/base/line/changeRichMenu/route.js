
export async function POST(request) {
  const { line_id, richMenuId } = request.body;

  try {
    // 綁定 Rich Menu 到用戶
    const response = await fetch(`https://api.line.me/v2/bot/user/${line_id}/richmenu/${richMenuId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CHANNEL_ACCESS_TOKEN}`,  // 確保 Token 正確
        'Content-Type': 'application/json'
      }
    });
    
    return res.status(200).json({ message: 'Rich Menu changed successfully!' });
  } catch (error) {
    console.error('Error changing Rich Menu:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to change Rich Menu' });
  }
}
