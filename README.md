# Portfolio (Frontend)

> **배포 URL**: <https://portfolio-yuuki08noah-447543468752.asia-northeast3.run.app> (예시)
> **테스트 계정**: ID: `admin@example.com` / PW: (App log 확인 필요)

## 📌 프로젝트 소개

나만의 아이덴티티를 온전히 담아내기 위해 기획부터 배포까지 직접 수행한 풀스택 포트폴리오 프로젝트의 프론트엔드입니다. Nuxt 3의 최신 기능을 활용하여 SEO 최적화와 사용자 경험을 극대화했습니다.

- **개발 기간**: 2024.11.20 ~ 2024.12.18
- **개발 인원**: 1인 (개인 프로젝트)

---

## 🔍 개선 사항

### 기존 코드의 문제점

| 문제점 | 개선 방법 |
|--------|----------|
| 정적 사이트의 업데이트 비효율성 | Admin CMS 구축을 통한 콘텐츠 관리 자동화 |
| 비즈니스 로직과 UI 코드의 결합 | Composition API (Composables) 패턴 적용 |

### 개선 결과

**[개선 1: 컴포지션 API 활용]**

- **개선 전**: 컴포넌트 내에 API 호출 로직이 혼재되어 재사용 불가 및 테스트 난해
- **개선 후**: `useProjects`, `useAuth` 등 도메인별 Composable로 로직을 분리하여 UI는 뷰 역할만 담당

---

## ✨ 주요 기능

### 1. 사용자 인증

- JWT 기반 로그인 (백엔드 연동)
- 미들웨어를 통한 권한 제어 (Admin 전용 페이지)

### 2. 커스텀 블록 에디터

- Notion 스타일의 블록 기반 위지윅 에디터 직접 구현
- [선택한 심화 기술: Slash Command & Markdown Parsing]

### 3. 프로젝트 및 블로그

- 카테고리별 필터링 및 상세 조회
- 서버 사이드 렌더링(SSR)을 통한 SEO 최적화

---

## 🛠️ 기술 스택

### Frontend

- Nuxt 4.2.1
- Vue 3.5.24
- TypeScript
- Marked (Markdown Parser)

### Deployment

- GCP Cloud Run
- Google Container Registry

---

## 📂 프로젝트 구조

```
frontend/
├── components/
│   ├── admin/      # 관리자용 컴포넌트 (Editor 등)
│   ├── blog/       # 블로그 관련 컴포넌트
│   ├── common/     # 공통 UI 컴포넌트
│   └── layout/     # 레이아웃 컴포넌트
├── composables/    # 비즈니스 로직 (useAuth, useFetch 등)
├── pages/          # 라우트 페이지
├── public/         # 정적 에셋
└── nuxt.config.ts
```

---

## 🔗 API 명세

Frontend는 Backend API를 소비하는 클라이언트입니다. 상세 명세는 Backend README를 참고해 주세요.

| Method | Endpoint Base | Description |
|--------|---------------|-------------|
| POST | `/api/v1/auth/*` | 인증 관련 |
| GET | `/api/v1/projects` | 프로젝트 조회 |
| GET | `/api/v1/posts` | 블로그 조회 |

---

## 💻 로컬 실행 방법

### 1. 레포지토리 클론

```bash
git clone https://github.com/yuuki08noah/portfolio.frontend.git
cd portfolio.frontend
```

### 2. 패키지 설치 및 환경 설정

```bash
npm install

# .env 파일 생성 및 설정
# NUXT_PUBLIC_BACKEND_API_BASE=http://localhost:3000
```

### 3. 실행

```bash
npm run dev
```

---

## 🎥 시연 영상

[YouTube 링크](https://youtu.be/9HfOZwA1XUI)

---

## 📚 참고 자료

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/)
