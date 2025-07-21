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
