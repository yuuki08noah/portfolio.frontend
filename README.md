# Portfolio (Frontend)

> **배포 URL**: <https://portfolio.yuuki.dev> (예시)
> **테스트 계정**: ID: `admin@example.com` / PW: (App log 확인 필요)

## 📌 프로젝트 소개

**"나만의 아이덴티티를 온전히 담아낸 커스텀 플랫폼"**

시중에는 이미 훌륭한 블로그 서비스(Velog, Tistory 등)가 많습니다. 하지만 이러한 기성 플랫폼은 정해진 템플릿의 한계로 인해 개발자로서의 고유한 개성을 드러내기에는 부족함이 있었습니다.
이 프로젝트는 단순히 글을 적재하는 공간을 넘어, **기획부터 배포까지 풀스택으로 직접 구축**하며 내 기술적 역량과 철학을 증명하는 무대입니다. Nuxt 3와 TypeScript를 기반으로 하여 SEO 최적화와 사용자 경험(UX) 극대화에 중점을 두었습니다.

- **개발 기간**: 2024.11.20 ~ 2024.12.18
- **개발 인원**: 1인 (개인 프로젝트)

---

## 🔍 개선 사항

### 기존 코드의 문제점 및 해결 과정

| 문제점 | 개선 방법 |
|--------|----------|
| **정적 사이트의 한계**<br>기존 포트폴리오는 수정할 때마다 코드를 변경하고 재배포해야 하는 비효율이 존재함 | **Admin CMS 구축**<br>관리자 대시보드를 만들어 프로젝트, 블로그, 독서 기록 등을 GUI 환경에서 즉시 업데이트 가능하게 함 |
| **복잡한 로직의 결합**<br>컴포넌트 내에 API 호출, 데이터 가공, UI 로직이 혼재되어 유지보수와 테스트가 어려움 | **Composition API (Composables)**<br>`useProjects`, `useAuth` 등 도메인별로 로직을 분리하여 재사용성을 높이고 UI는 뷰 역할에 집중시킴 |

### 주요 개선 결과

@ **[심화: Notion-like Block Editor 구현]**

사용자 경험(UX)을 극대화하기 위해 Notion 스타일의 **블록 기반 위지윅(WYSIWYG) 에디터**를 직접 구현했습니다.

1. **블록 기반 데이터 구조**
    - 일반적인 에디터(HTML string 방식)와 달리, 각 문단을 독립적인 `Block` 객체(`{ id, type, content }`)로 관리합니다.
    - 이를 통해 블록 단위의 드래그 앤 드롭(DnD) 이동, 멀티컬럼 레이아웃 등 복잡한 인터랙션을 구현했습니다.

2. **실시간 Markdown 파싱**
    - Slash Menu(`/` 입력 시 메뉴 팝업)를 통해 마우스 없이 빠른 작성이 가능합니다.
    - `##` 입력 시 즉시 헤더로 변환되는 등 실시간 입력 패턴 매칭으로 생산성을 높였습니다.

---

## ✨ 주요 기능

### 1. 사용자 인증 & 관리자 모드

- JWT 기반 로그인 및 세션 관리
- 미들웨어를 통한 일반/관리자 권한 분기

### 2. 콘텐츠 관리 시스템 (CMS)

- 프로젝트, 블로그 포스트, 독서/여행 기록 CRUD
- 이미지 업로드 및 관리 (GCS 연동)

### 3. 사용자 경험 (UX)

- 다크 모드 / 라이트 모드 테마 지원
- 반응형 레이아웃 및 모바일 최적화

---

## 🛠️ 기술 스택

### Frontend

- **Framework**: Nuxt 4.2.1, Vue 3.5.24
- **Language**: TypeScript
- **Styling**: Tailwind CSS (PostCSS)
- **Editor**: Custom Implementation (Notion-like), Marked Parser

### Deployment

- **Platform**: GCP Cloud Run
- **CI/CD**: GitHub Actions

---

## 📂 프로젝트 구조

```
frontend/
├── components/
│   ├── admin/      # 관리자용 컴포넌트 (Editor, Dashboard)
│   ├── blog/       # 블로그 관련 (PostViewer, List)
│   └── common/     # 공통 UI (Button, Input, Modal)
├── composables/    # 비즈니스 로직 (useAuth, useFetch)
├── pages/          # 파일 시스템 라우팅
├── server/         # Nuxt 서버 사이드 로직 (BFF 패턴 등)
└── app.vue         # 루트 컴포넌트
```

---

## 🔗 API 명세

Frontend는 Backend API를 소비하는 클라이언트입니다.

| Method | Endpoint Base | Description |
|--------|---------------|-------------|
| POST | `/api/v1/auth/*` | 로그인, 로그아웃, 토큰 갱신 |
| GET | `/api/v1/projects` | 포트폴리오 프로젝트 목록 조회 |
| GET | `/api/v1/posts` | 기술 블로그 포스트 조회 |

---

## 💻 로컬 실행 방법

### 1. 레포지토리 클론

```bash
git clone https://github.com/yuuki08noah/portfolio.frontend.git
cd portfolio.frontend
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 루트에 생성합니다.

```ini
NUXT_PUBLIC_BACKEND_API_BASE=http://localhost:3000
```

### 4. 실행

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
