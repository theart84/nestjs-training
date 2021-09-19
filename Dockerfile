# Качаем сборку ноды с линуксом
FROM node:14-alpine
# Указываем рабочую папку
WORKDIR /opt/app
# Добавляем package.json, чтобы при обновлении кода не перекачивались зависимости
ADD package.json package.json
# Устанавливаем депсы
RUN npm install
# После этого копируем все файлы
ADD . .
# Формируем билд
RUN npm run build
# После сборки удаляем все дев зависимости
RUN npm prune --production
# Запускаем файл
CMD ["node", "./dist/main.js"]
