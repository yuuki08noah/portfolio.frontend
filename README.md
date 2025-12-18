# Portfolio Frontend (Nuxt 3)

개인 포트폴리오 및 블로그 CMS의 프론트엔드 프로젝트입니다.
Nuxt 3와 TypeScript를 기반으로 구축되었으며, SEO 최적화와 사용자 경험(UX) 향상에 중점을 두었습니다.

## 🚀 진단 및 개선 목표

### 1. 나만의 차별화된 플랫폼 구축

시중에는 이미 훌륭한 블로그 서비스(Velog, Tistory 등)가 많습니다. 하지만 이러한 기성 플랫폼은 제공되는 템플릿의 한계로 인해 개발자로서의 고유한 개성을 드러내기에는 부족함이 있었습니다.
따라서, 단순히 글을 적재하는 공간을 넘어 내 기술적 역량과 아이덴티티를 온전히 담아낼 수 있는 커스텀 포트폴리오 사이트를 직접 구축하게 되었습니다.

### 2. 복잡한 비즈니스 로직과 상태 관리

페이지 컴포넌트 내에 API 호출, 데이터 가공, UI 로직이 혼재되어 있어 유지보수가 어렵고 테스트가 힘들었습니다.
이를 개선하기 위해 Vue 3 Composition API (Composables) 패턴을 도입하여 비즈니스 로직(useProjects, useAuth 등)을 UI와 분리했습니다. 이를 통해 코드 재사용성을 높이고 컴포넌트를 순수하게 뷰(View) 역할에 집중시켰습니다.

---

## 💡 적용 기술 심화 설명: Notion-like Block Editor

사용자 경험(UX)을 극대화하기 위해 Notion 스타일의 블록 기반 위지윅(WYSIWYG) 에디터를 직접 구현했습니다.

### 1. 블록 기반 데이터 구조의 설계와 이점

일반적인 에디터가 전체 콘텐츠를 하나의 HTML 문자열로 관리하는 것과 달리, 각 문단을 독립적인 Block 객체({ id, type, content, props })로 관리하는 구조를 채택했습니다.
Vue의 Reactivity System을 활용하여 블록의 상태 변화를 감지하고, Virtual DOM이 변경된 블록만 효율적으로 리렌더링하도록 설계했습니다. 이 구조 덕분에 블록 단위의 드래그 앤 드롭(DnD)으로 순서를 변경하거나, 멀티컬럼 레이아웃을 구성하는 등 복잡한 UI 인터랙션을 자연스럽게 구현할 수 있었습니다.

### 2. 실시간 Markdown 파싱 및 UX 최적화

Slash Menu(/ 입력 시 메뉴 팝업) 기능을 구현하여 마우스 없이 키보드만으로 빠른 작성이 가능하도록 했습니다.
또한 에디터 내에서 ## 입력 시 자동으로 Header 블록으로 변환되는 등 실시간 입력 패턴 매칭 로직을 구현했습니다. 이를 위해 input 이벤트 핸들러에서 정규식으로 마크다운 문법을 감지하고, 즉시 해당 블록 타입으로 교체하는 방식을 사용하여 끊김 없는 작성 경험을 제공했습니다.

---

## 📡 API 명세 요약

Frontend는 Backend API와 RESTful 방식으로 통신합니다.

| Domain | Endpoint Base | Description |
|--------|---------------|-------------|
| Auth | /api/v1/auth | 로그인, 로그아웃, 세션 검증 |
| Projects | /api/v1/portfolio/projects | 포트폴리오 프로젝트 목록 및 상세 조회 |
| Blog | /api/v1/blog/posts | 기술 블로그 포스트 및 태그 관리 |
| Reading | /api/v1/reading | 읽은 책 목록 및 통계 데이터 |
| Travel | /api/v1/travel | 여행 기록 및 지도 데이터 |
| Uploads | /api/v1/uploads | 이미지 업로드 (GCS 연동) |

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

.env 파일을 루트에 생성하고 다음 내용을 추가하세요.

```ini
NUXT_PUBLIC_BACKEND_API_BASE=http://localhost:3000
```

### 4. 실행

```bash
npm run dev
```

브라우저에서 <http://localhost:3000으로> 접속하여 확인합니다.
