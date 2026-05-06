FROM node:22

WORKDIR /app/src

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate

RUN yarn build


EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
