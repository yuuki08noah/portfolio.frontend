# Portfolio Frontend (Nuxt 3)

개인 포트폴리오 및 블로그 CMS의 프론트엔드 프로젝트입니다.
**Nuxt 3**와 **TypeScript**를 기반으로 구축되었으며, SEO 최적화와 사용자 경험(UX) 향상에 중점을 두었습니다.

## 🚀 진단 및 개선 목표

### 1. 단순 정적 페이지의 한계 극복

- **진단**: 기존의 정적 포트폴리오 사이트는 콘텐츠 업데이트를 위해 매번 코드를 수정하고 배포해야 하는 불편함이 있었습니다.
- **개선**: **Admin Dashboard (CMS)**를 구축하여 개발자가 아닌 관리자도 직관적인 UI에서 프로젝트, 블로그 포스트, 독서 기록 등을 CRUD 할 수 있도록 개선했습니다.

### 2. 복잡한 비즈니스 로직과 상태 관리

- **진단**: 페이지 컴포넌트 내에 API 호출, 데이터 가공, UI 로직이 혼재되어 있어 유지보수가 어렵고 테스트가 힘들었습니다.
- **개선**: **Vue 3 Composition API (Composables)** 패턴을 도입하여 비즈니스 로직(`useProjects`, `useAuth` 등)을 UI와 분리했습니다. 이를 통해 코드 재사용성을 높이고 컴포넌트를 순수하게 뷰(View) 역할에 집중시켰습니다.

---

## 💡 적용 기술 심화 설명: Composition API & Composables

이 프로젝트는 Nuxt 3의 핵심 기능인 **Auto-imported Composables**를 적극 활용하여 모듈화된 아키텍처를 구현했습니다.

### 구현 근거

대규모 관리자 기능(Admin)을 구현하면서 동일한 데이터 페칭 및 상태 관리 로직(예: 목록 조회, 상세 조회, 에러 핸들링)이 여러 페이지에서 반복되었습니다. 이를 해결하기 위해 로직을 재사용 가능한 함수로 캡슐화했습니다.

### 기술적 이점

- **관심사의 분리**: UI 코드와 비즈니스 로직이 분리되어 가독성이 향상되었습니다.
- **타입 안전성**: TypeScript를 활용하여 API 응답 데이터의 타입을 명확히 정의함으로써 런타임 에러를 방지했습니다.
- **상태 공유 용이**: `useState`를 통해 전역 상태를 효율적으로 관리하고 SSR(Server-Side Rendering) 환경에서도 일관된 상태를 유지합니다.

---

## 📡 API 명세 요약

Frontend는 Backend API와 RESTful 방식으로 통신합니다.

| Domain | Endpoint Base | Description |
|--------|---------------|-------------|
| **Auth** | `/api/v1/auth` | 로그인, 로그아웃, 세션 검증 |
| **Projects** | `/api/v1/portfolio/projects` | 포트폴리오 프로젝트 목록 및 상세 조회 |
| **Blog** | `/api/v1/blog/posts` | 기술 블로그 포스트 및 태그 관리 |
| **Reading** | `/api/v1/reading` | 읽은 책 목록 및 통계 데이터 |
| **Travel** | `/api/v1/travel` | 여행 기록 및 지도 데이터 |
| **Uploads** | `/api/v1/uploads` | 이미지 업로드 (GCS 연동) |

---

## 🏃 로컬 실행 방법

### 1. 사전 요구 사항

- Node.js (v18+)
- Backend API 서버 실행 중 (<http://localhost:3000>)

### 2. 프로젝트 클론 및 설치

```bash
git clone https://github.com/yuuki08noah/portfolio.frontend.git
cd portfolio.frontend
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 루트에 생성하고 다음 내용을 추가하세요.

```ini
NUXT_PUBLIC_BACKEND_API_BASE=http://localhost:3000
```

### 4. 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.
