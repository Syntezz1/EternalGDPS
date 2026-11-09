# Сайт GD-сервера на Netlify

Структура: public/index.html (сайт), netlify/functions/api.mjs (API и хранение данных), netlify.toml, package.json.

## Запуск
1. Выложите папку в репозиторий GitHub (все файлы из этого архива, в корень).
2. Netlify: Add new site, Import an existing project, выберите репозиторий. Настройки сборки оставьте по умолчанию.
3. Site configuration, Environment variables: создайте ADMIN_PASSWORD с длинным паролем (это пароль админки).
4. Сделайте новый деплой (Deploys, Trigger deploy), чтобы переменная применилась.
5. Откройте сайт, нажмите «Режим админа» и введите пароль.

Вместо GitHub можно через консоль: npm i -g netlify-cli, затем netlify login, netlify link, netlify deploy --prod.

Данные хранятся в Netlify Blobs и обновляются сразу для всех посетителей. Пароль никому не передавайте.
