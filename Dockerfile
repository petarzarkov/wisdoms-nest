FROM public.ecr.aws/docker/library/node:22

EXPOSE 5056

WORKDIR /app

ENV NODE_ENV=production
ENV PNPM_IGNORE_PREPARE=yes
ENV NO_COLOR=1
ENV APP_ENV=prod

CMD ["node", "build/src/main.js"]
RUN npm install -g pnpm@10.6.2
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm build
