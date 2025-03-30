# 케어링노트 웹 (Caring Note Web)

방문 상담을 하는 약사를 위한 웹 서비스입니다.

🌐 **서비스 주소**: [caringnote.co.kr](https://caringnote.co.kr)  
📚 **사용자 가이드**: [사용법 안내 노션 페이지](https://www.notion.so/yoonyounglee/19a4b68481fb802db0fef7bbf9e35afb)

## 📋 프로젝트 개요

케어링노트는 방문 상담을 수행하는 약사들을 위한 웹 기반 서비스입니다. 상담 관리, 환자 정보 추적, 설문 조사 등의 기능을 제공하여 약사의 업무 효율성을 향상시킵니다.

## 🛠 기술 스택

- **프론트엔드**: React, TypeScript, Vite
- **상태 관리**: Zustand, React Query
- **UI 라이브러리**: Shadcn UI (with Tailwind CSS)
- **인증**: Keycloak
- **API 클라이언트**: OpenAPI Generator (Typescript-Axios)
- **배포**: Docker, Kubernetes, GitHub Actions

## 🔑 주요 기능

- 방문 상담 관리
- 환자(내담자) 정보 관리
- 상담 세션 기록
- 설문 조사 생성 및 관리
- 계정 관리

## 🚀 시작하기

### 필수 조건

- Node.js 22 이상
- pnpm

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 결과물 미리보기
pnpm preview
```

### API 클라이언트 생성

```bash
# 프로덕션 API에서 클라이언트 생성
pnpm generate:api

# 로컬 API에서 클라이언트 생성
pnpm generate:api:local
```

## 🏗 프로젝트 구조

```
src/
├── api/          # API 관련 코드 (OpenAPI 생성)
├── app/          # 앱 핵심 설정 (Router, Keycloak 등)
├── components/   # 컴포넌트
│   ├── common/   # 공통 컴포넌트
│   └── ui/       # Shadcn UI 컴포넌트
├── context/      # 컨텍스트 (인증 등)
├── hooks/        # 커스텀 훅
├── pages/        # 페이지 컴포넌트
│   ├── Account/     # 계정 관련 페이지
│   ├── Consult/     # 상담 관련 페이지
│   ├── Counselee/   # 내담자 관련 페이지
│   ├── Errors/      # 에러 페이지
│   ├── Home/        # 홈 페이지
│   ├── Session/     # 세션 관련 페이지
│   └── Survey/      # 설문 관련 페이지
├── stores/       # Zustand 스토어
├── types/        # 타입 정의
└── utils/        # 유틸리티 함수
```

## 🔐 인증 (Keycloak)

이 프로젝트는 Keycloak을 사용하여 인증을 처리합니다. 주요 구성:

- PKCE 인증 방식 사용
- 인증 상태는 `AuthContext`를 통해 관리
- API 요청에 자동으로 토큰 첨부
- 토큰 만료 시 자동 갱신

## 📦 배포

### Docker

```bash
# Docker 이미지 빌드
docker build -t caring-note-web .

# Docker 이미지 실행
docker run -p 80:80 caring-note-web
```

### CI/CD

GitHub Actions를 사용하여 CI/CD 파이프라인이 구성되어 있습니다:

1. PR이 main 브랜치에 머지될 때 자동으로 실행
2. Docker 이미지 빌드 및 DockerHub 업로드
3. Kubernetes 클러스터에 자동 배포

## 🧩 코드 규칙

자세한 코드 규칙은 [cursorrule.mdc](/.cursor/rules/cursorrule.mdc) 파일을 참조하세요. 주요 규칙:

- Keycloak 인증 관련 규칙
- Zustand 스토어 구조 규칙
- Shadcn 컴포넌트 규칙
- 라우팅 규칙
- API 사용 규칙

## 🤝 기여

1. 이슈 생성
2. 개발 브랜치 생성
3. 코드 변경
4. PR 생성
5. 리뷰 및 머지
