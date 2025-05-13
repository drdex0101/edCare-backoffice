// utils/notify.js

export async function notify(lineId, message) {
  try {
    const response = await fetch("/api/base/line/sendNotification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: lineId,
        message,
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || "通知失敗");
    }
  } catch (err) {
    console.error("通知失敗:", err);
    throw err;
  }
}

export async function approvedNotify(lineId) {
  const message = {
    type: "flex",
    altText: "審核通過",
    contents: {
      type: "bubble",
      styles: {
        header: { backgroundColor: "#ECD3D2" },
        body: { backgroundColor: "#ECD3D2" },
      },
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "用戶審核通知",
            weight: "bold",
            size: "lg",
            color: "#00695c",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "恭喜您，您的用戶審核已通過！\n現在就可以立即前往平台使用我們的服務囉～",
            wrap: true,
          },
        ],
      },
    },
  };

  return notify(lineId, message);
}

export async function failedNotify(lineId) {
  const message = {
    type: "flex",
    altText: "審核未通過",
    contents: {
      type: "bubble",
      styles: {
        header: { backgroundColor: "#ECD3D2" },
        body: { backgroundColor: "#ECD3D2" },
      },
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "用戶審核通知",
            weight: "bold",
            size: "lg",
            color: "#00695c",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "您的用戶審核未通過，如有任何疑問，歡迎聯繫居託中心協助處理。謝謝您。",
            wrap: true,
          },
        ],
      },
    },
  };

  return notify(lineId, message);
}

export async function appointmentNotifyParent(lineId, orderId) {
  const message = {
    type: "flex",
    altText: "有保母選擇媒合訂單，請盡快查看！",
    contents: {
      type: "bubble",
      styles: {
        header: { backgroundColor: "#ECD3D2" },
        body: { backgroundColor: "#ECD3D2" },
        footer: { backgroundColor: "#ECD3D2" },
      },
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "訂單媒合通知",
            weight: "bold",
            size: "lg",
            color: "#00695c",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "📢 您的預約已有保母願意接單。\n\n為確保服務順利進行，請您盡快登入平台確認預約詳情。",
            wrap: true,
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#00695c",
            action: {
              type: "uri",
              label: "前往平台",
              uri: "https://edcarehome.com",
            },
          },
        ],
      },
    },
  };

  return notify(lineId, message);
}

export async function appointmentNotifyNanny(lineId, orderId) {
  const message = {
    type: "flex",
    altText: "有新媒合訂單，請盡快查看！",
    contents: {
      type: "bubble",
      styles: {
        header: { backgroundColor: "#ECD3D2" },
        body: { backgroundColor: "#ECD3D2" },
        footer: { backgroundColor: "#ECD3D2" },
      },
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "訂單媒合通知",
            weight: "bold",
            size: "lg",
            color: "#00695c",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "📢 有家長已選擇您！\n\n請登入平台查看預約詳情與服務時間安排。",
            wrap: true,
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#00695c",
            action: {
              type: "uri",
              label: "前往平台",
              uri: "https://edcarehome.com",
            },
          },
        ],
      },
    },
  };

  return notify(lineId, message);
}

export async function matchNotify(lineId, orderId, type) {
  const message = {
    type: "flex",
    altText: "訂單媒合成功",
    contents: {
      type: "bubble",
      styles: {
        header: { backgroundColor: "#ECD3D2" },
        body: { backgroundColor: "#ECD3D2" },
        footer: { backgroundColor: "#ECD3D2" },
      },
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "訂單媒合成功！",
            weight: "bold",
            size: "lg",
            color: "#00695c",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "🎉 訂單已成立，媒合成功！\n\n接下來將由居託中心協助聯繫與安排簽約事宜，請留意近期的來電。感謝您的信任與支持！",
            wrap: true,
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#00695c",
            action: {
              type: "uri",
              label: "前往平台",
              uri:
                type === "parent"
                  ? "https://edcare-line-bot2.vercel.app/parent/history"
                  : type === "nanny"
                  ? "https://edcare-line-bot2.vercel.app/nanny/history"
                  : null,
            },
          },
        ],
      },
    },
  };

  return notify(lineId, message);
}
