# A2B Transport landing — deployment notes

## 1. Critical security step

The previous front-end exposed the Telegram bot token in public JavaScript. Revoke that token in BotFather and create a new one before deploying.

## 2. Files

- `index.html` — improved landing page with LV/RU switch, stronger CTA, mobile sticky buttons, price estimator and safer form submit.
- `api/order.js` — Vercel serverless function that sends leads to Telegram without exposing the bot token in the browser.

## 3. Vercel environment variables

In Vercel project settings add:

```txt
TELEGRAM_BOT_TOKEN=your_new_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

Redeploy after adding the variables.

## 4. Replace placeholders

In `index.html`, replace these placeholders with real business data:

- `+371 20 000 000`
- `+37120000000`
- `37120000000`
- `info@a2btransport.lv`
- canonical URL if the final domain changes

## 5. Recommended next additions

- Add real photos of the bus/team.
- Add Google Business Profile reviews when available.
- Add Meta Pixel and Google Analytics conversion events after the first test orders.
- Add a privacy policy page because the form collects name and phone.
