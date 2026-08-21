# QA status

## Выполнено в текущем окружении

- Astro strict typecheck — PASS;
- production build трёх preview-профилей — PASS;
- content audit — PASS;
- запрет русского маркетингового копирайта в компонентах — PASS;
- статические HTML/CSS/JS performance-бюджеты — PASS;
- создание трёх ZIP-пакетов и checksum manifest — PASS;
- release guard — корректно блокирует публикацию из-за отсутствующих подтверждённых данных.

## Требует запуска в окружении с Chromium

- Playwright e2e;
- axe accessibility;
- фактическое измерение `5 / 15 / 20 / 40 / 20` на пяти viewport;
- full-page и модульные screenshots;
- browser SEO checks.

В текущем рабочем окружении загрузка Chromium завершилась повреждённым архивом, а изолированный браузер не получил доступ к локальному preview. Тесты и команды полностью добавлены в проект; после установки браузера запустите:

```bash
pnpm exec playwright install chromium
pnpm validate
```
