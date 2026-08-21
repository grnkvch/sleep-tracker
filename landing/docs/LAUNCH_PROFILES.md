# Launch-профили

## Telegram

Файл: `src/content/launch/telegram.yaml`.

Заполните `primary.url` deep link или публичной ссылкой бота. После подтверждения можно включить SVG QR через `qrEnabled` и отдельный build-time генератор.

## PWA

Файл: `src/content/launch/pwa.yaml`.

Заполните `primary.url` адресом onboarding веб-приложения. Лендинг не получает service worker и остаётся обычной статической страницей.

## Hybrid

Файл: `src/content/launch/hybrid.yaml`.

Заполните `primary.url` для Telegram и `secondary.url` для веб-приложения. Две кнопки показывают одинаковую ценность и различаются только каналом.

## Команды

```bash
pnpm dev:telegram
pnpm dev:pwa
pnpm dev:hybrid
pnpm build:all
```

Production публикует только один профиль на одном canonical URL. Не размещайте три индексируемые копии одновременно.
