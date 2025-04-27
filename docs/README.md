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

### Git 훅 설정 (lefthook)

이 프로젝트는 코드 품질 유지를 위해 Lefthook을 통한 Git 훅을 사용합니다.

```bash
# 모든 개발자는 최초 프로젝트 설정 후 반드시 실행해야 합니다
pnpm dlx lefthook install
```

**주요 훅 설정:**

- **pre-commit**: 커밋 전 다음 작업 수행

  - 린트 검사 (`pnpm run lint`)
  - 타입 검사 (`pnpm run type-check`)
  - 스테이징된 파일 포맷팅 (`pnpm run format:staged`)

- **pre-push**: 푸시 전 다음 작업 수행
  - 전체 파일 타입 검사 (`pnpm run type-check`)
  - 전체 코드 포맷팅 (`pnpm run format`)

> ⚠️ **중요**: git 훅 작동을 위해 프로젝트 클론 후 `pnpm dlx lefthook install` 명령을 실행해주세요

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

#### branch

* staging branch로 부터 작업 브랜치 생성하여 작업한다.
  * 작업 브랜치 명명 규칙
    * feature/
      * 신규 기능 개발
    * refactor/
      * 기능 개선
    * fix/
      * 결함 조치
  * commit 메시지 규칙 => 이모티콘은 기호에 따라 붙임
    * feat :
      * 신규 기능
    * fix : 
      * 버그 수정
    * refactor :
      * 기능 개선
    * chore :
      * 쓸모없는 주석등 코드 정리

#### CI

* 작업 브랜치에서 개발 후 gitHub에서 PR 요청 진행하여
  reviewer 중 1명이 승인하면 브랜치 담당자가 staging branch로 merge한다.

* staging branch로 merge 이후 특이 사항 없으면 배포 담당자 통해서 staging에서 main 브랜치로 merge

  * PR 요청서 양식

    ```
    🔍️ 이 PR을 통해 해결하려는 문제가 무엇인가요?
    
    ✨ 이 PR에서 핵심적으로 변경된 사항은 무엇일까요?
    
    🔖 핵심 변경 사항 외에 추가적으로 변경된 부분이 있나요?
    
    🙏 Reviewer 분들이 이런 부분을 신경써서 봐 주시면 좋겠어요
    
    🩺 이 PR에서 테스트 혹은 검증이 필요한 부분이 있을까요?
    
    테스트가 필요한 항목이나 테스트 코드가 추가되었다면 함께 적어주세요
    
    ```

  * PR 요청 시, label 설정하여 배포 시급성을 reviewer에게 인지시킴.

    * D-0 ~ D-4

  * Reviewer check list

    ```
    📌 PR 진행 시 이러한 점들을 참고해 주세요
    - Reviewer 분들은 코드 리뷰 시 좋은 코드의 방향을 제시하되, 코드 수정을 강제하지 말아 주세요.
    - Reviewer 분들은 좋은 코드를 발견한 경우, 칭찬과 격려를 아끼지 말아 주세요.
    - Review는 특수한 케이스가 아니면 Reviewer로 지정된 시점 기준으로 7일 이내에 진행해 주세요.
    - Comment 작성 시 Prefix로 P1, P2, P3, P4, P5 를 적어 주시면 Assignee가 보다 명확하게 Comment에 대해 대응할 수 있어요
        - P1 : 꼭 반영해 주세요 (Request Changes) - 이슈가 발생하거나 취약점이 발견되는 케이스 등
        - P2 : 반영을 적극적으로 고려해 주시면 좋을 것 같아요 (Comment)
        - P3 : 이런 방법도 있을 것 같아요~ 등의 사소한 의견입니다 (Chore)
        - P4: 반영해도 좋고 넘어가도 좋습니다 (Approve)
        - P5: 그냥 사소한 의견입니다 (Approve+Chore)
    ```

#### CD

* 케어링 노트는 현재 staging, main 2개의 환경으로 운영됨.

* staging branch에 작업 branch merge 되면
  gitAction 통해서 케어링 노트 서버에 반영됨.

  * gitAction Process

    * dockerfile 기반으로 image build

    * 생성된 imgae DockerHub에 업로드

      * 현재는 @**[jawsbaek](https://github.com/jawsbaek)**  의 docker hub repo로 업로드 됨

    * 업로드 이후 케어링노트 k8s에서 아래 cli 실행되며 운영 서버에 반영됨.

      ```sh
      kubectl apply -f api.yaml
      ```

* 배포 담당자 통해서 특정 주기로 staging branch를 main branch로 merge(release)함.

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
