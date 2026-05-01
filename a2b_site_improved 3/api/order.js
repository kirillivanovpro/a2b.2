function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .slice(0, 1200);
}

function normalizePhone(value = '') {
  return String(value).replace(/[^+\d]/g, '').slice(0, 20);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ ok: false, error: 'Telegram environment variables are not configured' });
  }

  const body = req.body || {};

  if (body.company) {
    return res.status(200).json({ ok: true });
  }

  const name = escapeHtml(body.name);
  const phone = normalizePhone(body.phone);
  const service = escapeHtml(body.service);
  const date = escapeHtml(body.date || 'Nav norādīts / не указано');
  const address = escapeHtml(body.address || 'Nav norādīta / не указан');
  const details = escapeHtml(body.details || 'Nav / нет');
  const lang = escapeHtml(body.lang || 'lv');
  const page = escapeHtml(body.page || 'Website');

  if (!name || !phone || !service) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  const message = `🚨 <b>JAUNS PIETEIKUMS A2B</b>

👤 <b>Vārds / имя:</b> ${name}
📞 <b>Telefons:</b> ${phone}
🎯 <b>Pakalpojums / услуга:</b> ${service}
🕐 <b>Kad / когда:</b> ${date}
📍 <b>Adrese / адрес:</b> ${address}
📝 <b>Detaļas / детали:</b> ${details}
🌐 <b>Valoda:</b> ${lang}
🔗 <b>Lapa:</b> ${page}
⏰ <b>Laiks:</b> ${new Date().toLocaleString('lv-LV', { timeZone: 'Europe/Riga' })}

👉 <a href="tel:${phone}">Zvanīt klientam / позвонить клиенту</a>`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      return res.status(502).json({ ok: false, error: data.description || 'Telegram request failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}
