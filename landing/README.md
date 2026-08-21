# Лендинг помощника по детскому сну

Статический лендинг на Astro с единым контентом и тремя launch-профилями: `telegram`, `pwa`, `hybrid`.

## Быстрый старт

```bash
pnpm install
pnpm exec playwright install chromium
pnpm dev:hybrid
```

Другие варианты: `pnpm dev:telegram`, `pnpm dev:pwa`.

## Проверка

```bash
pnpm validate
```

Команда собирает три preview-профиля, проверяет структуру, текст, ссылки, доступность, геометрию секций и статические performance-бюджеты. Браузер Playwright устанавливается один раз отдельной командой выше.

Release-проверка запускается отдельно и сейчас намеренно завершается ошибкой до заполнения подтверждённых URL и юридических данных:

```bash
BUILD_MODE=release LAUNCH_PROFILE=hybrid SITE_URL=https://your-domain.example pnpm audit:release
```

## Основные файлы

- `src/content/landing/ru.mdx` — весь маркетинговый текст и порядок блоков;
- `src/content/landing/demo.ru.yaml` — повторяемые значения интерфейсного примера;
- `src/content/launch/*.yaml` — отличия каналов;
- `src/content/facts/verified.yaml` — реестр подтверждённых продуктовых фактов;
- `src/styles/tokens.css` — палитра, размеры и section-токены.

Подробнее: [CONTENT_EDITING.md](docs/CONTENT_EDITING.md) и [LAUNCH_PROFILES.md](docs/LAUNCH_PROFILES.md).
