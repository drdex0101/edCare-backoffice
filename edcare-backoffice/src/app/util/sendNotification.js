export default async function sendNotification(userId, message) {
    const accessToken = process.env.NEXT_PUBLIC_CHANNEL_ACCESS_TOKEN;
  
    if (!accessToken) {
      throw new Error('CHANNEL_ACCESS_TOKEN 未設定');
    }
  
    const lineMessage = typeof message === "string"
      ? [{ type: "text", text: message }]
      : [message];

    const body = {
      to: userId,
      messages: lineMessage,
    };
    
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
  
    if (!response.ok) {
      const error = await response.text();
      console.error('LINE API 發送失敗:', error);
      throw new Error(`LINE API 發送失敗: ${response.status}`);
    }
  }
  