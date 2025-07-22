# FSD 구조 안내

이 프로젝트는 Feature-Sliced Design(FSD) 아키텍처를 따릅니다.

## 폴더 구조

- **src/app**: Next.js app directory (routing)
- **src/shared**: 공통 유틸, 타입, 컴포넌트 등
- **src/entities**: 핵심 도메인 엔티티 (예: user)
- **src/features**: 사용자 액션 단위의 feature (예: user-auth)
- **src/widgets**: 여러 feature/entity를 조합한 UI 블록
- **src/pages**: (필요시) 라우트별 페이지 (app 디렉토리와 병행 가능)

---

각 폴더에 예시 파일을 추가해 주세요.

---

## 개발 환경 세팅 가이드

### 1. Node.js 버전 관리 (nvm)

이 프로젝트는 [nvm(Node Version Manager)](https://github.com/nvm-sh/nvm)을 사용하여 Node.js 버전을 관리합니다.  
`.nvmrc` 파일에 명시된 버전(`v22.14.0`)을 사용해야 합니다.

#### nvm이 없다면 설치

```bash
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 설치 후, 터미널을 재시작하거나 아래 명령 실행
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

#### 프로젝트 Node 버전으로 세팅

```bash
# 프로젝트 루트에서 아래 명령 실행
nvm install   # .nvmrc에 명시된 버전이 자동 설치됨
nvm use       # 해당 버전으로 전환
```

> nvm이 정상 동작하면, `node -v` 명령 시 `v22.14.0`이 출력되어야 합니다.

---

### 2. pnpm 활성화 및 설치, corepack 설정

이 프로젝트는 [pnpm](https://pnpm.io/) 패키지 매니저(`pnpm@10.12.4`)를 사용합니다.

#### corepack 활성화 및 pnpm 설치

Node.js 16.13 이상에서는 corepack을 통해 pnpm을 쉽게 사용할 수 있습니다.

```bash
# corepack 활성화 (최초 1회)
corepack enable

# pnpm 최신 버전 설치 및 활성화
corepack prepare pnpm@10.12.4 --activate
```

#### pnpm 직접 설치(권장: corepack 사용)

corepack이 불가한 환경에서는 아래 명령으로 직접 설치할 수 있습니다.

```bash
npm install -g pnpm@10.12.4
```

#### pnpm 버전 확인

```bash
pnpm -v
# 10.12.4 (또는 호환 버전)
```

---

이후 의존성 설치 및 개발 서버 실행은 아래와 같이 진행합니다.

```bash
pnpm install
pnpm dev
```

---

## 📁 실제 프로젝트 폴더 구조 및 파일별 기능 명세

```
src/
├── app/                # Next.js App Router 기반 라우트 및 페이지
│   ├── layout.tsx      # 전체 레이아웃, ReactQueryProvider 적용
│   ├── page.tsx        # 메인(랜딩) 페이지
│   ├── globals.css     # 글로벌 스타일(Tailwind 포함)
│   ├── choice/         # /choice 카테고리 선택 페이지
│   ├── battle/         # /battle 상품 배틀 페이지
│   └── champion/       # /champion 최종 선택 페이지
│
├── shared/             # 공통 유틸리티, API 클라이언트, UI 컴포넌트
│   ├── api/
│   │   ├── index.ts            # axios 기반 API 클라이언트, queryFactory
│   │   └── queryClient.tsx     # React Query QueryClient 및 Provider
│   └── lib/
│       ├── useQueryParams.ts   # 쿼리스트링 관리 커스텀 훅
│       ├── ErrorBoundary.tsx   # 에러 바운더리 컴포넌트
│       └── LoadingSpinner.tsx  # 로딩 스피너 컴포넌트
│
├── entities/           # 도메인별 타입, API, 비즈니스 로직
│   └── product/
│       ├── api.ts      # 상품/카테고리 API 쿼리 팩토리
│       └── types.ts    # Musinsa API 응답 타입, 상품/카테고리 타입 정의
│
├── widgets/            # 복합 UI 위젯(페이지 단위 주요 컴포넌트)
│   ├── category-tabs/
│   │   └── CategoryTabs.tsx    # 카테고리 선택/드릴다운 UI 및 로직
│   ├── product-battle/
│   │   ├── ProductBattle.tsx   # 1:1 상품 배틀 UI 및 로직
│   │   └── useBattleState.ts   # 배틀 상태 관리 커스텀 훅
│   └── final-choice/
│       ├── FinalChoice.tsx     # 최종 선택 상품 UI 및 구매 링크
│       └── useFinalChoice.ts   # 최종 선택 파라미터 관리 훅
│
├── features/           # (확장용) 주요 기능 단위 컴포넌트/로직
│   ├── category-select/
│   └── product-battle/
│   # (현재는 비어있거나, 추후 확장용)
│
└── README.md           # 프로젝트 설명 및 가이드
```

---

### 주요 파일별 기능 요약

- **app/layout.tsx**: 전체 앱 레이아웃, React Query Provider 적용
- **app/page.tsx**: 메인(랜딩) 페이지, 이상형 고르기 버튼
- **app/choice/page.tsx**: 카테고리 선택 화면
- **app/battle/page.tsx**: 상품 배틀 화면
- **app/champion/page.tsx**: 최종 선택 결과 화면

- **shared/api/index.ts**: axios 인스턴스 및 queryFactory 패턴
- **shared/api/queryClient.tsx**: React Query QueryClient 및 Provider
- **shared/lib/useQueryParams.ts**: 쿼리스트링 get/push/replace 커스텀 훅
- **shared/lib/ErrorBoundary.tsx**: 에러 바운더리 컴포넌트
- **shared/lib/LoadingSpinner.tsx**: 로딩 스피너 컴포넌트

- **entities/product/types.ts**: Musinsa API 응답 타입, 상품/카테고리 타입
- **entities/product/api.ts**: 카테고리/상품 쿼리 팩토리

- **widgets/category-tabs/CategoryTabs.tsx**: 카테고리 선택 및 드릴다운 UI
- **widgets/product-battle/ProductBattle.tsx**: 1:1 상품 배틀 UI
- **widgets/product-battle/useBattleState.ts**: 배틀 상태 관리 훅
- **widgets/final-choice/FinalChoice.tsx**: 최종 선택 상품 UI
- **widgets/final-choice/useFinalChoice.ts**: 최종 선택 파라미터 관리 훅

---
