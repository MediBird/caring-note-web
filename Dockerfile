FROM node:18.16.1 as builder

# pnpm 사용을 위해 corepack 활성화
RUN corepack enable

WORKDIR /app

# package.json, pnpm-lock.yaml 등을 복사
COPY package*.json ./
# pnpm-lock.yaml 파일도 있으면 복사해주세요.
COPY pnpm-lock.yaml ./

# 의존성 설치
RUN pnpm install

# 소스 복사 및 빌드
COPY . .

# 빌드 시 사용할 환경 변수 정의
ARG VITE_KEYCLOAK_CLIENT_ID
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID

RUN pnpm run build

# 2. Nginx 스테이지
FROM nginx:stable-alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 정적 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
