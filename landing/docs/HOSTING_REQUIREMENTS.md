# Требования к будущему хостингу

Сайт не привязан к конкретному провайдеру. Хостинг должен поддерживать:

- HTTPS и custom domain;
- обычную раздачу статических файлов;
- корректную страницу `404.html`;
- Brotli или Gzip;
- длительный cache для файлов в `_assets/`;
- короткий cache для HTML;
- redirects;
- security headers;
- preview-среду с `noindex`;
- атомарное переключение release или простой rollback.

Рекомендуемые заголовки:

- `Content-Security-Policy` с `default-src 'self'`, запретом embed через `frame-ancestors` и минимальными исключениями;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `X-Content-Type-Options: nosniff`;
- ограничивающий `Permissions-Policy`;
- `Strict-Transport-Security` после подтверждения постоянного HTTPS.

HTML не должен кешироваться как immutable. Хешированные CSS/JS/SVG можно отдавать с `Cache-Control: public, max-age=31536000, immutable`.
